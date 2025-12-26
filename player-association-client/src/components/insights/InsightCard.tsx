import { useState } from "react";
import InsightDetails from "./InsightDetails";

interface InsightCardProps {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
}

export default function InsightCard({
  id,
  title,
  description,
  content,
  author,
  category,
  imagePath,
}: InsightCardProps) {
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
        <p className="text-gray-600">{category} - By {author}</p>
      </div>

      {isOpen && (
        <InsightDetails
          id={id}
          title={title}
          description={description}
          content={content}
          author={author}
          category={category}
          imagePath={imagePath}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
