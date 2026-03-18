import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Clock } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

interface EventProps {
  id: number; title: string; description: string;
  imagePath?: string; imagePaths?: string[];
  eventDate: string; location: string;
}

export default function EventCard({ id, title, imagePath, imagePaths, eventDate, location }: EventProps) {
  const { i18n } = useTranslation();
  const dateObj = new Date(eventDate);
  const displayImage = getImageUrl(imagePaths || imagePath);
  const formattedDate = dateObj.toLocaleDateString(i18n.language === "am" ? "am-ET" : "en-US", { month: "long", day: "numeric" });

  return (
    <Link to={`/events/${id}`} className="group block luxury-card">
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-[#C9A84C]/10 bg-white dark:bg-[#111]">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-[#1A1A1A]">
          <img src={displayImage} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Date badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#0D0D0D]/80 backdrop-blur-sm border border-gray-200 dark:border-[#C9A84C]/30 px-3 py-2 rounded-xl text-center shadow-sm">
            <span className="block text-[9px] font-bold uppercase text-[#C9A84C] tracking-wider leading-none">
              {dateObj.toLocaleString("en-US", { month: "short" })}
            </span>
            <span className="block text-xl font-black text-gray-900 dark:text-white leading-none mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
              {dateObj.getDate()}
            </span>
          </div>

          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Body */}
        <div className="p-5">
          <span className="inline-block px-2.5 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-[8px] font-bold uppercase tracking-widest rounded-full mb-3">
            Scheduled
          </span>
          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#C9A84C] transition-colors line-clamp-1 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h3>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
              <MapPin size={11} className="text-[#009A44]" /> {location}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
              <Clock size={11} className="text-[#C9A84C]" /> {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
