import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AdminSidebarProps {
  onLogout?: () => void;
}

const WaliaLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="#009A44" strokeWidth="2" />
    <path d="M20 8 L28 14 L28 22 C28 27 24 31 20 33 C16 31 12 27 12 22 L12 14 Z" fill="#009A44" opacity="0.15" stroke="#009A44" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M17 20 L20 17 L23 20 L20 26 Z" fill="#FEDD00"/>
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const PlayerIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const EventIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const InsightIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { path: "/admin", label: t('nav.home'), icon: <DashboardIcon />, end: true },
    { path: "/admin/players", label: t('nav.players'), icon: <PlayerIcon /> },
    { path: "/admin/events", label: t('nav.events'), icon: <EventIcon /> },
    { path: "/admin/insights", label: t('nav.insights'), icon: <InsightIcon /> },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <div className="w-60 h-full bg-[#0a0f0d] flex flex-col font-sans border-r border-white/5 z-30">

      {/* Brand */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3 border-b border-white/5">
        <WaliaLogo />
        <div className="flex flex-col">
          <span className="text-sm font-black text-white tracking-tight leading-none">
            EPA <span className="text-[#009A44]">ADMIN</span>
          </span>
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">
            {t('nav.admin_console')}
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em]">Navigation</span>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? "bg-[#009A44]/15 text-[#009A44] border border-[#009A44]/20"
                : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors duration-200 ${isActive ? "text-[#009A44]" : "text-white/30 group-hover:text-white/60"}`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-white" : ""}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-[#009A44]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Flag accent */}
      <div className="mx-6 my-4 flex gap-0 rounded-full overflow-hidden h-0.5 opacity-30">
        <div className="flex-1 bg-[#009A44]"></div>
        <div className="flex-1 bg-[#FEDD00]"></div>
        <div className="flex-1 bg-[#E30613]"></div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 uppercase tracking-widest border border-transparent hover:border-red-500/20"
        >
          <LogoutIcon />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
}
