import { useEffect, useState } from "react";
import { PlayerService } from "../../api/playerService";
import { EventService } from "../../api/eventService";
import { InsightService } from "../../api/insightService";
import { useTranslation } from "react-i18next";
import { Users, Calendar, Newspaper, Clock, Activity, ArrowRight, TrendingUp } from "lucide-react";
import Loader from "../../components/common/Loader";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalEvents: 0,
    totalInsights: 0,
    lastUpdate: new Date().toLocaleTimeString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [players, events, insights] = await Promise.all([
          PlayerService.getAll(),
          EventService.getAll(),
          InsightService.getAll(),
        ]);
        setStats({
          totalPlayers: players.data.length,
          totalEvents: events.data.length,
          totalInsights: insights.data.length,
          lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    {
      label: t('nav.players'),
      value: stats.totalPlayers,
      icon: <Users size={20} />,
      accent: "#009A44",
      bg: "from-[#009A44]/10 to-[#009A44]/5",
      border: "border-[#009A44]/20",
    },
    {
      label: t('nav.events'),
      value: stats.totalEvents,
      icon: <Calendar size={20} />,
      accent: "#FEDD00",
      bg: "from-[#FEDD00]/10 to-[#FEDD00]/5",
      border: "border-[#FEDD00]/30",
    },
    {
      label: t('nav.insights'),
      value: stats.totalInsights,
      icon: <Newspaper size={20} />,
      accent: "#E30613",
      bg: "from-[#E30613]/10 to-[#E30613]/5",
      border: "border-[#E30613]/20",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">
            {t('admin.central_management')}
          </p>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            {t('admin.system_overview').split(' ')[0]}{' '}
            <span className="font-black text-[#009A44]">
              {t('admin.system_overview').split(' ').slice(1).join(' ')}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
          <Clock size={12} className="text-[#009A44]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {t('admin.sync')}: {stats.lastUpdate}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border ${card.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center`}
                style={{ color: card.accent }}
              >
                {card.icon}
              </div>
              <TrendingUp size={14} className="text-gray-200 group-hover:text-gray-300 transition-colors" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{card.value}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{t('admin.total_entries')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Metrics */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">{t('admin.metrics_health')}</h3>
            <Activity size={14} className="text-gray-300" />
          </div>
          <div className="space-y-6">
            {[
              { label: t('admin.profile_integrity'), progress: 85, color: "#009A44" },
              { label: t('admin.calendar_accuracy'), progress: 62, color: "#FEDD00" },
              { label: t('admin.media_optimization'), progress: 40, color: "#E30613" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <span>{item.label}</span>
                  <span className="text-gray-700">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0a0f0d] rounded-2xl p-7 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#009A44] blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] mb-5">{t('admin.express_actions')}</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#009A44]/30 rounded-xl transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wide text-white/70 group-hover:text-white">{t('admin.add_player')}</span>
                <ArrowRight size={13} className="text-[#009A44] group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FEDD00]/30 rounded-xl transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wide text-white/70 group-hover:text-white">{t('admin.sync_calendar')}</span>
                <ArrowRight size={13} className="text-[#FEDD00] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/20 tracking-wider">{t('admin.secure_instance')} v2.4</span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#009A44]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FEDD00]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#E30613]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
