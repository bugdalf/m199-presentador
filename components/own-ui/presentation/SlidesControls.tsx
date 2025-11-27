"use client"

import { useSlides } from "@/hooks/use-slides";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

interface SlidesControlsProps {
  eventId?: string;
  isLeader?: boolean;
}

export function SlidesControls({ eventId = 'default', isLeader = false }: SlidesControlsProps) {
  const {
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    resetSlides,
    goToSlide
  } = useSlides(eventId, isLeader);

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
        size="lg"
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
        size="lg"
        title="Siguiente (→)"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
