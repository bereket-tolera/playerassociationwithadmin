import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EventService } from "../api/eventService";
import Loader from "../components/common/Loader";
import ImageSlider from "../components/ImageSlider";
import { getImageUrl, getImageUrls } from "../utils/imageUtils";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";

interface Event {
  id: number; title: string; description: string;
  imagePath?: string; imagePaths?: string[];
  eventDate: string; location: string;
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await EventService.getById(Number(id));
        setEvent(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!event) return <div className="text-center py-24 text-gray-500">{t("common.not_found")}</div>;

  const dateObj = new Date(event.eventDate);
  const time = dateObj.toLocaleTimeString(i18n.language === "am" ? "am-ET" : "en-US", { hour: "2-digit", minute: "2-digit" });
  const fullDate = dateObj.toLocaleDateString(i18n.language === "am" ? "am-ET" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-4">
        <Link to="/events" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-colors group">
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          {t("details.back_to_events")}
        </Link>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Media */}
        <div className="relative">
          <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10">
            {event.imagePaths && event.imagePaths.length > 0 ? (
              <ImageSlider images={getImageUrls(event.imagePaths)} alt={event.title} className="h-full" />
            ) : (
              <img src={getImageUrl(event.imagePaths || event.imagePath)} alt={event.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-[#C9A84C]/30 rounded-tr-3xl" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-[#C9A84C]/30 rounded-bl-3xl" />
        </div>

        {/* Info */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded-full">
              {t("details.official_schedule")}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{event.id}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h1>
          <div className="w-12 h-px bg-[#C9A84C] mb-10" />

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: <Calendar size={14} className="text-[#C9A84C]" />, label: t("details.occurrence"), value: fullDate },
              { icon: <Clock size={14} className="text-[#009A44]" />, label: t("details.timing"), value: time },
              { icon: <MapPin size={14} className="text-[#CC0000]" />, label: t("details.venue"), value: event.location },
            ].map(({ icon, label, value }) => (
              <div key={label} className="p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#C9A84C]/10 rounded-2xl shadow-sm dark:shadow-none">
                <div className="mb-2">{icon}</div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">{t("details.event_intelligence")}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-sm">{event.description}</p>
          </div>

          {/* Status */}
          <div className="p-5 bg-[#009A44]/5 border border-[#009A44]/20 rounded-2xl flex items-center gap-4">            <div className="w-2.5 h-2.5 bg-[#009A44] rounded-full animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("details.active_status")}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{t("details.event_live_msg")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 dark:bg-[#0D0D0D] mt-20 py-12">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 text-center">{t("details.global_infrastructure")}</p>
      </div>
    </div>
  );
}
