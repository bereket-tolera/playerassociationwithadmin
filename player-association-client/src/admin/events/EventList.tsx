import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import EventForm from "./EventForm";
import { Calendar, MapPin, Edit3, Trash2, Plus, Clock } from "lucide-react";

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
      setEvents(res.data.sort((a: FederationEvent, b: FederationEvent) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await EventService.delete(id);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 border-2 border-gray-200 border-t-[#009A44] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">Fixtures & Event Management</p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            System <span className="font-black text-[#009A44]">Calendar</span>
          </h1>
        </div>
        <button
          onClick={() => { setEditingEvent(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 bg-[#009A44] hover:bg-[#007A30] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
        >
          <Plus size={14} /> New Event
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <EventForm
          event={editingEvent}
          onSuccess={() => { setEditingEvent(null); fetchEvents(); }}
        />

        <div className="space-y-3 mt-8">
          {events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-400 text-xs tracking-wider">
              No events scheduled.
            </div>
          ) : (
            events.map(event => {
              const dateObj = new Date(event.eventDate);
              const isPast = dateObj < new Date();

              return (
                <div
                  key={event.id}
                  className={`group bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-5 hover:border-[#009A44]/25 hover:shadow-md transition-all duration-300 ${isPast ? 'opacity-50' : ''}`}
                >
                  {/* Date block */}
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100 flex-shrink-0">
                    <span className="text-[9px] font-black uppercase text-[#E30613]">
                      {dateObj.toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black text-gray-900 leading-none">{dateObj.getDate()}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">{dateObj.getFullYear()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-gray-900 truncate group-hover:text-[#009A44] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <MapPin size={10} className="text-[#009A44]" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <Clock size={10} className="text-amber-500" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pr-2">
                    <button
                      onClick={() => { setEditingEvent(event); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={13} />
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
