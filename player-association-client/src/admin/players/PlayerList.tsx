import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// Ensure this path matches your project structure
import { PlayerService } from "../../api/playerService";
import ImageSlider from "../../components/ImageSlider";

// --- Types ---
interface Player {
  id?: number;
  fullName: string;
  age: number | string;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
  imagePaths?: string[];
}

// --- Icons (Embedded for single-file portability) ---
const WaliaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const AddUserIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

// --- Sub-Component: The Form ---
interface PlayerFormProps {
  player?: Player | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function PlayerForm({ player, onSuccess, onCancel }: PlayerFormProps) {
  const initialFormState: Player = {
    fullName: "",
    age: "",
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      setForm({ ...player });
      setImageFile(null);
      // Use getImageUrl to handle relative paths from backend
      const playerImageUrl = player.imagePath ? getImageUrl(player.imagePath) : null;
      setPreviewUrl(playerImageUrl);
    } else {
      setForm(initialFormState);
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [player]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.fullName.trim()) {
      setError("Full name is required (ሙሉ ስም ያስፈልጋል)");
      setLoading(false);
      return;
    }

    if (form.age === "" || form.age === null || form.age === undefined) {
      setError("Age is required");
      setLoading(false);
      return;
    }

    if (Number(form.age) < 0) {
      setError("Age cannot be negative");
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

      if (imageFile) formData.append("ImageFiles", imageFile);

      if (player && player.id) {
        await PlayerService.update(player.id, formData);
      } else {
        await PlayerService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save player");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border-t-4 border-[#009A44] overflow-hidden mb-10 animate-fade-in-down">
      <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
          {player ? "Edit Legend" : "Register New Talent"}
          <span className="text-xs font-normal text-gray-500 uppercase tracking-wider border px-2 py-0.5 rounded-full">
            {player ? "Updating Record" : "Drafting"}
          </span>
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors">
          <CloseIcon />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Image Section */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 shadow-md mb-4 group ${previewUrl ? 'border-[#FEDD00]' : 'border-gray-200'}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <AddUserIcon />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs font-bold">Change</span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-sm text-gray-500">Upload Photo</p>
          </div>

          {/* Fields Section */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Full Name *</label>
              <input className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#009A44] outline-none"
                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Abebe Bikila" required />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Club</label>
              <input className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#FEDD00] outline-none"
                value={form.club} onChange={e => setForm({ ...form, club: e.target.value })} placeholder="Current Club" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Age *</label>
              <input type="number" className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#FF0000] outline-none"
                value={form.age}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || Number(val) >= 0) {
                    setForm({ ...form, age: val });
                  }
                }}
                min="0" required />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Position</label>
              <div className="relative">
                <select
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#009A44] outline-none appearance-none bg-white"
                  value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                >
                  <option value="" disabled>Select Position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Attacker">Attacker</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 mt-1 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Nationality</label>
              <input className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#009A44] outline-none"
                value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Scout Report / Description</label>
              <textarea className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#009A44] outline-none" rows={3}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Skills, history..." />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-[#009A44] hover:bg-[#007A30] text-white rounded-lg font-bold shadow-lg transition transform active:scale-95 disabled:opacity-50">
            {loading ? "Saving..." : "Save Player"}
          </button>
        </div>
      </form>
    </div>
  );
}

const getImageUrl = (imagePaths?: string | string[]) => {
  if (!imagePaths) return "https://via.placeholder.com/150x150?text=No+Photo";
  const imagePath = Array.isArray(imagePaths) ? (imagePaths.length > 0 ? imagePaths[0] : null) : imagePaths;
  if (!imagePath) return "https://via.placeholder.com/150x150?text=No+Photo";
  if (imagePath.startsWith("http")) return imagePath;

  // Adjust this base URL to match your backend port
  return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/uploads/'}${imagePath}`;
};

// --- Main Component: Player Manager ---
export default function PlayerManager() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await PlayerService.getAll();
      setPlayers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this player from the roster?")) return;
    try {
      await PlayerService.delete(id);
      fetchPlayers();
    } catch (err) {
      alert("Failed to delete player");
    }
  };

  // Stats Logic
  const stats = {
    total: players.length,
    avgAge: players.length ? Math.round(players.reduce((acc, p) => acc + Number(p.age), 0) / players.length) : 0,
    positions: players.reduce((acc: any, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 1. HERO HEADER */}
      <div className="bg-white shadow-lg relative overflow-hidden">
        {/* Flag Stripe */}
        <div className="flex h-2">
          <div className="flex-1 bg-[#009A44]"></div>
          <div className="flex-1 bg-[#FEDD00]"></div>
          <div className="flex-1 bg-[#FF0000]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-[#009A44] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <WaliaIcon className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Ethiopian Football Federation
                </h1>
                <p className="text-sm text-[#009A44] font-bold uppercase tracking-widest mt-1">
                  National Squad Manager (ብሔራዊ ቡድን)
                </p>
              </div>
            </div>

            <button
              onClick={() => { setShowForm(true); setEditingPlayer(null); }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#009A44] to-[#007A30] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <AddUserIcon />
              Add New Player
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 uppercase font-bold">Squad Size</span>
              <div className="text-2xl font-black text-gray-800">{stats.total}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 uppercase font-bold">Avg Age</span>
              <div className="text-2xl font-black text-gray-800">{stats.avgAge}</div>
            </div>
            <div className="col-span-2 flex gap-2 overflow-x-auto pb-1">
              {Object.entries(stats.positions).map(([pos, count]: any) => (
                <span key={pos} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 whitespace-nowrap flex items-center">
                  {pos}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 2. FORM SECTION (Conditional) */}
        {(showForm || editingPlayer) && (
          <PlayerForm
            player={editingPlayer}
            onSuccess={() => {
              setShowForm(false);
              setEditingPlayer(null);
              fetchPlayers();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingPlayer(null);
            }}
          />
        )}

        {/* 3. PLAYERS GRID */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-[#009A44] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Scouting players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <div className="text-gray-400 mb-4 mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <WaliaIcon className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Roster Empty</h3>
            <p className="text-gray-500 mb-6">No players found in the database.</p>
            <button onClick={() => setShowForm(true)} className="text-[#009A44] font-bold hover:underline">Register your first player</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <div key={player.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">

                {/* Card Image Header */}
                <div className="relative h-48 bg-gray-900">
                  {player.imagePaths && player.imagePaths.length > 0 ? (
                    <ImageSlider
                      images={player.imagePaths}
                      alt={player.fullName}
                      className="h-48"
                    />
                  ) : (
                    <img
                      src={getImageUrl(player.imagePath)}
                      alt={player.fullName}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300x200?text=EFF"; }}
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

                  {/* Position Badge */}
                  <span className="absolute top-3 right-3 bg-[#FEDD00] text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                    {player.position || "N/A"}
                  </span>

                  {/* Name Overlay */}
                  <div className="absolute bottom-3 left-4 text-white z-10 pointer-events-none">
                    <h3 className="font-bold text-lg leading-tight">{player.fullName}</h3>
                    <p className="text-xs opacity-90">{player.club}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3 border-b pb-2">
                    <span>Age: <strong className="text-gray-800">{player.age}</strong></span>
                    <span>{player.nationality}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {player.description || "No scouting report available."}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setEditingPlayer(player); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#009A44] hover:text-white transition-colors"
                  >
                    <EditIcon /> Edit
                  </button>
                  <button
                    onClick={() => player.id && handleDelete(player.id)}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <DeleteIcon /> Release
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}