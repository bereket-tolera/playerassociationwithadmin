import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { InsightService } from "../../api/insightService";

interface InsightFormProps {
  insight?: any;
  onSuccess: () => void;
}

const categories = [
  "Development",
  "HealthFitness",
  "CareerEducation",
  "TransferMarket",
  "Interview",
  "Biography",
];

export default function InsightForm({ insight, onSuccess }: InsightFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    category: categories[0],
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    }
  }, [insight]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      formData.append("Content", form.content.trim());
      formData.append("Author", form.author.trim());
      formData.append("Category", form.category);

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

      if (insight && insight.id) {
        console.log(`Updating insight ${insight.id}`);
        await InsightService.update(insight.id, formData);
      } else {
        console.log("Creating new insight");
        await InsightService.create(formData);
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        content: "",
        author: "",
        category: categories[0],
      });
      setImageFile(null);
      onSuccess();
      
    } catch (err: any) {
      console.error("Failed to save insight:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to save insight";
      setError(errorMessage);
      
      alert(`Error: ${errorMessage}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-white shadow-sm">
      <h3 className="font-bold mb-4 text-lg">{insight ? "Edit Insight" : "Add New Insight"}</h3>

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
            placeholder="Insight Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={form.author}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <textarea
            name="description"
            placeholder="Short description (for preview)"
            rows={2}
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea
            name="content"
            placeholder="Full content of the insight"
            rows={5}
            value={form.content}
            onChange={handleChange}
            required
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
          {loading ? "Saving..." : insight ? "Update Insight" : "Add Insight"}
        </button>
        
        {insight && (
          <button
            type="button"
            onClick={() => {
              setForm({
                title: "",
                description: "",
                content: "",
                author: "",
                category: categories[0],
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