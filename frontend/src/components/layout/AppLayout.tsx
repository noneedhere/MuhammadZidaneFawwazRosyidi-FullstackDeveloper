import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ requiredRole }: { requiredRole?: 'JOB_SEEKER' | 'COMPANY' }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff]">
        <div className="w-10 h-10 border-3 border-[#e5eeff] border-t-[#2563eb] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    const redirectTo = user?.role === 'COMPANY' ? '/company/dashboard' : '/jobs';
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main className="lg:pl-[240px] pt-16 min-h-screen">
        <div className="px-4 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
