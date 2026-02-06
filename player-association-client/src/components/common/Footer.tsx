import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Twitter, Send } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-white dark:bg-gray-950 text-gray-400 font-sans border-t border-gray-100 dark:border-gray-900 pb-20">

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#009A44] rounded-full"></div>
              <h3 className="text-gray-900 dark:text-white font-black text-xl tracking-tighter uppercase leading-none">
                EPA<span className="text-[#009A44]">.</span>
              </h3>
            </Link>
            <p className="text-[11px] font-medium leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 border border-gray-50 dark:border-gray-800 rounded-full hover:border-[#009A44] hover:text-[#009A44] transition-all"><Facebook size={14} /></a>
              <a href="#" className="p-2 border border-gray-50 dark:border-gray-800 rounded-full hover:border-[#009A44] hover:text-[#009A44] transition-all"><Twitter size={14} /></a>
              <a href="#" className="p-2 border border-gray-50 dark:border-gray-800 rounded-full hover:border-[#009A44] hover:text-[#009A44] transition-all"><Send size={14} /></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-500 tracking-[0.2em] mb-8 block">{t('footer.directory')}</span>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-[#009A44] transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/players" className="hover:text-[#009A44] transition-colors">{t('nav.players')}</Link></li>
              <li><Link to="/events" className="hover:text-[#009A44] transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/insights" className="hover:text-[#009A44] transition-colors">{t('nav.insights')}</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <span className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-500 tracking-[0.2em] mb-8 block">{t('footer.presence')}</span>
            <ul className="space-y-4 text-[11px] font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#009A44] mt-0.5" />
                <span>Addis Ababa Stadium Complex,<br />Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#009A44]" />
                <a href="mailto:info@epa.et" className="hover:text-gray-900 transition-colors">central@epa.et</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#009A44]" />
                <span>+251 11-551-0000</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
            <span className="text-[9px] font-black uppercase text-[#009A44] tracking-[0.2em] mb-3 block">{t('footer.official_channel')}</span>
            <h4 className="text-gray-900 dark:text-white font-bold text-sm tracking-tight mb-4">{t('footer.newsletter_msg')}</h4>
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-center block w-full outline outline-1 outline-gray-200 dark:outline-gray-800 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all">
              {t('footer.staff_access')}
            </Link>
          </div>

        </div>

        <div className="mt-20 pt-10 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
