import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCompany = user?.role === 'COMPANY';

  const seekerLinks = [
    { path: '/jobs', icon: 'work_outline', label: 'Browse Jobs' },
    { path: '/applications', icon: 'description', label: 'My Applications' },
    { path: '/profile', icon: 'person_outline', label: 'My Profile' },
  ];

  const companyLinks = [
    { path: '/company/dashboard', icon: 'grid_view', label: 'Dashboard' },
    { path: '/company/jobs', icon: 'work_outline', label: 'My Jobs' },
    { path: '/company/profile', icon: 'person_outline', label: 'Profile' },
  ];

  const links = isCompany ? companyLinks : seekerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-[#c3c6d7]/40 z-50 flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center gap-2 border-b border-[#c3c6d7]/30">
            <img alt="IndoKerja.id Logo" className="h-8 w-auto object-contain" src="/images/logo.png" />
            <span className="text-base font-semibold text-[#0b1c30] tracking-tight">
              IndoKerja<span className="text-[#004ac6]">.id</span>
            </span>
          </div>

          {/* Navigation */}
          <div className="px-3 pt-6">
            <p className="px-3 pb-1 text-[11px] font-semibold text-[#434655]/70 uppercase tracking-wider">
              Main Menu
            </p>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#eff4ff] text-[#004ac6]'
                        : 'text-[#434655] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-[#c3c6d7]/30 flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
