import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title must be at most 100 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be at most 5000 characters'),
  requirements: z.string().trim().min(10, 'Requirements must be at least 10 characters').max(3000, 'Requirements must be at most 3000 characters'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters').max(100, 'Location must be at most 100 characters'),
  salaryMin: z.number().int('Salary must be an integer').min(0, 'Minimum salary must be >= 0'),
  salaryMax: z.number().int('Salary must be an integer').min(0, 'Maximum salary must be >= 0'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], {
    errorMap: () => ({ message: 'Type must be FULL_TIME, PART_TIME, CONTRACT, or INTERNSHIP' }),
  }),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salaryMax'],
});

export const updateJobSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  requirements: z.string().trim().min(10).max(3000).optional(),
  location: z.string().trim().min(2).max(100).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).default(''),
});
