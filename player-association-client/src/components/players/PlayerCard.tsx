import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

interface PlayerProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  imagePath?: string;
  imagePaths?: string[];
}

export default function PlayerCard({ id, fullName, position, club, imagePath, imagePaths }: PlayerProps) {
  const displayImage = getImageUrl(imagePaths || imagePath);

  return (
    <Link to={`/players/${id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:translate-y-[-4px]">
        <img
          src={displayImage}
          alt={fullName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Minimal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-0 left-0 w-full p-5">
          <span className="inline-block px-2 py-0.5 bg-[#009A44] text-white text-[8px] font-black uppercase tracking-widest rounded mb-2">
            {position}
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors leading-tight">
            {fullName}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-widest mt-1">
            {club}
          </p>
        </div>
      </div>
    </Link>
  );
}