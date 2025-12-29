import { useEffect } from "react";

// --- Icons ---
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const JerseyIcon = () => (
  <svg className="w-5 h-5 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const GlobeIcon = () => (
  <svg className="w-5 h-5 text-[#FEDD00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ClubIcon = () => (
  <svg className="w-5 h-5 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const BirthdayIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
);

interface PlayerModalProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
  onClose: () => void;
}

export default function PlayerModal({
  fullName,
  age,
  club,
  position,
  nationality,
  description,
  imagePath,
  onClose,
}: PlayerModalProps) {

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 1. Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 2. Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up">
        
        {/* --- Left Column: Hero Image --- */}
        <div className="w-full md:w-2/5 relative h-72 md:h-auto bg-gray-800">
          <img 
            src={imagePath} 
            alt={fullName} 
            className="w-full h-full object-cover object-top opacity-90"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x800?text=Walia+Star"; }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 md:opacity-100"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          
          {/* Name Overlay (Mobile Only - visible on small screens) */}
          <div className="absolute bottom-0 left-0 p-6 md:hidden">
            <h2 className="text-3xl font-black text-white uppercase leading-none">{fullName}</h2>
            <p className="text-[#009A44] font-bold text-sm mt-1">{position}</p>
          </div>

          {/* Close Button (Mobile) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md md:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {/* --- Right Column: Details & Stats --- */}
        <div className="w-full md:w-3/5 bg-white flex flex-col relative overflow-y-auto">
          
          {/* Close Button (Desktop) */}
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors z-10"
          >
            <CloseIcon />
          </button>

          {/* Flag Stripe Decoration */}
          <div className="h-1.5 w-full flex">
             <div className="flex-1 bg-[#009A44]"></div>
             <div className="flex-1 bg-[#FEDD00]"></div>
             <div className="flex-1 bg-[#FF0000]"></div>
          </div>

          <div className="p-8 md:p-10 flex-grow">
            
            {/* Header (Desktop) */}
            <div className="hidden md:block mb-8">
               <span className="inline-block px-3 py-1 bg-[#009A44] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                 National Squad
               </span>
               <h2 className="text-4xl font-black text-gray-900 uppercase leading-none tracking-tight">
                 {fullName}
               </h2>
               <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs">
                 Official Player Profile (ተጫዋች መገለጫ)
               </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <div className="mt-1"><BirthdayIcon /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Age (ዕድሜ)</p>
                    <p className="text-lg font-bold text-gray-800">{age} Years</p>
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <div className="mt-1"><JerseyIcon /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Position (ቦታ)</p>
                    <p className="text-lg font-bold text-gray-800">{position}</p>
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <div className="mt-1"><ClubIcon /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Club (ክለብ)</p>
                    <p className="text-lg font-bold text-gray-800">{club}</p>
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <div className="mt-1"><GlobeIcon /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Nation (ዜግነት)</p>
                    <p className="text-lg font-bold text-gray-800">{nationality}</p>
                  </div>
               </div>
            </div>

            {/* Bio Section */}
            <div>
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                 Scout Report & Bio
               </h3>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                 {description || "No specific details available for this player."}
               </p>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="bg-[#f8fafc] px-8 py-4 border-t border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-2 opacity-50">
               <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
               <span className="text-xs font-bold text-gray-400 uppercase">EFF Database</span>
             </div>
             <button 
               onClick={onClose}
               className="text-sm font-bold text-gray-900 hover:text-[#009A44] transition-colors"
             >
               Close Profile
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}