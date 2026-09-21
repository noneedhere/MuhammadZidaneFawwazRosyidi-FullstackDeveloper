import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyService } from '../../services/api';
import type { ApplicationDetail } from '../../types';
import { formatDateTime } from '../../utils/formatDate';
import StatusBadge from '../../components/shared/StatusBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import toast from 'react-hot-toast';

const VALID_TRANSITIONS: Record<string, string[]> = {
  APPLIED: ['REVIEWING', 'REJECTED'], REVIEWING: ['SHORTLISTED', 'REJECTED'], SHORTLISTED: ['ACCEPTED', 'REJECTED'], ACCEPTED: [], REJECTED: [],
};

const STATUS_LABELS: Record<string, string> = { REVIEWING: 'Move to Review', SHORTLISTED: 'Shortlist', ACCEPTED: 'Accept', REJECTED: 'Reject' };

export default function ApplicantDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      const res = await companyService.getApplicationDetail(applicationId!);
      setDetail(res.data.data.application);
    } catch { navigate('/company/jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetail(); }, [applicationId]);

  const handleStatusUpdate = async () => {
    if (!confirmAction || updating) return;
    setUpdating(true);
    try {
      await companyService.updateApplicationStatus(applicationId!, confirmAction);
      toast.success('Status updated');
      setLoading(true);
      fetchDetail();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setUpdating(false); setConfirmAction(null); }
  };

  if (loading) return <LoadingSpinner />;
  if (!detail) return null;

  const allowedTransitions = VALID_TRANSITIONS[detail.currentStatus] || [];

  return (
    <div className="max-w-[900px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-medium text-[#434655] hover:text-[#0b1c30] transition-colors self-start">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
      </button>

      {/* Applicant info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xl font-bold">
              {detail.applicant?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0b1c30]">{detail.applicant?.fullName}</h1>
              <p className="text-sm text-[#434655]">{detail.applicant?.email}</p>
              {detail.applicant?.phone && <p className="text-xs text-[#434655]">{detail.applicant.phone}</p>}
            </div>
          </div>
          <StatusBadge status={detail.currentStatus} />
        </div>
        {detail.applicant?.bio && (
          <div className="mt-4 pt-4 border-t border-[#c3c6d7]/30">
            <p className="text-xs font-semibold text-[#434655] mb-1">About</p>
            <p className="text-sm text-[#434655]">{detail.applicant.bio}</p>
          </div>
        )}
      </div>

      {/* Job info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-xs font-semibold text-[#434655] mb-2">Applied for</p>
        <h2 className="text-lg font-semibold text-[#0b1c30]">{detail.job.title}</h2>
        <p className="text-sm text-[#434655]">{detail.job.location} • {detail.job.type.replace('_', ' ')}</p>
      </div>

      {/* Status actions */}
      {allowedTransitions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-[#0b1c30] mb-3">Update Status</h3>
          <div className="flex gap-3 flex-wrap">
            {allowedTransitions.map((status) => (
              <button key={status} onClick={() => setConfirmAction(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  status === 'REJECTED' ? 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]' : 'bg-[#2563eb] text-white hover:bg-[#004ac6]'
                }`}>
                {STATUS_LABELS[status] || status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0b1c30] mb-6">Timeline</h2>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-[#c3c6d7]/40" />
          <div className="flex flex-col gap-6">
            {detail.history.map((entry, i) => (
              <div key={entry.id} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  i === detail.history.length - 1 ? 'bg-[#2563eb] text-white' : 'bg-[#eff4ff] text-[#004ac6]'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">circle</span>
                </div>
                <div className="flex-1">
                  <StatusBadge status={entry.newStatus} />
                  <p className="text-xs text-[#434655] mt-1">{formatDateTime(entry.changedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={!!confirmAction} title="Update Application Status?"
        message={`Are you sure you want to change the status to "${confirmAction?.replace('_', ' ')}"?`}
        confirmText="Update" variant={confirmAction === 'REJECTED' ? 'danger' : 'primary'}
        onConfirm={handleStatusUpdate} onCancel={() => setConfirmAction(null)} />
    </div>
  );
}
