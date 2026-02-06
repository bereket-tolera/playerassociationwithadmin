import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";
import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { ArrowRight, Star, Plus } from "lucide-react";

interface Player {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
  imagePaths?: string[];
}

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  imagePaths?: string[];
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
  imagePaths?: string[];
}

export default function Home() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#fafafa] dark:bg-gray-950 transition-colors duration-500">

      {/* ================= HERO SECTION: MINIMAL & AIRY ================= */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#009A44]/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-[#FEDD00]/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mb-10 animate-fade-in">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#009A44]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FEDD00]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-white tracking-tight leading-none mb-8">
            Elevating <span className="font-bold text-[#009A44]">Talent</span> <br />
            Empowering <span className="italic font-medium">Future</span>
          </h1>

          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/players"
              className="px-10 py-4 bg-[#009A44] text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-green-200 dark:shadow-none hover:translate-y-[-2px] transition-all"
            >
              {t('hero.explore_btn')}
            </Link>
            <Link
              to="/insights"
              className="px-10 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all"
            >
              {t('hero.fixtures_btn')}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION: FEATURED SQUAD ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-4">
          <div>
            <span className="text-[10px] font-black text-[#009A44] uppercase tracking-[0.3em] mb-3 block">Top Profiles</span>
            <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-tight">Meet the <span className="font-bold">National Icons</span></h2>
          </div>
          <Link to="/players" className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#009A44] transition-colors mt-6 md:mt-0">
            View All Talent <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))}
        </div>
      </section>

      {/* ================= SECTION: UPCOMING ================= */}
      <section className="py-24 bg-white dark:bg-gray-900 border-y border-gray-50 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-3 block">Fixture List</span>
          <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-tight">Active <span className="font-bold">Engagements</span></h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="text-[10px] font-bold text-[#009A44] uppercase tracking-widest border border-[#009A44]/20 px-6 py-2.5 rounded-full hover:bg-[#009A44] hover:text-white transition-all">
            Access Calendar
          </Link>
        </div>
      </section>

      {/* ================= SECTION: PRESS FEED ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-4">
          <div>
            <span className="text-[10px] font-black text-[#FF0000] uppercase tracking-[0.3em] mb-3 block">Media Room</span>
            <h2 className="text-3xl font-light text-gray-900 dark:text-white tracking-tight">Latest <span className="font-bold pr-2">Communications</span> <FileTextIcon /></h2>
          </div>
          <Link to="/insights" className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#FF0000] transition-colors mt-6 md:mt-0">
            Full Press Feed <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <InsightCard key={insight.id} {...insight} />
          ))}
        </div>
      </section>

      {/* ================= CTAs ================= */}
      <section className="py-32 bg-[#fafafa] dark:bg-gray-950 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <Star size={32} className="mx-auto mb-8 text-[#FEDD00]" />
          <h2 className="text-4xl font-light text-gray-900 dark:text-white tracking-tight mb-8">Part of something <br /><span className="font-bold">Bigger</span></h2>
          <div className="h-0.5 w-12 bg-[#009A44] mx-auto mb-8 rounded-full"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
            Join our mission to transform Ethiopian football through excellence, transparency, and association support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/players" className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-[#009A44] dark:hover:bg-[#009A44] dark:hover:text-white transition-all">
              Register Interest
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

const FileTextIcon = () => (
  <div className="inline-flex p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-[#FF0000] ml-2">
    <Star size={14} fill="currentColor" />
  </div>
);
