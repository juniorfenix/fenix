import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as ResponsiveContainer, L as LineChart, X as XAxis, Y as YAxis, T as Tooltip, a as ReferenceLine, b as Label, c as Line } from "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function WeightChart({ data, goal }) {
  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights, goal ?? Infinity) - 1;
  const max = Math.max(...weights, goal ?? -Infinity) + 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "logged_date", tick: { fontSize: 10, fill: "oklch(0.66 0.012 70)" }, tickFormatter: (d) => d.slice(5) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      YAxis,
      {
        tick: { fontSize: 10, fill: "oklch(0.66 0.012 70)" },
        domain: goal != null ? [min, max] : ["dataMin - 1", "dataMax + 1"]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: { background: "oklch(0.20 0.006 60)", border: "1px solid oklch(0.28 0.006 60)", borderRadius: 8, fontSize: 12 } }),
    goal != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReferenceLine,
      {
        y: goal,
        stroke: "oklch(0.82 0.15 65)",
        strokeDasharray: "4 4",
        strokeWidth: 1.5,
        strokeOpacity: 0.7,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            value: `Meta ${goal}kg`,
            position: "insideTopRight",
            fill: "oklch(0.82 0.15 65)",
            fontSize: 10
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "weight", stroke: "oklch(0.72 0.18 47)", strokeWidth: 2.5, dot: { r: 3, fill: "oklch(0.82 0.15 65)" } })
  ] }) });
}
export {
  WeightChart as default
};
