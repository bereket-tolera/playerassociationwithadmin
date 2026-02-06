import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import InsightForm from "./InsightForm";
import { User, Edit3, Trash2, Plus, FileText, ChevronRight } from "lucide-react";

// --- Interfaces ---
interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: any;
  imagePath?: string;
  imagePaths?: string[];
  createdAt?: string;
}

export default function InsightList() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await InsightService.getAll();
      setInsights(res.data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Archive this entry?")) return;
    try {
      await InsightService.delete(id);
      fetchInsights();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getImageUrl = (imagePaths?: string | string[]) => {
    if (!imagePaths) return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80";
    const imagePath = Array.isArray(imagePaths) ? (imagePaths.length > 0 ? imagePaths[0] : null) : imagePaths;
    if (!imagePath) return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const displayCategory = (category: any): string => {
    if (!category) return "General";
    if (typeof category === "string") return category;
    const categories = ["Development", "Health", "Education", "Transfer", "Interview", "Bio"];
    return categories[category] || "News";
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 border-2 border-gray-100 border-t-[#009A44] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20 text-gray-800">

      {/* 1. Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">Editorial <span className="font-bold text-[#009A44]">Insights</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Official News & Press Feed</p>
        </div>
        <button
          onClick={() => { setEditingInsight(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#009A44] transition-all shadow-sm"
        >
          <Plus size={14} /> New Article
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <InsightForm
          insight={editingInsight}
          onSuccess={() => { setEditingInsight(null); fetchInsights(); }}
          onCancel={() => setEditingInsight(null)}
        />

        <div className="mt-12 space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-400 text-xs tracking-wider">
              No editorial content available.
            </div>
          ) : (
            insights.map(insight => (
              <div key={insight.id} className="group bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-6 hover:border-[#009A44]/20 transition-all">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <img
                    src={getImageUrl(insight.imagePaths || insight.imagePath)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    alt=""
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#009A44]/10 text-[#009A44] text-[8px] font-black uppercase tracking-widest rounded-full">
                      {displayCategory(insight.category)}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID#{insight.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 truncate pr-4 group-hover:text-[#009A44] transition-colors">{insight.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <User size={10} className="text-gray-300" />
                      {insight.author || "System Admin"}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 pr-4 lg:pr-8">
                  <button
                    onClick={() => { setEditingInsight(insight); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(insight.id)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}