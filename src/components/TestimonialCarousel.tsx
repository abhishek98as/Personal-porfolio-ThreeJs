import { useState, useEffect, useRef } from 'react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from '../data/testimonialsData';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  itemsPerView?: number;
}

export default function TestimonialCarousel({ 
  testimonials, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showControls = true,
  itemsPerView = 3 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const carouselRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isDragging, maxIndex, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch/Mouse drag functionality
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = useState<number | null>(null);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragCurrent(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStart !== null) {
      setDragCurrent(clientX);
    }
  };

  const handleDragEnd = () => {
    if (dragStart !== null && dragCurrent !== null) {
      const diff = dragStart - dragCurrent;
      const threshold = 50;

      if (diff > threshold) {
        goToNext();
      } else if (diff < -threshold) {
        goToPrevious();
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  // Responsive items per view
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setResponsiveItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setResponsiveItemsPerView(2);
      } else {
        setResponsiveItemsPerView(itemsPerView);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  return (
    <div className="relative">
      {/* Main carousel */}
      <div 
        ref={carouselRef}
        className="overflow-hidden rounded-2xl"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / responsiveItemsPerView}%` }}
            >
              <TestimonialCard 
                testimonial={testimonial}
                isActive={
                  index >= currentIndex && 
                  index < currentIndex + responsiveItemsPerView
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <div className="flex items-center justify-between mt-6">
          {/* Previous/Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Previous testimonial"
            >
              <svg className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Next testimonial"
            >
              <svg className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-cyan-400 w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause button */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
              title={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {isPlaying && (
        <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-100"
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`
            }}
          />
        </div>
      )}

      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl border-2 border-cyan-400/30 pointer-events-none" />
      )}
    </div>
  );
}