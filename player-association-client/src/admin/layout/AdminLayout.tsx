import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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
  const [username, setUsername] = useState("Admin");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    setFormattedDate(date.toLocaleDateString('en-US', options));
  }, []);

  const handleLogout = () => {
    if (window.confirm("Sign out of the management console?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] font-sans overflow-hidden text-gray-800">

      {/* 1. Sidebar */}
      <aside className="hidden md:block h-full flex-shrink-0 relative z-20">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full min-w-0">

        {/* --- Top Header: Minimalist --- */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 flex-shrink-0 px-8 py-3 flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="md:hidden h-6 w-6 text-[#009A44]">
              {/* Mobile logo placeholder */}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 leading-none mb-1">Current Instance</p>
              <h1 className="text-sm font-bold text-gray-800 tracking-tight leading-none uppercase">
                Management Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Live Clock / Date */}
            <div className="hidden lg:flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 pr-8">
              <Clock size={12} className="mr-2 text-[#009A44]" /> {formattedDate}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-900 leading-none">{username}</p>
                <p className="text-[9px] text-[#009A44] font-bold uppercase tracking-widest mt-1">Verified Admin</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#009A44] transition-colors">
                <UserCircleIcon />
              </div>
            </div>
          </div>
        </header>

        {/* --- Area --- */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] p-8 relative">

          <div className="max-w-6xl mx-auto relative z-10">
            <Outlet />
          </div>

          <footer className="mt-20 py-8 border-t border-gray-50 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} EPA GLOBAL SYSTEM • ADDIS ABABA
            </p>
          </footer>
        </main>

      </div>
    </div>
  );
}
