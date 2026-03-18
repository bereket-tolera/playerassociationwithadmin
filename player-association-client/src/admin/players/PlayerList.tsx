import { useEffect, useState, FormEvent } from "react";
import { PlayerService } from "../../api/playerService";
import { UserPlus, Edit3, Trash2, X, Filter, Shield } from "lucide-react";

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

const positionColors: Record<string, string> = {
  Goalkeeper: "bg-amber-100 text-amber-700 border-amber-200",
  Defender: "bg-blue-100 text-blue-700 border-blue-200",
  Midfielder: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Attacker: "bg-red-100 text-red-700 border-red-200",
};

const getImageUrl = (imagePaths?: string | string[]) => {
  if (!imagePaths) return "https://via.placeholder.com/150x150?text=No+Photo";
  const p = Array.isArray(imagePaths) ? imagePaths[0] : imagePaths;
  if (!p) return "https://via.placeholder.com/150x150?text=No+Photo";
  if (p.startsWith("http")) return p;
  return `http://localhost:5121${p.startsWith("/") ? "" : "/uploads/"}${p}`;
};

interface PlayerFormProps {
  player?: Player | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function PlayerForm({ player, onSuccess, onCancel }: PlayerFormProps) {
  const blank: Player = { fullName: "", age: "", club: "", position: "", nationality: "Ethiopian", description: "", imagePath: "" };
  const [form, setForm] = useState<Player>(blank);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      setForm({ ...player });
      setPreviewUrl(player.imagePath ? getImageUrl(player.imagePath) : null);
    } else {
      setForm(blank);
      setPreviewUrl(null);
    }
    setImageFile(null);
  }, [player]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("FullName", form.fullName.trim());
      fd.append("Age", form.age.toString());
      fd.append("Club", form.club.trim());
      fd.append("Position", form.position.trim());
      fd.append("Nationality", form.nationality.trim());
      fd.append("Description", form.description.trim());
      if (imageFile) fd.append("ImageFiles", imageFile);
      if (player?.id) {
        await PlayerService.update(player.id, fd);
      } else {
        await PlayerService.create(fd);
      }
      onSuccess();
    } catch {
      setError("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-[#009A44]"></div>
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
            {player ? "Edit Player" : "Register New Player"}
          </h3>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <X size={15} className="text-gray-400" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <UserPlus size={28} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Change</span>
              </div>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Profile Photo</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Full Name *</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm font-semibold text-gray-900 transition-all"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Abebe Bikila"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Club</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                value={form.club}
                onChange={e => setForm({ ...form, club: e.target.value })}
                placeholder="Current Club"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Position</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all cursor-pointer"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
              >
                <option value="" disabled>Select Position</option>
                <option>Goalkeeper</option>
                <option>Defender</option>
                <option>Midfielder</option>
                <option>Attacker</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Age</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Nationality</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009A44]/20 focus:border-[#009A44] outline-none text-sm transition-all"
                value={form.nationality}
                onChange={e => setForm({ ...form, nationality: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3 items-center">
          {error && <span className="text-[10px] font-bold text-red-500 uppercase mr-auto">{error}</span>}
          <button type="button" onClick={onCancel} className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 bg-[#009A44] hover:bg-[#007A30] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : (player ? "Update" : "Register")}
          </button>
        </div>
      </form>
    </div>
  );
}

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

  useEffect(() => { fetchPlayers(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this player from the registry?")) return;
    try {
      await PlayerService.delete(id);
      fetchPlayers();
    } catch {
      alert("Removal failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">Management Profile Registry</p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Active <span className="font-black text-[#009A44]">Roster</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors shadow-sm">
            <Filter size={16} />
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingPlayer(null); }}
            className="flex items-center gap-2 bg-[#009A44] hover:bg-[#007A30] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
          >
            <UserPlus size={14} /> Register Player
          </button>
        </div>
      </div>

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
      ) : players.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs tracking-wider italic">
          No players registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {players.map(player => (
            <div
              key={player.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#009A44]/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                <img
                  src={getImageUrl(player.imagePaths || player.imagePath)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  alt={player.fullName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                {player.position && (
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${positionColors[player.position] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {player.position}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-black text-gray-900 truncate mb-0.5">{player.fullName}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{player.club || "—"}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <Shield size={10} className="text-[#009A44]" />
                    {player.nationality || "—"}
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => setEditingPlayer(player)}
                      className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => player.id && handleDelete(player.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
