import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

interface PlayerProps {
  id: number; fullName: string; age: number; club: string;
  position: string; nationality: string; imagePath?: string; imagePaths?: string[];
}

export default function PlayerCard({ id, fullName, position, club, imagePath, imagePaths }: PlayerProps) {
  const displayImage = getImageUrl(imagePaths || imagePath);

  return (
    <Link to={`/players/${id}`} className="group block luxury-card">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10">
        <img
          src={displayImage}
          alt={fullName}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-0 left-0 w-full p-5">
          <span className="inline-block px-2.5 py-1 bg-[#009A44] text-white text-[8px] font-bold uppercase tracking-widest rounded-full mb-3">
            {position}
          </span>
          <h3 className="text-base font-bold text-white leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {fullName}
          </h3>
          <p className="text-[10px] font-semibold text-[#C9A84C]/80 uppercase tracking-widest">{club}</p>
        </div>

        <div className="absolute top-4 right-4 w-6 h-6 border border-[#C9A84C]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
        </div>
      </div>
    </Link>
  );
}
