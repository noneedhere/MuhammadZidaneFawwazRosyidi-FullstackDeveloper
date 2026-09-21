import type { ApplicationStatus } from '../../types';

const statusConfig: Record<ApplicationStatus, { bg: string; text: string; dot: string; label: string }> = {
  APPLIED: { bg: 'bg-[#f1f5f9]', text: 'text-[#334155]', dot: 'bg-[#64748b]', label: 'Applied' },
  REVIEWING: { bg: 'bg-[#eff6ff]', text: 'text-[#1d4ed8]', dot: 'bg-[#2563eb]', label: 'Reviewing' },
  SHORTLISTED: { bg: 'bg-[#faf5ff]', text: 'text-[#7e22ce]', dot: 'bg-[#7e22ce]', label: 'Shortlisted' },
  ACCEPTED: { bg: 'bg-[#ecfdf5]', text: 'text-[#047857]', dot: 'bg-[#047857]', label: 'Accepted' },
  REJECTED: { bg: 'bg-[#fff1f2]', text: 'text-[#be123c]', dot: 'bg-[#be123c]', label: 'Rejected' },
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status] || statusConfig.APPLIED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'REVIEWING' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
}
