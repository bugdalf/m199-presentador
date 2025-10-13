// components/slides-controls.tsx
"use client"

import { useSlides } from "@/hooks/use-slides";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

interface SlidesControlsProps {
  eventId?: string;
}

export function SlidesControls({ eventId = 'default' }: SlidesControlsProps) {
  const { 
    currentSlide, 
    totalSlides, 
    nextSlide, 
    prevSlide, 
    resetSlides,
    goToSlide 
  } = useSlides(eventId);

  // Manejo de teclas de flecha
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Home') resetSlides();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, resetSlides]);

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={resetSlides}
        variant="outline"
        size="sm"
        title="Reiniciar (Home)"
      >
        <RotateCcwIcon className="w-4 h-4" />
      </Button>
      
      <Button 
        onClick={prevSlide}
        disabled={currentSlide === 0}
        variant="outline"
        size="sm"
        title="Anterior (←)"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </Button>

      <div className="px-3 py-1 bg-cyan-950 text-cyan-400 rounded text-sm font-mono">
        {currentSlide + 1} / {totalSlides}
      </div>

      <Button 
        onClick={nextSlide}
        disabled={currentSlide >= totalSlides - 1}
        variant="outline"
        size="sm"
        title="Siguiente (→)"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </Button>

      {/* Mini navegador */}
      <div className="flex gap-1 ml-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-cyan-400' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
