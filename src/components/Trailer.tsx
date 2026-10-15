interface TrailerProps {
  youtubeId: string;
  title: string;
}

// Browsers only allow autoplay when the video is muted; the viewer can unmute in the player
export function Trailer({ youtubeId, title }: TrailerProps) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    rel: "0",
  });

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-fg/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`}
        title={`${title} trailer`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
