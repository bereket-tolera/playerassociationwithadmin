export default function Loader() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Minimalist Spinner */}
        <div className="h-8 w-8 rounded-full border-2 border-gray-100 dark:border-gray-800 border-t-[#009A44] animate-spin"></div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] animate-pulse">
          Synchronizing
        </p>
      </div>
    </div>
  );
}