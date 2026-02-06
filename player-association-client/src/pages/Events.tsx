import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventService } from "../api/eventService";
import EventCard from "../components/events/EventCard";
import Loader from "../components/common/Loader";
import { Calendar } from "lucide-react";

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 font-sans transition-colors duration-500">

      {/* 1. Header Area: Minimalist */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-gray-100 dark:border-gray-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-4 block">System Calendar</span>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tight leading-none">
              Fixture <span className="font-bold pr-2">Timeline</span> <CalendarIcon />
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {events.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Zero scheduled occurrences found.</p>
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

const CalendarIcon = () => (
  <div className="inline-flex p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 ml-2 shadow-sm">
    <Calendar size={18} />
  </div>
);
