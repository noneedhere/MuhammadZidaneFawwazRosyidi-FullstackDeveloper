import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { JobType } from '@prisma/client';

interface CreateJobInput {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: JobType;
}

export const createJob = async (companyId: string, input: CreateJobInput) => {
  const job = await prisma.job.create({
    data: {
      ...input,
      companyId,
    },
    include: {
      company: {
        select: { companyName: true },
      },
    },
  });

  return {
    ...job,
    companyName: job.company.companyName,
  };
};

export const getCompanyJobs = async (companyId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where: { companyId },
      include: {
        _count: { select: { applications: true } },
        company: { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.job.count({ where: { companyId } }),
  ]);

  return {
    items: items.map((job) => ({
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      status: job.status,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      applicantCount: job._count.applications,
      companyName: job.company.companyName,
      createdAt: job.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOpenJobs = async (page: number, limit: number, search: string) => {
  const skip = (page - 1) * limit;

  const where: any = { status: 'OPEN' as const };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { company: { companyName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    items: items.map((job) => ({
      id: job.id,
      title: job.title,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      type: job.type,
      companyName: job.company.companyName,
      createdAt: job.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getJobDetail = async (jobId: string, userId?: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: { select: { companyName: true, id: true } },
    },
  });

  if (!job) {
    throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
  }

  let applicationStatus: string | null = null;
  if (userId) {
    const application = await prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (application) {
      applicationStatus = application.currentStatus;
    }
  }

  return {
    job: {
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      type: job.type,
      status: job.status,
      companyName: job.company.companyName,
      companyId: job.company.id,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    },
    applicationStatus,
  };
};

export const updateJob = async (jobId: string, companyId: string, input: Partial<CreateJobInput>) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
  }
  if (job.companyId !== companyId) {
    throw new AppError('You can only edit your own jobs', 403, 'FORBIDDEN');
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: input,
    include: { company: { select: { companyName: true } } },
  });

  return { ...updated, companyName: updated.company.companyName };
};

export const closeJob = async (jobId: string, companyId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
  }
  if (job.companyId !== companyId) {
    throw new AppError('You can only close your own jobs', 403, 'FORBIDDEN');
  }
  if (job.status === 'CLOSED') {
    throw new AppError('Job is already closed', 400, 'JOB_ALREADY_CLOSED');
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: { status: 'CLOSED' },
    include: { company: { select: { companyName: true } } },
  });

  return { ...updated, companyName: updated.company.companyName };
};
