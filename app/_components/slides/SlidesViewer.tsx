// components/slides-viewer.tsx
"use client"

import { useFirestoreSlides } from "@/hooks/use-firestore-slides";
import { SlideItem } from "./SlideItem";
import { useEffect } from "react";
import { useSlides } from "@/hooks/use-slides";

interface SlidesViewerProps {
  eventId?: string;
}

export function SlidesViewer({ eventId = 'default' }: SlidesViewerProps) {
  const { slides, isLoading: slidesLoading, error } = useFirestoreSlides();
  const { currentSlide, totalSlides, setTotal, isLoading: syncLoading } = useSlides(eventId);

  useEffect(() => {
    // Sincronizar el total de slides con Realtime Database
    if (slides.length > 0 && totalSlides !== slides.length) {
      setTotal(slides.length);
    }
  }, [slides.length, totalSlides, setTotal]);

  if (slidesLoading || syncLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Cargando slides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Error al cargar los slides</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-gray-400 mb-2">No hay slides disponibles</p>
          <p className="text-sm text-gray-500">Agrega slides desde el panel de administración</p>
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
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white border border-cyan-400/30">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-cyan-400">
            {currentSlide + 1} / {totalSlides}
          </span>
          {currentSlideData && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              • {currentSlideData.fileName}
            </span>
          )}
        </div>
      </div>

      {/* Indicador de carga previo (precarga siguiente slide) */}
      {slides[currentSlide + 1] && (
        <link rel="preload" as="image" href={slides[currentSlide + 1].url} />
      )}
    </div>
  );
}