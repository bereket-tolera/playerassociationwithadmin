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

  return (
    <>
      <div
        className="border rounded shadow p-4 cursor-pointer hover:shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={imagePath}
          alt={title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600">{new Date(eventDate).toLocaleDateString()} - {location}</p>
      </div>

      {isOpen && (
        <EventDetails
          id={id}
          title={title}
          description={description}
          imagePath={imagePath}
          eventDate={eventDate}
          location={location}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
