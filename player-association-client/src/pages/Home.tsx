import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";
import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";

// --- Icons for UI Styling ---
const WaliaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#009A44]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

interface Player {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersRes, eventsRes, insightsRes] = await Promise.all([
        PlayerService.getAll(),
        EventService.getAll(),
        InsightService.getAll(),
      ]);

      setPlayers(playersRes.data.slice(0, 4));
      setEvents(eventsRes.data.slice(0, 3));
      setInsights(insightsRes.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Check if user is logged in (only for login button visibility)
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAdmin(false);
    window.location.href = '/';
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      
      {/* --- 1. Federation Navbar --- */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Flag Stripe */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#009A44]"></div>
          <div className="flex-1 bg-[#FEDD00]"></div>
          <div className="flex-1 bg-[#FF0000]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-full p-1 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
               <WaliaIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-none tracking-tight">EFF</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ethiopian Football Fed.</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-6 text-sm font-bold uppercase tracking-wide">
              <Link to="/" className="text-[#009A44]">Home</Link>
              <Link to="/players" className="text-gray-600 hover:text-[#009A44] transition-colors">Squad</Link>
              <Link to="/events" className="text-gray-600 hover:text-[#009A44] transition-colors">Fixtures</Link>
              <Link to="/insights" className="text-gray-600 hover:text-[#009A44] transition-colors">News</Link>
            </div>
            
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link to="/admin" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-0.5">
                  Admin Panel
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold uppercase hover:bg-red-200 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#009A44] transition-all shadow-lg">
                <LockIcon /> Admin Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* --- 2. Hero Section --- */}
      <section className="relative bg-[#111827] text-white overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-2/3 opacity-20 transform skew-x-12 translate-x-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="md:w-3/5">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-[#009A44] rounded-full">
              Official Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              The Heart of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEDD00] to-yellow-600">
                Ethiopian Football
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              Experience the passion of the Walias. Discover talented players, upcoming fixtures, 
              and exclusive expert insights from the federation.
            </p>
            <p className="font-amharic text-gray-400 mb-8">የኢትዮጵያ እግር ኳስ ፌዴሬሽን</p>
            
            <div className="flex gap-4">
              <Link to="/players" className="px-8 py-4 bg-[#009A44] hover:bg-[#007A30] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-900/50 flex items-center">
                View Squad <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Flag Stripe */}
        <div className="absolute bottom-0 w-full h-1.5 flex">
          <div className="flex-1 bg-[#009A44]"></div>
          <div className="flex-1 bg-[#FEDD00]"></div>
          <div className="flex-1 bg-[#FF0000]"></div>
        </div>
      </section>

      {/* --- 3. Featured Players --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Featured <span className="text-[#009A44]">Squad</span>
            </h2>
            <p className="text-gray-500 font-medium">Top talents representing the nation</p>
          </div>
          <Link to="/players" className="hidden md:flex items-center text-[#009A44] font-bold hover:underline">
            View All Players <ArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {players.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
            <Link to="/players" className="inline-flex items-center text-[#009A44] font-bold">
              View All Players <ArrowRight />
            </Link>
        </div>
      </section>

      {/* --- 4. Upcoming Events (Dark Theme) --- */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Matchday <span className="text-[#FEDD00]">&</span> Events
              </h2>
              <p className="text-gray-400 font-medium">Official federation schedules</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center text-[#FEDD00] font-bold hover:underline">
              Full Calendar <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. Latest Insights --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Federation <span className="text-red-600">News</span>
            </h2>
            <p className="text-gray-500 font-medium">Latest updates and expert analysis</p>
          </div>
          <Link to="/insights" className="hidden md:flex items-center text-red-600 font-bold hover:underline">
            Read Newsroom <ArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
      </section>

      {/* --- 6. CTA & Fan Zone --- */}
      <section className="py-16 bg-gradient-to-br from-[#009A44] to-[#007A30] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Join the Walia Community</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest player news, events, and expert analysis.
            Never miss an important update from the world of sports.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/players" className="px-8 py-3 bg-white text-[#009A44] font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
              Explore Players
            </Link>
            {!isAdmin && (
              <Link to="/login" className="px-8 py-3 bg-[#006025] text-white font-bold rounded-lg border border-white/20 hover:bg-[#004d1e] transition-colors">
                Admin Access
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* --- 7. Footer --- */}
      <footer className="bg-[#111827] text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
             <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
               <WaliaIcon />
               <span className="text-white font-black text-xl">EFF</span>
             </div>
             <p className="text-xs">© {new Date().getFullYear()} Player Association. All rights reserved.</p>
          </div>
          <div className="text-sm font-medium flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}