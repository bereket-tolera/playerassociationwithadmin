import { useState } from "react";
import PlayerModal from "./PlayerModal";

interface PlayerCardProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
}

export default function PlayerCard({
  id,
  fullName,
  age,
  club,
  position,
  nationality,
  description,
  imagePath,
}: PlayerCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="border rounded shadow p-4 cursor-pointer hover:shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={imagePath}
          alt={fullName}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="font-bold text-lg">{fullName}</h3>
        <p className="text-gray-600">{position} - {club}</p>
      </div>

      {isOpen && (
        <PlayerModal
          id={id}
          fullName={fullName}
          age={age}
          club={club}
          position={position}
          nationality={nationality}
          description={description}
          imagePath={imagePath}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
