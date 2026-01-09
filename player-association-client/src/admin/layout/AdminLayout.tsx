import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

// --- Header Icons ---
const UserCircleIcon = () => (
  <svg className="w-9 h-9 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const BellIcon = () => (
  <svg className="w-6 h-6 text-gray-400 hover:text-[#009A44] transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4 text-[#009A44] mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

export default function AdminLayout() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Administrator");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // 1. Get User
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    // 2. Format Date (e.g., "Monday, Oct 24")
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    setFormattedDate(date.toLocaleDateString('en-US', options));
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Federation portal?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden selection:bg-[#009A44] selection:text-white">

      {/* 1. Sidebar (Desktop Fixed) */}
      <aside className="hidden md:block h-full flex-shrink-0 relative z-20">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative w-full min-w-0">

        {/* --- Top Header --- */}
        <header className="bg-white shadow-sm z-10 flex-shrink-0">
          {/* Ethiopian Flag Stripe (Top Border) */}
          <div className="h-1 w-full flex">
            <div className="flex-1 bg-[#009A44]"></div>
            <div className="flex-1 bg-[#FEDD00]"></div>
            <div className="flex-1 bg-[#E30613]"></div>
          </div>

          <div className="px-6 py-4 flex justify-between items-center">
            {/* Left: Dashboard Title & Date */}
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                Federation Dashboard
              </h1>
              <div className="flex items-center mt-1 text-xs font-medium text-gray-500">
                <CalendarIcon />
                <span>{formattedDate}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-[#009A44] font-bold">Addis Ababa, ET</span>
              </div>
            </div>

            {/* Right: User Profile */}
            <div className="flex items-center gap-6">
              {/* Notifications */}
              <div className="relative group">
                <BellIcon />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-[#E30613] transform translate-x-1/4 -translate-y-1/4 animate-pulse"></span>
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">{username}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Admin Access</p>
                </div>
                <div className="rounded-full bg-gray-50 p-1 border border-gray-100 shadow-sm">
                  <UserCircleIcon />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- Scrollable Content Area --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F4F6] p-6 relative scroll-smooth">
          {/* Subtle Watermark/Pattern - Carbon Fibre */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`
            }}>
          </div>

          {/* Dynamic Page Content */}
          <div className="max-w-7xl mx-auto relative z-10 fade-in-up">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="mt-12 mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                © {new Date().getFullYear()} Ethiopian Football Federation
              </span>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
}