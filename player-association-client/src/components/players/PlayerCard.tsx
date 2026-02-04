import { Link } from "react-router-dom";
import { ArrowRight, Shirt } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

interface PlayerProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
}

export default function PlayerCard({ id, fullName, position, club, imagePath }: PlayerProps) {
  const displayImage = getImageUrl(imagePath);
  console.log(`Player ${fullName}:`, { imagePath, displayImage });

  return (
    <Link to={`/players/${id}`} className="group relative block h-[400px] w-full perspective-1000">
      <div className="relative h-full w-full transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">

        {/* Card Background & Image */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90" />
          <img
            src={displayImage}
            alt={fullName}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
          <div className="flex items-center gap-2 mb-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="px-2 py-1 bg-[#009A44] text-white text-[10px] uppercase font-bold tracking-wider rounded">
              {position}
            </span>
          </div>

          <h3 className="text-3xl font-black text-white uppercase italic leading-none mb-1 group-hover:text-[#FEDD00] transition-colors font-oswald">
            {fullName}
          </h3>

          <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
            <Shirt size={14} className="text-[#009A44]" />
            {club}
          </div>

          {/* Hover Arrow */}
          <div className="absolute right-6 bottom-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#009A44]">
            <ArrowRight size={18} />
          </div>
        </div>

        {/* Gradient Border Line */}
        <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-[#009A44] via-[#FEDD00] to-[#FF0000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30"></div>
      </div>
    </Link>
  );
}