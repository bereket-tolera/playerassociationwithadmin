import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventService } from "../api/eventService";
import EventCard from "../components/events/EventCard";
import Loader from "../components/common/Loader";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  imagePaths?: string[];
  eventDate: string;
  location: string;
}

export default function Events() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await EventService.getAll();
        setEvents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500">

      {/* 1. Hero Section */}
      <div className="relative pt-20 pb-24 bg-[#111827] text-white overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FEDD00] opacity-5 blur-[150px] rounded-full animate-float"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#b45309] opacity-5 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEDD00]/10 backdrop-blur border border-[#FEDD00]/20 rounded-full text-[#FEDD00] font-bold text-xs uppercase tracking-[0.2em] mb-6">
            <Calendar size={14} /> {t('events_page.badge')}
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 leading-tight text-white">
            {t('matchday.title')} <span className="text-[#FEDD00]">{t('matchday.live')}</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('events_page.description')}
          </p>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-24">

        {/* Featured Block */}
        <div className="bg-[#FEDD00] text-black rounded-xl shadow-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-black text-2xl uppercase mb-1">{t('matchday.subtitle')}</h3>
            <p className="font-medium opacity-80">{t('events_page.description')}</p>
          </div>
          <div className="relative z-10 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded flex items-center gap-2">
            <Calendar size={18} /> {t('matchday.calendar')}
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('events_page.no_events')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('events_page.empty_list')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
