import { useEffect, useState } from "react";
import { InsightService } from "../api/insightService";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.id} {...insight} />
      ))}
    </div>
  );
}
