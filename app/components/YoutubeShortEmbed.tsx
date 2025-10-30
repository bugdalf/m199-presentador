
'use client';

import React from 'react';

interface YoutubeShortEmbedProps {
  url: string;
  className?: string;
}

export default function YoutubeShortEmbed({ url, className = '' }: YoutubeShortEmbedProps) {
  const getEmbedUrl = (url: string) => {
    try {
      // Ejemplo: https://www.youtube.com/shorts/abc123XYZ → abc123XYZ
      const shortIdMatch = url.match(/shorts\/([\w-]+)/);
      if (shortIdMatch) {
        return `https://www.youtube.com/embed/${shortIdMatch[1]}`;
      }

      // También aceptar enlaces normales de YouTube
      const normalIdMatch = url.match(/[?&]v=([\w-]+)/);
      if (normalIdMatch) {
        return `https://www.youtube.com/embed/${normalIdMatch[1]}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return
  }

  return (
    <div className={`w-sm h-[40rem] overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; mute; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
        className="w-full h-full rounded-xl overflow-hidden"
      ></iframe>
    </div>
  );
}
