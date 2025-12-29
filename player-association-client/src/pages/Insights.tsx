import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ADD THIS IMPORT
import { InsightService } from "../api/insightService";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";

// --- Icons ---
const NewsHeroIcon = () => (
  <svg className="w-16 h-16 text-[#009A44] opacity-20 absolute top-6 right-6 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M22 3H2v18h20V3zM4 5h16v14H4V5zm2 2h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z"/></svg>
);
const EmptyStateIcon = () => (
  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
);

// Navigation Icons
const HomeIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PlayerIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75a3.5 3.5 0 01-7 0m7 0a3.5 3.5 0 00-7 0m7 0h-7" />
  </svg>
);

const InsightsIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const EventsIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

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
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center text-gray-700 hover:text-[#009A44] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <HomeIcon />
                Home
              </Link>
              
              <Link 
                to="/players" 
                className="flex items-center text-gray-700 hover:text-[#009A44] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <PlayerIcon />
                Players
              </Link>
              
              <Link 
                to="/events" 
                className="flex items-center text-gray-700 hover:text-[#009A44] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <EventsIcon />
                Events
              </Link>
              
              <Link 
                to="/insights" 
                className="flex items-center text-[#009A44] bg-green-50 px-3 py-2 rounded-md text-sm font-medium border-l-4 border-[#009A44]"
              >
                <InsightsIcon />
                Insights
              </Link>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                EFF Newsroom
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. Hero / Newsroom Header */}
      <div className="bg-white shadow-sm relative overflow-hidden mb-12">
        {/* Flag Stripe */}
        <div className="h-1.5 flex w-full">
           <div className="flex-1 bg-[#009A44]"></div>
           <div className="flex-1 bg-[#FEDD00]"></div>
           <div className="flex-1 bg-[#FF0000]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center md:text-left">
           <NewsHeroIcon />
           
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
             News <span className="text-[#009A44]">&</span> Insights
           </h1>
           
           <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
             <span>Official Press Centre</span>
             <span className="hidden md:inline">•</span>
             <span className="font-amharic text-[#009A44]">የፌዴሬሽን ዜና እና ትንታኔ</span>
           </div>

           <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
             Exclusive interviews, tactical analysis, youth development updates, 
             and official statements from the Ethiopian Football Federation. 
             Get the stories behind the scores.
           </p>
        </div>
        
        {/* Decorative Background Fade */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>
      </div>

      {/* 2. Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {insights.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-20 text-center">
             <EmptyStateIcon />
             <h3 className="text-xl font-bold text-gray-900">No Articles Published</h3>
             <p className="text-gray-500 mt-2">The newsroom is currently quiet. Check back soon.</p>
          </div>
        ) : (
          // Insights Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {insights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        )}
        
        {/* Footer Note */}
        <div className="mt-16 text-center">
           <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
             EFF Editorial Team
           </p>
        </div>
      </div>
    </div>
  );
}