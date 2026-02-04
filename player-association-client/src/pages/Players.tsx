import { useEffect, useState } from "react";
import { PlayerService } from "../api/playerService";
import PlayerCard from "../components/players/PlayerCard";
import Loader from "../components/common/Loader";
import { Users, Search } from "lucide-react";

interface Player {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
}

const POSITIONS = ["All", "Goalkeeper", "Defender", "Midfielder", "Attacker"];

export default function Players() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await PlayerService.getAll();
        console.log('Players data:', res.data);
        console.log('First player:', res.data[0]);
        setAllPlayers(res.data);
        setFilteredPlayers(res.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allPlayers;

    // 1. Filter by Position
    if (activeTab !== "All") {
      result = result.filter(p => p.position.toLowerCase() === activeTab.toLowerCase());
    }

    // 2. Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.fullName.toLowerCase().includes(query) ||
        p.club.toLowerCase().includes(query)
      );
    }

    setFilteredPlayers(result);
  }, [activeTab, searchQuery, allPlayers]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500">

      {/* 1. Hero Section */}
      <div className="relative pt-20 pb-24 bg-[#050816] text-white overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#009A44] opacity-10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#007A30] opacity-10 blur-[150px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full text-[#009A44] font-bold text-xs uppercase tracking-[0.2em] mb-6">
            <Users size={14} /> Official Roster
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 leading-tight">
            National <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009A44] to-[#007A30]">Squad</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The pride of Ethiopia. Meet the elite athletes representing our nation on the international stage.
          </p>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-24">

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 mb-12 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100 dark:border-gray-700">

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009A44] text-gray-900 dark:text-white transition-colors"
            />
          </div>

          {/* Position Tabs */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => setActiveTab(pos)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                    ${activeTab === pos
                    ? "bg-[#009A44] text-white shadow-lg shadow-green-500/30"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {pos === "All" ? "All Players" : pos + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Players Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchQuery ? `No matches for "${searchQuery}"` : "The squad list is empty."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}