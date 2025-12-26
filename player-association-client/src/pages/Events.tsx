import { useEffect, useState } from "react";
import { EventService } from "../api/eventService";
import EventCard from "../components/events/EventCard";
import Loader from "../components/common/Loader";

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
}
