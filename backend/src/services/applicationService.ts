import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const applyToJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
  }
  if (job.status === 'CLOSED') {
    throw new AppError('Cannot apply to a closed job', 400, 'JOB_CLOSED');
  }

  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) {
    throw new AppError('You have already applied to this job', 409, 'APPLICATION_ALREADY_EXISTS');
  }

  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.application.create({
      data: {
        userId,
        jobId,
        currentStatus: 'APPLIED',
      },
    });

    await tx.applicationHistory.create({
      data: {
        applicationId: application.id,
        previousStatus: null,
        newStatus: 'APPLIED',
        changedBy: userId,
      },
    });

    return application;
  });

  return result;
};

export const getUserApplications = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: { select: { companyName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { userId } }),
  ]);

  return {
    items: items.map((app) => ({
      id: app.id,
      jobTitle: app.job.title,
      companyName: app.job.company.companyName,
      currentStatus: app.currentStatus,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApplicationDetail = async (applicationId: string, userId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          company: { select: { companyName: true } },
        },
      },
      history: {
        orderBy: { changedAt: 'asc' },
      },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }
  if (application.userId !== userId) {
    throw new AppError('You can only view your own applications', 403, 'FORBIDDEN');
  }

  return {
    application: {
      id: application.id,
      currentStatus: application.currentStatus,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
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
