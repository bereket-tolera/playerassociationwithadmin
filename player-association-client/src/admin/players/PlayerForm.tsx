import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// Keep your existing service import
import { PlayerService } from "../../api/playerService";

// --- Types & Interfaces ---
interface Player {
  id?: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
}

interface PlayerFormProps {
  player?: Player | null;
  onSuccess: () => void;
}

// --- Icons & UI Components (Internal) ---

const WaliaIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Main Component ---

export default function PlayerForm({ player, onSuccess }: PlayerFormProps) {
  // 1. Initial State Definition
  const initialFormState: Player = {
    fullName: "",
    age: 18,
    club: "",
    position: "",
    nationality: "Ethiopian",
    description: "",
    imagePath: "",
  };

  const [form, setForm] = useState<Player>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({ type: null, message: null });

  // 2. Effects
  useEffect(() => {
    if (player) {
      setForm({ ...player });
      setImageFile(null);
      // Use single image path
      const imgPreview = typeof player.imagePath === 'string' ? player.imagePath : '';
      setPreviewUrl(imgPreview || null);
    } else {
      setForm(initialFormState);
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [player]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 3. Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "age" ? Number(value) : value }));
    if (status.type === 'error') setStatus({ type: null, message: null });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview for single file
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (status.type === 'error') setStatus({ type: null, message: null });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: null });

    // Validation
    if (!form.fullName.trim()) {
      setStatus({ type: 'error', message: "Full name is required (ሙሉ ስም ያስፈልጋል)" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      // Using standard casing for backend compatibility
      formData.append("FullName", form.fullName.trim());
      formData.append("Age", form.age.toString());
      formData.append("Club", form.club.trim());
      formData.append("Position", form.position.trim());
      formData.append("Nationality", form.nationality.trim());
      formData.append("Description", form.description.trim());

      if (imageFile) {
        formData.append("ImageFiles", imageFile);
      }

      if (player && player.id) {
        await PlayerService.update(player.id, formData);
      } else {
        await PlayerService.create(formData);
      }

      setStatus({ type: 'success', message: "Player saved successfully!" });

      // Slight delay to show success state before closing/resetting
      setTimeout(() => {
        setForm(initialFormState);
        setImageFile(null);
        setPreviewUrl(null);
        onSuccess();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to save player";
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="max-w-4xl mx-auto font-sans">

      {/* 1. Header Section - Ethiopian Flag Theme */}
      <div className="relative overflow-hidden rounded-t-xl bg-white shadow-xl">
        <div className="h-3 bg-[#009A44]"></div> {/* Green */}
        <div className="h-3 bg-[#FEDD00]"></div> {/* Yellow */}
        <div className="h-3 bg-[#FF0000]"></div> {/* Red */}

        <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {player ? "Edit Player Profile" : "Register New Talent"}
            </h2>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">
              Ethiopian Football Federation (የኢትዮጵያ እግር ኳስ ፌዴሬሽን)
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center h-16 w-16 bg-[#009A44] text-white rounded-full shadow-lg transform rotate-12">
            <WaliaIcon className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* 2. Form Section */}
      <form onSubmit={handleSubmit} className="bg-white border-x border-b rounded-b-xl shadow-lg p-8">

        {/* Status Messages */}
        {status.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${status.type === 'error'
            ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
            : 'bg-green-50 text-green-800 border-l-4 border-[#009A44]'
            }`}>
            <span className="text-lg mr-2">{status.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-semibold">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Left Column: Image Upload (Takes up 4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col items-center space-y-4">
            <div className="w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo (ፎቶ)</label>

              {/* Preview */}
              <div className="mb-3">
                {previewUrl ? (
                  <div className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
                    <UploadIcon className="h-10 w-10" />
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#009A44] file:text-white
                    hover:file:bg-[#007A30] cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">Max 5MB. Single profile image only.</p>
            </div>
          </div>

          {/* Right Column: Inputs (Takes up 8 cols on desktop) */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name (ሙሉ ስም) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Abebe Bikila"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#009A44] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Age (ዕድሜ) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="age"
                min="16"
                max="50"
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FEDD00] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nationality (ዜግነት)</label>
              <input
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF0000] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Current Club (ክለብ)</label>
              <input
                type="text"
                name="club"
                value={form.club}
                onChange={handleChange}
                placeholder="e.g. Saint George S.C."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#009A44] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Position (ቦታ)</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g. Forward"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#009A44] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Player Description (መግለጫ)</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe playing style, achievements..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#009A44] focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          {player && (
            <button
              type="button"
              onClick={() => onSuccess()}
              className="px-6 py-2.5 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
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
            {loading ? <LoadingSpinner /> : null}
            {loading ? "Processing..." : (player ? "Update Profile" : "Register Player")}
          </button>
        </div>
      </form>
    </div>
  );
}