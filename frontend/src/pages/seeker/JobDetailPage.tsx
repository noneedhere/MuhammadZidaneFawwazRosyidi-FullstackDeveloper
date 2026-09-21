import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService } from '../../services/api';
import type { Job } from '../../types';
import { formatSalaryRange } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobDetail(id!);
        setJob(res.data.data.job);
        setApplicationStatus(res.data.data.applicationStatus);
      } catch { navigate('/jobs'); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (applying || applicationStatus) return;
    setApplying(true);
    try {
      await applicationService.apply(id!);
      setApplicationStatus('APPLIED');
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return null;

  return (
    <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      {/* Back button */}
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-1 text-sm font-medium text-[#434655] hover:text-[#0b1c30] transition-colors self-start">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Jobs
      </button>

      {/* Job header card */}
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#004ac6] shrink-0">
              <span className="material-symbols-outlined text-[28px]">corporate_fare</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-[#434655]">
                <span className="font-medium text-[#0b1c30]">{job.companyName}</span>
                <span className="text-[#c3c6d7]">•</span>
                <span className="flex items-center gap-0.5 text-[#006242] text-xs">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#565e74] text-xs font-semibold">{JOB_TYPE_LABELS[job.type]}</span>
                <span className="px-2.5 py-1 rounded bg-[#f8f9ff] text-[#434655] text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">place</span> {job.location}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#f8f9ff] text-[#434655] text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> Posted {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-lg font-semibold text-[#006242]">{formatSalaryRange(job.salaryMin, job.salaryMax)}</p>
            {applicationStatus ? (
              <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#eff4ff] text-[#004ac6]">
                Already Applied ({applicationStatus.replace('_', ' ')})
              </span>
            ) : job.status === 'CLOSED' ? (
              <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#f1f5f9] text-[#64748b]">Closed</span>
            ) : (
              <button onClick={handleApply} disabled={applying}
                className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">send</span>
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description + Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-[#0b1c30] mb-4">Job Description</h2>
          <div className="text-sm text-[#434655] whitespace-pre-line leading-relaxed">{job.description}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-[#0b1c30] mb-4">Requirements</h2>
          <div className="text-sm text-[#434655] whitespace-pre-line leading-relaxed">{job.requirements}</div>
        </div>
      </div>
    </div>
  );
}
