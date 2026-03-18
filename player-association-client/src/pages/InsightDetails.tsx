import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InsightService } from "../api/insightService";
import Loader from "../components/common/Loader";
import ImageSlider from "../components/ImageSlider";
import { getImageUrl, getImageUrls } from "../utils/imageUtils";
import { ArrowLeft, User, Tag } from "lucide-react";

interface Insight {
  id: number; title: string; description: string; content: string;
  author: string; category: string; imagePath?: string; imagePaths?: string[];
}

export default function InsightDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await InsightService.getById(Number(id));
        setInsight(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!insight) return <div className="text-center py-24 text-gray-500">{t("common.not_found")}</div>;

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">

      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-8 pt-10 pb-4">
        <Link to="/insights" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-colors group">
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          {t("details.back_to_insights")}
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <span className="px-3 py-1 bg-[#CC0000] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
            {insight.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {insight.title}
          </h1>
          <div className="w-12 h-px bg-[#C9A84C] mb-8" />

          <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#C9A84C]/10 rounded-full flex items-center justify-center">
                <User size={13} className="text-[#C9A84C]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                {insight.author || t("details.press_team")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#CC0000]/10 rounded-full flex items-center justify-center">
                <Tag size={13} className="text-[#CC0000]" />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("details.editorial_press")} {insight.category}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10 mb-16">
          {insight.imagePaths && insight.imagePaths.length > 0 ? (
            <ImageSlider images={getImageUrls(insight.imagePaths)} alt={insight.title} className="h-full" />
          ) : (
            <img src={getImageUrl(insight.imagePaths || insight.imagePath)} alt={insight.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-[#C9A84C]/30 rounded-tr-3xl" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {insight.description && (
            <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 italic border-l-2 border-[#C9A84C] pl-6">
              {insight.description}
            </p>
          )}
          <div className="text-gray-700 dark:text-gray-300 leading-[1.9] font-light text-base whitespace-pre-line">
            {insight.content}
          </div>
        </div>
      </article>

      {/* Footer */}
      <div className="bg-gray-900 dark:bg-[#0D0D0D] mt-20 py-12">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 text-center">{t("details.official_press_channel")}</p>
        <div className="flex justify-center gap-2 mt-6">
          <div className="h-0.5 w-8 bg-[#009A44] rounded-full" />
          <div className="h-0.5 w-8 bg-[#FEDD00] rounded-full" />
          <div className="h-0.5 w-8 bg-[#CC0000] rounded-full" />
        </div>
      </div>
    </div>
  );
}
