import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import Loader from "../../components/common/Loader";
import InsightForm from "./InsightForm";

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
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
      console.error(error);
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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <Loader />;

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

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight.id} className="border-b">
              <td className="p-2">{insight.title}</td>
              <td>{insight.category}</td>
              <td>{insight.author}</td>
              <td className="space-x-2 p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingInsight(insight)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(insight.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
