interface EventDetailsProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
  onClose: () => void;
}

export default function EventDetails({
  title,
  description,
  imagePath,
  eventDate,
  location,
  onClose,
}: EventDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 font-bold"
          onClick={onClose}
        >
          X
        </button>
        <img src={imagePath} alt={title} className="w-full h-64 object-cover rounded mb-4"/>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p><strong>Date:</strong> {new Date(eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {location}</p>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  );
}
