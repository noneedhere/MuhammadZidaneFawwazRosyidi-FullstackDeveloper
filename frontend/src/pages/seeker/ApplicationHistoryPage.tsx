import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/api';
import type { Application, Pagination as PaginationType } from '../../types';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from '../../components/shared/StatusBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import PaginationComp from '../../components/shared/Pagination';

export default function ApplicationHistoryPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchApps = async (page = 1) => {
    setLoading(true);
    try {
      const res = await applicationService.getUserApplications(page);
      setApps(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) { console.error('Failed to fetch applications', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  return (
    <div className="max-w-[1360px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">My Applications</h1>
        <p className="text-sm text-[#434655]">Track the progress of all your job applications.</p>
      </div>

      {loading ? <LoadingSpinner /> : apps.length === 0 ? (
        <EmptyState icon="description" title="No applications yet" description="Start applying to jobs and track your progress here." action={
          <Link to="/jobs" className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#004ac6] transition-colors">Browse Jobs</Link>
        } />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#eff4ff] text-[#434655] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#eff4ff]/60 transition-colors border-b border-[#c3c6d7]/20 last:border-b-0">
                    <td className="py-4 px-4 font-semibold text-sm text-[#0b1c30]">{app.jobTitle}</td>
                    <td className="py-4 px-4 text-sm text-[#434655]">{app.companyName}</td>
                    <td className="py-4 px-4 text-xs text-[#434655]/80 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                    <td className="py-4 px-4"><StatusBadge status={app.currentStatus} /></td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/applications/${app.id}`} className="px-3 py-1 rounded-lg text-[#004ac6] hover:bg-[#e5eeff] text-xs font-medium transition-colors">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationComp page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchApps} />
        </div>
      )}
    </div>
  );
}
