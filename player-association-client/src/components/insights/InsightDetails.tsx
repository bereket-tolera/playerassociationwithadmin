import { useEffect } from "react";

// --- Icons ---
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4 mr-2 text-[#009A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const TagIcon = () => (
  <svg className="w-4 h-4 mr-2 text-[#FEDD00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
);

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

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* 1. Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]">

        {/* --- Header Image --- */}
        <div className="relative h-64 sm:h-80 flex-shrink-0">
          <img
            src={imagePath}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=EFF+Article"; }}
          />

          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full p-2 backdrop-blur-md transition-all hover:rotate-90 focus:outline-none"
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          {/* Title Area */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
            <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-black tracking-widest text-white uppercase bg-[#009A44] rounded shadow-lg">
              {category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight shadow-black drop-shadow-md">
              {title}
            </h2>
          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="flex-1 overflow-y-auto bg-white relative">

          {/* Flag Stripe Decoration */}
          <div className="absolute top-0 left-0 w-full h-1.5 flex">
            <div className="flex-1 bg-[#009A44]"></div>
            <div className="flex-1 bg-[#FEDD00]"></div>
            <div className="flex-1 bg-[#FF0000]"></div>
          </div>

          <div className="p-6 sm:p-10">

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <div className="flex items-center">
                <UserIcon />
                <span className="text-xs font-bold uppercase tracking-wide">By <span className="text-gray-900">{author}</span></span>
              </div>
              <div className="flex items-center">
                <TagIcon />
                <span className="text-xs font-bold uppercase tracking-wide">Official Editorial</span>
              </div>
            </div>

            {/* Lead Paragraph */}
            <div className="text-lg font-medium text-gray-800 leading-relaxed mb-8 italic border-l-4 border-[#FEDD00] pl-4">
              {description}
            </div>

            {/* Main Text */}
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 leading-8 whitespace-pre-wrap">
              {content}
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="h-8 w-8 text-[#009A44] opacity-30 mb-2">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                Ethiopian Football Federation
              </p>
            </div>

          </div>
        </div>

        {/* --- Footer Action --- */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-[#009A44] transition-colors shadow-lg text-xs uppercase tracking-wide"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
}