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
}

// --- Icons ---
const UserIcon = () => (
  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const NewsIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
);

export default function InsightList() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await InsightService.getAll();
      // Reverse to show newest first
      setInsights(res.data.reverse());
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
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
    if (!imagePath) return "https://via.placeholder.com/400x250?text=EFF+Insight";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `http://localhost:5121${imagePath}`;
    return imagePath;
  };

  // Safe category display function
  const displayCategory = (category: any): string => {
    if (!category) return "General";
    if (typeof category === "string") return category;
    if (typeof category === "number") {
      const categories = [
        "Development", "HealthFitness", "CareerEducation",
        "TransferMarket", "Interview", "Biography"
      ];
      return categories[category] || `Category ${category}`;
    }
    return String(category);
  };

  // Helper to give distinct colors to categories
  const getCategoryColor = (categoryName: string) => {
    const normalized = categoryName.toLowerCase();
    if (normalized.includes("health")) return "bg-red-100 text-red-800 border-red-200";
    if (normalized.includes("development")) return "bg-green-100 text-green-800 border-green-200";
    if (normalized.includes("transfer")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (normalized.includes("interview")) return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009A44]"></div>
      <p className="mt-4 text-gray-500 font-medium">Loading Editorials...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* 1. Header Section */}
      <div className="bg-white shadow-sm mb-8">
        <div className="h-1 flex">
            <div className="flex-1 bg-[#009A44]"></div>
            <div className="flex-1 bg-[#FEDD00]"></div>
            <div className="flex-1 bg-[#FF0000]"></div>
        </div>
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Federation Insights
          </h2>
          <p className="text-[#009A44] font-bold text-sm tracking-widest uppercase mt-1">
            Editorial Management (ትንታኔ እና ዜና)
          </p>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto">
        
        {/* 2. The Form Area */}
        <div className="mb-12">
          <InsightForm
            insight={editingInsight}
            onSuccess={() => {
              setEditingInsight(null);
              fetchInsights();
            }}
            // If you added onCancel to your form props in the previous step, uncomment this:
            // onCancel={() => setEditingInsight(null)} 
          />
        </div>

        {/* 3. Section Divider */}
        <div className="flex items-center mb-8">
           <div className="h-px flex-1 bg-gray-300"></div>
           <span className="px-4 text-gray-500 font-bold text-sm uppercase tracking-wider">Published Articles</span>
           <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* 4. News Grid (Replaces Table) */}
        {insights.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
             <div className="mx-auto flex justify-center mb-4">
               <NewsIcon />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No Insights Published</h3>
             <p className="mt-1 text-gray-500">Be the first to write an analysis or update.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((insight) => {
              const categoryName = displayCategory(insight.category);
              
              return (
                <div 
                  key={insight.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group h-full"
                >
                  {/* Card Image */}
                  <div className="relative h-52 bg-gray-200 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      src={getImageUrl(insight.imagePath)}
                      alt={insight.title}
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250?text=EFF+Insight"; }}
                    />
                    
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {/* Category Badge */}
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${getCategoryColor(categoryName)}`}>
                      {categoryName}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-2 flex items-center text-xs text-gray-500">
                      <UserIcon />
                      <span className="font-medium">{insight.author || "EFF Admin"}</span>
                      <span className="mx-2">•</span>
                      <span>ID: #{insight.id}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#009A44] transition-colors">
                      {insight.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                      {insight.description}
                    </p>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-auto border-t border-gray-100 flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingInsight(insight);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(insight.id)}
                        className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}