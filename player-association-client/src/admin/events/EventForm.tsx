import { useEffect, useState } from "react";
import { EventService } from "../../api/eventService";
import { UploadService } from "../../api/uploadService";

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imagePath: "",
    eventDate: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({ ...event });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imagePath = form.imagePath;
      if (imageFile) {
        const res = await UploadService.uploadImage(imageFile);
        imagePath = res.data.url;
      }

      const payload = { ...form, imagePath };

      if (event) {
        await EventService.update(event.id, payload);
      } else {
        await EventService.create(payload);
      }

      setForm({
        title: "",
        description: "",
        imagePath: "",
        eventDate: "",
        location: "",
      });
      setImageFile(null);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
      <h3 className="font-bold mb-2">{event ? "Edit Event" : "Add Event"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="eventDate"
          placeholder="Event Date"
          value={form.eventDate ? form.eventDate.split("T")[0] : ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input type="file" onChange={handleFileChange} />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : event ? "Update Event" : "Add Event"}
      </button>
    </form>
  );
}
