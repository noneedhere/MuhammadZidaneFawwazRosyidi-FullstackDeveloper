import { z } from 'zod';

export const updateJobSeekerProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  bio: z.string().trim().max(1000).optional().nullable(),
});

export const updateCompanyProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  companyName: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  website: z.string().trim().url('Invalid URL format').optional().nullable().or(z.literal('')),
});
