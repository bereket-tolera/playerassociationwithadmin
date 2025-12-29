import { useState } from "react";
import InsightDetails from "./InsightDetails";

// --- Icons ---
const UserIcon = () => (
  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const ArrowIcon = () => (
  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
);

interface InsightCardProps {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  category: any;
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

  // Helper to handle image URLs robustness
  const getImageUrl = () => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=EFF+News";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Helper for Category Display
  const categoryName = typeof category === 'string' ? category : `Category ${category}`;
  
  // Helper for colors based on category (Simple hashing concept)
  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('health')) return 'bg-red-500';
    if (c.includes('develop')) return 'bg-[#009A44]';
    if (c.includes('transfer')) return 'bg-[#FEDD00] text-black';
    return 'bg-gray-800';
  };

  return (
    <>
      <div
        className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-full"
        onClick={() => setIsOpen(true)}
      >
        {/* 1. Image Area */}
        <div className="relative h-52 overflow-hidden bg-gray-200">
          <img
            src={getImageUrl()}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x400?text=EFF+Insight"; }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          
          {/* Category Badge */}
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${getCategoryColor(categoryName)}`}>
            {categoryName}
          </span>
        </div>

        {/* 2. Content Body */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center text-xs text-gray-500 mb-3 font-medium">
             <UserIcon />
             <span className="uppercase tracking-wide">{author || "EFF Editorial"}</span>
          </div>

          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#009A44] transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Footer / Read More */}
          <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Read Article</span>
            <button className="text-sm font-bold text-[#009A44] flex items-center">
              Read More <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Modal */}
      {isOpen && (
        <InsightDetails
          id={id}
          title={title}
          description={description}
          content={content}
          author={author}
          category={categoryName}
          imagePath={getImageUrl()} // Pass the processed URL
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}