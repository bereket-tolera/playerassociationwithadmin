// --- Icon ---
const SoccerBallIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.68 15.67c-.24-.72-.45-1.47-.62-2.24l-3.32 1.39c1.03 1.54 2.47 2.76 4.14 3.49-.07-.88-.13-1.76-.2-2.64zm7.36-2.64c-.17.77-.38 1.52-.62 2.24-.07.88-.13 1.76-.2 2.64 1.67-.73 3.11-1.95 4.14-3.49l-3.32-1.39zM12 4.04c.83 1.5 1.48 3.12 1.88 4.81l3.52-1.12c-.93-1.52-2.13-2.83-3.56-3.83-.61.05-1.23.1-1.84.14zM5.56 5.56c1.03 1.54 2.47 2.76 4.14 3.49.4-.33.82-.64 1.25-.93-.68-1.46-1.53-2.79-2.52-3.95L5.56 5.56zm-1.39 3.32l3.32 1.39c.32.13.63.28.94.43-.37 1.48-.56 3.02-.56 4.6 0 .42.01.83.04 1.24-.31.15-.62.3-.94.43l-3.32 1.39C3.21 16.85 2.5 14.5 2.5 12s.71-4.85 1.67-6.44zm11.51 1.82l3.32-1.39c.96 1.59 1.67 3.94 1.67 6.44s-.71 4.85-1.67 6.44l-3.32-1.39c-.32-.13-.63-.28-.94-.43.03-.41.04-.82.04-1.24 0-1.58-.19-3.12-.56-4.6.31-.15.62-.3.94-.43z" />
  </svg>
);

export default function Loader() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 min-h-[300px]">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring: Rotating Flag Gradient */}
        <div className="h-20 w-20 rounded-full border-[5px] border-t-[#009A44] border-r-[#FEDD00] border-b-[#FF0000] border-l-transparent animate-spin shadow-lg"></div>
        
        {/* Inner Ring: Reverse Spin (Subtle) */}
        <div className="absolute h-14 w-14 rounded-full border-2 border-dashed border-gray-300 animate-spin-slow-reverse opacity-50"></div>
        
        {/* Center Icon */}
        <div className="absolute text-gray-400 animate-pulse">
           <SoccerBallIcon className="h-8 w-8" />
        </div>
      </div>
      
      {/* Text Label */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-sm font-extrabold text-gray-700 tracking-widest uppercase">
          Loading Data
        </p>
        <p className="text-xs font-bold text-[#009A44]">
          እባክዎ ይጠብቁ...
        </p>
      </div>
    </div>
  );
}