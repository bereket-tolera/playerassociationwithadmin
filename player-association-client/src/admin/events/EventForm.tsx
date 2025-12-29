import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { EventService } from "../../api/eventService";

// --- Icons for UI (Purely Visual) ---
const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const LocationIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const TitleIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const ImageIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  // --- LOGIC STARTS HERE (UNALTERED) ---
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
      // @ts-ignore - Iterator needs specific TS config, but keeping logic as requested
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
  // --- LOGIC ENDS HERE ---

  // --- UI STARTS HERE (EXTRAORDINARY THEME) ---
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-[#009A44] mb-8 animate-fade-in">
      {/* Decorative Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-xl text-gray-800 tracking-tight">
            {event ? "Update Fixture Details" : "Schedule New Event"}
          </h3>
          <p className="text-xs text-[#009A44] font-bold uppercase tracking-widest mt-0.5">
            Ethiopian Football Federation (የክስተት ቅጽ)
          </p>
        </div>
        {/* Subtle Flag Decoration */}
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-[#009A44]"></div>
          <div className="h-2 w-2 rounded-full bg-[#FEDD00]"></div>
          <div className="h-2 w-2 rounded-full bg-[#FF0000]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p className="text-sm font-bold text-red-800">Submission Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Event Title <span className="text-[#FF0000]">*</span>
              <span className="text-gray-400 font-normal ml-2 text-xs">(ርዕስ)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TitleIcon />
              </div>
              <input
                type="text"
                name="title"
                placeholder="e.g. Ethiopia vs Egypt Qualifier"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Date <span className="text-[#FF0000]">*</span>
              <span className="text-gray-400 font-normal ml-2 text-xs">(ቀን)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon />
              </div>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEDD00] focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Location <span className="text-[#FF0000]">*</span>
              <span className="text-gray-400 font-normal ml-2 text-xs">(ቦታ)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LocationIcon />
              </div>
              <input
                type="text"
                name="location"
                placeholder="e.g. Addis Ababa Stadium"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Event Banner Image
              <span className="text-gray-400 font-normal ml-2 text-xs">(ምስል)</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#009A44] hover:bg-green-50 rounded-lg cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center pt-7">
                  {imageFile ? (
                    <div className="flex items-center text-[#009A44]">
                      <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-semibold">{imageFile.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({(imageFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon />
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-[#009A44]">
                        Select a photo
                      </p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="opacity-0" 
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description / Details
              <span className="text-gray-400 font-normal ml-2 text-xs">(መግለጫ)</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter event details, match context, or important notes..."
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none transition-all shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
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
                onSuccess(); // This actually acts as cancel in your logic based on props
              }}
              className="px-6 py-2.5 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`
              flex items-center justify-center px-8 py-2.5 rounded-lg text-white font-bold shadow-md transition-all transform hover:-translate-y-0.5
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#009A44] to-[#007A30] hover:shadow-lg active:scale-95'
              }
            `}
          >
            {loading ? <LoadingSpinner /> : <SaveIcon />}
            {loading ? "Processing..." : (event ? "Update Event" : "Create Event")}
          </button>
        </div>
      </form>
    </div>
  );
}