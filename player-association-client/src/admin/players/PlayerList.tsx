import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { PlayerService } from "../../api/playerService";
import ImageSlider from "../../components/ImageSlider";
import { UserPlus, Edit3, Trash2, X, ChevronRight, Filter } from "lucide-react";

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

// --- Icons ---
const PositionIcon = ({ pos }: { pos: string }) => {
  const colors: Record<string, string> = {
    'Goalkeeper': 'text-yellow-500',
    'Defender': 'text-blue-500',
    'Midfielder': 'text-green-500',
    'Attacker': 'text-red-500'
  };
  return <div className={`w-2 h-2 rounded-full ${colors[pos] || 'bg-gray-300'} ring-4 ring-opacity-10 ring-current`}></div>;
};

// --- Sub-Component: The Form (Refined) ---
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
      const playerImageUrl = player.imagePath ? getImageUrl(player.imagePath) : null;
      setPreviewUrl(playerImageUrl);
    } else {
      setForm(initialFormState);
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [player]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setError("Failed to process request. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8 animate-fade-in">
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          {player ? "Modify Registry" : "New Entry"}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <UserPlus size={32} />
                </div>
              )}
              <input type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-3 tracking-widest tracking-tighter">Profile Media</p>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                className="w-full text-lg font-medium border-b border-gray-100 focus:border-[#009A44] outline-none py-2 transition-colors placeholder:text-gray-300"
                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Full Legal Name" required
              />
            </div>
            <div className="space-y-4">
              <input
                className="w-full text-xs font-bold uppercase tracking-widest border-b border-gray-100 focus:border-[#009A44] outline-none py-2 transition-colors placeholder:text-gray-300"
                value={form.club} onChange={e => setForm({ ...form, club: e.target.value })}
                placeholder="Current Club"
              />
              <select
                className="w-full text-xs font-bold uppercase tracking-widest border-b border-gray-100 focus:border-[#009A44] outline-none py-2 transition-colors bg-white cursor-pointer"
                value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
              >
                <option value="" disabled>Assigned Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Attacker">Attacker</option>
              </select>
            </div>
            <div className="space-y-4">
              <input
                type="number"
                className="w-full text-xs font-bold uppercase tracking-widest border-b border-gray-100 focus:border-[#009A44] outline-none py-2 transition-colors placeholder:text-gray-300"
                value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                placeholder="Age" required
              />
              <input
                className="w-full text-xs font-bold uppercase tracking-widest border-b border-gray-100 focus:border-[#009A44] outline-none py-2 transition-colors placeholder:text-gray-300"
                value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })}
                placeholder="Nationality"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 items-center">
          {error && <span className="text-[10px] font-bold text-red-500 uppercase mr-auto">{error}</span>}
          <button type="button" onClick={onCancel} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2 hover:text-gray-600">Dismiss</button>
          <button type="submit" disabled={loading} className="text-[10px] font-bold text-white bg-[#009A44] uppercase tracking-widest px-6 py-2 rounded-full shadow-sm hover:translate-y-[-1px] transition-all">
            {loading ? "Processing..." : "Commit Changes"}
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Verify removal from system registry?")) return;
    try {
      await PlayerService.delete(id);
      fetchPlayers();
    } catch (err) {
      alert("Removal failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20">

      {/* 1. Subtle Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">Active <span className="font-bold text-[#009A44]">Roster</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Management Profile Registry</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <Filter size={18} />
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingPlayer(null); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#009A44] transition-all shadow-sm"
          >
            <UserPlus size={14} /> Register Talent
          </button>
        </div>
      </div>

      {/* 2. Content */}
      <div className="max-w-6xl mx-auto">
        {(showForm || editingPlayer) && (
          <PlayerForm
            player={editingPlayer}
            onSuccess={() => { setShowForm(false); setEditingPlayer(null); fetchPlayers(); }}
            onCancel={() => { setShowForm(false); setEditingPlayer(null); }}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 border-2 border-gray-200 border-t-[#009A44] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map(player => (
              <div key={player.id} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#009A44]/30 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <img
                      src={getImageUrl(player.imagePaths || player.imagePath)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{player.fullName}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{player.club}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <PositionIcon pos={player.position} />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{player.position}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingPlayer(player)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => player.id && handleDelete(player.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-[10px] font-black text-gray-300 uppercase italic">
                    ID#{player.id?.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}