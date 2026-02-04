import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import EventForm from "./EventForm";
import ImageSlider from "../../components/ImageSlider";

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

// --- Icons ---
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CalendarIcon = () => (
  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

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
    if (!window.confirm("CONFIRM: Delete this scheduled event?")) return;
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

  const isPastEvent = (dateString: string) => new Date(dateString) < new Date();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="h-10 w-10 border-4 border-gray-200 border-t-[#009A44] rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Calendar...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans text-gray-800">

      {/* 1. Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Fixtures & Events
            </h1>
            <p className="text-[#009A44] font-bold text-[10px] tracking-[0.2em] uppercase mt-1">
              Association Calendar • መርሃ ግብር
            </p>
          </div>
          <button
            onClick={() => { setEditingEvent(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hidden md:block text-xs font-bold text-gray-500 hover:text-[#009A44] transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-[#009A44]"
          >
            Create New Event
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">

        {/* 2. Form Injection */}
        <div className="mb-12">
          <EventForm
            event={editingEvent}
            onSuccess={() => {
              setEditingEvent(null);
              fetchEvents();
            }}
          />
        </div>

        {/* 3. The "Agenda/Ticket" List Layout */}
        {events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="mx-auto flex justify-center mb-4"><CalendarIcon /></div>
            <h3 className="text-sm font-bold text-gray-900 uppercase">No Scheduled Events</h3>
            <p className="text-xs text-gray-500 mt-1">The calendar is currently empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const isPast = isPastEvent(event.eventDate);
              const dateObj = new Date(event.eventDate);

              return (
                <div
                  key={event.id}
                  className={`relative flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${isPast ? 'opacity-60 grayscale' : ''}`}
                >
                  {/* Left: Date Block (Ticket Stub Style) */}
                  <div className={`w-24 sm:w-32 flex-shrink-0 flex flex-col items-center justify-center p-2 border-r border-dashed border-gray-300 ${isPast ? 'bg-gray-100' : 'bg-[#009A44]/5'}`}>
                    <span className="text-xs font-bold text-[#E30613] uppercase tracking-wider">
                      {dateObj.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-4xl font-black text-gray-800 leading-none my-1">
                      {dateObj.getDate()}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                      {dateObj.toLocaleString('default', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      <LocationIcon />
                      <span className="truncate">{event.location}</span>
                      {isPast && <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">Concluded</span>}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Mobile Actions (Visible only on small screens) */}
                    <div className="flex sm:hidden mt-3 gap-3 border-t pt-2">
                      <button onClick={() => setEditingEvent(event)} className="text-xs text-blue-600 font-bold">Edit</button>
                      <button onClick={() => handleDelete(event.id)} className="text-xs text-red-600 font-bold">Delete</button>
                    </div>
                  </div>

                  {/* Right: Actions & Image Preview (Desktop) */}
                  <div className="hidden sm:flex w-48 border-l border-gray-100 bg-gray-50">
                    {/* Image Preview */}
                    <div className="w-16 h-full relative border-r border-gray-200">
                      {event.imagePaths && event.imagePaths.length > 1 ? (
                        <div className="relative w-full h-full">
                          <img
                            src={getImageUrl(event.imagePaths || event.imagePath)}
                            alt=""
                            className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
                          />
                          <div className="absolute bottom-1 right-1 bg-[#009A44] text-white text-[8px] font-bold px-1 py-0.5 rounded">
                            +{event.imagePaths.length - 1}
                          </div>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(event.imagePaths || event.imagePath)}
                          alt=""
                          className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
                        />
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => { setEditingEvent(event); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full py-1.5 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded hover:border-[#009A44] hover:text-[#009A44] transition-colors uppercase"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="w-full py-1.5 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded hover:border-[#E30613] hover:text-[#E30613] transition-colors uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Association Status Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPast ? 'bg-gray-300' : 'bg-[#FEDD00]'}`}></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}