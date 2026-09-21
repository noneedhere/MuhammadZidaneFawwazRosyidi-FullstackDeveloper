import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate(user.role === 'COMPANY' ? '/company/dashboard' : '/jobs', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#004ac6] to-[#2563eb] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">IndoKerja<span className="text-[#b4c5ff]">.id</span></h1>
          <p className="text-xl text-[#dbe1ff] mb-6">Your career journey starts here.</p>
          <p className="text-[#b4c5ff]/80">Connect with top companies in Indonesia and find your dream job.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-[#c3c6d7]/30">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#0b1c30]">Welcome back</h2>
              <p className="text-sm text-[#434655] mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] bg-white text-[#0b1c30] text-sm placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0b1c30] mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#c3c6d7] bg-white text-[#0b1c30] text-sm placeholder:text-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-[#434655] mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#004ac6] font-semibold hover:underline">Sign up</Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-[#eff4ff] rounded-lg">
              <p className="text-xs font-semibold text-[#004ac6] mb-2">Demo Accounts</p>
              <div className="space-y-1 text-xs text-[#434655]">
                <p><strong>Job Seeker:</strong> seeker1@example.com / password123</p>
                <p><strong>Company:</strong> company1@example.com / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
