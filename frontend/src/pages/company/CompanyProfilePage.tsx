import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CompanyProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', companyName: '', description: '', location: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await profileService.getProfile();
        const u = res.data.data.user;
        setForm({ fullName: u.fullName || '', companyName: u.companyName || '', description: u.description || '', location: u.location || '', website: u.website || '' });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.updateProfile(form);
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[700px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-[30px] font-bold text-[#0b1c30] tracking-tight leading-[38px]">Company Profile</h1>
        <p className="text-sm text-[#434655]">Manage your company information.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#c3c6d7]/30">
          <div className="w-16 h-16 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#004ac6]">
            <span className="material-symbols-outlined text-[32px]">business</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0b1c30]">{user?.companyName || user?.fullName}</h2>
            <p className="text-sm text-[#434655]">{user?.email}</p>
            <span className="text-[10px] font-semibold text-[#003ea8] bg-[#dbe1ff] px-2 py-0.5 rounded mt-1 inline-block">Company</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Contact Name</label>
            <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Company Name</label>
            <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="City or region" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Website</label>
            <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-none" placeholder="About your company..." />
          </div>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
