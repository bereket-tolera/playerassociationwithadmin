import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// --- Icons ---
const WaliaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#009A44]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold tracking-wide uppercase transition-colors duration-300 hover:text-[#009A44] ${
      isActive ? "text-[#009A44]" : "text-gray-600"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-base font-bold rounded-lg transition-colors ${
      isActive ? "bg-green-50 text-[#009A44]" : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-sans">
      
      {/* 1. Top Flag Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#009A44]"></div>
        <div className="flex-1 bg-[#FEDD00]"></div>
        <div className="flex-1 bg-[#FF0000]"></div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 2. Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-full p-1 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
               <WaliaIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-none tracking-tight group-hover:text-[#009A44] transition-colors">
                EFF
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Ethiopian Football Fed.
              </span>
            </div>
          </Link>

          {/* 3. Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/players" className={linkClass}>National Squad</NavLink>
            <NavLink to="/events" className={linkClass}>Fixtures</NavLink>
            <NavLink to="/insights" className={linkClass}>News</NavLink>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>
            
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#009A44] transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              <LockIcon />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-[#009A44] p-2 focus:outline-none"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Home
            </NavLink>
            <NavLink to="/players" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              National Squad
            </NavLink>
            <NavLink to="/events" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Fixtures & Events
            </NavLink>
            <NavLink to="/insights" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              News & Insights
            </NavLink>
            <div className="pt-4 mt-2 border-t border-gray-100">
               <Link 
                 to="/login"
                 onClick={() => setIsOpen(false)} 
                 className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-bold uppercase"
               >
                 <LockIcon /> Access Admin Portal
               </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}