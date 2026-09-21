import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', location: '', salaryMin: '', salaryMax: '', type: 'FULL_TIME',
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createJob({ ...form, salaryMin: parseInt(form.salaryMin), salaryMax: parseInt(form.salaryMax) });
      toast.success('Job created!');
      navigate('/company/jobs');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">Create New Job</h1>
        <p className="text-sm text-[#434655]">Fill in the details for your new job listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 lg:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Job Title *</label>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required minLength={3} maxLength={100} placeholder="e.g. Frontend Developer"
            className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Job Type *</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] bg-white">
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Location *</label>
            <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} required placeholder="e.g. Jakarta Selatan"
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Min Salary (IDR) *</label>
            <input type="number" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} required min={0} placeholder="e.g. 8000000"
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Max Salary (IDR) *</label>
            <input type="number" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} required min={0} placeholder="e.g. 15000000"
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} required rows={6} minLength={10} placeholder="Describe the role, responsibilities, and what the candidate will do..."
            className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Requirements *</label>
          <textarea value={form.requirements} onChange={(e) => update('requirements', e.target.value)} required rows={4} minLength={10} placeholder="List the skills, experience, and qualifications needed..."
            className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/company/jobs')} className="px-6 py-2.5 rounded-lg border border-[#c3c6d7] text-[#434655] font-semibold text-sm hover:bg-[#f8f9ff] transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm transition-colors disabled:opacity-60">
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
