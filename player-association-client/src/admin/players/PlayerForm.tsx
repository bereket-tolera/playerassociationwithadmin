import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { PlayerService } from "../../api/playerService";

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

export default function PlayerForm({ player, onSuccess }: PlayerFormProps) {
  const [form, setForm] = useState<Player>({
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      setForm({ ...player });
      setImageFile(null);
    }
  }, [player]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "age" ? Number(value) : value });
    setError(null); // Clear error when user types
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file.name, file.size, file.type);
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!form.fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("FullName", form.fullName.trim());
      formData.append("Age", form.age.toString());
      formData.append("Club", form.club.trim());
      formData.append("Position", form.position.trim());
      formData.append("Nationality", form.nationality.trim());
      formData.append("Description", form.description.trim());

      if (imageFile) {
        formData.append("ImageFile", imageFile);
        console.log("Adding image to FormData:", imageFile.name);
      } else {
        console.log("No image file selected");
      }

      // Debug: Log all FormData entries
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let response;
      if (player && player.id) {
        console.log(`Updating player ${player.id}`);
        response = await PlayerService.update(player.id, formData);
      } else {
        console.log("Creating new player");
        response = await PlayerService.create(formData);
      }

      console.log("Success:", response.data);

      // Reset form
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
      
      // Trigger success callback
      onSuccess();
      
    } catch (err: any) {
      console.error("Failed to save player:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to save player";
      setError(errorMessage);
      
      alert(`Error: ${errorMessage}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 border p-4 rounded bg-white shadow-sm"
    >
      <h3 className="font-bold mb-4 text-lg">
        {player ? "Edit Player" : "Add New Player"}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age *</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            min="16"
            max="50"
            value={form.age}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Club</label>
          <input
            type="text"
            name="club"
            placeholder="Club"
            value={form.club}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={form.nationality}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
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
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
        >
          {loading ? "Saving..." : player ? "Update Player" : "Add Player"}
        </button>
        
        {player && (
          <button
            type="button"
            onClick={() => {
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
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}