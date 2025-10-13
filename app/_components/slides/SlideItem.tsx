// components/slide-item.tsx
"use client"

import { Slide } from "@/hooks/use-firestore-slides";
import Image from "next/image";
import { useState } from "react";

interface SlideItemProps {
  slide: Slide;
}

export function SlideItem({ slide }: SlideItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (imageError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Error al cargar la imagen</p>
          <p className="text-sm text-gray-400">{slide.fileName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      )}
      <img
        src={slide.url}
        alt={slide.fileName}
        className="max-w-full max-h-full object-contain"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}