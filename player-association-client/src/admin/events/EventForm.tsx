import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { EventService } from "../../api/eventService";

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
        location: event.location || "",
      });
      setImageFile(null);
    }
  }, [event]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!form.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", form.title.trim());
      formData.append("Description", form.description.trim());
      formData.append("EventDate", form.eventDate);
      formData.append("Location", form.location.trim());

      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      // Debug: Log FormData entries
      console.log("FormData entries:");
      const entries = formData.entries();
      let entry = entries.next();
      while (!entry.done) {
        const [key, value] = entry.value;
        console.log(`${key}:`, value);
        entry = entries.next();
      }

      if (event && event.id) {
        await EventService.update(event.id, formData);
      } else {
        await EventService.create(formData);
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        eventDate: "",
        location: "",
      });
      setImageFile(null);
      onSuccess();
      
    } catch (err: any) {
      console.error("Failed to save event:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to save event";
      setError(errorMessage);
      
      alert(`Error: ${errorMessage}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-white shadow-sm">
      <h3 className="font-bold mb-4 text-lg">{event ? "Edit Event" : "Add New Event"}</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={form.location}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {imageFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Event Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
        >
          {loading ? "Saving..." : event ? "Update Event" : "Add Event"}
        </button>
        
        {event && (
          <button
            type="button"
            onClick={() => {
              setForm({
                title: "",
                description: "",
                eventDate: "",
                location: "",
              });
              setImageFile(null);
              onSuccess();
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}