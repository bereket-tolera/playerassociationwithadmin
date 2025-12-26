import { useEffect, useState } from "react";
import { PlayerService } from "../../api/playerService";
import { UploadService } from "../../api/uploadService";

interface PlayerFormProps {
  player?: any;
  onSuccess: () => void;
}

export default function PlayerForm({ player, onSuccess }: PlayerFormProps) {
  const [form, setForm] = useState({
    fullName: "",
    age: 0,
    club: "",
    position: "",
    nationality: "",
    description: "",
    imagePath: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player) {
      setForm({ ...player });
    }
  }, [player]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("age", form.age.toString());
      formData.append("club", form.club);
      formData.append("position", form.position);
      formData.append("nationality", form.nationality);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (form.imagePath) {
        // send existing imagePath if no new file is selected
        formData.append("imagePath", form.imagePath);
      }

      if (player) {
        await PlayerService.update(player.id, formData);
      } else {
        await PlayerService.create(formData);
      }

      // Reset form after success
      setForm({
        fullName: "",
        age: 0,
        club: "",
        position: "",
        nationality: "",
        description: "",
        imagePath: "",
      });
      setImageFile(null);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save player. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-white">
      <h3 className="font-bold mb-4">{player ? "Edit Player" : "Add Player"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="club"
          placeholder="Club"
          value={form.club}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={form.nationality}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded md:col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        {loading ? "Saving..." : player ? "Update Player" : "Add Player"}
      </button>
    </form>
  );
}
