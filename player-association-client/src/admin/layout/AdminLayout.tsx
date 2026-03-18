import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import { Clock, Bell } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Admin");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
    const date = new Date();
    setFormattedDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
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
    <div className="flex h-screen bg-[#f5f5f0] font-sans overflow-hidden text-gray-800">

      {/* Sidebar */}
      <aside className="hidden md:block h-full flex-shrink-0 relative z-20">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full relative w-full min-w-0">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 z-10 flex-shrink-0 px-8 py-4 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-300 leading-none mb-1">Management Console</p>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-none">
              Ethiopian Players Association
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Clock size={11} className="text-[#009A44]" />
              {formattedDate}
            </div>

            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell size={16} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#009A44]"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-900 leading-none">{username}</p>
                <p className="text-[9px] text-[#009A44] font-bold uppercase tracking-widest mt-0.5">Verified Admin</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#009A44] to-[#007A30] flex items-center justify-center text-white font-black text-sm shadow-sm">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f5f0] p-8 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <Outlet />
          </div>

          <footer className="mt-20 py-8 border-t border-gray-200/50 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} EPA GLOBAL SYSTEM • ADDIS ABABA
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
