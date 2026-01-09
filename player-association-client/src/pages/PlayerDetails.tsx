import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PlayerService } from "../api/playerService";
import Loader from "../components/common/Loader";
import { ArrowLeft, User, Shirt, Users, Globe, ChevronRight } from "lucide-react";

interface Player {
    id: number;
    fullName: string;
    age: number;
    club: string;
    position: string;
    nationality: string;
    description: string;
    imagePath: string;
}

export default function PlayerDetails() {
    const { id } = useParams<{ id: string }>();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const { data } = await PlayerService.getById(Number(id));
                setPlayer(data);
            } catch (error) {
                console.error("Failed to load player", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayer();
    }, [id]);

    if (loading) return <Loader />;
    if (!player) return <div className="text-center py-24 text-gray-500">Player not found.</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500">

            {/* 1. Header / Hero */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={player.imagePath}
                    alt={player.fullName}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 z-30 max-w-7xl mx-auto">
                    <Link to="/players" className="inline-flex items-center text-white/80 hover:text-white mb-6 uppercase tracking-widest text-xs font-bold transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Squad
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none font-oswald text-shadow-lg">
                            {player.fullName}
                        </h1>
                        <div className="md:mb-4 px-4 py-1.5 bg-[#009A44] text-white text-sm font-bold uppercase tracking-wider rounded inline-block self-start md:self-auto">
                            {player.position}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2">
                                Biography <span className="w-12 h-1 bg-[#009A44] rounded-full ml-4"></span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {player.description || "No biography available for this player."}
                            </p>
                        </div>
                    </div>

                    {/* Stats / Sidebar Column */}
                    <div className="space-y-6">

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Player Details</h3>

                            <ul className="space-y-4">
                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><User size={18} /></div>
                                        Age
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{player.age} Years</span>
                                </li>

                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Shirt size={18} /></div>
                                        Club
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{player.club}</span>
                                </li>

                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Globe size={18} /></div>
                                        Nationality
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{player.nationality}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#009A44] to-[#007A30] rounded-2xl p-8 text-white shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <Users size={32} className="mb-4 text-[#FEDD00]" />
                            <h3 className="text-2xl font-black uppercase leading-tight mb-2">Member of EPA</h3>
                            <p className="text-white/80 text-sm mb-6">Verified professional player and active member of the association.</p>
                            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-[#FEDD00] animate-pulse"></div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}
