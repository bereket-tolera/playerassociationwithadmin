import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";

const ShieldIcon = () => (
  <svg viewBox="0 0 40 46" fill="none" className="w-8 h-9">
    <path d="M20 2L4 9v12c0 10.5 6.8 20.3 16 23 9.2-2.7 16-12.5 16-23V9L20 2z" fill="url(#shieldGrad)" />
    <path d="M20 2L4 9v12c0 10.5 6.8 20.3 16 23 9.2-2.7 16-12.5 16-23V9L20 2z" stroke="rgba(201,168,76,0.6)" strokeWidth="0.5" />
    <path d="M14 22l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="shieldGrad" x1="4" y1="2" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#009A44" />
        <stop offset="100%" stopColor="#006B2F" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "en" ? "am" : "en");

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 pb-0.5
    after:absolute after:bottom-0 after:left-0 after:h-px after:transition-all after:duration-300
    ${isActive
      ? "text-[#C9A84C] after:w-full after:bg-[#C9A84C]"
      : "text-gray-500 dark:text-gray-400 hover:text-[#C9A84C] after:w-0 hover:after:w-full after:bg-[#C9A84C]"
    }`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 font-sans
      ${scrolled
        ? "bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-[#C9A84C]/10"
        : "bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-lg border-b border-gray-100 dark:border-transparent"
      }`}>

      {/* Ethiopian flag stripe */}
      <div className="h-0.5 w-full flex">
        <div className="flex-1 bg-[#009A44]" />
        <div className="flex-1 bg-[#FEDD00]" />
        <div className="flex-1 bg-[#CC0000]" />
      </div>

      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <ShieldIcon />
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-black tracking-tight text-gray-900 dark:text-white uppercase">
                EPA <span className="gold-text">Portal</span>
              </span>
              <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-[0.25em] mt-0.5">
                {t("nav.global_portal")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/" end className={linkClass}>{t("nav.home")}</NavLink>
            <NavLink to="/players" className={linkClass}>{t("nav.players")}</NavLink>
            <NavLink to="/events" className={linkClass}>{t("nav.events")}</NavLink>
            <NavLink to="/insights" className={linkClass}>{t("nav.insights")}</NavLink>
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 hover:text-[#C9A84C] border border-gray-200 dark:border-gray-700 hover:border-[#C9A84C]/40 rounded-full transition-all"
            >
              {i18n.language === "en" ? "አማ" : "EN"}
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#C9A84C] transition-colors" aria-label="Toggle theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <Link to="/login" className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-[#009A44] hover:bg-[#006B2F] rounded-full transition-all shadow-md shadow-green-900/20">
              {t("nav.login")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-400" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#111] border-t border-gray-100 dark:border-[#C9A84C]/10 shadow-2xl animate-fade-in">
          <div className="px-6 py-6 space-y-1">
            {[{ to: "/", label: t("nav.home") }, { to: "/players", label: t("nav.players") }, { to: "/events", label: t("nav.events") }, { to: "/insights", label: t("nav.insights") }].map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors
                  ${isActive ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"}`
                }>
                {label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase text-[#009A44] tracking-widest">{t("nav.login")}</Link>
              <div className="flex gap-4 items-center">
                <button onClick={toggleLanguage} className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{i18n.language === "en" ? "አማርኛ" : "English"}</button>
                <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
