import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InsightService } from "../api/insightService";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { getImageUrl } from "../utils/imageUtils";
import { Newspaper, Rss, ArrowUpRight } from "lucide-react";

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath?: string;
  imagePaths?: string[];
}

export default function Insights() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await InsightService.getAll();
        setInsights(res.data.reverse()); // Show newest first
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500">

      {/* 1. Hero Section */}
      <div className="relative pt-20 pb-24 bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-[#FF0000] border border-red-100 dark:border-red-900/30 rounded-full font-bold text-xs uppercase tracking-[0.2em] mb-6">
            <Newspaper size={14} /> {t('insights_page.badge')}
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 leading-tight">
            {t('newsroom.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-red-800">{t('newsroom.subtitle')}</span>
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('insights_page.description')}
          </p>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Feature (First item if exists) */}
        {insights.length > 0 && (
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl h-[400px]">
              <img src={getImageUrl(insights[0].imagePaths || insights[0].imagePath)} alt={insights[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-[#FF0000] text-white text-xs font-bold uppercase tracking-widest rounded mb-3 inline-block">Featured</span>
                <h2 className="text-3xl font-black text-white leading-tight mb-2">{insights[0].title}</h2>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase leading-tight">
                {insights[0].title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                {insights[0].description}
              </p>
              <a href={`/insights/${insights[0].id}`} className="inline-flex items-center gap-2 text-[#FF0000] font-bold uppercase tracking-widest hover:text-red-700 transition-colors">
                {t('insights_page.read_more')} <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-700 pb-4 mb-12 overflow-x-auto">
          <button className="text-[#FF0000] font-black uppercase text-sm border-b-2 border-[#FF0000] pb-4 -mb-4.5 whitespace-nowrap">Latest News</button>
          <button className="text-gray-500 dark:text-gray-400 font-bold uppercase text-sm hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">Interviews</button>
          <button className="text-gray-500 dark:text-gray-400 font-bold uppercase text-sm hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap">Tactics</button>
          <div className="flex-grow"></div>
          <button className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            <Rss size={14} />
          </button>
        </div>

        {/* Insights Grid */}
        {insights.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Articles Published</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">The newsroom is coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {insights.slice(1).map((insight) => ( // Skip the first one if used in Featured
              <InsightCard key={insight.id} {...insight} />
            ))}
            {/* If only 1 item, show it again or handle empty logic differently. Here simply mapping all remaining. */}
            {insights.length === 1 && (
              <div className="col-span-full text-center py-10 text-gray-400">
                More articles coming soon.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
