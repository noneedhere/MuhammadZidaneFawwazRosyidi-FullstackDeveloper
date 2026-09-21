import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 h-16 bg-white border-b border-[#c3c6d7]/40 z-40 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1 text-[#434655] hover:text-[#0b1c30]">
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <span className="text-xs font-medium text-[#434655]">Workspace</span>
        <span className="material-symbols-outlined text-[16px] text-[#737686]">chevron_right</span>
        <span className="text-sm font-semibold text-[#0b1c30]">Job Portal</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-3 border-l border-[#c3c6d7]/40">
          <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#0b1c30]">{user?.fullName}</span>
            <span className="text-[10px] font-semibold text-[#003ea8] bg-[#dbe1ff] px-1.5 py-[1px] rounded self-start leading-tight">
              {user?.role === 'COMPANY' ? 'Company' : 'Job Seeker'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
