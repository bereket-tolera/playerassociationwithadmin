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

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();

  // Navigation Config
  const navItems = [
    {
      path: "/admin/players",
      label: "Squad Manager",
      sub: "ተጫዋቾች (Squad)",
      icon: <PlayerIcon />
    },
    {
      path: "/admin/events",
      label: "Fixtures & Events",
      sub: "መርሃ ግብር (Events)",
      icon: <EventIcon />
    },
    {
      path: "/admin/insights",
      label: "News & Insights",
      sub: "ዜና (News)",
      icon: <InsightIcon />
    },
  ];

  const handleLogout = () => {
    // Logic usually handled by parent, but fallback provided
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <div className="w-64 h-full bg-white flex flex-col font-sans border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">

      {/* 1. Brand Header */}
      <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center border-[3px] border-[#009A44] mb-3 p-2">
          <WaliaLogo />
        </div>
        <h2 className="text-lg font-black text-gray-800 tracking-tight text-center leading-none">
          EFF ADMIN
        </h2>
        <p className="text-[10px] text-[#009A44] font-bold tracking-[0.2em] uppercase mt-1">
          Ethiopia
        </p>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-grow px-3 py-6 space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-oswald">
          Management Console
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent
              ${isActive
                ? "bg-gradient-to-r from-[#009A44]/10 to-transparent text-[#009A44] border-l-4 border-l-[#009A44] border-y-[#009A44]/5 border-r-[#009A44]/5 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3.5">
                  <span className={`transition-colors duration-200 ${isActive ? "text-[#009A44]" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {item.icon}
                  </span>
                  <div>
                    <span className={`block text-sm font-bold ${isActive ? "text-gray-900" : ""}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] block font-medium ${isActive ? "text-[#009A44]" : "text-gray-400"}`}>
                      {item.sub}
                    </span>
                  </div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-sm border border-transparent hover:border-red-100 transition-all duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">Sign Out</span>
          <LogoutIcon />
        </button>

        {/* Subtle decorative dots */}
        <div className="mt-4 flex justify-center gap-1.5 opacity-30">
          <div className="h-1 w-1 rounded-full bg-[#009A44]"></div>
          <div className="h-1 w-1 rounded-full bg-[#FEDD00]"></div>
          <div className="h-1 w-1 rounded-full bg-[#FF0000]"></div>
        </div>
      </div>
    </div>
  );
}