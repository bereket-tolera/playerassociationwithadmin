import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Menu, X, Lock } from "lucide-react";

// --- Icons ---
const WaliaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#009A44]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold tracking-wide uppercase transition-colors duration-300 hover:text-[#009A44] ${isActive ? "text-[#009A44]" : "text-gray-600 dark:text-gray-300"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-base font-bold rounded-lg transition-colors ${isActive ? "bg-green-50 text-[#009A44] dark:bg-green-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-white/20 dark:border-gray-800 font-sans transition-colors duration-300">

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
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all">
              <WaliaIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-[#009A44] transition-colors">
                EPA
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Ethiopian Players Association
              </span>
            </div>
          </Link>

          {/* 3. Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/players" className={linkClass}>Players</NavLink>
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            <NavLink to="/insights" className={linkClass}>Insights</NavLink>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#009A44] dark:hover:text-[#009A44] transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link
              to="/login"
              className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#009A44] dark:hover:bg-[#009A44] transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              <Lock size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#009A44]"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-[#009A44] p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-xl animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Home
            </NavLink>
            <NavLink to="/players" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Players
            </NavLink>
            <NavLink to="/events" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Events
            </NavLink>
            <NavLink to="/insights" onClick={() => setIsOpen(false)} className={mobileLinkClass}>
              Insights
            </NavLink>
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-bold uppercase hover:bg-[#009A44] transition-colors"
              >
                <Lock size={16} /> Access Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}