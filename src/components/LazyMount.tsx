import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `placeholder` until the element scrolls within `rootMargin` of the
 * viewport, then mounts `children`. Once mounted, stays mounted to avoid
 * thrashing when scrolling back.
 */
export function LazyMount({
  children,
  placeholder,
  rootMargin = "200px",
  minHeight,
}: {
  children: ReactNode;
  placeholder: ReactNode;
  rootMargin?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={!visible && minHeight ? { minHeight } : undefined}>
      {visible ? children : placeholder}
    </div>
  );
}
