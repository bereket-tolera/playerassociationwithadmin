interface PlayerModalProps {
  id: number;
  fullName: string;
  age: number;
  club: string;
  position: string;
  nationality: string;
  description: string;
  imagePath: string;
  onClose: () => void;
}

export default function PlayerModal({
  fullName,
  age,
  club,
  position,
  nationality,
  description,
  imagePath,
  onClose,
}: PlayerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 font-bold"
          onClick={onClose}
        >
          X
        </button>
        <img src={imagePath} alt={fullName} className="w-full h-64 object-cover rounded mb-4"/>
        <h2 className="text-2xl font-bold mb-2">{fullName}</h2>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Club:</strong> {club}</p>
        <p><strong>Position:</strong> {position}</p>
        <p><strong>Nationality:</strong> {nationality}</p>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  );
}
