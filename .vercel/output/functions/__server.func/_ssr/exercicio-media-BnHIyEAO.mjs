import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./router-DSsXXfgN.mjs";
import { ag as Image } from "../_libs/lucide-react.mjs";
function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}
function isProxyGifUrl(url) {
  return url.includes("/functions/v1/exercise-gif");
}
function ExercicioMedia({ url, alt, size = "sm" }) {
  const [errored, setErrored] = reactExports.useState(false);
  const [blobSrc, setBlobSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!url || !isProxyGifUrl(url)) return;
    let cancelled = false;
    let objectUrl = null;
    async function loadProxyGif() {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      if (!token || cancelled) return;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `${dim} ${rounded} shrink-0 bg-muted/40 border border-border grid place-items-center`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-muted-foreground/50" })
      }
    );
  }
  if (isVideoUrl(url)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: url,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        preload: "metadata",
        onError: () => setErrored(true),
        className: base
      }
    );
  }
  if (isProxyGifUrl(url)) {
    if (!blobSrc) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `${dim} ${rounded} shrink-0 bg-muted/40 border border-border grid place-items-center`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-muted-foreground/50" })
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: blobSrc,
        alt,
        loading: "lazy",
        decoding: "async",
        onError: () => setErrored(true),
        className: base
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: url,
      alt,
      loading: "lazy",
      decoding: "async",
      onError: () => setErrored(true),
      className: base
    }
  );
}
export {
  ExercicioMedia as E
};
