import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import EventForm from "./EventForm";
import { Calendar, MapPin, Edit3, Trash2, Plus, Clock, ChevronRight } from "lucide-react";

// Types
interface FederationEvent {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  imagePaths?: string[];
  eventDate: string;
  location: string;
}

export default function EventList() {
  const [events, setEvents] = useState<FederationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<FederationEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await EventService.getAll();
      const sortedEvents = res.data.sort((a: FederationEvent, b: FederationEvent) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete event?")) return;
    try {
      await EventService.delete(id);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getImageUrl = (imagePaths?: string | string[]) => {
    if (!imagePaths) return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
    const imagePath = Array.isArray(imagePaths) ? (imagePaths.length > 0 ? imagePaths[0] : null) : imagePaths;
    if (!imagePath) return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 border-2 border-gray-100 border-t-[#009A44] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20 text-gray-800">

      {/* 1. Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">System <span className="font-bold text-[#009A44]">Calendar</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Fixtures & Event Management</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#009A44] transition-all shadow-sm"
        >
          <Plus size={14} /> New Schedule
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <EventForm
          event={editingEvent}
          onSuccess={() => { setEditingEvent(null); fetchEvents(); }}
        />

        <div className="mt-12 space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-400 text-xs tracking-wider">
              Zero scheduled occurrences found.
            </div>
          ) : (
            events.map(event => {
              const dateObj = new Date(event.eventDate);
              const isPast = dateObj < new Date();

              return (
                <div key={event.id} className={`group bg-white rounded-2xl border border-gray-100 p-2 flex items-center gap-6 hover:border-[#009A44]/20 transition-all ${isPast ? 'opacity-50' : ''}`}>
                  {/* Simple Date Block */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100 flex-shrink-0">
                    <span className="text-[10px] font-black uppercase text-[#E30613]">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-gray-900 leading-none my-0.5">{dateObj.getDate()}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{dateObj.getFullYear()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#009A44] transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        <MapPin size={10} className="text-[#009A44]" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        <Clock size={10} className="text-yellow-500" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 pr-4 lg:pr-8">
                    <button
                      onClick={() => { setEditingEvent(event); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}