import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { ApplicationStatus } from '@prisma/client';

const VALID_TRANSITIONS: Record<string, string[]> = {
  APPLIED: ['REVIEWING', 'REJECTED'],
  REVIEWING: ['SHORTLISTED', 'REJECTED'],
  SHORTLISTED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: [],
  REJECTED: [],
};

export const getJobApplicants = async (
  jobId: string,
  companyId: string,
  page: number,
  limit: number
) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
  }
  if (job.companyId !== companyId) {
    throw new AppError('You can only view applicants for your own jobs', 403, 'FORBIDDEN');
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { jobId } }),
  ]);

  return {
    items: items.map((app) => ({
      applicationId: app.id,
      applicantName: app.user.fullName,
      applicantEmail: app.user.email,
      currentStatus: app.currentStatus,
      appliedAt: app.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCompanyApplicationDetail = async (
  applicationId: string,
  companyId: string
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: { company: { select: { companyName: true, id: true } } },
      },
      user: {
        select: { fullName: true, email: true, phone: true, bio: true },
      },
      history: {
        orderBy: { changedAt: 'asc' },
      },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }
  if (application.job.company.id !== companyId) {
    throw new AppError('You can only view applications for your own jobs', 403, 'FORBIDDEN');
  }

  return {
    application: {
      id: application.id,
      currentStatus: application.currentStatus,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      applicant: {
        fullName: application.user.fullName,
        email: application.user.email,
        phone: application.user.phone,
        bio: application.user.bio,
      },
      job: {
        id: application.job.id,
        title: application.job.title,
        companyName: application.job.company.companyName,
        location: application.job.location,
        type: application.job.type,
      },
      history: application.history.map((h) => ({
        id: h.id,
        previousStatus: h.previousStatus,
        newStatus: h.newStatus,
        changedAt: h.changedAt,
      })),
    },
  };
};

export const updateApplicationStatus = async (
  applicationId: string,
  companyId: string,
  newStatus: ApplicationStatus,
  changedByUserId: string
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: { select: { companyId: true } },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }
  if (application.job.companyId !== companyId) {
    throw new AppError('You can only update applications for your own jobs', 403, 'FORBIDDEN');
  }

  const currentStatus = application.currentStatus;
  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowedTransitions.includes(newStatus)) {
    throw new AppError(
      `Cannot transition from ${currentStatus} to ${newStatus}`,
      400,
      'INVALID_STATUS_TRANSITION'
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id: applicationId },
      data: { currentStatus: newStatus },
    });

    await tx.applicationHistory.create({
      data: {
        applicationId,
        previousStatus: currentStatus,
        newStatus,
        changedBy: changedByUserId,
      },
    });

    return updated;
  });

  return result;
};

export const getDashboardStats = async (companyId: string) => {
  const [totalJobs, applications] = await Promise.all([
    prisma.job.count({ where: { companyId } }),
    prisma.application.findMany({
      where: { job: { companyId } },
      select: { currentStatus: true },
    }),
  ]);

  const totalApplications = applications.length;
  const applicationsByStatus: Record<string, number> = {
    APPLIED: 0,
    REVIEWING: 0,
    SHORTLISTED: 0,
    ACCEPTED: 0,
    REJECTED: 0,
  };

  applications.forEach((app) => {
    applicationsByStatus[app.currentStatus]++;
  });

  return {
    totalJobs,
    totalApplications,
    applicationsByStatus,
  };
};
