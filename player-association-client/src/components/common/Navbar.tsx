import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";

// --- Icons ---
const WaliaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#009A44]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:text-[#009A44] ${isActive ? "text-[#009A44]" : "text-gray-500 dark:text-gray-400"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${isActive ? "bg-green-50 text-[#009A44] dark:bg-green-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 font-sans transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* 2. Logo / Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-[#009A44]">
              <WaliaIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                EPA <span className="text-[#009A44]">GLOBAL</span>
              </span>
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-0.5">
                {t('nav.global_portal')}
              </span>
            </div>
          </Link>

          {/* 3. Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/" className={linkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/players" className={linkClass}>{t('nav.players')}</NavLink>
            <NavLink to="/events" className={linkClass}>{t('nav.events')}</NavLink>
            <NavLink to="/insights" className={linkClass}>{t('nav.insights')}</NavLink>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-400 hover:text-[#009A44] transition-colors flex items-center gap-1"
                aria-label="Toggle Language"
              >
                <span className="text-[10px] font-black">{i18n.language === 'en' ? 'AM' : 'EN'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-[#009A44] transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest text-[#009A44] border border-[#009A44]/20 px-5 py-2 rounded-full hover:bg-[#009A44] hover:text-white transition-all"
            >
              {t('nav.login')}
            </Link>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 p-2"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full shadow-2xl animate-fade-in">
          <div className="px-6 py-6 space-y-2">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/players" onClick={() => setIsOpen(false)} className={mobileLinkClass}>{t('nav.players')}</NavLink>
            <NavLink to="/events" onClick={() => setIsOpen(false)} className={mobileLinkClass}>{t('nav.events')}</NavLink>
            <NavLink to="/insights" onClick={() => setIsOpen(false)} className={mobileLinkClass}>{t('nav.insights')}</NavLink>
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase text-[#009A44]">{t('nav.login')}</Link>
              <div className="flex gap-4">
                <button onClick={toggleLanguage} className="text-[10px] font-black uppercase text-gray-400">{i18n.language === 'en' ? 'Amharic' : 'English'}</button>
                <button onClick={toggleTheme} className="text-gray-400">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
