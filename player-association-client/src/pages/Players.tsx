import { useEffect, useState } from "react";
import { PlayerService } from "../api/playerService";
import PlayerCard from "../components/players/PlayerCard";
import Loader from "../components/common/Loader";

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

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await PlayerService.getAll();
      setPlayers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard key={player.id} {...player} />
      ))}
    </div>
  );
}
