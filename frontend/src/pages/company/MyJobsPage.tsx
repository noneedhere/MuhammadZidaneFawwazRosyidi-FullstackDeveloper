import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/api';
import type { Job, Pagination as PaginationType } from '../../types';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import PaginationComp from '../../components/shared/Pagination';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import toast from 'react-hot-toast';

const JOB_TYPE_LABELS: Record<string, string> = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship' };

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [closeTarget, setCloseTarget] = useState<string | null>(null);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await jobService.getCompanyJobs(page);
      setJobs(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleClose = async () => {
    if (!closeTarget) return;
    try {
      await jobService.closeJob(closeTarget);
      toast.success('Job closed');
      fetchJobs(pagination.page);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCloseTarget(null); }
  };

  return (
    <div className="max-w-[1360px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">My Jobs</h1>
          <p className="text-sm text-[#434655]">Manage your posted job listings.</p>
        </div>
        <Link to="/company/jobs/new" className="px-4 py-2.5 bg-[#2563eb] text-white font-semibold text-sm rounded-lg hover:bg-[#004ac6] transition-colors flex items-center gap-2 self-start">
          <span className="material-symbols-outlined text-[18px]">add</span> Create Job
        </Link>
      </div>

      {loading ? <LoadingSpinner /> : jobs.length === 0 ? (
        <EmptyState icon="work" title="No jobs posted" description="Create your first job listing." action={
          <Link to="/company/jobs/new" className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm font-semibold">Create Job</Link>
        } />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#eff4ff] text-[#434655] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Applicants</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#eff4ff]/60 transition-colors border-b border-[#c3c6d7]/20 last:border-b-0">
                    <td className="py-4 px-4 font-semibold text-sm text-[#0b1c30]">{job.title}</td>
                    <td className="py-4 px-4 text-xs text-[#434655]">{JOB_TYPE_LABELS[job.type]}</td>
                    <td className="py-4 px-4 text-xs text-[#434655]">{job.location}</td>
                    <td className="py-4 px-4">
                      <Link to={`/company/jobs/${job.id}/applicants`} className="text-[#004ac6] text-xs font-semibold hover:underline">{job.applicantCount || 0}</Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${job.status === 'OPEN' ? 'bg-[#ecfdf5] text-[#047857]' : 'bg-[#f1f5f9] text-[#64748b]'}`}>{job.status}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#434655] whitespace-nowrap">{formatDate(job.createdAt)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/company/jobs/${job.id}/edit`} className="text-[#004ac6] text-xs font-medium hover:underline">Edit</Link>
                        {job.status === 'OPEN' && (
                          <button onClick={() => setCloseTarget(job.id)} className="text-[#ba1a1a] text-xs font-medium hover:underline">Close</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationComp page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchJobs} />
        </div>
      )}

      <ConfirmDialog isOpen={!!closeTarget} title="Close Job?" message="Closing this job will prevent new applications. This cannot be undone." confirmText="Close Job" variant="danger" onConfirm={handleClose} onCancel={() => setCloseTarget(null)} />
    </div>
  );
}
