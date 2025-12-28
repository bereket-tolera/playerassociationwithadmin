import { useEffect, useState } from "react";
import { PlayerService } from "../../api/playerService";
import PlayerForm from "./PlayerForm";

interface Player {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath?: string;
}

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await PlayerService.getAll();
      console.log("Players fetched:", res.data);
      setPlayers(res.data);
    } catch (err) {
      console.error("Failed to fetch players:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await PlayerService.delete(id);
      fetchPlayers();
    } catch (err) {
      console.error("Failed to delete player:", err);
    }
  };

  const toggleDescription = (id: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDescriptions(newExpanded);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      return "https://via.placeholder.com/50x50?text=No+Image";
    }
    
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:5121${imagePath}`;
    }
    
    if (!imagePath.includes("://")) {
      return `http://localhost:5121/uploads/${imagePath}`;
    }
    
    return imagePath;
  };

  const truncateText = (text: string, length: number = 40) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  if (loading) return <div className="p-6">Loading players...</div>;

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

      <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nationality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No players found. Add your first player!
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover border"
                          src={getImageUrl(player.imagePath)}
                          alt={player.fullName}
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/50x50?text=No+Img";
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {player.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.club}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.nationality}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      className="text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => toggleDescription(player.id)}
                      title={expandedDescriptions.has(player.id) ? "Click to show less" : "Click to show more"}
                    >
                      {expandedDescriptions.has(player.id) ? (
                        <div>
                          {player.description}
                          <span className="text-blue-500 text-xs ml-2">[show less]</span>
                        </div>
                      ) : (
                        <div>
                          {truncateText(player.description)}
                          {player.description.length > 40 && (
                            <span className="text-blue-500 text-xs ml-2">[show more]</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => setEditingPlayer(player)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => handleDelete(player.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition"
                      onClick={() => {
                        console.log("View player:", player);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p className="text-sm text-blue-700">
          Showing {players.length} player{players.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}