import { useEffect, useState } from "react";
import { PlayerService } from "../../api/playerService";
import Loader from "../../components/common/Loader";
import PlayerForm from "./PlayerForm";

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

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await PlayerService.delete(id);
      fetchPlayers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Players Management</h2>

      <PlayerForm
        player={editingPlayer}
        onSuccess={() => {
          setEditingPlayer(null);
          fetchPlayers();
        }}
      />

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th>Club</th>
            <th>Position</th>
            <th>Age</th>
            <th>Nationality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-b">
              <td className="p-2">{player.fullName}</td>
              <td>{player.club}</td>
              <td>{player.position}</td>
              <td>{player.age}</td>
              <td>{player.nationality}</td>
              <td className="space-x-2 p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingPlayer(player)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(player.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
