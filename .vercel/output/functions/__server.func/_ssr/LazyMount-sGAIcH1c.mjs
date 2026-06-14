import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function LazyMount({
  children,
  placeholder,
  rootMargin = "200px",
  minHeight
}) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      { rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible, rootMargin]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, style: !visible && minHeight ? { minHeight } : void 0, children: visible ? children : placeholder });
}
export {
  LazyMount as L
};
