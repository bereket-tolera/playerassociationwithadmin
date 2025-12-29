import { useEffect } from "react";

// --- Icons ---
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5 mr-2 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const MapPinIcon = () => (
  <svg className="w-5 h-5 mr-2 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5 mr-2 text-[#FEDD00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

interface EventDetailsProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
  onClose: () => void;
}

export default function EventDetails({
  title,
  description,
  imagePath,
  eventDate,
  location,
  onClose,
}: EventDetailsProps) {
  
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const dateObj = new Date(eventDate);
  const fullDate = dateObj.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 1. Backdrop (Blur) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 2. Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header Image Section */}
        <div className="relative h-64 sm:h-80 flex-shrink-0">
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=EFF+Event"; }}
          />
          {/* Gradient overlay for text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          
          {/* Close Button (Floating) */}
          <button
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-transform hover:scale-105 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Flag Line */}
          <div className="flex h-1.5 w-16 mb-6 rounded-full overflow-hidden">
             <div className="flex-1 bg-[#009A44]"></div>
             <div className="flex-1 bg-[#FEDD00]"></div>
             <div className="flex-1 bg-[#FF0000]"></div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
            {title}
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">
            Official Fixture Detail (ዝርዝር መረጃ)
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div className="flex items-center">
               <CalendarIcon />
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                 <p className="text-sm font-bold text-gray-800">{fullDate}</p>
               </div>
             </div>
             
             <div className="flex items-center">
               <MapPinIcon />
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                 <p className="text-sm font-bold text-gray-800">{location}</p>
               </div>
             </div>

             <div className="flex items-center sm:col-span-2">
               <ClockIcon />
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">Time</p>
                 <p className="text-sm font-bold text-gray-800">Kick-off at {timeStr}</p>
               </div>
             </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm sm:prose-base text-gray-600 max-w-none leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Event Overview</h3>
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-8 sm:py-6 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md"
           >
             Close Details
           </button>
        </div>

      </div>
    </div>
  );
}