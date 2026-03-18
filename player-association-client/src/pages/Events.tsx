import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventService } from "../api/eventService";
import EventCard from "../components/events/EventCard";
import Loader from "../components/common/Loader";
import { PageHero, EmptyState } from "./Players";

interface Event {
  id: number; title: string; description: string;
  imagePath?: string; imagePaths?: string[];
  eventDate: string; location: string;
}

export default function Events() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await EventService.getAll();
        setEvents(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0D0D0D] transition-colors duration-500">
      <PageHero badge={t("events_page.header_badge")} title1={t("events_page.header_title_1")} title2={t("events_page.header_title_2")} />
      <div className="max-w-7xl mx-auto px-8 py-16 pb-24">
        {events.length === 0 ? (
          <EmptyState label={t("events_page.empty")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e) => <EventCard key={e.id} {...e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
