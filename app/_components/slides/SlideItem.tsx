"use client"
import { Slide } from "@/hooks/use-firestore-slides";
import { useState } from "react";

interface SlideItemProps {
  slide: Slide;
}

// Función para extraer el videoId de una URL de YouTube
function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Para URLs del tipo: https://www.youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v');
    }

    // Para URLs del tipo: https://youtube.com/shorts/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/shorts/')) {
      // Extraer el ID después de /shorts/ y antes de cualquier parámetro
      const pathParts = urlObj.pathname.split('/');
      const videoId = pathParts[2]; // /shorts/VIDEO_ID
      return videoId || null;
    }

    // Para URLs del tipo: https://youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1).split('?')[0]; // Remover cualquier query param
    }
    
    return null;
  } catch (error) {
    console.error('Error al extraer videoId:', error);
    return null;
  }
}

export function SlideItem({ slide }: SlideItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extraer el videoId de la URL
  const videoId = slide.videoUrl ? extractYouTubeVideoId(slide.videoUrl) : null;

  if (imageError) {
    return (
      <div className="w-full h-full max-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Error al cargar la imagen</p>
          <p className="text-sm text-gray-400">{slide.fileName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-screen flex items-center justify-center bg-black relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      )}
      <img
        src={slide.url}
        alt={slide.fileName}
        className="w-full h-full max-h-screen object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
      {videoId && (
        <div className="absolute h-full w-5/12 top-0 right-0 ">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}