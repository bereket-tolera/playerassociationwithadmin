import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    imagePath?: string;
}

// --- Player Image Component for Better Positioning ---
const PlayerHeroImage = ({ src, alt }: { src: string, alt: string }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleError = () => {
        // Use a better fallback image
        setImgSrc("https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80");
    };

    const handleLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-gray-900">
            <img
                src={imgSrc}
                alt={alt}
                className={`w-full h-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onError={handleError}
                onLoad={handleLoad}
            />

            {/* Loading skeleton */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"></div>
            )}
        </div>
    );
};

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

    // Helper function to get proper image URL
    const getImageUrl = (imagePaths?: string | string[]) => {
        if (!imagePaths) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

        const imagePath = Array.isArray(imagePaths) ? (imagePaths.length > 0 ? imagePaths[0] : null) : imagePaths;

        if (!imagePath) return "https://images.unsplash.com/photo-1614632537423-1e6c7d5e1b9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
        if (imagePath.startsWith("http")) return imagePath;

        return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/uploads/'}${imagePath}`;
    };

    if (loading) return <Loader />;
    if (!player) return <div className="text-center py-24 text-gray-500">{t('common.not_found')}</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500">

            {/* 1. Header / Hero - Image Gallery */}
            <div className="relative h-[55vh] min-h-[450px] w-full overflow-hidden bg-gray-900">
                {/* Player Image */}
                <div className="absolute inset-0 z-0">
                    <PlayerHeroImage
                        src={getImageUrl(player.imagePath)}
                        alt={player.fullName}
                    />
                </div>

                {/* Bottom gradient overlay - z-10 */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10 pointer-events-none"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/players" className="inline-flex items-center text-white/80 hover:text-white mb-6 uppercase tracking-widest text-xs font-bold transition-colors group">
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> {t('details.back_to_squad')}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="flex-grow">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic leading-none font-oswald text-shadow-lg mb-2">
                                {player.fullName}
                            </h1>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="px-4 py-1.5 bg-[#009A44] text-white text-sm font-bold uppercase tracking-wider rounded-full inline-block">
                                    {player.position}
                                </div>
                                <div className="text-white/80 text-sm font-medium">
                                    {player.club} • {player.nationality}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-40">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2">
                                <span className="flex items-center gap-3">
                                    {t('details.biography')}
                                    <span className="w-12 h-1 bg-[#009A44] rounded-full"></span>
                                </span>
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {player.description || t('details.no_biography')}
                                </p>
                            </div>
                        </div>

                        {/* Additional Stats Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6">{t('details.career_highlights')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-[#009A44]">{player.age}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('details.age')}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-[#009A44]">{player.position}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('details.position')}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-[#009A44]">{player.club.split(' ')[0]}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('details.current_club')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Sidebar Column */}
                    <div className="space-y-6">

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('details.player_details')}</h3>

                            <ul className="space-y-4">
                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><User size={18} /></div>
                                        {t('details.age')}
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{player.age} {t('details.years')}</span>
                                </li>

                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Shirt size={18} /></div>
                                        {t('details.current_club')}
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white truncate max-w-[150px]" title={player.club}>
                                        {player.club}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Globe size={18} /></div>
                                        {t('details.nationality')}
                                    </div>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{player.nationality}</span>
                                </li>

                                <li className="flex items-center justify-between pt-4">
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#009A44] to-[#007A30] rounded-2xl p-6 md:p-8 text-white shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <Users size={32} className="mb-3 text-[#FEDD00]" />
                                    <h3 className="text-xl font-black uppercase leading-tight mb-2">{t('details.member_epa')}</h3>
                                    <p className="text-white/80 text-sm mb-6">{t('details.member_desc')}</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-[#FEDD00] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Note */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 pt-8">
                    © {new Date().getFullYear()} {t('footer.tagline')} • {t('footer.rights')}
                </div>
            </div>

        </div>
    );
}
