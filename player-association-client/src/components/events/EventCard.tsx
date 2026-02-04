import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, getImageUrls } from "../../utils/imageUtils";
import { useState } from "react";

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
  const month = dateObj.toLocaleString(i18n.language === 'am' ? 'am-ET' : 'en-US', { month: "short" });
  const day = dateObj.getDate();

  // Handle multiple images
  const images = imagePaths && imagePaths.length > 0 ? getImageUrls(imagePaths) : [getImageUrl(imagePath)];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageCount = images.length;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  return (
    <Link to={`/events/${id}`} className="group relative block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Large Image Section */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Date Badge - Positioned on Image */}
        <div className="absolute top-4 left-4 bg-[#FEDD00] text-black rounded-xl p-3 text-center shadow-lg min-w-[70px]">
          <span className="block text-xs font-bold uppercase tracking-wider">{month}</span>
          <span className="block text-3xl font-black leading-none my-1">{day}</span>
        </div>

        {/* Manual Navigation Arrows - Only show if multiple images */}
        {imageCount > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold">
              <Images size={14} />
              {currentImageIndex + 1}/{imageCount}
            </div>
          </>
        )}

        {/* Title Overlay on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-black text-white leading-tight mb-2 group-hover:text-[#FEDD00] transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-[#FEDD00]" />
            <span className="font-medium">{location}</span>
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-[#FEDD00]" />
            <span className="font-medium">{t('matchday.live')}</span>
          </span>
        </div>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('insights_page.read_more')}</span>
          <div className="w-8 h-8 rounded-full bg-[#FEDD00] flex items-center justify-center transform translate-x-0 group-hover:translate-x-2 transition-transform">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FEDD00] via-[#b45309] to-[#FEDD00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </Link>
  );
}