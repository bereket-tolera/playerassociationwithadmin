import { Link } from "react-router-dom";

// --- Icons ---
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
);
const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
);
const WaliaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] dark:bg-black text-gray-300 dark:text-gray-400 mt-auto border-t border-gray-800 dark:border-gray-900">
      {/* 1. Flag Gradient Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#009A44] via-[#FEDD00] to-[#FF0000]"></div>

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <WaliaIcon />
              <div>
                <h3 className="text-white font-black text-lg leading-none uppercase tracking-wider">EPA</h3>
                <p className="text-[10px] text-[#009A44] font-bold">Ethiopian Players Association</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Governing body for players in Ethiopia. Protecting rights and promoting welfare.
            </p>
            <p className="font-amharic text-sm text-gray-500">የኢትዮጵያ ተጫዋቾች ማህበር</p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#009A44] transition-colors">Home</Link></li>
              <li><Link to="/players" className="hover:text-[#009A44] transition-colors">Players</Link></li>
              <li><Link to="/events" className="hover:text-[#009A44] transition-colors">Events</Link></li>
              <li><Link to="/insights" className="hover:text-[#009A44] transition-colors">Insights</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-700 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[#009A44]">📍</span>
                <span>Addis Ababa Stadium,<br />Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#FEDD00]">✉️</span>
                <a href="mailto:info@epa.et" className="hover:text-white">info@epa.et</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#FF0000]">📞</span>
                <span>+251 11 551 0000</span>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-700 pb-2 inline-block">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-full hover:bg-[#009A44] hover:text-white transition-all transform hover:-translate-y-1">
                <FacebookIcon />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:-translate-y-1">
                <TwitterIcon />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-full hover:bg-[#229ED9] hover:text-white transition-all transform hover:-translate-y-1">
                <TelegramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-[#0f141f] dark:bg-black border-t border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ethiopian Players Association. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}