import { NavLink, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  onLogout?: () => void;
}

// --- Icons (Custom SVGs) ---
const WaliaLogo = () => (
  // Abstract Shield/Ibex shape
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#009A44]">
    <path d="M12 2L2 7v6c0 5.55 3.84 10.74 9 12 2.3-3.04 5.3-5.04 6.7-6.7.8-1 .8-2.3 0-3.3-1.6-1.9-4.4-4.2-6.7-6.7V5l-5 2.5V13c0 3.7 2.56 7.16 6 8.8 3.44-1.64 6-5.1 6-8.8V7l-10-5z" />
  </svg>
);

const PlayerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

const EventIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

const InsightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();

  // Navigation Config
  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <DashboardIcon />,
      end: true
    },
    {
      path: "/admin/players",
      label: "Players",
      icon: <PlayerIcon />
    },
    {
      path: "/admin/events",
      label: "Events",
      icon: <EventIcon />
    },
    {
      path: "/admin/insights",
      label: "Insights",
      icon: <InsightIcon />
    },
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
    <div className="w-56 h-full bg-white flex flex-col font-sans border-r border-gray-100 z-30">

      {/* 1. Brand: Minimal */}
      <div className="px-6 py-10 flex items-center gap-3">
        <div className="h-8 w-8 text-[#009A44]">
          <WaliaLogo />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-gray-900 tracking-tighter leading-none">
            EPA <span className="text-[#009A44]">ADMIN</span>
          </span>
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            Console
          </span>
        </div>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-grow px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
              ${isActive
                ? "bg-gray-50 text-[#009A44]"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors duration-200 ${isActive ? "text-[#009A44]" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-gray-900" : ""}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 uppercase tracking-widest"
        >
          <span>Sign Out</span>
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}
