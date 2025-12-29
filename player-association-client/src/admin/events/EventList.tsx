import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import EventForm from "./EventForm";

// Renamed to avoid conflict with global DOM 'Event' type
interface FederationEvent {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

// --- Icons ---
const MapPinIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

export default function EventList() {
  const [events, setEvents] = useState<FederationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<FederationEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await EventService.getAll();
      // Sort: Upcoming events first, then by date
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
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
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

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://via.placeholder.com/400x250?text=EFF+Event";
    if (imagePath.startsWith("http")) return imagePath;
    // Ensure this matches your backend port
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009A44]"></div>
      <p className="mt-4 text-gray-500 font-medium">Loading Federation Events...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* 1. Header Section */}
      <div className="bg-white shadow-sm mb-8">
        <div className="h-1 flex">
          <div className="flex-1 bg-[#009A44]"></div>
          <div className="flex-1 bg-[#FEDD00]"></div>
          <div className="flex-1 bg-[#FF0000]"></div>
        </div>
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Events Management
          </h2>
          <p className="text-[#009A44] font-bold text-sm tracking-widest uppercase mt-1">
            Ethiopian Football Federation (ዝግጅቶች አስተዳደር)
          </p>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto">
        
        {/* 2. The Form (integrated nicely) */}
        <div className="mb-10">
          <EventForm
            event={editingEvent}
            onSuccess={() => {
              setEditingEvent(null);
              fetchEvents();
            }}
          />
        </div>

        {/* 3. Divider */}
        <div className="flex items-center mb-8">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Scheduled Fixtures & Events</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* 4. Event Grid (Replaces Table) */}
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
             <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
               <CalendarIcon />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No events found</h3>
             <p className="mt-1 text-gray-500">Get started by creating a new event above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const isPast = isPastEvent(event.eventDate);
              const dateObj = new Date(event.eventDate);
              
              return (
                <div 
                  key={event.id} 
                  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group ${isPast ? 'opacity-80' : ''}`}
                >
                  {/* Card Image Header */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      src={getImageUrl(event.imagePath)}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250?text=EFF+Event"; }}
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${isPast ? 'bg-gray-800 text-white' : 'bg-[#FEDD00] text-black'}`}>
                      {isPast ? "Concluded" : "Upcoming"}
                    </div>

                    {/* Date Block */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg px-3 py-1 shadow-lg text-center min-w-[60px]">
                      <span className="block text-xs font-bold text-red-600 uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                      <span className="block text-xl font-black text-gray-900 leading-none">{dateObj.getDate()}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow">
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isPast ? 'text-gray-600' : 'text-gray-900'}`}>
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPinIcon />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">ID: #{event.id}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}