import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InsightService } from "../api/insightService";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { PageHero, EmptyState } from "./Players";

interface Insight {
  id: number; title: string; description: string; content: string;
  author: string; category: string; imagePath?: string; imagePaths?: string[];
}

export default function Insights() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await InsightService.getAll();
        setInsights(res.data.reverse());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">
      {/* Custom header with filter tabs */}
      <div className="bg-gray-900 dark:bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">{t("insights_page.header_badge")}</span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("insights_page.header_title_1")} <span className="gold-text italic">{t("insights_page.header_title_2")}</span>
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-[#C9A84C] to-transparent mb-8" />
          <div className="flex gap-6">
            {[t("insights_page.filter_latest"), t("insights_page.filter_research"), t("insights_page.filter_updates")].map((label, i) => (
              <button key={label} className={`text-[10px] font-bold uppercase tracking-widest pb-2 transition-all border-b
                ${i === 0 ? "text-[#C9A84C] border-[#C9A84C]" : "text-gray-500 border-transparent hover:text-[#C9A84C]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FAF7F0] dark:from-[#0D0D0D] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 pb-24">
        {insights.length === 0 ? (
          <EmptyState label={t("insights_page.empty")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((i) => <InsightCard key={i.id} {...i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
