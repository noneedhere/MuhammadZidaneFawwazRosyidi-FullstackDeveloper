import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService, jobService } from '../../services/api';
import type { DashboardStats, Job } from '../../types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          companyService.getDashboard(),
          jobService.getCompanyJobs(1, 5),
        ]);
        setStats(statsRes.data.data);
        setRecentJobs(jobsRes.data.data.items);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: 'work', bg: 'bg-[#dce9ff]', color: 'text-[#004ac6]' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: 'description', bg: 'bg-[#d3e4fe]', color: 'text-[#004ac6]' },
    { label: 'Shortlisted', value: stats?.applicationsByStatus?.SHORTLISTED || 0, icon: 'stars', bg: 'bg-[#dae2fd]', color: 'text-[#3f465c]' },
    { label: 'Accepted', value: stats?.applicationsByStatus?.ACCEPTED || 0, icon: 'check_circle', bg: 'bg-[#6ffbbe]/30', color: 'text-[#006242]' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">Dashboard</h1>
          <p className="text-sm text-[#434655]">Overview of your company's hiring activity.</p>
        </div>
        <Link to="/company/jobs/new" className="px-4 py-2.5 bg-[#2563eb] text-white font-semibold text-sm rounded-lg hover:bg-[#004ac6] transition-colors flex items-center gap-2 self-start">
          <span className="material-symbols-outlined text-[18px]">add</span> Post New Job
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#434655]">{card.label}</span>
              <span className="text-[30px] font-bold text-[#0b1c30] mt-1 leading-[38px]">{card.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
              <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent jobs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Recent Jobs</h2>
          <Link to="/company/jobs" className="text-xs font-medium text-[#004ac6] flex items-center gap-0.5 hover:text-[#2563eb]">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        {recentJobs.length === 0 ? (
          <p className="text-sm text-[#434655] text-center py-8">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link key={job.id} to={`/company/jobs/${job.id}/applicants`} className="flex items-center justify-between p-4 rounded-lg hover:bg-[#eff4ff] transition-colors">
                <div>
                  <h3 className="text-sm font-semibold text-[#0b1c30]">{job.title}</h3>
                  <p className="text-xs text-[#434655]">{job.location} • {job.applicantCount || 0} applicants</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  job.status === 'OPEN' ? 'bg-[#ecfdf5] text-[#047857]' : 'bg-[#f1f5f9] text-[#64748b]'
                }`}>
                  {job.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
