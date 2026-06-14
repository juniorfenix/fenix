import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, s as supabase } from "./router-DHEQdz8j.mjs";
import { p as profileQuery } from "./queries-BVYoVCpW.mjs";
import { t as todayISO } from "./calories-D7mpMhLM.mjs";
import { S as Skeleton } from "./skeleton-CoUJiN10.mjs";
import { B as Button, I as Input } from "./input-CqozOQNs.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogFooter } from "./dialog-DUBMlo7Z.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DK4TJU2r.mjs";
import { M as MEAL_KEYS, a as MEAL_LABELS, m as macrosFor, e as encontrarSubstitutos, C as CATEGORIA_LABELS } from "./substituicao-DzIb7esG.mjs";
import { L as LazyMount } from "./LazyMount-sGAIcH1c.mjs";
import { U as Utensils, x as Droplet, T as TrendingDown, L as Leaf, ad as TrendingUp, n as Target, w as Beef, W as Wheat, c as Salad, l as ClipboardList, a1 as ArrowRightLeft, ae as Coffee, b as Apple, h as Dumbbell, o as UtensilsCrossed, a4 as Moon, P as Plus, F as Flame, K as Pencil, af as Trash2, f as Search, S as Sparkles, r as LoaderCircle, C as Check, Z as Zap, i as BookOpen, O as Clock, B as Ban, Q as CircleCheck, y as TriangleAlert } from "../_libs/lucide-react.mjs";
import { Z as ZodError, o as objectType, s as stringType, l as literalType, c as coerce } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
const REFEICOES = [
  { key: "Café", icon: Coffee },
  { key: "Lanche da manhã", icon: Apple },
  { key: "Pré-treino", icon: Dumbbell },
  { key: "Almoço", icon: UtensilsCrossed },
  { key: "Lanche da tarde", icon: Apple },
  { key: "Pós-treino", icon: Dumbbell },
  { key: "Jantar", icon: Moon },
  { key: "Outro", icon: Plus }
];
const formSchema = objectType({
  nome: stringType().trim().min(1, "Informe o nome").max(120),
  calorias: coerce.number().int().min(0).max(5e3),
  proteinas: coerce.number().int().min(0).max(500),
  carboidratos: coerce.number().int().min(0).max(1e3),
  gorduras: coerce.number().int().min(0).max(500),
  observacoes: stringType().trim().max(500).optional().or(literalType(""))
});
function defaultRefeicaoForNow() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 10) return "Café";
  if (h < 12) return "Lanche da manhã";
  if (h < 14) return "Almoço";
  if (h < 17) return "Lanche da tarde";
  return "Jantar";
}
function isoDaysAgo(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE");
}
function MinhaAlimentacao({
  objetivo = "perda",
  metaKcal = 2e3,
  macroGoals,
  prefill = null,
  onPrefillConsumed
} = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const today = todayISO();
  const queryKey = ["diario_alimentar", userId, today];
  const { data: registros = [], isPending } = useQuery({
    queryKey,
    enabled: !!userId,
    staleTime: 3e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("diario_alimentar").select("id,refeicao,nome,calorias,proteinas,carboidratos,gorduras,observacoes,data,created_at").eq("user_id", userId).eq("data", today).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: alimentosPadrao = [] } = useQuery({
    queryKey: ["alimentos_padrao"],
    staleTime: 10 * 60 * 1e3,
    queryFn: async () => {
      const { data, error } = await supabase.from("alimentos_padrao").select("id,nome,icone,calorias,proteinas,carboidratos,gorduras").eq("ativo", true).order("ordem", { ascending: true }).order("nome", { ascending: true }).limit(500);
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: recent = [] } = useQuery({
    queryKey: ["diario_alimentar", userId, "recent30"],
    enabled: !!userId,
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("diario_alimentar").select("id,refeicao,nome,calorias,proteinas,carboidratos,gorduras,observacoes,data,created_at").eq("user_id", userId).gte("data", isoDaysAgo(30)).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const totals = reactExports.useMemo(() => registros.reduce(
    (acc, r) => ({
      kcal: acc.kcal + r.calorias,
      prot: acc.prot + r.proteinas,
      carb: acc.carb + r.carboidratos,
      gord: acc.gord + r.gorduras
    }),
    { kcal: 0, prot: 0, carb: 0, gord: 0 }
  ), [registros]);
  const progressoReal = Math.round(totals.kcal / metaKcal * 100);
  const progresso = Math.min(100, progressoReal);
  const metaBatida = totals.kcal >= metaKcal;
  const suggestionsByMeal = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of recent) {
      const m = map.get(r.refeicao) ?? /* @__PURE__ */ new Map();
      const key = r.nome.toLowerCase();
      const ex = m.get(key);
      if (ex) ex.count += 1;
      else m.set(key, { row: r, count: 1 });
      map.set(r.refeicao, m);
    }
    const result = {};
    for (const [meal, items] of map) {
      result[meal] = [...items.values()].sort((a, b) => b.count - a.count).slice(0, 3).map((x) => x.row);
    }
    return result;
  }, [recent]);
  const todayByMeal = reactExports.useMemo(() => {
    const map = {};
    for (const r of registros) (map[r.refeicao] ??= []).push(r);
    return map;
  }, [registros]);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [refeicao, setRefeicao] = reactExports.useState("Café");
  const [form, setForm] = reactExports.useState({ nome: "", calorias: "", proteinas: "", carboidratos: "", gorduras: "", observacoes: "" });
  const [search, setSearch] = reactExports.useState("");
  function openNew(r) {
    setEditing(null);
    setRefeicao(r);
    setForm({ nome: "", calorias: "", proteinas: "", carboidratos: "", gorduras: "", observacoes: "" });
    setSearch("");
    setOpen(true);
  }
  function fillFromItem(a) {
    setForm({
      nome: a.nome,
      calorias: String(a.calorias),
      proteinas: String(a.proteinas),
      carboidratos: String(a.carboidratos),
      gorduras: String(a.gorduras),
      observacoes: ""
    });
  }
  reactExports.useEffect(() => {
    if (!prefill) return;
    setEditing(null);
    const r = prefill.refeicao && REFEICOES.find((x) => x.key === prefill.refeicao)?.key || defaultRefeicaoForNow();
    setRefeicao(r);
    fillFromItem(prefill);
    setSearch("");
    setOpen(true);
    onPrefillConsumed?.();
  }, [prefill, onPrefillConsumed]);
  function openEdit(row) {
    setEditing(row);
    setRefeicao(row.refeicao ?? "Outro");
    setForm({
      nome: row.nome,
      calorias: String(row.calorias),
      proteinas: String(row.proteinas),
      carboidratos: String(row.carboidratos),
      gorduras: String(row.gorduras),
      observacoes: row.observacoes ?? ""
    });
    setSearch("");
    setOpen(true);
  }
  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = formSchema.parse(form);
      const payload = {
        user_id: userId,
        data: today,
        refeicao,
        nome: parsed.nome,
        calorias: parsed.calorias,
        proteinas: parsed.proteinas,
        carboidratos: parsed.carboidratos,
        gorduras: parsed.gorduras,
        observacoes: parsed.observacoes || null
      };
      if (editing) {
        const { error } = await supabase.from("diario_alimentar").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("diario_alimentar").insert(payload);
        if (error) throw error;
      }
    },
    onMutate: async () => {
      try {
        formSchema.parse(form);
      } catch (e) {
        throw e;
      }
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData([...queryKey]) ?? [];
      const optimistic = {
        id: editing?.id ?? `tmp-${Date.now()}`,
        refeicao,
        nome: form.nome,
        calorias: Number(form.calorias) || 0,
        proteinas: Number(form.proteinas) || 0,
        carboidratos: Number(form.carboidratos) || 0,
        gorduras: Number(form.gorduras) || 0,
        observacoes: form.observacoes || null,
        data: today,
        created_at: editing?.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
      };
      const next = editing ? prev.map((r) => r.id === editing.id ? { ...r, ...optimistic, id: editing.id } : r) : [...prev, optimistic];
      queryClient.setQueryData([...queryKey], next);
      setOpen(false);
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData([...queryKey], ctx.prev);
      const msg = e instanceof ZodError ? e.issues[0]?.message ?? "Dados inválidos" : e.message;
      toast.error(msg);
      setOpen(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["meals", userId, "recent30"] });
      queryClient.invalidateQueries({ queryKey: ["diario_alimentar", userId, "recent30"] });
      toast.success(editing ? "Registro salvo" : "Registro salvo 🔥");
    }
  });
  const deleteWithUndo = (row) => {
    const prev = queryClient.getQueryData([...queryKey]) ?? [];
    queryClient.setQueryData(
      [...queryKey],
      prev.filter((r) => r.id !== row.id)
    );
    let undone = false;
    const t = window.setTimeout(async () => {
      if (undone) return;
      const { error } = await supabase.from("diario_alimentar").delete().eq("id", row.id);
      if (error) {
        queryClient.setQueryData([...queryKey], prev);
        toast.error("Erro ao remover: " + error.message);
      } else {
        queryClient.invalidateQueries({ queryKey: ["meals", userId, "recent30"] });
      }
    }, 5e3);
    toast("Registro removido", {
      description: row.nome,
      duration: 5e3,
      action: {
        label: "Desfazer",
        onClick: () => {
          undone = true;
          clearTimeout(t);
          queryClient.setQueryData([...queryKey], prev);
          toast.success("Registro restaurado");
        }
      }
    });
  };
  const searchResults = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return alimentosPadrao.filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 8);
  }, [search, alimentosPadrao]);
  const currentSuggestions = suggestionsByMeal[refeicao] ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-5 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Registro do dia" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: `h-4 w-4 ${metaBatida ? "text-accent" : "text-primary"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: totals.kcal }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "/ ",
          metaKcal,
          " kcal"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded-full bg-background/40 border border-border/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full bg-gradient-ember transition-all duration-500",
          style: { width: `${progresso}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex justify-between text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          progressoReal,
          "% da meta"
        ] }),
        metaBatida ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: progressoReal > 100 ? `+${totals.kcal - metaKcal} kcal acima` : "Meta batida 🎉" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Faltam ",
          Math.max(0, metaKcal - totals.kcal),
          " kcal"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MacroCell, { label: "Proteínas", value: totals.prot, goal: macroGoals?.prot, color: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MacroCell, { label: "Carbos", value: totals.carb, goal: macroGoals?.carb, color: "accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MacroCell, { label: "Gorduras", value: totals.gord, goal: macroGoals?.gord, color: "primary-soft" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: REFEICOES.map((r) => {
      const entries = todayByMeal[r.key] ?? [];
      const hasEntries = entries.length > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => openNew(r.key),
          className: `relative flex flex-col items-center gap-1 rounded-xl py-2.5 border transition-colors min-h-[60px] ${hasEntries ? "bg-primary/10 border-primary/40 hover:border-primary/60" : "bg-background/40 border-border/40 hover:border-primary/50"}`,
          children: [
            hasEntries && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center", children: entries.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: `h-4 w-4 ${hasEntries ? "text-primary" : "text-primary/70"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-center leading-tight", children: r.key })
          ]
        },
        r.key
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Registros de hoje" }),
      isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }) : registros.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onCta: () => openNew(defaultRefeicaoForNow()) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: REFEICOES.filter((r) => (todayByMeal[r.key]?.length ?? 0) > 0).map((r) => {
        const items = todayByMeal[r.key] ?? [];
        const kcalGroup = items.reduce((a, b) => a + b.calorias, 0);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/20 border border-border/30 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "h-3.5 w-3.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide font-semibold text-primary", children: r.key })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              kcalGroup,
              " kcal"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: items.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg bg-background/40 border border-border/20 p-2.5 flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-snug truncate", children: row.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                row.calorias,
                " kcal · P ",
                row.proteinas,
                "g · C ",
                row.carboidratos,
                "g · G ",
                row.gorduras,
                "g"
              ] }),
              row.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1 italic", children: row.observacoes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openEdit(row),
                  className: "h-9 w-9 grid place-items-center rounded-lg hover:bg-background/60 text-muted-foreground hover:text-foreground active:scale-95 transition",
                  "aria-label": "Editar",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteWithUndo(row),
                  className: "h-9 w-9 grid place-items-center rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive active:scale-95 transition",
                  "aria-label": "Remover",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }, row.id)) })
        ] }, r.key);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        editing ? "Editar" : "Registrar",
        " · ",
        refeicao
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: saveMutation.isPending, className: "space-y-3", children: [
        !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Buscar alimento (ex: arroz, frango...)",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-9"
              }
            )
          ] }),
          searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "rounded-lg border border-border/40 bg-background/40 max-h-48 overflow-y-auto divide-y divide-border/30", children: searchResults.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                fillFromItem(a);
                setSearch("");
              },
              className: "w-full text-left px-3 py-2 hover:bg-primary/10 flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: a.icone ?? "🍽️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium truncate", children: a.nome }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground whitespace-nowrap", children: [
                  a.calorias,
                  "kcal · P",
                  a.proteinas,
                  " C",
                  a.carboidratos,
                  " G",
                  a.gorduras
                ] })
              ]
            }
          ) }, a.id)) }),
          !search && currentSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
              "Você costuma comer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: currentSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => fillFromItem(s),
                className: "rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs hover:bg-primary/20 transition",
                children: [
                  s.nome,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "· ",
                    s.calorias,
                    "kcal"
                  ] })
                ]
              },
              s.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome da refeição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nome",
              value: form.nome,
              maxLength: 120,
              onChange: (e) => setForm((f) => ({ ...f, nome: e.target.value })),
              placeholder: "Ex: 2 ovos mexidos + pão integral"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "calorias", children: "Calorias (kcal)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "calorias",
              type: "number",
              inputMode: "numeric",
              min: 0,
              max: 5e3,
              value: form.calorias,
              onChange: (e) => setForm((f) => ({ ...f, calorias: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prot", children: "Prot (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "prot", type: "number", min: 0, max: 500, value: form.proteinas, onChange: (e) => setForm((f) => ({ ...f, proteinas: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "carb", children: "Carb (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "carb", type: "number", min: 0, max: 1e3, value: form.carboidratos, onChange: (e) => setForm((f) => ({ ...f, carboidratos: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gord", children: "Gord (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "gord", type: "number", min: 0, max: 500, value: form.gorduras, onChange: (e) => setForm((f) => ({ ...f, gorduras: e.target.value })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "obs", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "obs",
              rows: 2,
              maxLength: 500,
              value: form.observacoes,
              onChange: (e) => setForm((f) => ({ ...f, observacoes: e.target.value })),
              placeholder: "Opcional"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpen(false), disabled: saveMutation.isPending, children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => saveMutation.mutate(),
            disabled: saveMutation.isPending || !form.nome.trim(),
            className: "bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95 disabled:opacity-80",
            children: saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              " Salvando…"
            ] }) : editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }),
              "Salvar"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2" }),
              "Registrar"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
function MacroCell({
  label,
  value,
  goal,
  color
}) {
  const pct = goal ? Math.min(100, Math.round(value / goal * 100)) : 0;
  const txt = color === "accent" ? "text-accent" : color === "primary-soft" ? "text-primary/80" : "text-primary";
  const bar = color === "accent" ? "bg-accent" : "bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/30 border border-border/30 py-2 px-2.5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-semibold ${txt}`, children: [
      value,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-[10px]", children: [
        goal ? `/${goal}` : "",
        "g"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: label }),
    goal ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1 rounded-full bg-background/60 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${bar} transition-all duration-500`, style: { width: `${pct}%` } }) }) : null
  ] });
}
function EmptyState({ onCta }) {
  const next = defaultRefeicaoForNow();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/20 border border-dashed border-border/40 p-5 text-center space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🍽️" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Nada registrado ainda hoje" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Comece pelo que faz sentido agora." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        onClick: onCta,
        className: "bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
          " Registrar ",
          next
        ]
      }
    )
  ] });
}
const ACCENT = {
  perda: { text: "text-primary", border: "border-primary/40", bg: "bg-primary/10", label: "Déficit" },
  ganho: { text: "text-accent", border: "border-accent/30", bg: "bg-accent/10", label: "Ganho" },
  reeducacao: { text: "text-primary", border: "border-primary/30", bg: "bg-primary/10", label: "Equilíbrio" }
};
function CardapioSugerido({
  objetivo,
  genero,
  onSelect
}) {
  const enabled = !!genero;
  const { data: rows = [], isPending } = useQuery({
    queryKey: ["cardapios", objetivo, genero],
    enabled,
    staleTime: 10 * 60 * 1e3,
    queryFn: async () => {
      const { data, error } = await supabase.from("cardapios").select("id,refeicao,horario,opcao_numero,opcao_nome,calorias,proteinas,carboidratos,gorduras,descricao,ordem").eq("objetivo", objetivo).eq("genero", genero).order("ordem", { ascending: true }).order("opcao_numero", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const grupos = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const key = `${r.ordem}-${r.refeicao}`;
      const g = map.get(key) ?? { refeicao: r.refeicao, horario: r.horario, ordem: r.ordem, opcoes: [] };
      g.opcoes.push(r);
      map.set(key, g);
    }
    return Array.from(map.values()).sort((a, b) => a.ordem - b.ordem);
  }, [rows]);
  const accent = ACCENT[objetivo];
  if (!enabled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-5 border border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Cardápio Sugerido" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Defina seu gênero no perfil para receber o cardápio personalizado." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "glass rounded-2xl p-5 border border-border/40 space-y-4 animate-fade-in",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: `h-5 w-5 ${accent.text}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Cardápio Sugerido" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] uppercase tracking-widest font-semibold ${accent.text}`, children: [
            accent.label,
            " · ",
            genero === "homem" ? "Homem" : "Mulher"
          ] })
        ] }),
        isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" })
        ] }) : grupos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Nenhum cardápio cadastrado para esta combinação ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: grupos.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: g.refeicao }),
            g.horario && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              " ",
              g.horario
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: g.opcoes.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSelect?.({
                refeicao: g.refeicao,
                nome: `${g.refeicao} · ${o.opcao_nome}`,
                calorias: o.calorias,
                proteinas: o.proteinas,
                carboidratos: o.carboidratos,
                gorduras: o.gorduras
              }),
              className: "w-full text-left rounded-xl bg-background/30 border border-border/30 p-3 hover:border-primary/50 hover:bg-background/50 transition-colors group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] uppercase tracking-wide font-semibold ${accent.text}`, children: o.opcao_nome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3 text-primary" }),
                      " ",
                      o.calorias,
                      " kcal"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Beef, { className: "h-3 w-3 text-accent" }),
                      " ",
                      o.proteinas,
                      "g"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-snug", children: o.descricao }),
                onSelect && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 mt-2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity ${accent.text}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  " Registrar esta opção"
                ] })
              ]
            },
            o.id
          )) })
        ] }, `${g.ordem}-${g.refeicao}`)) })
      ]
    },
    `${objetivo}-${genero}`
  );
}
function TrocarAlimentoModal({
  open,
  onOpenChange,
  userId,
  refeicao,
  protocoloItemId,
  original,
  gramasOriginais,
  bloqueados,
  onSubstituted
}) {
  const qc = useQueryClient();
  const [picked, setPicked] = reactExports.useState(null);
  const { data: pool = [], isLoading } = useQuery({
    queryKey: ["alimentos_por_categoria", original.categoria],
    enabled: open,
    staleTime: 5 * 60 * 1e3,
    queryFn: async () => {
      const { data, error } = await supabase.from("alimentos_padrao").select("id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras").eq("ativo", true).eq("categoria", original.categoria).order("nome", { ascending: true }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const candidatos = reactExports.useMemo(() => {
    if (!pool.length) return [];
    return encontrarSubstitutos({
      original,
      originalGrams: gramasOriginais,
      pool,
      bloqueados: new Set(bloqueados.map((b) => b.toLowerCase())),
      limite: 3
    });
  }, [pool, original, gramasOriginais, bloqueados]);
  const confirmar = useMutation({
    mutationFn: async (c) => {
      const { error } = await supabase.from("substituicoes_log").insert({
        user_id: userId,
        protocolo_item_id: protocoloItemId ?? null,
        refeicao,
        alimento_original_id: original.id,
        alimento_original_nome: original.nome,
        gramas_original: gramasOriginais,
        alimento_substituto_id: c.alimento.id,
        alimento_substituto_nome: c.alimento.nome,
        gramas_substituto: c.gramas,
        delta_proteinas_pct: Number(c.delta.p.toFixed(2)),
        delta_carboidratos_pct: Number(c.delta.c.toFixed(2)),
        delta_gorduras_pct: Number(c.delta.g.toFixed(2))
      });
      if (error) throw error;
      return c;
    },
    onSuccess: (c) => {
      toast.success("Troca registrada", {
        description: `${original.nome} → ${c.alimento.nome} (${c.gramas} g)`
      });
      qc.invalidateQueries({ queryKey: ["substituicoes_log"] });
      qc.invalidateQueries({ queryKey: ["substituicoes_admin"] });
      onSubstituted?.(c);
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message ?? "Não foi possível registrar a troca.")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 font-display text-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-5 w-5 text-primary" }),
      "Trocar alimento"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/40 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Original" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: original.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          gramasOriginais,
          " g"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
        "Categoria: ",
        CATEGORIA_LABELS[original.categoria] ?? original.categoria
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
      " Buscando opções equivalentes…"
    ] }) : candidatos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "mx-auto mb-2 h-5 w-5" }),
      "Nenhuma substituição disponível nessa categoria que respeite suas restrições."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: candidatos.map((c) => {
      const isPicked = picked === c.alimento.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPicked(c.alimento.id),
          className: `w-full rounded-xl border-2 p-3 text-left transition ${isPicked ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: c.alimento.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
                c.gramas,
                " g"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-[11px]", children: [
              c.within10pct ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                " Equivalente (±10%)"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                " Fora da margem"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DeltaChip, { label: "P", v: c.delta.p }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DeltaChip, { label: "C", v: c.delta.c }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DeltaChip, { label: "G", v: c.delta.g })
            ] })
          ]
        }
      ) }, c.alimento.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        disabled: !picked || confirmar.isPending,
        onClick: () => {
          const c = candidatos.find((x) => x.alimento.id === picked);
          if (c) confirmar.mutate(c);
        },
        className: "h-12 w-full bg-gradient-ember text-primary-foreground shadow-ember",
        children: confirmar.isPending ? "Registrando…" : "Confirmar troca"
      }
    )
  ] }) });
}
function DeltaChip({ label, v }) {
  const sign = v > 0 ? "+" : "";
  const ok = Math.abs(v) <= 10;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `rounded-full px-2 py-0.5 ${ok ? "bg-secondary text-foreground/70" : "bg-amber-500/10 text-amber-400"}`,
      children: [
        label,
        " ",
        sign,
        v.toFixed(0),
        "%"
      ]
    }
  );
}
function CardapioPrescrito({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["protocolo_aluno", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: prot } = await supabase.from("protocolos_prescritos").select("id,meta_kcal,meta_proteinas,meta_carboidratos,meta_gorduras,observacoes").eq("user_id", userId).maybeSingle();
      if (!prot) return { protocolo: null, itens: [] };
      const { data: itens } = await supabase.from("protocolo_itens").select(
        "id,refeicao,gramas,ordem,alimento:alimentos_padrao(id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras)"
      ).eq("protocolo_id", prot.id).order("ordem", { ascending: true });
      return {
        protocolo: prot,
        itens: itens ?? []
      };
    }
  });
  const { data: bloqueados = [] } = useQuery({
    queryKey: ["bloqueados_aluno", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [prefRes, profRes] = await Promise.all([
        supabase.from("preferencias_alimentares").select("detestados,restricoes").eq("user_id", userId).maybeSingle(),
        supabase.from("profiles").select("alimentos_evitar").eq("id", userId).maybeSingle()
      ]);
      const a = prefRes.data?.detestados ?? [];
      const b = profRes.data?.alimentos_evitar ?? [];
      return [...new Set([...a, ...b].filter(Boolean))];
    }
  });
  const itensPorRefeicao = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const k of MEAL_KEYS) map.set(k, []);
    for (const it of data?.itens ?? []) {
      if (!map.has(it.refeicao)) map.set(it.refeicao, []);
      map.get(it.refeicao).push(it);
    }
    return map;
  }, [data]);
  const [trocar, setTrocar] = reactExports.useState(null);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Carregando seu protocolo…" }) });
  }
  if (!data?.protocolo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "mx-auto mb-2 h-5 w-5 text-primary/70" }),
      "Você ainda não tem um protocolo prescrito. Quando o admin liberar, ele aparecerá aqui."
    ] }) });
  }
  const p = data.protocolo;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
      " Protocolo Prescrito"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 text-center text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Kcal", value: p.meta_kcal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "P", value: `${p.meta_proteinas}g` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "C", value: `${p.meta_carboidratos}g` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "G", value: `${p.meta_gorduras}g` })
      ] }),
      p.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-xl bg-secondary/40 p-3 text-xs italic text-muted-foreground", children: p.observacoes }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        MEAL_KEYS.map((m) => {
          const itens = itensPorRefeicao.get(m) ?? [];
          if (itens.length === 0) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[11px] uppercase tracking-widest text-muted-foreground", children: MEAL_LABELS[m] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: itens.map((it) => {
              const macros = macrosFor(it.alimento, it.gramas);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2 last:border-0 last:pb-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: it.alimento.nome }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                        it.gramas,
                        " g · ",
                        Math.round(macros.kcal),
                        " kcal · P",
                        Math.round(macros.p),
                        " · C",
                        Math.round(macros.c),
                        " · G",
                        Math.round(macros.g)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => setTrocar({ item: it }),
                        className: "h-8 gap-1 text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-3 w-3" }),
                          " Trocar"
                        ]
                      }
                    )
                  ]
                },
                it.id
              );
            }) })
          ] }, m);
        }),
        (data.itens ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground", children: "O admin ainda não adicionou alimentos. As metas já estão prescritas." })
      ] })
    ] }),
    trocar && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TrocarAlimentoModal,
      {
        open: !!trocar,
        onOpenChange: (v) => !v && setTrocar(null),
        userId,
        refeicao: trocar.item.refeicao,
        protocoloItemId: trocar.item.id,
        original: trocar.item.alimento,
        gramasOriginais: trocar.item.gramas,
        bloqueados
      }
    )
  ] });
}
function Meta({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/30 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: value })
  ] });
}
function mapGenero(g) {
  if (g === "male") return "homem";
  if (g === "female") return "mulher";
  return null;
}
const ML_POR_COPO = 250;
const ML_POR_KG = 35;
const META_COPOS_FALLBACK = 8;
function AlimentacaoPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const {
    data: profile
  } = useQuery({
    ...profileQuery(user?.id ?? ""),
    enabled: !!user
  });
  const today = todayISO();
  const pesoKg = Number(profile?.current_weight) || 0;
  const metaMl = pesoKg > 0 ? Math.round(pesoKg * ML_POR_KG) : META_COPOS_FALLBACK * ML_POR_COPO;
  const metaCopos = Math.max(1, Math.ceil(metaMl / ML_POR_COPO));
  const metaLitros = metaMl / 1e3;
  const hydroKey = ["hidratacao_diaria", user?.id, today];
  const {
    data: copos = 0
  } = useQuery({
    queryKey: hydroKey,
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("hidratacao_diaria").select("copos").eq("user_id", user.id).eq("data", today).maybeSingle();
      if (error) throw error;
      return data?.copos ?? 0;
    }
  });
  const setCoposMut = useMutation({
    mutationFn: async (novo) => {
      if (!user) throw new Error("no user");
      const c = Math.max(0, Math.min(metaCopos, novo));
      const {
        error
      } = await supabase.from("hidratacao_diaria").upsert({
        user_id: user.id,
        data: today,
        copos: c
      }, {
        onConflict: "user_id,data"
      });
      if (error) throw error;
      return c;
    },
    onMutate: async (novo) => {
      await qc.cancelQueries({
        queryKey: hydroKey
      });
      const prev = qc.getQueryData(hydroKey);
      const next = Math.max(0, Math.min(metaCopos, novo));
      qc.setQueryData(hydroKey, next);
      if ((prev ?? 0) < metaCopos && next >= metaCopos) {
        toast.success("Meta de hidratação batida 💧", {
          description: `Você bebeu ${metaLitros.toFixed(2)}L hoje. Mandou bem!`,
          duration: 4e3
        });
        if (typeof window !== "undefined") {
          import("../_libs/canvas-confetti.mjs").then(({
            default: confetti
          }) => {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: {
                y: 0.3
              },
              colors: ["#38bdf8", "#0ea5e9", "#7dd3fc"]
            });
          }).catch(() => {
          });
        }
      }
      return {
        prev
      };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== void 0) qc.setQueryData(hydroKey, ctx.prev);
      toast.error("Não foi possível salvar a hidratação.");
    }
  });
  const metaKey = ["metas_usuario", user?.id];
  const {
    data: metaRow
  } = useQuery({
    queryKey: metaKey,
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("metas_usuario").select("objetivo_ativo").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data?.objetivo_ativo ?? "perda";
    }
  });
  const objetivo = metaRow ?? "perda";
  const baseKcal = profile?.daily_calorie_goal ?? 2e3;
  const kcalFor = (o) => o === "perda" ? Math.max(1200, baseKcal - 500) : o === "ganho" ? baseKcal + 300 : baseKcal;
  const metaKcal = kcalFor(objetivo);
  const setObjetivo = useMutation({
    mutationFn: async (novo) => {
      if (!user) throw new Error("no user");
      const {
        error
      } = await supabase.from("metas_usuario").upsert({
        user_id: user.id,
        objetivo_ativo: novo
      }, {
        onConflict: "user_id"
      });
      if (error) throw error;
      return novo;
    },
    onMutate: async (novo) => {
      await qc.cancelQueries({
        queryKey: metaKey
      });
      const prev = qc.getQueryData(metaKey);
      qc.setQueryData(metaKey, novo);
      return {
        prev,
        anterior: prev ?? objetivo
      };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== void 0) qc.setQueryData(metaKey, ctx.prev);
      toast.error("Não foi possível atualizar a meta.");
    },
    onSuccess: (novo, _v, ctx) => {
      const antigo = ctx?.anterior ?? "perda";
      const antesKcal = kcalFor(antigo);
      const depoisKcal = kcalFor(novo);
      const delta = depoisKcal - antesKcal;
      const deltaTxt = delta === 0 ? "Meta calórica mantida" : `Meta: ${antesKcal} → ${depoisKcal} kcal (${delta > 0 ? "+" : ""}${delta})`;
      const titulo = novo === "ganho" ? "Modo ganho ativado 💪" : novo === "reeducacao" ? "Modo reeducação ativado 🌱" : "Modo perda ativado 🔥";
      toast.success(titulo, {
        description: deltaTxt,
        duration: 4e3
      });
    }
  });
  const macros = reactExports.useMemo(() => {
    const split = objetivo === "perda" ? {
      p: 0.35,
      c: 0.35,
      g: 0.3
    } : objetivo === "ganho" ? {
      p: 0.3,
      c: 0.5,
      g: 0.2
    } : {
      p: 0.25,
      c: 0.5,
      g: 0.25
    };
    return {
      prot: Math.round(metaKcal * split.p / 4),
      carb: Math.round(metaKcal * split.c / 4),
      gord: Math.round(metaKcal * split.g / 9)
    };
  }, [metaKcal, objetivo]);
  const accent = objetivo === "ganho" ? {
    text: "text-accent",
    border: "border-accent/30",
    bgInner: "bg-accent/10 border-accent/30",
    textStrong: "text-accent",
    gradient: "from-accent/10 via-primary/5 to-transparent"
  } : objetivo === "reeducacao" ? {
    text: "text-primary",
    border: "border-primary/30",
    bgInner: "bg-primary/10 border-primary/30",
    textStrong: "text-primary",
    gradient: "from-primary/10 via-accent/5 to-transparent"
  } : {
    text: "text-primary",
    border: "border-primary/40",
    bgInner: "bg-primary/10 border-primary/40",
    textStrong: "text-gradient-ember",
    gradient: "from-primary/15 via-accent/5 to-transparent"
  };
  const objetivoLabel = objetivo === "perda" ? "Déficit" : objetivo === "ganho" ? "Superávit" : "Equilíbrio";
  const [prefill, setPrefill] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Minha Alimentação" })
      ] })
    ] }),
    user?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CardapioPrescrito, { userId: user.id }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-4 border border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1 gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-5 w-5 text-sky-500/80" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Hidratação" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          copos,
          "/",
          metaCopos,
          " copos · ",
          (copos * ML_POR_COPO / 1e3).toFixed(2),
          "L de ",
          metaLitros.toFixed(2),
          "L"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: pesoKg > 0 ? `Meta personalizada: ${pesoKg}kg × 35ml = ${metaLitros.toFixed(2)}L` : "Cadastre seu peso no Perfil para personalizar a meta." }),
      metaCopos > 16 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-4 rounded-full bg-background/40 border border-sky-500/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 bg-gradient-to-r from-sky-600/60 to-sky-500/70 transition-all", style: {
          width: `${Math.min(100, copos / metaCopos * 100)}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCoposMut.mutate(copos - 1), disabled: copos <= 0 || setCoposMut.isPending, className: "px-3 py-1.5 rounded-lg border border-border/60 bg-background/40 text-sm hover:border-sky-500/30 disabled:opacity-40", children: "− 250ml" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            Math.round(copos / metaCopos * 100),
            "% da meta"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCoposMut.mutate(copos + 1), disabled: copos >= metaCopos || setCoposMut.isPending, className: "px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300/90 text-sm hover:bg-sky-500/20 disabled:opacity-40", children: "+ 250ml" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid gap-2 ${metaCopos <= 8 ? "grid-cols-8" : "grid-cols-8 sm:grid-cols-12"}`, children: Array.from({
        length: metaCopos
      }).map((_, i) => {
        const active = i < copos;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCoposMut.mutate(active ? i : i + 1), "aria-label": `Marcar copo ${i + 1}`, className: `aspect-square rounded-lg border flex items-center justify-center transition-colors ${active ? "bg-sky-500/15 border-sky-500/40 text-sky-300/90" : "bg-background/40 border-border/40 text-muted-foreground hover:border-sky-500/30"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-4 w-4", fill: active ? "currentColor" : "none" }) }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "glass rounded-2xl p-2 border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: [{
      key: "perda",
      label: "Perda",
      Icon: TrendingDown,
      activeCls: "bg-gradient-to-br from-rose-500 to-red-700 text-white border-rose-400 shadow-[0_0_20px_-4px_rgba(244,63,94,0.6)]",
      idleCls: "text-rose-300/80 hover:text-rose-200 hover:border-rose-500/50"
    }, {
      key: "reeducacao",
      label: "Reeducação",
      Icon: Leaf,
      activeCls: "bg-gradient-to-br from-emerald-500 to-green-700 text-white border-emerald-400 shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)]",
      idleCls: "text-emerald-300/80 hover:text-emerald-200 hover:border-emerald-500/50"
    }, {
      key: "ganho",
      label: "Ganho",
      Icon: TrendingUp,
      activeCls: "bg-gradient-ember text-primary-foreground border-primary shadow-ember",
      idleCls: "text-orange-300/80 hover:text-orange-200 hover:border-primary/50"
    }].map(({
      key,
      label,
      Icon,
      activeCls,
      idleCls
    }) => {
      const active = objetivo === key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => !active && setObjetivo.mutate(key), disabled: setObjetivo.isPending, className: `relative overflow-hidden rounded-xl px-2 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border ${active ? `${activeCls} scale-[1.03]` : `bg-[#0f0f0f] border-border/60 ${idleCls}`}`, "aria-pressed": active, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
        label
      ] }, key);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `rounded-2xl p-5 border transition-colors duration-500 animate-fade-in backdrop-blur-md bg-gradient-to-br ${accent.gradient} ${accent.border}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: `h-5 w-5 transition-colors duration-500 ${accent.text}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Meta Nutricional" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] uppercase tracking-widest font-semibold ${accent.text}`, children: objetivoLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 col-span-2 transition-colors duration-500 ${accent.bgInner}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Calorias diárias" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-2xl font-bold mt-1 transition-colors duration-500 ${accent.textStrong}`, children: [
            metaKcal,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-normal", children: "kcal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Beef, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Proteínas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              macros.prot,
              "g"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wheat, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Carboidratos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              macros.carb,
              "g"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Salad, { className: "h-4 w-4 text-primary/80" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Gorduras" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              macros.gord,
              "g"
            ] })
          ] })
        ] })
      ] }),
      !profile?.daily_calorie_goal && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-3 italic", children: "Defina sua meta no perfil para personalizar (usando 2000 kcal por padrão)." })
    ] }, objetivo),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MinhaAlimentacao, { objetivo, metaKcal, macroGoals: macros, prefill, onPrefillConsumed: () => setPrefill(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LazyMount, { rootMargin: "300px", minHeight: 320, placeholder: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl h-[320px] animate-pulse", "aria-hidden": true }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardapioSugerido, { objetivo, genero: mapGenero(profile?.gender), onSelect: (p) => setPrefill(p) }) })
  ] });
}
export {
  AlimentacaoPage as component
};
