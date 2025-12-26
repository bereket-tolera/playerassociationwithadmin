import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import Loader from "../../components/common/Loader";
import EventForm from "./EventForm";

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

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

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Events Management</h2>

      <EventForm
        event={editingEvent}
        onSuccess={() => {
          setEditingEvent(null);
          fetchEvents();
        }}
      />

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="p-2">{event.title}</td>
              <td>{new Date(event.eventDate).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td className="space-x-2 p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingEvent(event)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
