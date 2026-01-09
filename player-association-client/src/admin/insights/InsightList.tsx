import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import InsightForm from "./InsightForm";

// --- Interfaces ---
interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: any;
  imagePath: string;
  createdAt?: string;
}

// --- Icons ---
const UserIcon = () => (
  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const ArchiveIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
);

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
      console.error("Failed to fetch insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("CONFIRM DELETION: Remove this article?")) return;
    try {
      await InsightService.delete(id);
      fetchInsights();
    } catch (error) {
      console.error("Failed to delete insight:", error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getImageUrl = (imagePath?: string) => {
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
    <div className="flex flex-col items-center justify-center h-96">
       <div className="h-1 w-24 bg-gray-200 overflow-hidden rounded-full">
          <div className="h-full bg-[#009A44] w-1/3 animate-[slide_1.5s_infinite]"></div>
       </div>
       <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Press Feed...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12 font-sans">
      
      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-8 py-5 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Press Room
            </h2>
            <p className="text-[#009A44] font-bold text-[10px] tracking-[0.2em] uppercase mt-1">
              Official Communications • ዜና
            </p>
          </div>
          <div className="text-right">
             <span className="text-4xl font-black text-gray-200">{insights.length.toString().padStart(2, '0')}</span>
             <span className="block text-[10px] text-gray-400 uppercase font-bold">Articles</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* 2. Form Injection */}
        <div className="mb-10">
          <InsightForm
            insight={editingInsight}
            onSuccess={() => {
              setEditingInsight(null);
              fetchInsights();
            }}
            onCancel={() => setEditingInsight(null)} 
          />
        </div>

        {/* 3. The "Press Wire" List (Horizontal Cards) */}
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
             <ArchiveIcon />
             <h3 className="mt-4 text-sm font-bold text-gray-900 uppercase">No Articles Published</h3>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {insights.map((insight) => {
              const categoryName = displayCategory(insight.category);
              
              return (
                <div 
                  key={insight.id} 
                  className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row overflow-hidden h-auto sm:h-48"
                >
                  {/* Left: Compact Image (Thumbnail) */}
                  <div className="w-full sm:w-48 h-32 sm:h-full relative flex-shrink-0 bg-gray-900">
                    <img
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      src={getImageUrl(insight.imagePath)}
                      alt={insight.title}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80"; }}
                    />
                    {/* Category Overlay on Image */}
                    <div className="absolute top-0 left-0 bg-[#E30613] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      {categoryName}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Meta Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                          <UserIcon />
                          <span className="text-[#009A44] mr-2">{insight.author || "Admin"}</span>
                          <span>• ID: {insight.id}</span>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#009A44] transition-colors">
                        {insight.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {insight.description}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                      <button
                        onClick={() => { setEditingInsight(insight); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit Article"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(insight.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Article"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative Side Border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#009A44] sm:hidden"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}