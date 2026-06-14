import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as useChildMatches, O as Outlet, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, s as supabase } from "./router-DHEQdz8j.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DK4TJU2r.mjs";
import { B as Button, I as Input } from "./input-CqozOQNs.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import { A as AlertasTrocas } from "./alertas-trocas-DGTybFI8.mjs";
import "../_libs/sonner.mjs";
import { ag as Shield, ah as Download, f as Search, t as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
function AdminLayout() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminAlunosPage, {});
}
function AdminAlunosPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const {
    data: isAdmin,
    isLoading: roleLoading
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (error) throw error;
      return !!data;
    }
  });
  reactExports.useEffect(() => {
    if (loading || roleLoading) return;
    if (!user || isAdmin === false) navigate({
      to: "/app"
    });
  }, [user, isAdmin, loading, roleLoading, navigate]);
  const {
    data: alunos,
    isLoading
  } = useQuery({
    queryKey: ["admin-alunos"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const [profilesRes, weightsRes, metasRes] = await Promise.all([supabase.from("profiles").select("id,display_name,current_weight,goal_weight,height").order("created_at", {
        ascending: false
      }), supabase.from("weight_logs").select("user_id,weight,logged_date").order("logged_date", {
        ascending: false
      }), supabase.from("metas_usuario").select("user_id,objetivo_ativo")]);
      if (profilesRes.error) throw profilesRes.error;
      if (weightsRes.error) throw weightsRes.error;
      if (metasRes.error) throw metasRes.error;
      const lastByUser = /* @__PURE__ */ new Map();
      for (const r of weightsRes.data ?? []) {
        if (!lastByUser.has(r.user_id)) lastByUser.set(r.user_id, {
          weight: Number(r.weight),
          date: r.logged_date
        });
      }
      const metaByUser = /* @__PURE__ */ new Map();
      for (const m of metasRes.data ?? []) metaByUser.set(m.user_id, m.objetivo_ativo);
      return (profilesRes.data ?? []).map((p) => {
        const last = lastByUser.get(p.id);
        return {
          id: p.id,
          display_name: p.display_name,
          current_weight: p.current_weight,
          goal_weight: p.goal_weight,
          height: p.height,
          ultimo_peso: last?.weight ?? null,
          ultimo_peso_data: last?.date ?? null,
          objetivo: metaByUser.get(p.id) ?? null
        };
      });
    }
  });
  const filtered = reactExports.useMemo(() => {
    if (!alunos) return [];
    const t = q.trim().toLowerCase();
    if (!t) return alunos;
    return alunos.filter((a) => (a.display_name ?? "").toLowerCase().includes(t));
  }, [alunos, q]);
  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Nome", "Peso Atual (kg)", "Altura (cm)", "Meta (kg)", "Objetivo", "Último Peso Registrado (kg)", "Data Último Registro"];
    const rows = filtered.map((a) => [a.display_name ?? "", a.current_weight ?? "", a.height ?? "", a.goal_weight ?? "", objetivoLabel(a.objetivo), a.ultimo_peso ?? "", a.ultimo_peso_data ?? ""]);
    downloadCSV("alunos.csv", [headers, ...rows]);
  };
  if (loading || roleLoading || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Verificando acesso…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-6xl px-4 py-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Painel do Admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportCSV, disabled: !filtered.length, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " Gerar Relatório (CSV)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertasTrocas, { limit: 15 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          alunos?.length ?? 0,
          " alunos cadastrados"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-72", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar por nome…", className: "pl-8 h-9" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Peso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Altura" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Objetivo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Último registro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "cursor-pointer hover:bg-secondary/40", onClick: () => navigate({
            to: "/app/admin/$userId",
            params: {
              userId: a.id
            }
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: a.display_name ?? "Sem nome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
              a.ultimo_peso ?? a.current_weight ?? "—",
              " kg"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
              a.height ?? "—",
              " cm"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: objetivoLabel(a.objetivo) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: a.ultimo_peso_data ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground inline" }) })
          ] }, a.id)),
          !filtered.length && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground py-8", children: "Nenhum aluno encontrado." }) })
        ] })
      ] }) })
    ] })
  ] });
}
function objetivoLabel(o) {
  if (o === "perda") return "Déficit";
  if (o === "ganho") return "Ganho";
  if (o === "reeducacao" || o === "manutencao") return "Reeducação";
  return o ?? "—";
}
function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((v) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export {
  AdminLayout as component
};
