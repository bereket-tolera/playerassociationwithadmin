import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

// --- Icons ---
const UserCircleIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);
const BellIcon = () => (
  <svg className="w-6 h-6 text-gray-500 hover:text-[#009A44] transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);
const LogoutIcon = () => (
  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

export default function AdminLayout() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Admin");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set username from storage
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    // Set readable date (e.g., "Monday, Dec 29")
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* 1. Sidebar (Fixed Left) */}
      <aside className="z-20 hidden md:block w-64 flex-shrink-0 bg-white shadow-xl h-full overflow-y-auto">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* --- Top Header Bar --- */}
        <header className="bg-white shadow-sm z-10 flex-shrink-0">
          {/* Flag Stripe */}
          <div className="h-1 flex w-full">
            <div className="flex-1 bg-[#009A44]"></div>
            <div className="flex-1 bg-[#FEDD00]"></div>
            <div className="flex-1 bg-[#FF0000]"></div>
          </div>

          {/* Header Content */}
          <div className="px-6 py-3 flex justify-between items-center">
            
            {/* Left: Title & Date */}
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">
                EFF Dashboard
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {currentDate} • <span className="text-[#009A44]">Addis Ababa</span>
              </p>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <BellIcon />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200"></div>

              {/* Profile Dropdown Area */}
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-gray-800 leading-none">{username}</p>
                   <p className="text-xs text-gray-500">Administrator</p>
                 </div>
                 <div className="rounded-full bg-gray-100 p-1 border border-gray-200">
                   <UserCircleIcon />
                 </div>
                 
                 <button 
                   onClick={handleLogout} 
                   className="hidden sm:flex items-center text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                 >
                   Sign Out <LogoutIcon />
                 </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- Scrollable Content Area --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8 relative">
           {/* Background Pattern (Optional subtle texture) */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
           </div>

           {/* The actual page content */}
           <div className="max-w-7xl mx-auto relative z-0">
             <Outlet />
           </div>

           {/* Footer */}
           <footer className="mt-12 text-center text-gray-400 text-xs pb-4">
             <p>&copy; {new Date().getFullYear()} Ethiopian Football Federation. All rights reserved.</p>
             <p className="font-amharic">የኢትዮጵያ እግር ኳስ ፌዴሬሽን</p>
           </footer>
        </main>

      </div>
    </div>
  );
}