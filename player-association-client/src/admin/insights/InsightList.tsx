import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import InsightForm from "./InsightForm";

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: any; // Use any to be safe
  imagePath: string;
}

export default function InsightList() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await InsightService.getAll();
      setInsights(res.data);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this insight?")) return;
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
    if (!imagePath) return "/default-insight.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `http://localhost:5121${imagePath}`;
    return imagePath;
  };

  // Safe category display function
  const displayCategory = (category: any): string => {
    if (!category) return "Unknown";
    
    // If it's a string, return it
    if (typeof category === "string") return category;
    
    // If it's a number, map it
    if (typeof category === "number") {
      const categories = [
        "Development",
        "HealthFitness", 
        "CareerEducation",
        "TransferMarket",
        "Interview",
        "Biography"
      ];
      return categories[category] || `Category ${category}`;
    }
    
    // Fallback
    return String(category);
  };

  if (loading) return <div className="p-6">Loading insights...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Insights Management</h2>

      <InsightForm
        insight={editingInsight}
        onSuccess={() => {
          setEditingInsight(null);
          fetchInsights();
        }}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {insights.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No insights found. Add your first insight!
                </td>
              </tr>
            ) : (
              insights.map((insight) => (
                <tr key={insight.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded object-cover border"
                        src={getImageUrl(insight.imagePath)}
                        alt={insight.title}
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/40?text=Insight";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {insight.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {displayCategory(insight.category)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{insight.author}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div 
                      className="text-sm text-gray-700"
                      title={insight.description}
                    >
                      {insight.description.length > 50 
                        ? `${insight.description.substring(0, 50)}...` 
                        : insight.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => setEditingInsight(insight)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => handleDelete(insight.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}