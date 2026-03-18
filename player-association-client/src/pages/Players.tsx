import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import PlayerCard from "../components/players/PlayerCard";
import Loader from "../components/common/Loader";
import { Search } from "lucide-react";

interface Player {
  id: number; fullName: string; age: number; club: string;
  position: string; nationality: string; description: string;
  imagePath?: string; imagePaths?: string[];
}

export default function Players() {
  const { t } = useTranslation();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const POSITIONS = [
    { label: t("positions.all"), value: "All" },
    { label: t("positions.goalkeepers"), value: "Goalkeeper" },
    { label: t("positions.defenders"), value: "Defender" },
    { label: t("positions.midfielders"), value: "Midfielder" },
    { label: t("positions.attackers"), value: "Attacker" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await PlayerService.getAll();
        setAllPlayers(res.data);
        setFilteredPlayers(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    let result = allPlayers;
    if (activeTab !== "All") result = result.filter(p => p.position.toLowerCase() === activeTab.toLowerCase());
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.fullName.toLowerCase().includes(q) || p.club.toLowerCase().includes(q));
    }
    setFilteredPlayers(result);
  }, [activeTab, searchQuery, allPlayers]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">

      {/* Page header */}
      <PageHero badge={t("players_page.header_badge")} title1={t("players_page.header_title_1")} title2={t("players_page.header_title_2")} />

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {POSITIONS.map((pos) => (
              <button key={pos.value} onClick={() => setActiveTab(pos.value)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border
                  ${activeTab === pos.value
                    ? "bg-[#009A44] border-[#009A44] text-white shadow-lg shadow-green-900/20"
                    : "bg-white dark:bg-[#111] border-gray-200 dark:border-[#C9A84C]/10 text-gray-500 dark:text-gray-400 hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
                  }`}>
                {pos.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder={t("players_page.search_placeholder") as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10 rounded-full focus:outline-none focus:border-[#C9A84C]/40 text-[11px] font-semibold text-gray-700 dark:text-gray-300 placeholder-gray-400 transition-all w-full md:w-72"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {filteredPlayers.length === 0 ? (
          <EmptyState label={t("players_page.not_found")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((p) => <PlayerCard key={p.id} {...p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export function PageHero({ badge, title1, title2 }: { badge: string; title1: string; title2: string }) {
  return (
    <div className="bg-gray-900 dark:bg-[#0D0D0D] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-16">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">{badge}</span>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title1} <span className="gold-text italic">{title2}</span>
        </h1>
        <div className="w-16 h-px bg-gradient-to-r from-[#C9A84C] to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FAF7F0] dark:from-[#0D0D0D] to-transparent" />
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-32 text-center">
      <div className="w-px h-16 bg-gradient-to-b from-[#C9A84C]/30 to-transparent mx-auto mb-8" />
      <p className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{label}</p>
    </div>
  );
}
