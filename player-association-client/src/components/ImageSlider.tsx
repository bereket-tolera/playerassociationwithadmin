import { useState, useEffect } from 'react';

interface ImageSliderProps {
    images: string[];
    alt?: string;
    className?: string;
    autoSlide?: boolean;
    autoSlideInterval?: number; // in milliseconds
}

const ChevronLeft = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export default function ImageSlider({ images, alt = "Image", className = "", autoSlide = false, autoSlideInterval = 30000 }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (!autoSlide || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [autoSlide, autoSlideInterval, images.length]);

    if (!images || images.length === 0) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <>
            <div className={`relative group ${className}`}>
                {/* Main Image */}
                <div className="relative w-full h-full overflow-hidden bg-gray-900">
                    <img
                        src={images[currentIndex]}
                        alt={`${alt} ${currentIndex + 1}`}
                        className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setIsFullscreen(true)}
                    />

                    {/* Image Counter Badge */}
                    {images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 z-20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {currentIndex + 1}/{images.length}
                        </div>
                    )}

                    {/* Navigation Arrows - Always visible for detail pages */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-20"
                                aria-label="Previous image"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-20"
                                aria-label="Next image"
                            >
                                <ChevronRight />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Navigation */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${index === currentIndex
                                    ? 'border-[#009A44] ring-2 ring-[#009A44] ring-offset-2 scale-105'
                                    : 'border-gray-200 hover:border-[#FEDD00] opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
                        aria-label="Close fullscreen"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentIndex]}
                            alt={`${alt} ${currentIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />

                        {/* Fullscreen Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
                                >
                                    <ChevronRight />
                                </button>

                                {/* Fullscreen Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm font-bold px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {currentIndex + 1}/{images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
