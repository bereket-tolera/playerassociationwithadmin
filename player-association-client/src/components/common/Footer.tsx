import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Twitter, Send } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#0D0D0D] text-gray-400 font-sans">

      {/* Gold top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#009A44] via-[#FEDD00] to-[#CC0000]" />
              <h3 className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                EPA<span className="gold-text">.</span>
              </h3>
            </Link>
            <p className="text-[12px] leading-relaxed text-gray-500 max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Send].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full text-gray-600 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-8 block">
              {t("footer.directory")}
            </span>
            <ul className="space-y-3">
              {[
                { to: "/", label: t("nav.home") },
                { to: "/players", label: t("nav.players") },
                { to: "/events", label: t("nav.events") },
                { to: "/insights", label: t("nav.insights") },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[12px] font-medium text-gray-500 hover:text-[#C9A84C] transition-colors tracking-wide">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-8 block">
              {t("footer.presence")}
            </span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={13} className="text-[#C9A84C] mt-0.5 shrink-0" />
                <span className="text-[12px] text-gray-500 leading-relaxed">Addis Ababa Stadium Complex,<br />Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={13} className="text-[#C9A84C] shrink-0" />
                <a href="mailto:central@epa.et" className="text-[12px] text-gray-500 hover:text-[#C9A84C] transition-colors">central@epa.et</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={13} className="text-[#C9A84C] shrink-0" />
                <span className="text-[12px] text-gray-500">+251 11-551-0000</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="border border-[#C9A84C]/20 rounded-2xl p-7 bg-white/[0.02]">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-3 block">
              {t("footer.official_channel")}
            </span>
            <h4 className="text-white font-semibold text-sm leading-snug mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("footer.newsletter_msg")}
            </h4>
            <Link
              to="/login"
              className="block text-center text-[10px] font-bold uppercase tracking-widest py-3 rounded-full border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all"
            >
              {t("footer.staff_access")}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium tracking-[0.2em] text-gray-600 uppercase">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex gap-8">
            {[t("footer.privacy"), t("footer.terms")].map((label) => (
              <a key={label} href="#" className="text-[10px] font-medium uppercase tracking-widest text-gray-600 hover:text-[#C9A84C] transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
