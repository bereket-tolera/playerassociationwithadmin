import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { EventService } from "../../api/eventService";
import { X, Upload } from "lucide-react";

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
}

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [form, setForm] = useState({ title: "", description: "", eventDate: "", location: "" });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      setImageFiles([]);
      let imgPreview = "";
      if (event.imagePaths?.length > 0) imgPreview = event.imagePaths.join(',');
      else if (typeof event.imagePath === 'string') imgPreview = event.imagePath;
      setPreviewUrl(imgPreview || null);
    } else {
      setForm({ title: "", description: "", eventDate: "", location: "" });
      setImageFiles([]);
      setPreviewUrl(null);
    }
  }, [event]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      setPreviewUrl(files.map(f => URL.createObjectURL(f)).join(','));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Event title is required."); return; }
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("Title", form.title.trim());
      fd.append("Description", form.description.trim());
      fd.append("EventDate", form.eventDate);
      fd.append("Location", form.location.trim());
      imageFiles.forEach(f => fd.append("ImageFiles", f));
      if (event?.id) {
        await EventService.update(event.id, fd);
      } else {
        await EventService.create(fd);
      }
      setForm({ title: "", description: "", eventDate: "", location: "" });
      setImageFiles([]);
      setPreviewUrl(null);
      onSuccess();
    } catch (err: any) {
      setError("Failed to save event. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-7 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-[#009A44]"></div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
              {event ? "Edit Event" : "New Event Registration"}
            </h3>
            <p className="text-[9px] text-[#009A44] font-bold uppercase tracking-widest mt-0.5">
              {event ? "መዝገብ አርትዕ" : "አዲስ ክስተት ምዝገባ"}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#009A44]"></div>
          <div className="w-2 h-2 rounded-full bg-[#FEDD00]"></div>
          <div className="w-2 h-2 rounded-full bg-[#E30613]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-2">
            <X size={14} className="text-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Left */}
          <div className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                Event Title <span className="text-[#E30613]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm font-semibold text-gray-900 transition-all"
                placeholder="e.g. Friendly Match: ETH vs KEN"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Stadium / Venue"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Event Images</label>
              {previewUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 mb-3">
                  <img src={previewUrl.split(',')[0]} alt="Preview" className="w-full h-full object-cover" />
                  {previewUrl.includes(',') && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-lg font-bold">
                      +{previewUrl.split(',').length - 1} more
                    </div>
                  )}
                </div>
              )}
              <label className="flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#009A44] hover:bg-[#009A44]/5 transition-all cursor-pointer">
                <Upload size={18} className="text-gray-300" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browse or drag files</span>
                <span className="text-[9px] text-gray-300">PNG, JPG up to 5MB</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col">
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
              Description / Notes
              <span className="text-gray-300 font-normal ml-2 normal-case tracking-normal">(ዝርዝር መግለጫ)</span>
            </label>
            <textarea
              name="description"
              rows={10}
              value={form.description}
              onChange={handleChange}
              className="flex-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm resize-none transition-all"
              placeholder="Enter detailed information about the event..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 pt-5 border-t border-gray-50 flex justify-end gap-3">
          {event && (
            <button
              type="button"
              onClick={() => { setForm({ title: "", description: "", eventDate: "", location: "" }); setImageFiles([]); onSuccess(); }}
              className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 hover:bg-gray-50 uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#009A44] hover:bg-[#007A30] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading && <Spinner />}
            {loading ? "Processing..." : (event ? "Update Event" : "Create Event")}
          </button>
        </div>
      </form>
    </div>
  );
}
