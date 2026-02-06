import { useEffect, useState } from "react";
import { PlayerService } from "../../api/playerService";
import { EventService } from "../../api/eventService";
import { InsightService } from "../../api/insightService";
import { Users, Calendar, Newspaper, Clock, ExternalLink, Activity, ArrowRight } from "lucide-react";
import Loader from "../../components/common/Loader";

const AdminDashboard = () => {
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

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in bg-[#fdfdfd] min-h-screen text-gray-800 font-sans">

            {/* Header: Minimal & Clean */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-xl font-medium tracking-tight text-gray-900">
                        System <span className="text-[#009A44] font-bold">Overview</span>
                    </h1>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mt-1">
                        EPA Central Management
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-semibold text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-2">
                        <Clock size={12} className="text-[#009A44]" /> Sync: {stats.lastUpdate}
                    </div>
                </div>
            </div>

            {/* Stats Cards: Thin, Sleek, Glassy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Squad", value: stats.totalPlayers, icon: <Users size={18} />, theme: "border-green-100 hover:bg-green-50/30", color: "text-[#009A44]" },
                    { label: "Events", value: stats.totalEvents, icon: <Calendar size={18} />, theme: "border-yellow-100 hover:bg-yellow-50/30", color: "text-yellow-600" },
                    { label: "Insights", value: stats.totalInsights, icon: <Newspaper size={18} />, theme: "border-red-100 hover:bg-red-50/30", color: "text-[#FF0000]" },
                ].map((item, i) => (
                    <div key={i} className={`p-6 bg-white border ${item.theme} rounded-2xl transition-all duration-300 group cursor-default`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-gray-50 ${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <Activity size={14} className="text-gray-200" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-light text-gray-900 tracking-tighter">{item.value}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Total Entries</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Minimalist Goal Tracker */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Metrics & Health</h3>
                        <ExternalLink size={14} className="text-gray-300 hover:text-[#009A44] cursor-pointer" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: "Profile Data Integrity", progress: 85, color: "bg-[#009A44]" },
                            { label: "Calendar Accuracy", progress: 62, color: "bg-[#FEDD00]" },
                            { label: "Media Optimization", progress: 40, color: "bg-[#FF0000]" },
                        ].map((goal, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                    <span>{goal.label}</span>
                                    <span className="text-gray-800">{goal.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${goal.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refined Quick Actions */}
                <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity size={120} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Express Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                                <span className="text-[11px] font-bold uppercase tracking-wide">Add Player</span>
                                <ArrowRight size={14} className="text-[#009A44] group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                                <span className="text-[11px] font-bold uppercase tracking-wide">Sync Calendar</span>
                                <ArrowRight size={14} className="text-[#FEDD00] group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-medium text-gray-500 tracking-wider">SECURE INSTANCE v2.4</span>
                        <div className="flex gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-[#009A44]"></div>
                            <div className="w-1 h-1 rounded-full bg-[#FEDD00]"></div>
                            <div className="w-1 h-1 rounded-full bg-[#FF0000]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
