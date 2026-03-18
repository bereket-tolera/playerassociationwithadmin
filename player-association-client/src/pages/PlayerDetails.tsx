import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import Loader from "../components/common/Loader";
import { ArrowLeft, Shirt, Target, Globe } from "lucide-react";

interface Player {
  id: number; fullName: string; age: number; club: string;
  position: string; nationality: string; description: string;
  imagePath?: string; imagePaths?: string[];
}

export default function PlayerDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await PlayerService.getById(Number(id));
        setPlayer(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const getImg = (paths?: string | string[]) => {
    if (!paths) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?auto=format&fit=crop&w=2000&q=80";
    const p = Array.isArray(paths) ? paths[0] : paths;
    if (!p) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?auto=format&fit=crop&w=2000&q=80";
    if (p.startsWith("http")) return p;
    return `http://localhost:5121${p.startsWith("/") ? "" : "/uploads/"}${p}`;
  };

  if (loading) return <Loader />;
  if (!player) return <div className="text-center py-24 text-gray-500">{t("common.not_found")}</div>;

  const [firstName, ...rest] = player.fullName.split(" ");

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">


      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-4">
        <Link to="/players" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-colors group">
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          {t("details.back_to_squad")}
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10">
            <img
              src={getImg(player.imagePaths || player.imagePath)}
              alt={player.fullName}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          {/* Gold corner accent */}
          <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-[#C9A84C]/40 rounded-tr-3xl" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-[#C9A84C]/40 rounded-bl-3xl" />
        </div>

        {/* Info */}
        <div className="pt-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">{t("details.official_profile")}</span>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {firstName}<br /><span className="gold-text">{rest.join(" ")}</span>
          </h1>

          <div className="w-12 h-px bg-[#C9A84C] mb-8" />

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-4 py-2 bg-[#0D0D0D] dark:bg-white text-white dark:text-[#0D0D0D] text-[10px] font-bold uppercase tracking-widest rounded-full">
              {player.position}
            </span>
            <span className="px-4 py-2 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-full">
              {player.nationality}
            </span>
          </div>

          {/* Bio */}
          <div className="mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">{t("details.biography")}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-sm">
              {player.description || t("details.no_biography")}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Target size={16} className="text-[#C9A84C]" />, label: t("details.age"), value: `${player.age}` },
              { icon: <Shirt size={16} className="text-[#009A44]" />, label: t("details.current_club"), value: player.club },
              { icon: <Globe size={16} className="text-[#CC0000]" />, label: t("details.nationality"), value: player.nationality },
            ].map(({ icon, label, value }) => (
              <div key={label} className="p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10 rounded-2xl shadow-sm dark:shadow-none">
                <div className="mb-2">{icon}</div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registry footer */}
      <div className="bg-gray-900 dark:bg-[#0D0D0D] mt-20 py-20">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C] to-transparent mx-auto mb-8" />
          <h2 className="text-xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("details.member_national")}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 leading-loose">
            {t("details.registry_verified")} #{player.id.toString().padStart(6, "0")}<br />
            ADDIS ABABA • ETHIOPIA
          </p>
          <div className="flex justify-center gap-2 mt-8">
            <div className="h-0.5 w-12 bg-[#009A44] rounded-full" />
            <div className="h-0.5 w-12 bg-[#FEDD00] rounded-full" />
            <div className="h-0.5 w-12 bg-[#CC0000] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
