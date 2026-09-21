import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from '../../components/shared/StatusBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import PaginationComp from '../../components/shared/Pagination';
import type { Pagination as PaginationType, ApplicationStatus } from '../../types';

interface Applicant {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  currentStatus: ApplicationStatus;
  appliedAt: string;
}

export default function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await companyService.getJobApplicants(jobId!, page);
      setApplicants(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch { navigate('/company/jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [jobId]);

  return (
    <div className="max-w-[1360px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <button onClick={() => navigate('/company/jobs')} className="flex items-center gap-1 text-sm font-medium text-[#434655] hover:text-[#0b1c30] transition-colors self-start">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Jobs
      </button>

      <div>
        <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">Applicants</h1>
        <p className="text-sm text-[#434655]">{pagination.total} applicant(s) for this position.</p>
      </div>

      {loading ? <LoadingSpinner /> : applicants.length === 0 ? (
        <EmptyState icon="people" title="No applicants yet" description="Share your job listing to attract candidates." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#eff4ff] text-[#434655] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a.applicationId} className="hover:bg-[#eff4ff]/60 transition-colors border-b border-[#c3c6d7]/20 last:border-b-0">
                    <td className="py-4 px-4 font-semibold text-sm text-[#0b1c30]">{a.applicantName}</td>
                    <td className="py-4 px-4 text-sm text-[#434655]">{a.applicantEmail}</td>
                    <td className="py-4 px-4 text-xs text-[#434655]">{formatDate(a.appliedAt)}</td>
                    <td className="py-4 px-4"><StatusBadge status={a.currentStatus} /></td>
                    <td className="py-4 px-4 text-right">
                      <Link to={`/company/applications/${a.applicationId}`} className="px-3 py-1 rounded-lg text-[#004ac6] hover:bg-[#e5eeff] text-xs font-medium transition-colors">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationComp page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetch} />
        </div>
      )}
    </div>
  );
}
