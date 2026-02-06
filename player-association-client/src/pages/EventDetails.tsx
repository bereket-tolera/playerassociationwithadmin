import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EventService } from "../api/eventService";
import Loader from "../components/common/Loader";
import ImageSlider from "../components/ImageSlider";
import { getImageUrl, getImageUrls } from "../utils/imageUtils";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";

interface Event {
    id: number;
    title: string;
    description: string;
    imagePath?: string;
    imagePaths?: string[];
    eventDate: string;
    location: string;
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const { data } = await EventService.getById(Number(id));
                setEvent(data);
            } catch (error) {
                console.error("Failed to load event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <Loader />;
    if (!event) return <div className="text-center py-24 text-gray-500">{t('common.not_found')}</div>;

    const dateObj = new Date(event.eventDate);
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString(i18n.language === 'am' ? 'am-ET' : 'en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-500">

            {/* 1. Header Navigation */}
            <div className="max-w-7xl mx-auto px-8 pt-10 pb-6">
                <Link to="/events" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#009A44] transition-colors group">
                    <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> {t('details.back_to_events')}
                </Link>
            </div>

            {/* 2. Main Content Grid */}
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">

                {/* Media Side */}
                <div className="space-y-8">
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        {event.imagePaths && event.imagePaths.length > 0 ? (
                            <ImageSlider
                                images={getImageUrls(event.imagePaths)}
                                alt={event.title}
                                className="h-full"
                            />
                        ) : (
                            <img
                                src={getImageUrl(event.imagePaths || event.imagePath)}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Info Side */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Official Schedule
                        </div>
                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{event.id}</div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tight leading-none mb-8">
                        {event.title.split(' ').slice(0, -1).join(' ')} <span className="font-bold">{event.title.split(' ').slice(-1)}</span>
                    </h1>

                    {/* Quick Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-gray-50 dark:border-gray-900 mb-12">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Occurrence</span>
                            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar size={14} className="text-[#009A44]" />
                                {dateObj.toLocaleString('en-US', { month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Timing</span>
                            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock size={14} className="text-[#009A44]" />
                                {time}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Venue</span>
                            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin size={14} className="text-[#009A44]" />
                                {event.location}
                            </div>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Event Intelligence</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="mt-12 p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-[#009A44] rounded-full animate-pulse"></div>
                            <div>
                                <h4 className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider">Active Status</h4>
                                <p className="text-[10px] font-medium text-gray-400 tracking-wide mt-1">This event is currently live in the system registry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Foot Detail */}
            <div className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-50 dark:border-gray-900 mt-20">
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em] text-center">
                    EPA GLOBAL INFRASTRUCTURE • ADDIS ABABA
                </p>
            </div>
        </div>
    );
}

const CalendarIcon = () => (
    <div className="inline-flex p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 ml-2 shadow-sm">
        <Calendar size={18} />
    </div>
);
