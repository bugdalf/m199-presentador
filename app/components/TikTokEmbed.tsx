'use client';

import { useEffect } from 'react';

interface TikTokEmbedProps {
  url: string;
  className?: string;
}

export default function TikTokEmbed({ url, className = '' }: TikTokEmbedProps) {
  useEffect(() => {
    // Verificar si el script ya existe
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Si el script ya existe, forzar re-render del embed
      if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render();
      }
    }
  }, [url]);

  // Extraer username y videoId de la URL
  const extractTikTokData = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const username = pathParts[1]?.replace('@', '');
      const videoId = pathParts[3];

      return { username, videoId };
    } catch (error) {
      console.error('Error parsing TikTok URL:', error);
      return { username: '', videoId: '' };
    }
  };

  const { username, videoId } = extractTikTokData(url);

  if (!username || !videoId) {
    return <div className="text-red-500">URL de TikTok inválida</div>;
  }

  // Limpiar la URL de parámetros query
  const cleanUrl = `https://www.tiktok.com/@${username}/video/${videoId}`;

  return (
    <>
      <div className={`tiktok-container ${className}`}>
        <blockquote
          className="tiktok-embed rounded-lg"
          cite={cleanUrl}
          data-video-id={videoId}
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.tiktok.com/@${username}?refer=embed`}
            >
              @{username}
            </a>
          </section>
        </blockquote>
      </div>

      <style jsx>{`
        .tiktok-container {
          width: fit-content;
          overflow: hidden;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

// Tipos para TypeScript (opcional, agregar al archivo)
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: () => void;
      };
    };
  }
}