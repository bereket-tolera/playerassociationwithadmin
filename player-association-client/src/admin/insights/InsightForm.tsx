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
  // Added optional cancel prop for flexibility
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
const PenIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const TagIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
);
const ImageIcon = () => (
  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

export default function InsightForm({ insight, onSuccess, onCancel }: InsightFormProps) {
  const initialForm = {
    title: "",
    description: "",
    content: "",
    author: "",
    category: categories[0],
  };

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      setImageFile(null);
      setPreviewUrl(insight.imagePath || null);
    } else {
      setForm(initialForm);
      setPreviewUrl(null);
    }
  }, [insight]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.title.trim()) {
      setError("Headline Title is required (ርዕስ ያስፈልጋል)");
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

      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      if (insight && insight.id) {
        await InsightService.update(insight.id, formData);
      } else {
        await InsightService.create(formData);
      }

      // Cleanup
      setForm(initialForm);
      setImageFile(null);
      setPreviewUrl(null);
      onSuccess();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to publish insight";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border-t-4 border-[#009A44] overflow-hidden mb-10 font-sans">
      
      {/* --- Header --- */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            {insight ? "Edit Editorial" : "Compose New Insight"}
          </h3>
          <p className="text-xs text-[#009A44] font-bold uppercase tracking-widest mt-1">
            Official Federation Communication (መግለጫ)
          </p>
        </div>
        {/* Abstract Flag Dots */}
        <div className="flex gap-1.5">
           <span className="w-2.5 h-2.5 rounded-full bg-[#009A44]"></span>
           <span className="w-2.5 h-2.5 rounded-full bg-[#FEDD00]"></span>
           <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000]"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        
        {/* --- Error Alert --- */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
             <div className="flex">
               <div className="flex-shrink-0">
                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
               </div>
               <div className="ml-3">
                 <p className="text-sm text-red-700 font-medium">{error}</p>
               </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* --- Left Column: Main Content --- */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Headline Title <span className="text-red-500">*</span></label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PenIcon />
                </div>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Strategic Growth in Youth Academies"
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent transition-shadow outline-none text-gray-800 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Author & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Author (ደራሲ) *</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category (ምድብ) *</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon />
                  </div>
                  <select 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange}
                    className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none bg-white transition-shadow appearance-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Areas */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Executive Summary (Short Description)</label>
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={handleChange}
                placeholder="Brief overview for the news feed..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none resize-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Article Body <span className="text-red-500">*</span></label>
              <textarea
                name="content"
                rows={8}
                value={form.content}
                onChange={handleChange}
                placeholder="Write the full insight here..."
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009A44] focus:border-transparent outline-none transition-shadow"
              />
            </div>

          </div>

          {/* --- Right Column: Media --- */}
          <div className="md:col-span-4">
             <label className="block text-sm font-bold text-gray-700 mb-1">Featured Image (ምስል)</label>
             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#009A44] hover:bg-green-50 transition-all group cursor-pointer relative bg-gray-50 h-64">
                
                {previewUrl ? (
                   <div className="absolute inset-0 p-2 w-full h-full">
                     <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-bold text-sm">Change Image</p>
                     </div>
                   </div>
                ) : (
                  <div className="space-y-1 text-center self-center">
                    <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#009A44] transition-colors flex justify-center">
                      <ImageIcon />
                    </div>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-[#009A44] hover:text-[#007A30]">
                        <span>Upload a file</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
             </div>
             <p className="mt-2 text-xs text-gray-500 text-center">
               This image will appear on the news feed card.
             </p>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
           {insight && (
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setImageFile(null);
                  setPreviewUrl(null);
                  onSuccess();
                  if (onCancel) onCancel();
                }}
                className="px-6 py-2.5 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
           )}

           <button
             type="submit"
             disabled={loading}
             className={`
               flex items-center px-8 py-2.5 rounded-lg text-white font-bold shadow-md transform transition-all
               ${loading 
                 ? 'bg-gray-400 cursor-not-allowed' 
                 : 'bg-gradient-to-r from-[#009A44] to-[#007A30] hover:shadow-lg hover:-translate-y-0.5'
               }
             `}
           >
             {loading ? <LoadingSpinner /> : <SaveIcon />}
             <span>{loading ? "Publishing..." : (insight ? "Update Article" : "Publish Insight")}</span>
           </button>
        </div>

      </form>
    </div>
  );
}