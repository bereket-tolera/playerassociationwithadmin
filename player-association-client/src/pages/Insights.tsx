import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InsightService } from "../api/insightService";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { Newspaper } from "lucide-react";

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 font-sans transition-colors duration-500">

      {/* 1. Header Area: Minimalist */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-gray-100 dark:border-gray-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-4 block">Archive & Press</span>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tight leading-none">
              Editorial <span className="font-bold pr-2">Journal</span> <NewsIcon />
            </h1>
          </div>

          <div className="flex gap-4">
            <button className="text-[10px] font-black uppercase text-red-600 tracking-widest px-4 py-2 border-b-2 border-red-600 transition-all">Latest</button>
            <button className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 py-2 hover:text-[#009A44] transition-all">Research</button>
            <button className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 py-2 hover:text-[#009A44] transition-all">Updates</button>
          </div>
        </div>
      </div>

      {/* 2. Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {insights.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Zero editorial content found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {insights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

const NewsIcon = () => (
  <div className="inline-flex p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 ml-2 shadow-sm">
    <Newspaper size={18} />
  </div>
);
