import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/api';
import type { Job, Pagination as PaginationType } from '../../types';
import { formatSalaryRange } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import PaginationComp from '../../components/shared/Pagination';

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
};

export default function JobListingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const res = await jobService.getOpenJobs(page, 10, searchQuery);
      setJobs(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchJobs(1, searchInput);
  };

  return (
    <div className="max-w-[1360px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">Browse Jobs</h1>
          <p className="text-sm text-[#434655]">Find roles that match your skills and career goals.</p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-2 flex flex-col lg:flex-row items-stretch gap-2">
        <div className="flex-1 flex items-center gap-3 px-3 py-1 rounded-lg bg-[#f8f9ff]">
          <span className="material-symbols-outlined text-[#737686] text-[20px]">search</span>
          <input
            type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by job title, keywords, or company..."
            className="w-full bg-transparent border-0 outline-none text-[#0b1c30] placeholder:text-[#737686] text-sm py-1"
          />
        </div>
        <button type="submit" className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm px-8 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
          Search
        </button>
      </form>

      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between px-1 text-xs font-medium text-[#434655]">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#0b1c30]">{pagination.total}</span>
            <span>available opportunities</span>
          </div>
        </div>
      )}

      {/* Job cards */}
      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState icon="work_off" title="No jobs found" description="Try adjusting your search or check back later for new opportunities." />
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 block">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#004ac6] font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">{job.title}</h2>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#434655]">
                      <span className="text-[#0b1c30] font-medium">{job.companyName}</span>
                      <span className="text-[#c3c6d7]">•</span>
                      <span className="flex items-center gap-0.5 text-[#006242]">
                        <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#565e74] text-[11px] font-semibold">{JOB_TYPE_LABELS[job.type] || job.type}</span>
                      <span className="px-2.5 py-1 rounded bg-[#f8f9ff] text-[#434655] text-[11px] font-semibold">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap pt-2 text-sm text-[#434655]">
                      <span className="font-semibold text-[#006242]">{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
                      <span className="flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-[16px] text-[#737686]">schedule</span>
                        {timeAgo(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  <span className="inline-flex items-center gap-1 text-[#004ac6] font-semibold text-sm hover:text-[#2563eb] transition-colors">
                    View Details <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <PaginationComp page={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => fetchJobs(p)} />
    </div>
  );
}
