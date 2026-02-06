import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlayerService } from "../api/playerService";
import Loader from "../components/common/Loader";
import { ArrowLeft, Shirt, Target } from "lucide-react";

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

export default function PlayerDetails() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
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

    const getImageUrl = (imagePaths?: string | string[]) => {
        if (!imagePaths) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
        const imagePath = Array.isArray(imagePaths) ? (imagePaths.length > 0 ? imagePaths[0] : null) : imagePaths;
        if (!imagePath) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/uploads/'}${imagePath}`;
    };

    if (loading) return <Loader />;
    if (!player) return <div className="text-center py-24 text-gray-500">{t('common.not_found')}</div>;

    const firstName = player.fullName.split(' ')[0];
    const restName = player.fullName.split(' ').slice(1).join(' ');

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-500">

            {/* 1. Slim Header */}
            <div className="max-w-7xl mx-auto px-8 pt-10 pb-6">
                <Link to="/players" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#009A44] transition-colors group">
                    <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> {t('details.back_to_squad')}
                </Link>
            </div>

            {/* 2. Hero Component */}
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
                <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <img
                        src={getImageUrl(player.imagePaths || player.imagePath)}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div>
                    <span className="text-[10px] font-black text-[#009A44] uppercase tracking-[0.3em] mb-4 block">{t('details.official_profile')}</span>
                    <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
                        {firstName} <br /><span className="font-bold">{restName}</span>
                    </h1>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <div className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                            {player.position}
                        </div>
                        <div className="px-4 py-1.5 border border-gray-100 dark:border-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                            {player.nationality}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="prose dark:prose-invert">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{t('details.biography')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {player.description || t('details.no_biography')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50 dark:border-gray-900">
                            <div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">{t('details.current_club')}</span>
                                <div className="flex items-center gap-2">
                                    <Shirt size={16} className="text-[#009A44]" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{player.club}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-2">{t('details.age')}</span>
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-[#009A44]" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{player.age} {t('details.years')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Sub-Registry Section */}
            <div className="bg-[#fafafa] dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 py-24 mt-20">
                <div className="max-w-3xl mx-auto px-8 text-center">
                    <div className="w-1.5 h-12 bg-[#009A44] mx-auto mb-8 rounded-full"></div>
                    <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight mb-6">
                        {t('details.member_national')}
                    </h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-loose">
                        {t('details.registry_verified')} #{player.id.toString().padStart(6, '0')} <br />
                        ADDIS ABABA • ETHIOPIA
                    </p>
                </div>
            </div>
        </div>
    );
}
