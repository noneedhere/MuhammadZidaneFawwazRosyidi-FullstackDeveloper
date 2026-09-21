export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'JOB_SEEKER' | 'COMPANY';
  companyName?: string | null;
  phone?: string | null;
  bio?: string | null;
  description?: string | null;
  location?: string | null;
  website?: string | null;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  requirements?: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status?: 'OPEN' | 'CLOSED';
  companyName: string;
  companyId?: string;
  applicantCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  currentStatus: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetail {
  id: string;
  currentStatus: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    type: string;
  };
  history: HistoryEntry[];
  applicant?: {
    fullName: string;
    email: string;
    phone?: string | null;
    bio?: string | null;
  };
}

export interface HistoryEntry {
  id: string;
  previousStatus: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  changedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

export interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
}
