import { useEffect, useState } from "react";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";

import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";

// TypeScript types for clarity
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

interface Event {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

interface Insight {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersRes, eventsRes, insightsRes] = await Promise.all([
        PlayerService.getAll(),
        EventService.getAll(),
        InsightService.getAll(),
      ]);

      setPlayers(playersRes.data.slice(0, 4)); // featured players
      setEvents(eventsRes.data.slice(0, 3)); // upcoming events
      setInsights(insightsRes.data.slice(0, 3)); // latest insights
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-12">
      {/* Introduction */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Player Association</h1>
        <p className="text-lg text-gray-700">
          Discover players, upcoming events, and insights from the world of sports.
        </p>
      </section>

      {/* Featured Players */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              fullName={player.fullName}
              age={player.age}
              club={player.club}
              position={player.position}
              nationality={player.nationality}
              description={player.description}
              imagePath={player.imagePath}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              imagePath={event.imagePath}
              eventDate={event.eventDate}
              location={event.location}
            />
          ))}
        </div>
      </section>

      {/* Latest Insights */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              id={insight.id}
              title={insight.title}
              description={insight.description}
              content={insight.content}
              author={insight.author}
              category={insight.category}
              imagePath={insight.imagePath}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
