import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState<{ fullName: string; email: string; password: string; confirmPassword: string; role: 'JOB_SEEKER' | 'COMPANY'; companyName: string }>({ fullName: '', email: '', password: '', confirmPassword: '', role: 'JOB_SEEKER', companyName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { companyName, ...rest } = form;
      const payload = form.role === 'COMPANY' ? { ...rest, companyName } : rest;
      await register(payload);
      toast.success('Registration successful!');
      navigate(form.role === 'COMPANY' ? '/company/dashboard' : '/jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-[#c3c6d7]/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#0b1c30]">Create your account</h2>
            <p className="text-sm text-[#434655] mt-1">Join IndoKerja.id today</p>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['JOB_SEEKER', 'COMPANY'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => update('role', role)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  form.role === role
                    ? 'border-[#2563eb] bg-[#eff4ff] text-[#004ac6]'
                    : 'border-[#c3c6d7] text-[#434655] hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] block mb-1">
                  {role === 'JOB_SEEKER' ? 'person' : 'business'}
                </span>
                {role === 'JOB_SEEKER' ? 'Job Seeker' : 'Company'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required minLength={2} maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="you@example.com" />
            </div>
            {form.role === 'COMPANY' && (
              <div>
                <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Company Name</label>
                <input type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} required minLength={2} maxLength={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="Your company name" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8}
                className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="Min. 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#434655] mt-6">
            Already have an account? <Link to="/login" className="text-[#004ac6] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
