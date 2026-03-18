import { useState, FormEvent } from "react";
import { AuthService } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Lock, Loader2, ChevronRight } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await AuthService.login(username, password);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/admin");
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t("login.invalid_credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0D0D0D]">

      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1856&q=80')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D]/80 to-[#006B2F]/30" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #C9A84C, #C9A84C 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #C9A84C, #C9A84C 1px, transparent 1px, transparent 60px)" }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#009A44]" />
              <div className="w-2 h-2 rounded-full bg-[#FEDD00]" />
              <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">{t("login.sign_in")}</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="w-16 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
          <h1 className="text-5xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("login.unity_sport")}
            <br />
            <span className="gold-text italic">{t("login.excellence_action")}</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-light">
            {t("login.welcome_admin")}
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-2">
            <div className="h-1 w-16 bg-[#009A44] rounded-full" />
            <div className="h-1 w-16 bg-[#FEDD00] rounded-full" />
            <div className="h-1 w-16 bg-[#CC0000] rounded-full" />
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF7F0] dark:bg-[#111] relative">

        {/* Mobile top accent */}
        <div className="absolute top-0 left-0 w-full h-0.5 flex lg:hidden">
          <div className="flex-1 bg-[#009A44]" />
          <div className="flex-1 bg-[#FEDD00]" />
          <div className="flex-1 bg-[#CC0000]" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-3 block">
              Admin Portal
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("login.dashboard_title")}
            </h2>
            <p className="text-sm text-gray-400 font-light">{t("login.subtitle")}</p>
            <div className="w-10 h-px bg-[#C9A84C] mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-4 rounded-xl">
                <span className="text-red-500 text-sm">⚠</span>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder={t("login.username") as string}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder={t("login.password") as string}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all"
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-[11px] font-semibold text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
                {t("login.forgot_password")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all
                ${loading
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#009A44] hover:bg-[#006B2F] text-white shadow-lg shadow-green-900/20 hover:shadow-green-900/30"
                }`}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t("login.authenticating")}</>
              ) : (
                <>{t("login.secure_sign_in")} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Ethiopian Players Association
          </p>
        </div>
      </div>
    </div>
  );
}
