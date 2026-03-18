import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";
import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { ArrowRight, ChevronRight } from "lucide-react";

interface Player { id: number; fullName: string; age: number; club: string; position: string; nationality: string; description: string; imagePath: string; imagePaths?: string[]; }
interface Event { id: number; title: string; description: string; imagePath: string; imagePaths?: string[]; eventDate: string; location: string; }
interface Insight { id: number; title: string; description: string; content: string; author: string; category: string; imagePath: string; imagePaths?: string[]; }

export default function Home() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, e, i] = await Promise.all([PlayerService.getAll(), EventService.getAll(), InsightService.getAll()]);
        setPlayers(p.data.slice(0, 4));
        setEvents(e.data.slice(0, 3));
        setInsights(i.data.slice(0, 3));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-900 dark:bg-[#0D0D0D]">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#009A44]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#C9A84C]/8 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#009A44]" />
                <div className="w-2 h-2 rounded-full bg-[#FEDD00]" />
                <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">{t("hero.badge")}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.hero_title_1")}{" "}
              <span className="gold-text">{t("home.hero_title_2")}</span>
              <br />
              <span className="font-light italic">{t("home.hero_title_3")}</span>{" "}
              {t("home.hero_title_4")}
            </h1>

            <div className="w-16 h-px bg-gradient-to-r from-[#C9A84C] to-transparent mb-8" />

            <p className="text-gray-300 text-base leading-relaxed max-w-lg mb-12 font-light">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/players" className="group flex items-center gap-3 px-8 py-4 bg-[#009A44] hover:bg-[#006B2F] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-all shadow-lg shadow-green-900/30">
                {t("hero.explore_btn")} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/events" className="flex items-center gap-3 px-8 py-4 border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all">
                {t("hero.fixtures_btn")}
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { num: players.length || "—", label: t("admin.total_players"), color: "#009A44" },
              { num: events.length || "—", label: t("admin.active_events"), color: "#C9A84C" },
              { num: insights.length || "—", label: t("admin.insights_published"), color: "#CC0000" },
            ].map(({ num, label, color }) => (
              <div key={label} className="flex items-center gap-6 p-6 border border-white/5 rounded-2xl bg-white/[0.03] backdrop-blur-sm">
                <div className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color }}>{num}</div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</div>
              </div>
            ))}
            <div className="p-6 border border-[#C9A84C]/20 rounded-2xl bg-[#C9A84C]/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-2">{t("admin.system_health")}</p>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[92%] animate-shimmer rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FAF7F0] dark:from-[#0D0D0D] to-transparent" />
      </section>

      {/* ── PLAYERS ── */}
      <section className="py-28 max-w-7xl mx-auto px-8 w-full">
        <SectionHeader badge={t("home.section_players_badge")} badgeColor="#009A44" title1={t("home.section_players_title_1")} title2={t("home.section_players_title_2")} link="/players" linkLabel={t("home.section_players_link")} linkColor="#009A44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {players.map((p) => <PlayerCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-28 bg-gray-900 dark:bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #C9A84C, #C9A84C 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #C9A84C, #C9A84C 1px, transparent 1px, transparent 60px)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <SectionHeader badge={t("home.section_events_badge")} badgeColor="#C9A84C" title1={t("home.section_events_title_1")} title2={t("home.section_events_title_2")} link="/events" linkLabel={t("home.section_events_link")} linkColor="#C9A84C" dark />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {events.map((e) => <EventCard key={e.id} {...e} />)}
          </div>
        </div>
      </section>

      {/* ── INSIGHTS ── */}
      <section className="py-28 max-w-7xl mx-auto px-8 w-full">
        <SectionHeader badge={t("home.section_insights_badge")} badgeColor="#CC0000" title1={t("home.section_insights_title_1")} title2={t("home.section_insights_title_2")} link="/insights" linkLabel={t("home.section_insights_link")} linkColor="#CC0000" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {insights.map((i) => <InsightCard key={i.id} {...i} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-gray-900 dark:bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-[600px] h-[600px] rounded-full border border-[#C9A84C]" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#C9A84C]" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[#C9A84C]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent mx-auto mb-10" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("home.cta_title_1")} <span className="gold-text italic">{t("home.cta_title_2")}</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-12 font-light">{t("home.cta_description")}</p>
          <Link to="/players" className="inline-flex items-center gap-3 px-10 py-4 border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black text-[11px] font-bold uppercase tracking-widest rounded-full transition-all">
            {t("home.cta_btn")} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ badge, badgeColor, title1, title2, link, linkLabel, linkColor, dark = false }: {
  badge: string; badgeColor: string; title1: string; title2: string;
  link: string; linkLabel: string; linkColor: string; dark?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block" style={{ color: badgeColor }}>{badge}</span>
        <h2 className={`text-3xl md:text-4xl font-light leading-tight ${dark ? "text-white" : "text-gray-900 dark:text-white"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
          {title1} <span className="font-bold">{title2}</span>
        </h2>
      </div>
      <Link to={link} className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: linkColor }}>
        {linkLabel} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
