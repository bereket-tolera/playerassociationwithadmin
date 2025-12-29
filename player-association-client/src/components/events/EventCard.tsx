import { useState } from "react";
import EventDetails from "./EventDetails";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

// --- Icons ---
const MapPinIcon = () => (
  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);

export default function EventCard({
  id,
  title,
  description,
  imagePath,
  eventDate,
  location,
}: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to construct image URL
  const getImageUrl = () => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=EFF+Event";
    if (imagePath.startsWith("http")) return imagePath;
    // Adjust base URL to match your backend
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Date Logic
  const dateObj = new Date(eventDate);
  const isPast = dateObj < new Date();
  const monthName = dateObj.toLocaleString('default', { month: 'short' });
  const dayNum = dateObj.getDate();
  const yearNum = dateObj.getFullYear();

  return (
    <>
      <div
        className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full ${isPast ? 'opacity-90' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {/* 1. Image Header */}
        <div className="relative h-56 overflow-hidden bg-gray-200">
          <img
            src={getImageUrl()}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isPast ? 'grayscale-[0.5]' : ''}`}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/600x400?text=EFF+Event";
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>

          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${isPast ? 'bg-gray-800 text-white' : 'bg-[#FEDD00] text-gray-900'}`}>
             {isPast ? "Concluded" : "Upcoming"}
          </div>

          {/* Date Block (Floating) */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg flex flex-col items-center justify-center w-14 h-14 border-t-4 border-[#009A44]">
            <span className="text-[10px] font-black text-red-600 uppercase leading-none mt-1">{monthName}</span>
            <span className="text-xl font-black text-gray-800 leading-none">{dayNum}</span>
          </div>
        </div>

        {/* 2. Content Body */}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#009A44] uppercase tracking-wide">
              {yearNum} Season
            </span>
          </div>

          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#009A44] transition-colors">
            {title}
          </h3>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPinIcon />
            <span className="truncate font-medium">{location}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 w-full mb-4 mt-auto"></div>

          {/* Footer Action */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-amharic">ዝርዝር ይመልከቱ</span>
            <button className="flex items-center text-sm font-bold text-gray-900 group-hover:text-[#009A44] transition-colors">
              View Details <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Details Modal */}
      {isOpen && (
        <EventDetails
          id={id}
          title={title}
          description={description}
          imagePath={getImageUrl()}
          eventDate={eventDate}
          location={location}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}