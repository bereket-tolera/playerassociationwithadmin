import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { EventService } from "../../api/eventService";

// Styled Icons
const TitleIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LocationIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

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
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title.trim()) {
      setError("Event Title is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", form.title.trim());
      formData.append("Description", form.description.trim());
      formData.append("EventDate", form.eventDate);
      formData.append("Location", form.location.trim());
      if (imageFile) formData.append("ImageFile", imageFile);

      if (event && event.id) {
        await EventService.update(event.id, formData);
      } else {
        await EventService.create(formData);
      }

      setForm({ title: "", description: "", eventDate: "", location: "" });
      setImageFile(null);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Failed to save event. Please check the network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#009A44]">
      {/* Form Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {event ? "Edit Fixture Record" : "New Event Registration"}
          </h3>
          <p className="text-xs text-[#009A44] font-medium mt-0.5 uppercase tracking-wide">
            {event ? "መዝገብ አርትዕ" : "አዲስ ክስተት ምዝገባ"}
          </p>
        </div>
        {/* Decorative Flag Dots */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#009A44]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEDD00]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#E30613]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border-l-4 border-[#E30613] text-red-700 text-sm font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Event Title <span className="text-[#E30613]">*</span>
                <span className="text-gray-400 font-normal ml-2 text-xs">(ርዕስ)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TitleIcon />
                </div>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-[#009A44] focus:border-[#009A44] sm:text-sm transition-colors"
                  placeholder="e.g. Friendly Match: ETH vs KEN"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Date <span className="text-[#E30613]">*</span>
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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-[#009A44] focus:border-[#009A44] sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Location <span className="text-[#E30613]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LocationIcon />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Stadium / Venue"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-[#009A44] focus:border-[#009A44] sm:text-sm"
                  />
                </div>
              </div>
            </div>

             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Cover Image
                <span className="text-gray-400 font-normal ml-2 text-xs">(ምስል)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#009A44] hover:bg-green-50/30 transition-all cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-1 text-center">
                  {imageFile ? (
                    <div className="text-[#009A44] font-medium flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm">{imageFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto flex justify-center">
                        <UploadIcon />
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-[#009A44] hover:text-[#007A30] focus-within:outline-none">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full">
             <label className="block text-sm font-bold text-gray-700 mb-1">
                Description / Notes
                <span className="text-gray-400 font-normal ml-2 text-xs">(ዝርዝር መግለጫ)</span>
              </label>
              <textarea
                name="description"
                rows={8}
                value={form.description}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#009A44] focus:border-[#009A44] sm:text-sm resize-none flex-grow"
                placeholder="Enter detailed information about the event..."
              ></textarea>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end gap-3">
          {event && (
            <button
              type="button"
              onClick={() => {
                setForm({ title: "", description: "", eventDate: "", location: "" });
                setImageFile(null);
                onSuccess();
              }}
              className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009A44]"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`
              inline-flex items-center px-8 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009A44]
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#009A44] hover:bg-[#008037]'
              }
            `}
          >
            {loading && <Spinner />}
            <span className={loading ? "ml-2" : ""}>
              {loading ? "PROCESSING..." : (event ? "UPDATE RECORD" : "CREATE EVENT")}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
}