import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobListingPage from './pages/seeker/JobListingPage';
import JobDetailPage from './pages/seeker/JobDetailPage';
import ApplicationHistoryPage from './pages/seeker/ApplicationHistoryPage';
import ApplicationDetailPage from './pages/seeker/ApplicationDetailPage';
import ProfilePage from './pages/seeker/ProfilePage';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import MyJobsPage from './pages/company/MyJobsPage';
import CreateJobPage from './pages/company/CreateJobPage';
import EditJobPage from './pages/company/EditJobPage';
import ApplicantsPage from './pages/company/ApplicantsPage';
import ApplicantDetailPage from './pages/company/ApplicantDetailPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Job Seeker routes */}
          <Route element={<AppLayout requiredRole="JOB_SEEKER" />}>
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/applications" element={<ApplicationHistoryPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Company routes */}
          <Route element={<AppLayout requiredRole="COMPANY" />}>
            <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
            <Route path="/company/jobs" element={<MyJobsPage />} />
            <Route path="/company/jobs/new" element={<CreateJobPage />} />
            <Route path="/company/jobs/:id/edit" element={<EditJobPage />} />
            <Route path="/company/jobs/:jobId/applicants" element={<ApplicantsPage />} />
            <Route path="/company/applications/:applicationId" element={<ApplicantDetailPage />} />
            <Route path="/company/profile" element={<CompanyProfilePage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { background: '#0b1c30', color: '#fff', fontSize: '14px', borderRadius: '8px' },
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
