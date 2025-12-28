import { useState } from "react";
import EventDetails from "./EventDetails";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  eventDate: string;
  location: string;
}

export default function EventCard({
  id,
  title,
  description,
  imagePath,
  eventDate,
  location,
}: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getImageUrl = () => {
    if (!imagePath) return "/default-event.jpg";
    
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    if (imagePath.startsWith("/")) {
      return `http://localhost:5121${imagePath}`;
    }
    
    return imagePath;
  };

  return (
    <>
      <div
        className="border rounded shadow p-4 cursor-pointer hover:shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={getImageUrl()}
          alt={title}
          className="w-full h-48 object-cover rounded mb-4"
          onError={(e) => {
            e.currentTarget.src = "/default-event.jpg";
          }}
        />
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600">
          {new Date(eventDate).toLocaleDateString()} - {location}
        </p>
      </div>

      {isOpen && (
        <EventDetails
          id={id}
          title={title}
          description={description}
          imagePath={getImageUrl()}
          eventDate={eventDate}
          location={location}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}