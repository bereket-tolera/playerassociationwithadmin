import { useEffect, useState } from "react";
import { InsightService } from "../../api/insightService";
import { UploadService } from "../../api/uploadService";

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
    imagePath: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (insight) {
      setForm({ ...insight });
    }
  }, [insight]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

      if (insight) {
        await InsightService.update(insight.id, payload);
      } else {
        await InsightService.create(payload);
      }

      setForm({
        title: "",
        description: "",
        content: "",
        author: "",
        category: categories[0],
        imagePath: "",
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
      <h3 className="font-bold mb-2">{insight ? "Edit Insight" : "Add Insight"}</h3>
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
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} />
        <textarea
          name="description"
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Full Content"
          value={form.content}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : insight ? "Update Insight" : "Add Insight"}
      </button>
    </form>
  );
}
