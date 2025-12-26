interface InsightDetailsProps {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imagePath: string;
  onClose: () => void;
}

export default function InsightDetails({
  title,
  description,
  content,
  author,
  category,
  imagePath,
  onClose,
}: InsightDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-500 font-bold"
          onClick={onClose}
        >
          X
        </button>
        <img src={imagePath} alt={title} className="w-full h-64 object-cover rounded mb-4"/>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Author:</strong> {author}</p>
        <p className="mt-2">{description}</p>
        <p className="mt-2">{content}</p>
      </div>
    </div>
  );
}
