import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";
import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { ArrowRight, Star, Users, MapPin, Trophy } from "lucide-react";

// --- Types ---
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
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#f8f9fa] dark:bg-gray-900 transition-colors duration-500">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050816] text-white pt-20">

        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009A44] opacity-20 blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF0000] opacity-20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[#FEDD00] opacity-10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-[#009A44]">
              <Star size={12} className="fill-current" /> Official Association
            </div>

            <h1 className="text-5xl lg:text-8xl font-black leading-[0.9]">
              ELITE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009A44] via-[#FEDD00] to-[#FF0000]">
                ETHIOPIAN
              </span> <br />
              TALENT
            </h1>

            <p className="text-lg text-gray-300 max-w-xl leading-relaxed font-light border-l-4 border-[#FEDD00] pl-6">
              The independent voice for professional footballers in Ethiopia. We protect rights, clear pathways, and build the future of the game.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/players"
                className="group relative px-8 py-4 bg-[#009A44] text-white font-bold text-sm tracking-widest uppercase overflow-hidden rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,154,68,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">Explore Squad <ArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#007A30] to-[#009A44] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                to="/events"
                className="px-8 py-4 glass-panel text-white font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-white/20 transition-all"
              >
                Fixtures
              </Link>
            </div>
          </div>

          {/* Floating Stats / Visuals */}
          <div className="relative h-[600px] hidden lg:block perspective-1000">
            {/* Floating Card 1 */}
            <div className="absolute top-10 right-10 w-64 glass-card p-6 rotate-[-6deg] animate-float z-20">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg text-red-400"><Users size={24} /></div>
                <span className="text-4xl font-black text-white">300+</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Pro Members</p>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute top-40 left-10 w-64 glass-card p-6 rotate-[3deg] animate-float z-10" style={{ animationDelay: '1.5s', animationDuration: '7s' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><Trophy size={24} /></div>
                <span className="text-4xl font-black text-white">16</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Partner Clubs</p>
            </div>

            {/* Floating Card 3 */}
            <div className="absolute bottom-20 right-20 w-64 glass-card p-6 rotate-[-3deg] animate-float z-30" style={{ animationDelay: '0.5s' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><MapPin size={24} /></div>
                <span className="text-4xl font-black text-white">5</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Regional Hubs</p>
            </div>

            {/* Abstract Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* ================= FEATURED PLAYERS ================= */}
      {/* ================= FEATURED PLAYERS ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#009A44] font-bold text-sm tracking-[0.3em] uppercase mb-4 animate-pulse">The Squad</span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009A44] to-[#007A30]">ELITE</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#009A44] via-[#FEDD00] to-[#FF0000] rounded-full"></div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-4 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0">
            {players.map((player) => (
              <div key={player.id} className="min-w-[85%] md:min-w-[350px] snap-center">
                <PlayerCard {...player} />
              </div>
            ))}

            {/* "View More" Card */}
            <Link to="/players" className="min-w-[200px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#009A44] hover:bg-[#009A44]/5 transition-all group/more snap-center">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover/more:text-[#009A44] group-hover/more:scale-110 transition-all shadow-sm">
                <ArrowRight size={24} />
              </div>
              <span className="mt-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm group-hover/more:text-[#009A44]">View All</span>
            </Link>
          </div>

          {/* Fade Edges */}
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#f8f9fa] dark:from-gray-900 to-transparent pointer-events-none hidden md:block"></div>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#f8f9fa] dark:from-gray-900 to-transparent pointer-events-none hidden md:block"></div>
        </div>

        {/* View All Players Button */}
        <div className="mt-12 text-center">
          <Link to="/players" className="inline-block px-10 py-3 bg-[#009A44] text-white hover:bg-[#007A30] font-bold uppercase tracking-widest text-sm rounded shadow-lg hover:shadow-green-900/20 transition-all">
            View All Players
          </Link>
        </div>
      </section>

      {/* ================= EVENTS (Dark Theme) ================= */}
      <section className="relative py-24 bg-[#111827] dark:bg-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FEDD00] opacity-5 blur-[150px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 border-l-4 border-[#FEDD00] pl-6">
            <h2 className="text-4xl md:text-5xl font-black mb-2 uppercase">Matchday <span className="text-[#FEDD00]">Live</span></h2>
            <p className="text-gray-400 font-light text-lg">Official federation schedules and community events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/events" className="inline-block px-10 py-3 border border-[#FEDD00] text-[#FEDD00] hover:bg-[#FEDD00] hover:text-black font-bold uppercase tracking-widest text-sm rounded transition-all">
              Full Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INSIGHTS ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
          <div className="text-center md:text-left">
            <span className="block text-[#FF0000] font-bold text-sm tracking-[0.3em] uppercase mb-2">Newsroom</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">LATEST <span className="stroke-text">INSIGHTS</span></h2>
          </div>

          <Link to="/insights" className="mt-6 md:mt-0 text-gray-500 hover:text-[#FF0000] font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2">
            Read All Articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
      </section>

      {/* ================= MISSION / CTA ================= */}
      <section className="relative py-32 bg-[#009A44] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white opacity-10 blur-[100px] rounded-full"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 text-white">
          <Star size={48} className="mx-auto mb-8 text-[#FEDD00] animate-spin-slow" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">JOIN THE <br />MOVEMENT</h2>
          <p className="text-xl text-white/90 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            We are building a legacy for Ethiopian football. Whether you are a player, fan, or partner—your voice matters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/players"
              className="px-10 py-4 bg-white text-[#009A44] font-black uppercase tracking-widest rounded shadow-2xl hover:scale-105 transition-transform"
            >
              Explore Players
            </Link>
            {!isAdmin && (
              <Link
                to="/login"
                className="px-10 py-4 bg-[#007A30] text-white font-black uppercase tracking-widest rounded border border-white/20 hover:bg-[#006025] transition-colors"
              >
                Admin Access
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}