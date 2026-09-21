import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be at most 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['JOB_SEEKER', 'COMPANY'], { errorMap: () => ({ message: 'Role must be JOB_SEEKER or COMPANY' }) }),
  companyName: z.string().trim().max(100).optional().transform(val => val === '' ? undefined : val),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'COMPANY' && (!data.companyName || data.companyName.length < 2)) {
    return false;
  }
  return true;
}, {
  message: 'Company name is required for company accounts (min 2 characters)',
  path: ['companyName'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
