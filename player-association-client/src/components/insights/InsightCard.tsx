import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

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

export default function InsightCard({ id, title, description, category, author, imagePath, imagePaths }: InsightProps) {
  const { t } = useTranslation();
  const displayImage = getImageUrl(imagePaths || imagePath);

  return (
    <Link to={`/insights/${id}`} className="group block h-full">
      <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:translate-y-[-4px]">

        {/* Thumbnail area */}
        <div className="relative h-48 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <img
            src={displayImage}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            alt=""
          />
          <div className="absolute top-4 left-4">
            <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
              {category}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{author || "Editorial Team"}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors leading-tight mb-3">
              {title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
              {description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('insights_page.read_more')}</span>
            <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 text-gray-400 group-hover:text-red-500 transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}