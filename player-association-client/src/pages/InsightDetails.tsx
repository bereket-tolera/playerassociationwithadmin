import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InsightService } from "../api/insightService";
import Loader from "../components/common/Loader";
import ImageSlider from "../components/ImageSlider";
import { getImageUrl, getImageUrls } from "../utils/imageUtils";
import { ArrowLeft, User, Calendar } from "lucide-react";

interface Insight {
    id: number;
    title: string;
    description: string;
    content: string;
    author: string;
    category: string;
    imagePath?: string;
    imagePaths?: string[];
    createdAt?: string;
}

export default function InsightDetails() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const { data } = await InsightService.getById(Number(id));
                setInsight(data);
            } catch (error) {
                console.error("Failed to load insight", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsight();
    }, [id]);

    if (loading) return <Loader />;
    if (!insight) return <div className="text-center py-24 text-gray-500">{t('common.not_found')}</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-500">

            {/* 1. Header Navigation */}
            <div className="max-w-4xl mx-auto px-8 pt-10 pb-6">
                <Link to="/insights" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#009A44] transition-colors group">
                    <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> {t('details.back_to_insights')}
                </Link>
            </div>

            {/* 2. Article Surface */}
            <article className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-12">
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
                        Editorial / {insight.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white tracking-tighter leading-[1.1] mb-8">
                        {insight.title}
                    </h1>

                    <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-900">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-red-500">
                                <User size={14} />
                            </div>
                            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{insight.author || "Press Team"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-400">
                                <Calendar size={14} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latest Communication</span>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mb-16">
                    {insight.imagePaths && insight.imagePaths.length > 0 ? (
                        <ImageSlider
                            images={getImageUrls(insight.imagePaths)}
                            alt={insight.title}
                            className="h-full"
                        />
                    ) : (
                        <img
                            src={getImageUrl(insight.imagePaths || insight.imagePath)}
                            alt={insight.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="max-w-2xl mx-auto">
                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-16 italic text-center">
                        "{insight.description}"
                    </p>

                    <div className="prose prose-lg dark:prose-white max-w-none">
                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-[1.8] font-medium">
                            {insight.content}
                        </div>
                    </div>
                </div>
            </article>

            {/* Foot Detail */}
            <div className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-50 dark:border-gray-900 mt-20">
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em] text-center">
                    OFFICIAL PRESS CHANNEL • EPA
                </p>
            </div>
        </div>
    );
}
