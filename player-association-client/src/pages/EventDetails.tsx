import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EventService } from "../api/eventService";
import Loader from "../components/common/Loader";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";

interface Event {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    eventDate: string;
    location: string;
}

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
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
    if (!event) return <div className="text-center py-24 text-gray-500">Event not found.</div>;

    const dateObj = new Date(event.eventDate);
    const month = dateObj.toLocaleString("default", { month: "long" });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString("default", { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 font-sans transition-colors duration-500 pb-20">

            {/* 1. Hero Image */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                    src={event.imagePath}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-20"></div>

                <div className="absolute top-6 left-6 z-30">
                    <Link to="/events" className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors uppercase text-xs font-bold tracking-widest">
                        <ArrowLeft size={14} className="mr-2" /> All Events
                    </Link>
                </div>
            </div>

            {/* 2. Content Card */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-30">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-t-8 border-[#FEDD00] overflow-hidden">

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                            {/* Date Badge */}
                            <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center min-w-[100px]">
                                <span className="block text-red-600 font-black text-xl uppercase">{month}</span>
                                <span className="block text-gray-900 dark:text-white font-black text-5xl leading-none my-1">{day}</span>
                                <span className="block text-gray-500 dark:text-gray-400 font-bold">{year}</span>
                            </div>

                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase leading-tight mb-4">
                                    {event.title}
                                </h1>

                                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-[#009A44]" /> {time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-[#009A44]" /> {event.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-8"></div>

                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            <p>{event.description}</p>
                        </div>

                        <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900 flex items-center justify-between">
                            <div>
                                <span className="block text-[#009A44] font-black uppercase tracking-widest text-xs mb-1">Status</span>
                                <span className="text-gray-900 dark:text-white font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#009A44] rounded-full animate-pulse"></span> Registration Open
                                </span>
                            </div>
                            {/* <button className="px-6 py-3 bg-[#009A44] text-white font-bold uppercase rounded hover:bg-[#007A30] transition-colors shadow-lg shadow-green-900/20">
                                Join Event
                            </button> */}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
