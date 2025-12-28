import { useEffect, useState } from "react";
import { PlayerService } from "../api/playerService";
import { EventService } from "../api/eventService";
import { InsightService } from "../api/insightService";
import PlayerCard from "../components/players/PlayerCard";
import EventCard from "../components/events/EventCard";
import InsightCard from "../components/insights/InsightCard";
import Loader from "../components/common/Loader";
import { Link } from "react-router-dom";

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
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersRes, eventsRes, insightsRes] = await Promise.all([
        PlayerService.getAll(),
        EventService.getAll(),
        InsightService.getAll(),
      ]);

      setPlayers(playersRes.data.slice(0, 4));
      setEvents(eventsRes.data.slice(0, 3));
      setInsights(insightsRes.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Check if user is logged in (only for login button visibility)
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAdmin(false);
    window.location.href = '/';
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* Header with Login/Logout */}
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Player Association</h1>
            <p className="text-sm text-gray-300">Sports Hub</p>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/players" className="hover:text-blue-300">Players</Link>
            <Link to="/events" className="hover:text-blue-300">Events</Link>
            <Link to="/insights" className="hover:text-blue-300">Insights</Link>
            
            {isAdmin ? (
              <>
                <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Welcome to Player Association
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover talented players, exciting events, and expert insights from the world of sports.
            Your ultimate destination for everything football.
          </p>
        </section>

        {/* Featured Players */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Featured Players</h2>
            <Link to="/players" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Players →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Events →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Latest Insights</h2>
            <Link to="/insights" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Insights →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Join Our Community</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest player news, events, and expert analysis.
            Never miss an important update from the world of sports.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/players" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Explore Players
            </Link>
            {!isAdmin && (
              <Link 
                to="/login" 
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 font-medium"
              >
                Admin Access
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© {new Date().getFullYear()} Player Association. All rights reserved.</p>
          <p className="text-gray-400">Sports Hub • Player Profiles • Event Management • Expert Insights</p>
        </div>
      </footer>
    </div>
  );
}