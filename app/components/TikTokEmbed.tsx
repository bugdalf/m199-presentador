'use client';

import { useEffect, useState } from 'react';

interface TikTokEmbedProps {
  url: string;
  className?: string;
}

interface TikTokMeta {
  cover: string;
  title: string;
  author: string;
}

export default function TikTokEmbed({ url, className = '' }: TikTokEmbedProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [meta, setMeta] = useState<TikTokMeta | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const videoId = url.split('/').at(-1)?.split('?')[0];

  // Detectar si es móvil
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Cargar script oficial solo en desktop
  useEffect(() => {
    if (!isMobile && typeof window !== 'undefined') {
      const existing = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        script.onload = () => setLoaded(true);
        script.onerror = () => setError(true);
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [isMobile]);

  // Obtener metadata del video para la vista móvil
  useEffect(() => {
    if (!videoId || !isMobile) return;

    const fetchMeta = async () => {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
        if (!res.ok) throw new Error('error');
        const data = await res.json();
        setMeta({
          cover: data.thumbnail_url,
          title: data.title,
          author: data.author_name,
        });
      } catch (e) {
        setError(true);
      }
    };
    fetchMeta();
  }, [url, videoId, isMobile]);

  // Vista móvil con miniatura
  if (isMobile) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 rounded-xl overflow-hidden shadow-md ${className}`}
      >
        {meta ? (
          <>
            <img
              src={meta.cover}
              alt={meta.title}
              className="w-full aspect-[9/16] object-cover"
            />
            <div className="p-3 text-center bg-white w-full">
              <p className="text-gray-800 text-sm line-clamp-2">{meta.title}</p>
              <p className="text-gray-500 text-xs mb-2">@{meta.author}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Ver en TikTok
              </a>
            </div>
          </>
        ) : (
          <div className="p-6 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-700 mb-3">¿Quieres ver nuestro video? visita nuestro tiktok</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Ver en TikTok
            </a>
          </div>
        )}
      </div>
    );
  }

  // Embed para desktop
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: '605px', minWidth: '325px', width: '100%' }}
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ver en TikTok
          </a>
        </section>
      </blockquote>

      {error && (
        <div className="p-6 bg-gray-100 rounded-lg text-center mt-4">
          <p className="text-gray-700 mb-3">No se pudo cargar el video.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Ver en TikTok
          </a>
        </div>
      )}

      {!loaded && !error && (
        <p className="text-gray-500 text-sm mt-2">Cargando video...</p>
      )}
    </div>
  );
}
