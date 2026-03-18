import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { InsightService } from "../../api/insightService";
import { X, Upload } from "lucide-react";

interface InsightData {
  id?: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath?: string;
  imagePaths?: string[];
}

interface InsightFormProps {
  insight?: InsightData | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const categories = ["Development", "HealthFitness", "CareerEducation", "TransferMarket", "Interview", "Biography"];

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function InsightForm({ insight, onSuccess, onCancel }: InsightFormProps) {
  const initial = { title: "", description: "", content: "", author: "", category: categories[0] };
  const [form, setForm] = useState(initial);
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
      let imgPreview = "";
      if (insight.imagePaths?.length) imgPreview = insight.imagePaths.join(',');
      else if (typeof insight.imagePath === 'string') imgPreview = insight.imagePath;
      setPreviewUrl(imgPreview || null);
    } else {
      setForm(initial);
      setImageFiles([]);
      setPreviewUrl(null);
    }
  }, [insight]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      setPreviewUrl(files.map(f => URL.createObjectURL(f)).join(','));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Article title is required."); return; }
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("Title", form.title.trim());
      fd.append("Description", form.description.trim());
      fd.append("Content", form.content.trim());
      fd.append("Author", form.author.trim());
      fd.append("Category", form.category);
      imageFiles.forEach(f => fd.append("ImageFiles", f));
      if (insight?.id) {
        await InsightService.update(insight.id, fd);
      } else {
        await InsightService.create(fd);
      }
      setForm(initial);
      setImageFiles([]);
      setPreviewUrl(null);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initial);
    setImageFiles([]);
    setPreviewUrl(null);
    onSuccess();
    if (onCancel) onCancel();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-7 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-[#009A44]"></div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
              {insight ? "Edit Article" : "Compose Insight"}
            </h3>
            <p className="text-[9px] text-[#009A44] font-bold uppercase tracking-widest mt-0.5">
              Official Federation Press Release (መግለጫ ቅጽ)
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* Main fields */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                Headline <span className="text-[#E30613]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter article title..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm font-semibold text-gray-900 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Author (ደራሲ)</label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Category (ምድብ)</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm cursor-pointer transition-all"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Summary / Abstract</label>
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm resize-none transition-all"
                placeholder="Brief text for the card view..."
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
                Full Content Body <span className="text-[#E30613]">*</span>
              </label>
              <textarea
                name="content"
                rows={10}
                value={form.content}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm font-mono leading-relaxed resize-none transition-all"
                placeholder="Write article content here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Featured Images</label>
              {previewUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 mb-3">
                  <img src={previewUrl.split(',')[0]} alt="Preview" className="w-full h-full object-cover" />
                  {previewUrl.includes(',') && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-lg font-bold">
                      +{previewUrl.split(',').length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 mb-3">
                  <Upload size={24} />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#009A44] hover:bg-[#009A44]/5 transition-all cursor-pointer">
                <Upload size={14} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Images</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-[9px] text-gray-400 mt-2 text-center">Max 5MB per file. First image is featured.</p>
            </div>

            <div className="mt-auto space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black text-white uppercase tracking-widest bg-[#009A44] hover:bg-[#007A30] shadow-sm transition-all disabled:opacity-50"
              >
                {loading && <Spinner />}
                {loading ? "Publishing..." : (insight ? "Save Changes" : "Publish Article")}
              </button>

              {(insight || onCancel) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
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
