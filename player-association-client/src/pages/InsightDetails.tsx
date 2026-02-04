import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { InsightService } from "../api/insightService";
import Loader from "../components/common/Loader";
import ImageSlider from "../components/ImageSlider";
import { getImageUrl, getImageUrls } from "../utils/imageUtils";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface Insight {
    id: number;
    title: string;
    description: string;
    content: string;
    author: string;
    category: string;
    imagePath?: string;
    imagePaths?: string[];
    createdAt?: string; // Assuming API returns createdAt or similar
}

export default function InsightDetails() {
    const { id } = useParams<{ id: string }>();
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
    if (!insight) return <div className="text-center py-24 text-gray-500">Article not found.</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors duration-500">

            {/* 1. Hero Header with Image Gallery */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-900">
                {/* Image Layer - z-0 */}
                <div className="absolute inset-0 z-0">
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
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>

                {/* Gradient Overlays - z-10 */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 pointer-events-none"></div>

                <div className="absolute top-6 left-6 z-30">
                    <Link to="/insights" className="inline-flex items-center text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors bg-black/20 backdrop-blur px-4 py-2 rounded-full">
                        <ArrowLeft size={14} className="mr-2" /> Back to Insights
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-30 max-w-5xl mx-auto">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded mb-4 inline-block">
                        {insight.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-oswald mb-6 text-shadow-xl">
                        {insight.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-[#FEDD00]" />
                            By <span className="text-white underline decoration-[#FEDD00] underline-offset-4">{insight.author}</span>
                        </div>
                        {/* If we had date */}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#FEDD00]" />
                            <span>Latest Update</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Article Content */}
            <article className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-10 border-l-4 border-[#009A44] pl-6 italic">
                    {insight.description}
                </p>

                <div className="prose dark:prose-invert prose-lg max-w-none prose-green">
                    {/* Rendering content - assuming plain text or basic HTML here. For rich text, might need dangerouslySetInnerHTML */}
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-8">
                        {insight.content}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex gap-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this:</span>
                        {/* Social placeholders */}
                        <div className="flex gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full cursor-pointer hover:opacity-80"></div>
                            <div className="w-6 h-6 bg-sky-500 rounded-full cursor-pointer hover:opacity-80"></div>
                        </div>
                    </div>
                </div>
            </article>

        </div>
    );
}
