// components/slides-viewer.tsx
"use client"

import { useSlides } from "@/hooks/use-slides";
import { useFirestoreSlides } from "@/hooks/use-firestore-slides";
import { SlideItem } from "./SlideItem";
import { useEffect } from "react";

interface SlidesViewerProps {
  eventId?: string;
  isLeader?: boolean;
}

export function SlidesViewer({ eventId = 'default', isLeader = false }: SlidesViewerProps) {
  const { slides, isLoading: slidesLoading, error } = useFirestoreSlides();
  const { currentSlide, totalSlides, setTotal, isLoading: syncLoading } = useSlides(eventId, isLeader);

  useEffect(() => {
    // Sincronizar el total de slides con Realtime Database
    if (slides.length > 0 && totalSlides !== slides.length) {
      setTotal(slides.length);
    }
  }, [slides.length, totalSlides, setTotal]);

  if (slidesLoading || syncLoading) {
    return (
      <div className="w-full h-full max-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Cargando presentación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Error al cargar la presentación por favor refresca la página</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-gray-400 mb-2">La presentación aun no esta disponible</p>
          <p className="text-sm text-gray-500">Pronto tendras novedades</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full h-full relative bg-black">
      {/* Slide actual */}
      {currentSlideData && (
        <SlideItem slide={currentSlideData} />
      )}

      {/* Indicador de slide */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white border border-cyan-400/30">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-cyan-400">
            {currentSlide + 1} / {totalSlides}
          </span>
          {currentSlideData && isLeader && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              • {currentSlideData.fileName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}