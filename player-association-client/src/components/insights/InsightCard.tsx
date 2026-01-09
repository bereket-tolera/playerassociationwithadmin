import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface InsightProps {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
}

export default function InsightCard({ id, title, description, category, imagePath }: InsightProps) {
  return (
    <Link to={`/insights/${id}`} className="group relative block perspective-1000">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">

        <div className="relative h-64 overflow-hidden">
          <img src={imagePath} alt={title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2">
              {category}
            </span>
            <h3 className="text-xl font-black text-white leading-tight font-oswald uppercase group-hover:underline decoration-red-600 decoration-2 underline-offset-4">
              {title}
            </h3>
          </div>
        </div>

        <div className="p-6 relative">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>

          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform -translate-y-1/2 translate-x-1/2">
              <ArrowUpRight size={20} />
            </div>
          </div>

          <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 mt-2 overflow-hidden rounded-full">
            <div className="h-full bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </div>
        </div>

      </div>
    </Link>
  );
}