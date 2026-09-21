import { z } from 'zod';

export const applyJobSchema = z.object({
  jobId: z.string().uuid('Invalid job ID format'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be REVIEWING, SHORTLISTED, ACCEPTED, or REJECTED' }),
  }),
});
