import { useState } from "react";
import PlayerModal from "./PlayerModal";

// --- Icons ---
const JerseyIcon = () => (
  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const ClubIcon = () => (
  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M9 10a2 2 0 012-2h2a2 2 0 012 2v8m-6-8a2 2 0 01-2-2h2a2 2 0 012 2v8" /></svg>
);
const ArrowIcon = () => (
  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

interface PlayerCardProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
}

export default function PlayerCard({
  id,
  fullName,
  age,
  club,
  position,
  nationality,
  description,
  imagePath,
}: PlayerCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to construct robust image URL
  const getImageUrl = () => {
    if (!imagePath) return "https://via.placeholder.com/400x500?text=Walia+Star";
    if (imagePath.startsWith("http")) return imagePath;
    // Adjust base URL to match your backend
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Position Color Logic
  const getPosColor = (pos: string) => {
    const p = pos.toLowerCase();
    if (p.includes("goal") || p.includes("gk")) return "bg-yellow-500";
    if (p.includes("def")) return "bg-blue-600";
    if (p.includes("mid")) return "bg-[#009A44]";
    if (p.includes("for") || p.includes("str")) return "bg-[#FF0000]";
    return "bg-gray-700";
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-full flex flex-col"
        onClick={() => setIsOpen(true)}
      >
        {/* 1. Card Header / Image */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <img
            src={getImageUrl()}
            alt={fullName}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x500?text=No+Image"; }}
          />
          
          {/* Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

          {/* Position Badge (Floating) */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-black text-white uppercase shadow-lg tracking-wider ${getPosColor(position)}`}>
            {position}
          </div>

          {/* Age Badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-white/30">
            {age} <span className="text-[10px] font-normal opacity-80">YRS</span>
          </div>

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4">
            <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-md">
              {fullName}
            </h3>
            <p className="text-xs text-gray-300 font-medium flex items-center gap-1 mt-1">
              <span className="text-[#009A44]">●</span> {nationality}
            </p>
          </div>
        </div>

        {/* 2. Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between bg-white">
          <div>
            {/* Club Info */}
            <div className="flex items-center mb-3">
              <div className="p-1.5 rounded-full bg-gray-50 mr-3 border border-gray-100">
                <ClubIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Club</p>
                <p className="text-sm font-bold text-gray-800 line-clamp-1">{club}</p>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-px w-full bg-gray-100 my-3"></div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between mt-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase">Player Profile</span>
             <button className="text-xs font-bold text-[#009A44] uppercase flex items-center group-hover:underline decoration-2 underline-offset-4">
               Stats & Bio <ArrowIcon />
             </button>
          </div>
        </div>

        {/* 3. Bottom Color Bar (Flag) */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#009A44]"></div>
          <div className="flex-1 bg-[#FEDD00]"></div>
          <div className="flex-1 bg-[#FF0000]"></div>
        </div>
      </div>

      {isOpen && (
        <PlayerModal
          id={id}
          fullName={fullName}
          age={age}
          club={club}
          position={position}
          nationality={nationality}
          description={description}
          imagePath={getImageUrl()}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}