export default function VideoM199() {
// URL optimizada
  const videoUrl = `https://res.cloudinary.com/df0zafgos/video/upload/q_auto,f_auto/video-presentacion_wnatyl.mp4`;
  
  // Poster (thumbnail)
  const posterUrl = `https://res.cloudinary.com/df0zafgos/video/upload/so_2.0,q_auto,f_auto/video-presentacion_wnatyl.jpg`;
  return (
    <div className='w-full flex justify-center p-3 m-0'>
      <video
        className="rounded-lg"
        width="400px"
        height="auto"
        controls
        preload="metadata"
        poster={posterUrl}
        autoPlay
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Tu navegador no soporta el tag de video.
      </video>

    </div>
  );
}