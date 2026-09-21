import client from '../api/client';

export const authService = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  register: (data: any) =>
    client.post('/auth/register', data),
  getMe: () =>
    client.get('/auth/me'),
};

export const jobService = {
  getOpenJobs: (page = 1, limit = 10, search = '') =>
    client.get('/jobs', { params: { page, limit, search } }),
  getJobDetail: (id: string) =>
    client.get(`/jobs/${id}`),
  createJob: (data: any) =>
    client.post('/company/jobs', data),
  getCompanyJobs: (page = 1, limit = 10) =>
    client.get('/company/jobs', { params: { page, limit } }),
  updateJob: (id: string, data: any) =>
    client.put(`/company/jobs/${id}`, data),
  closeJob: (id: string) =>
    client.patch(`/company/jobs/${id}/close`),
};

export const applicationService = {
  apply: (jobId: string) =>
    client.post('/applications', { jobId }),
  getUserApplications: (page = 1, limit = 10) =>
    client.get('/applications', { params: { page, limit } }),
  getApplicationDetail: (id: string) =>
    client.get(`/applications/${id}`),
};

export const companyService = {
  getDashboard: () =>
    client.get('/company/dashboard'),
  getJobApplicants: (jobId: string, page = 1, limit = 10) =>
    client.get(`/company/jobs/${jobId}/applicants`, { params: { page, limit } }),
  getApplicationDetail: (id: string) =>
    client.get(`/company/applications/${id}`),
  updateApplicationStatus: (id: string, status: string) =>
    client.patch(`/company/applications/${id}/status`, { status }),
};

export const profileService = {
  getProfile: () =>
    client.get('/profile'),
  updateProfile: (data: any) =>
    client.put('/profile', data),
};
