import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./router-CJeOYY3V.mjs";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DIV666p3.mjs";
import { a1 as ArrowRightLeft, y as TriangleAlert } from "../_libs/lucide-react.mjs";
function AlertasTrocas({ userId, limit = 20 }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["substituicoes_admin", userId ?? "all", limit],
    queryFn: async () => {
      let q = supabase.from("substituicoes_log").select(
        "id,user_id,refeicao,alimento_original_nome,alimento_substituto_nome,gramas_substituto,delta_proteinas_pct,delta_carboidratos_pct,delta_gorduras_pct,created_at"
      ).order("created_at", { ascending: false }).limit(limit);
      if (userId) q = q.eq("user_id", userId);
      const { data: data2, error } = await q;
      if (error) throw error;
      const rows = data2 ?? [];
      if (!userId && rows.length) {
        const ids = [...new Set(rows.map((r) => r.user_id))];
        const { data: profs } = await supabase.from("profiles").select("id,display_name").in("id", ids);
        const map = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
        for (const r of rows) r.aluno = map.get(r.user_id) ?? null;
      }
      return rows;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-4 w-4 text-primary" }),
      "Alertas de Troca"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Carregando…" }) : data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-sm text-muted-foreground", children: [
      "Nenhuma troca registrada ",
      userId ? "para este aluno" : "ainda",
      "."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 max-h-96 overflow-auto", children: data.map((r) => {
      const dp = r.delta_proteinas_pct ?? 0;
      const dc = r.delta_carboidratos_pct ?? 0;
      const dg = r.delta_gorduras_pct ?? 0;
      const fora = Math.abs(dp) > 10 || Math.abs(dc) > 10 || Math.abs(dg) > 10;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "p-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            !userId && r.aluno && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary", children: r.aluno }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.alimento_original_nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground", children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.alimento_substituto_nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-muted-foreground", children: [
              "(",
              r.gramas_substituto,
              " g)"
            ] })
          ] }),
          fora && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
            " Fora da margem"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[11px] text-muted-foreground", children: [
          new Date(r.created_at).toLocaleString("pt-BR"),
          " ·",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: r.refeicao.replaceAll("_", " ") }),
          " · P",
          fmt(dp),
          " · C",
          fmt(dc),
          " · G",
          fmt(dg)
        ] })
      ] }, r.id);
    }) }) })
  ] });
}
function fmt(v) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(0)}%`;
}
export {
  AlertasTrocas as A
};
