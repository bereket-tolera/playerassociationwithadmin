import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { InsightService } from "../../api/insightService";

// --- Types ---
interface InsightData {
  id?: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath?: string;
}

interface InsightFormProps {
  insight?: InsightData | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const categories = [
  "Development",
  "HealthFitness",
  "CareerEducation",
  "TransferMarket",
  "Interview",
  "Biography",
];

// --- Icons ---
const PenIcon = () => <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const UserIcon = () => <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const UploadIcon = () => <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const Spinner = () => <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default function InsightForm({ insight, onSuccess, onCancel }: InsightFormProps) {
  const initialForm = {
    title: "",
    description: "",
    content: "",
    author: "",
    category: categories[0],
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (insight) {
      setForm({
        title: insight.title || "",
        description: insight.description || "",
        content: insight.content || "",
        author: insight.author || "",
        category: insight.category || categories[0],
      });
      setImageFiles([]);
      // Mock logic: insight.imagePath might be comma separated string from backend or single
      const imgPath = typeof insight.imagePath === 'string' ? insight.imagePath : '';
      setPreviewUrl(imgPath || null);
    } else {
      setForm(initialForm);
      setImageFiles([]);
      setPreviewUrl(null);
    }
  }, [insight]);

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        const urls = previewUrl.split(',');
        urls.forEach(url => {
          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
      }
    };
  }, [previewUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImageFiles(files);

      const objectUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrl(objectUrls.join(','));

      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title.trim()) {
      setError("Article Title is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", form.title.trim());
      formData.append("Description", form.description.trim());
      formData.append("Content", form.content.trim());
      formData.append("Author", form.author.trim());
      formData.append("Category", form.category);

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("ImageFiles", file);
        });
      }

      if (insight && insight.id) {
        await InsightService.update(insight.id, formData);
      } else {
        await InsightService.create(formData);
      }

      setForm(initialForm);
      setImageFiles([]);
      setPreviewUrl(null);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative">
      {/* Association Accent Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#009A44]"></div>

      {/* Header */}
      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {insight ? "Edit Editorial" : "Compose Insight"}
          </h3>
          <p className="text-xs text-[#009A44] font-bold uppercase mt-1">
            Official Federation Press Release (መግለጫ ቅጽ)
          </p>
        </div>
        {/* Flag Circles */}
        <div className="flex gap-1 mt-1">
          <div className="w-2 h-2 rounded-full bg-[#009A44]"></div>
          <div className="w-2 h-2 rounded-full bg-[#FEDD00]"></div>
          <div className="w-2 h-2 rounded-full bg-[#E30613]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-[#E30613] p-4 rounded-r text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Inputs */}
          <div className="lg:col-span-8 space-y-6">

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Headline <span className="text-[#E30613]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PenIcon />
                </div>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter article title..."
                  className="w-full pl-10 py-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-[#009A44] focus:border-[#009A44] focus:bg-white transition-colors text-sm font-semibold text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Author (ደራሲ)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full pl-10 py-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-[#009A44] focus:border-[#009A44] focus:bg-white transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Category (ምድብ)
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-[#009A44] focus:border-[#009A44] focus:bg-white transition-colors text-sm cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Summary / Abstract
              </label>
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-[#009A44] focus:border-[#009A44] focus:bg-white transition-colors text-sm resize-none"
                placeholder="Brief text for the card view..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Full Content Body <span className="text-[#E30613]">*</span>
              </label>
              <textarea
                name="content"
                rows={10}
                value={form.content}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-[#009A44] focus:border-[#009A44] focus:bg-white transition-colors text-sm font-mono leading-relaxed"
                placeholder="Write article content here..."
              />
            </div>

          </div>

          {/* Sidebar / Image */}
          <div className="lg:col-span-4 flex flex-col">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Featured Images
            </label>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {previewUrl ? (
                // Show primary/first image larger
                <div className="col-span-2 relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img src={previewUrl.split(',')[0]} alt="Main Preview" className="w-full h-full object-cover" />
                  {previewUrl.includes(',') && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{previewUrl.split(',').length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="col-span-2 aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <UploadIcon />
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-xs file:font-semibold
                    file:bg-[#009A44] file:text-white
                    hover:file:bg-[#007A30] cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Max 5MB per file. First image is featured.</p>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className={`
                   w-full flex items-center justify-center px-4 py-3 rounded text-sm font-bold text-white shadow-sm uppercase tracking-wide transition-all
                   ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#009A44] hover:bg-[#008037] hover:shadow-lg active:transform active:scale-95'
                  }
                 `}
              >
                {loading ? <Spinner /> : null}
                {loading ? "Publishing..." : (insight ? "Save Changes" : "Publish Article")}
              </button>

              {(insight || onCancel) && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setImageFiles([]);
                    setPreviewUrl(null);
                    onSuccess(); // Treats cancel as success to clear state
                    if (onCancel) onCancel();
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-gray-600 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}