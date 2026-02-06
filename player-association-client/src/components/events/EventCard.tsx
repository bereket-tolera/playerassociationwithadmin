import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Calendar } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

interface EventProps {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  imagePaths?: string[];
  eventDate: string;
  location: string;
}

export default function EventCard({ id, title, imagePath, imagePaths, eventDate, location }: EventProps) {
  const { t, i18n } = useTranslation();
  const dateObj = new Date(eventDate);

  const displayImage = getImageUrl(imagePaths || imagePath);
  const formattedDate = dateObj.toLocaleDateString(i18n.language === 'am' ? 'am-ET' : 'en-US', {
    month: "long",
    day: "numeric"
  });

  return (
    <Link to={`/events/${id}`} className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:translate-y-[-4px]">
      <div className="relative h-56 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Date Overlap Badge */}
        <div className="absolute top-4 left-4 flex flex-col items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700">
          <span className="text-[10px] font-black uppercase text-[#E30613] tracking-wider leading-none">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
          <span className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{dateObj.getDate()}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 text-[8px] font-black uppercase tracking-widest rounded-full">
            Scheduled Event
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#009A44] transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <MapPin size={12} className="text-[#009A44]" />
            {location}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Clock size={12} className="text-yellow-500" />
            {formattedDate}
          </div>
        </div>
      </div>
    </Link>
  );
}