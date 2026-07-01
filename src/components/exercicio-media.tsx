import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

function isProxyGifUrl(url: string) {
  return url.includes("/functions/v1/exercise-gif");
}

interface ExercicioMediaProps {
  url: string | null;
  alt: string;
  size?: "sm" | "lg";
}

export function ExercicioMedia({ url, alt, size = "sm" }: ExercicioMediaProps) {
  const [errored, setErrored] = useState(false);
  const [blobSrc, setBlobSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !isProxyGifUrl(url)) return;
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadProxyGif() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      if (!token || cancelled) return;
      try {
        const res = await fetch(url!, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok || cancelled) {
          if (!cancelled) setErrored(true);
          return;
        }
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobSrc(objectUrl);
      } catch {
        if (!cancelled) setErrored(true);
      }
    }

    void loadProxyGif();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

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

  if (isProxyGifUrl(url)) {
    if (!blobSrc) {
      return (
        <div
          className={`${dim} ${rounded} shrink-0 bg-muted/40 border border-border grid place-items-center`}
        >
          <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
        </div>
      );
    }
    return (
      <img
        src={blobSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
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
