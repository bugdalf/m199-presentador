'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: (elements: NodeListOf<Element>) => void;
      };
    };
  }
}

interface TikTokEmbedProps {
  videoId: string;
  username: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

export default function TikTokEmbed({
  videoId,
  username,
  description = '',
  hashtags = [],
  className = ''
}: TikTokEmbedProps) {
  useEffect(() => {
    // Cargar el script de TikTok si no existe
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Si el script ya existe, forzar la re-renderización del embed
      if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render(document.querySelectorAll('.tiktok-embed'));
      }
    }
  }, [videoId]);

  return (
    <div className='w-full flex justify-center'>
      <div className={`w-fit h-fit rounded-[8px] overflow-hidden ${className}`}>
        <blockquote
          className="tiktok-embed"
          // cite={`https://www.tiktok.com/@${username}/video/${videoId}`}
          cite="https://www.tiktok.com/@evangelismo_sin_limites/video/7428183340903058731"

          // data-video-id={videoId}
          data-video-id="7419263094586740011"

          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a
              target="_blank"
              rel="noopener noreferrer"
              title={`@${username}`}
              href={`https://www.tiktok.com/@${username}?refer=embed`}
            >
              @{username}
            </a>
            {description && ` ${description}`}
            {hashtags.map((tag) => (
              <a
                key={tag}
                title={tag}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.tiktok.com/tag/${tag}?refer=embed`}
                className="ml-1"
              >
                #{tag}
              </a>
            ))}
          </section>
        </blockquote>
      </div>
    </div>
  );
}
