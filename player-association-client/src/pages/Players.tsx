import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import PlayerCard from "../components/players/PlayerCard";
import Loader from "../components/common/Loader";
import { Search } from "lucide-react";

interface Player {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
  imagePaths?: string[];
}

export default function Players() {
  const { t } = useTranslation();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const POSITIONS_CONFIG = [
    { label: t('positions.all'), value: "All" },
    { label: t('positions.goalkeepers'), value: "Goalkeeper" },
    { label: t('positions.defenders'), value: "Defender" },
    { label: t('positions.midfielders'), value: "Midfielder" },
    { label: t('positions.attackers'), value: "Attacker" },
  ];

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await PlayerService.getAll();
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

  useEffect(() => {
    let result = allPlayers;
    if (activeTab !== "All") {
      result = result.filter(p => p.position.toLowerCase() === activeTab.toLowerCase());
    }
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 font-sans transition-colors duration-500">

      {/* 1. Header Area: Minimalist */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12 border-b border-gray-100 dark:border-gray-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black text-[#009A44] uppercase tracking-[0.3em] mb-4 block">{t('players_page.header_badge')}</span>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tight leading-none">
              {t('players_page.header_title_1')} <span className="font-bold">{t('players_page.header_title_2')}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={t('players_page.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#009A44] text-[11px] font-bold uppercase tracking-widest text-gray-900 dark:text-white dark:placeholder:text-gray-600 transition-all w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-4 mt-12 overflow-x-auto pb-4 no-scrollbar">
          {POSITIONS_CONFIG.map((pos) => (
            <button
              key={pos.value}
              onClick={() => setActiveTab(pos.value)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                    ${activeTab === pos.value
                  ? "bg-[#009A44] border-[#009A44] text-white shadow-xl shadow-green-200/50 dark:shadow-none"
                  : "bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-50 dark:border-gray-800 hover:text-[#009A44] hover:border-[#009A44]/20"
                }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {filteredPlayers.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{t('players_page.not_found')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
