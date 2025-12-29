import { NavLink, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  onLogout?: () => void;
}

// --- Icons ---
const WaliaLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#009A44]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
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
  
  // Navigation Items Config
  const navItems = [
    { 
      path: "/admin/players", 
      label: "Squad Manager", 
      sub: "ተጫዋቾች", 
      icon: <PlayerIcon /> 
    },
    { 
      path: "/admin/events", 
      label: "Fixtures & Events", 
      sub: "መርሃ ግብር", 
      icon: <EventIcon /> 
    },
    { 
      path: "/admin/insights", 
      label: "News & Insights", 
      sub: "ዜና", 
      icon: <InsightIcon /> 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="w-64 h-full bg-white flex flex-col font-sans border-r border-gray-100">
      
      {/* 1. Header / Brand */}
      <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100 bg-gray-50/50">
        <div className="h-14 w-14 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-[#009A44] mb-3">
          <WaliaLogo />
        </div>
        <h2 className="text-lg font-black text-gray-800 tracking-tight">EFF ADMIN</h2>
        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          Ethiopian Football Fed.
        </p>
      </div>
      
      {/* 2. Navigation */}
      <nav className="flex-grow px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Management
        </p>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? "bg-[#009A44]/10 text-[#009A44] shadow-sm font-bold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span className={`transition-colors ${isActive ? "text-[#009A44]" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {item.icon}
                  </span>
                  <div>
                    <span className="block text-sm">{item.label}</span>
                    <span className={`text-[10px] block ${isActive ? "text-[#009A44]/70" : "text-gray-300"}`}>
                      {item.sub}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-[#009A44]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* 3. Footer / Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
        >
          <span className="group-hover:translate-x-[-2px] transition-transform">Sign Out</span>
          <LogoutIcon />
        </button>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="h-1 w-8 bg-[#009A44] rounded-full opacity-20"></div>
          <div className="h-1 w-8 bg-[#FEDD00] rounded-full opacity-20"></div>
          <div className="h-1 w-8 bg-[#FF0000] rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
}