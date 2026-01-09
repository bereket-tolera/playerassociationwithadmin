import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";

interface EventProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

export default function EventCard({ id, title, imagePath, eventDate, location }: EventProps) {
  const dateObj = new Date(eventDate);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();

  return (
    <Link to={`/events/${id}`} className="group relative block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-[#FEDD00] hover:-translate-y-1">
      <div className="flex h-32">
        {/* Date Block */}
        <div className="w-24 bg-[#FEDD00] text-black flex flex-col items-center justify-center p-2 text-center shrink-0">
          <span className="text-sm font-bold uppercase tracking-widest">{month}</span>
          <span className="text-4xl font-black leading-none">{day}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-[#b45309] transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><MapPin size={12} /> {location}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> Upcoming</span>
          </div>

          {/* Hover BG Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 dark:to-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </div>

        {/* Image Preview (Small) */}
        <div className="w-24 relative overflow-hidden hidden sm:block">
          <img src={imagePath} alt={title} className="h-full w-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
        </div>
      </div>
    </Link>
  );
}