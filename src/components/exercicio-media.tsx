import { useState } from "react";
import { ImageIcon } from "lucide-react";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

interface ExercicioMediaProps {
  url: string | null;
  alt: string;
  size?: "sm" | "lg";
}

export function ExercicioMedia({ url, alt, size = "sm" }: ExercicioMediaProps) {
  const [errored, setErrored] = useState(false);

  const dim = size === "sm" ? "h-16 w-16" : "w-full aspect-video";
  const rounded = size === "sm" ? "rounded-lg" : "rounded-xl";
  const base = `${dim} ${rounded} shrink-0 object-cover bg-muted/40`;

  if (!url || errored) {
    return (
      <div
        className={`${dim} ${rounded} shrink-0 bg-muted/40 border border-border grid place-items-center`}
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
      </div>
    );
  }

  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onError={() => setErrored(true)}
        className={base}
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={base}
    />
  );
}
