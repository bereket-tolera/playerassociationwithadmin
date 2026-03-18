import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import InsightForm from "./InsightForm";
import { User, Edit3, Trash2, Plus } from "lucide-react";

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

const getImageUrl = (imagePaths?: string | string[]) => {
  if (!imagePaths) return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80";
  const p = Array.isArray(imagePaths) ? imagePaths[0] : imagePaths;
  if (!p) return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80";
  if (p.startsWith("http")) return p;
  return `http://localhost:5121${p.startsWith('/') ? '' : '/'}${p}`;
};

const displayCategory = (category: any): string => {
  if (!category) return "General";
  if (typeof category === "string") return category;
  const cats = ["Development", "Health", "Education", "Transfer", "Interview", "Bio"];
  return cats[category] || "News";
};

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
    if (!window.confirm("Delete this insight?")) return;
    try {
      await InsightService.delete(id);
      fetchInsights();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 border-2 border-gray-200 border-t-[#009A44] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">Official News & Press Feed</p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Editorial <span className="font-black text-[#009A44]">Insights</span>
          </h1>
        </div>
        <button
          onClick={() => { setEditingInsight(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 bg-[#009A44] hover:bg-[#007A30] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
        >
          <Plus size={14} /> New Article
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <InsightForm
          insight={editingInsight}
          onSuccess={() => { setEditingInsight(null); fetchInsights(); }}
          onCancel={() => setEditingInsight(null)}
        />

        <div className="space-y-3 mt-8">
          {insights.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-400 text-xs tracking-wider">
              No editorial content available.
            </div>
          ) : (
            insights.map(insight => (
              <div
                key={insight.id}
                className="group bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-5 hover:border-[#009A44]/25 hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <img
                    src={getImageUrl(insight.imagePaths || insight.imagePath)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    alt=""
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#009A44]/10 text-[#009A44] text-[8px] font-black uppercase tracking-widest rounded-lg border border-[#009A44]/10">
                      {displayCategory(insight.category)}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">#{insight.id}</span>
                  </div>
                  <h3 className="text-sm font-black text-gray-900 truncate pr-4 group-hover:text-[#009A44] transition-colors">
                    {insight.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <User size={10} className="text-gray-300" />
                    {insight.author || "System Admin"}
                  </div>
                </div>

                <div className="flex items-center gap-2 pr-2">
                  <button
                    onClick={() => { setEditingInsight(insight); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(insight.id)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={13} />
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
