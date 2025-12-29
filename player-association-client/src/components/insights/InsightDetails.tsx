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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 1. Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. Article Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* --- Header Image --- */}
        <div className="relative h-72 sm:h-96 flex-shrink-0">
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=EFF+Article"; }}
          />
          
          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 backdrop-blur-md text-white rounded-full p-2 transition-all hover:rotate-90"
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          {/* Title Overlay (Bottom of Image) */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-white uppercase bg-[#009A44] rounded-full shadow-lg">
              {category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight shadow-sm">
              {title}
            </h2>
          </div>
        </div>

        {/* --- Content Body (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto bg-white relative">
          
          {/* Decorative Flag Stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 flex">
             <div className="flex-1 bg-[#009A44]"></div>
             <div className="flex-1 bg-[#FEDD00]"></div>
             <div className="flex-1 bg-[#FF0000]"></div>
          </div>

          <div className="p-6 sm:p-10">
            
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-100 text-sm text-gray-500 font-medium">
              <div className="flex items-center">
                <UserIcon />
                <span>By <span className="text-gray-900 font-bold">{author}</span></span>
              </div>
              <div className="flex items-center">
                <TagIcon />
                <span>EFF Editorial</span>
              </div>
              <div className="ml-auto text-xs text-gray-400 font-amharic">
                የፌዴሬሽን ዜና
              </div>
            </div>

            {/* Lead Paragraph (Description) */}
            <div className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed mb-8 italic border-l-4 border-[#FEDD00] pl-4">
              {description}
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-gray-600 leading-8 whitespace-pre-wrap">
              {content}
            </div>
            
            {/* Signature / Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-center">
               <div className="h-10 w-10 text-[#009A44] opacity-20 mb-2">
                 <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
               </div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                 Ethiopian Football Federation
               </p>
            </div>

          </div>
        </div>

        {/* --- Footer / Sticky Close --- */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-[#009A44] transition-colors shadow-md text-sm"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
}