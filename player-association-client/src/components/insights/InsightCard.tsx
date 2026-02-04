import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, getImageUrls } from "../../utils/imageUtils";
import { useState } from "react";

interface InsightProps {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath?: string;
  imagePaths?: string[];
}

export default function InsightCard({ id, title, description, category, imagePath, imagePaths }: InsightProps) {
  const { t } = useTranslation();
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
    <Link to={`/insights/${id}`} className="group relative block perspective-1000">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">

        {/* Large Image Section */}
        <div className="relative h-72 overflow-hidden bg-gray-900">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

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
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold z-10">
                <Images size={14} />
                {currentImageIndex + 1}/{imageCount}
              </div>
            </>
          )}

          {/* Category & Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {category}
            </span>
            <h3 className="text-2xl font-black text-white leading-tight font-oswald uppercase group-hover:text-red-400 transition-colors line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 relative">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>

          {/* Read More Button */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('insights_page.read_more')}</span>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
              <ArrowUpRight size={20} />
            </div>
          </div>

          {/* Progress bar animation */}
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 mt-4 overflow-hidden rounded-full">
            <div className="h-full bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </div>
        </div>

      </div>
    </Link>
  );
}