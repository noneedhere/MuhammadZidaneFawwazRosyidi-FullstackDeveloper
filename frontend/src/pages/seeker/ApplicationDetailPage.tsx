import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';
import type { ApplicationDetail } from '../../types';
import { formatDateTime } from '../../utils/formatDate';
import StatusBadge from '../../components/shared/StatusBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationService.getApplicationDetail(id!);
        setDetail(res.data.data.application);
      } catch { navigate('/applications'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!detail) return null;

  return (
    <div className="max-w-[900px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <button onClick={() => navigate('/applications')} className="flex items-center gap-1 text-sm font-medium text-[#434655] hover:text-[#0b1c30] transition-colors self-start">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Applications
      </button>

      {/* Application header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">{detail.job.title}</h1>
            <p className="text-sm text-[#434655] mt-1">{detail.job.companyName} • {detail.job.location}</p>
          </div>
          <StatusBadge status={detail.currentStatus} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0b1c30] mb-6">Application Timeline</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-[#c3c6d7]/40" />
          <div className="flex flex-col gap-6">
            {detail.history.map((entry, i) => (
              <div key={entry.id} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  i === detail.history.length - 1 ? 'bg-[#2563eb] text-white' : 'bg-[#eff4ff] text-[#004ac6]'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {entry.newStatus === 'ACCEPTED' ? 'check_circle' : entry.newStatus === 'REJECTED' ? 'cancel' : 'circle'}
                  </span>
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={entry.newStatus} />
                    {entry.previousStatus && (
                      <span className="text-xs text-[#737686]">from {entry.previousStatus.replace('_', ' ')}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#434655] mt-1">{formatDateTime(entry.changedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
