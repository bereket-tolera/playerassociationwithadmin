import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

interface InsightProps {
  id: number; title: string; description: string; content: string;
  author: string; category: string; imagePath?: string; imagePaths?: string[];
}

export default function InsightCard({ id, title, description, category, author, imagePath, imagePaths }: InsightProps) {
  const { t } = useTranslation();
  const displayImage = getImageUrl(imagePaths || imagePath);

  return (
    <Link to={`/insights/${id}`} className="group block h-full luxury-card">
      <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10 rounded-2xl overflow-hidden h-full flex flex-col">

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-[#1A1A1A]">
          <img src={displayImage} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 bg-[#CC0000] text-white text-[8px] font-bold uppercase tracking-widest rounded-full">{category}</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{author || "Editorial Team"}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#C9A84C] transition-colors leading-snug mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-light">{description}</p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("insights_page.read_more")}</span>
            <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 group-hover:border-[#C9A84C]/50 group-hover:bg-[#C9A84C]/10 flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] transition-all">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
