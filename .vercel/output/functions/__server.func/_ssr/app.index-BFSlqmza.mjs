import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Root, a as CollapsibleTrigger$1, b as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
import { u as useAuth, a as perfilQuery, i as instrutorAlunosQuery, g as planosTreinoInstrutorCountQuery, h as planosAlimentaresInstrutorCountQuery, j as avisosInstrutorQuery, p as profileQuery, w as weightsQuery, m as mealsRecentQuery, k as badgesQuery, l as guiasMentaisQuery, s as supabase, D as Dialog, b as DialogTrigger, d as DialogContent, e as DialogHeader, f as DialogTitle, c as cn } from "./router-DSsXXfgN.mjs";
import { B as Button, I as Input } from "./input-VcF1Z4i4.mjs";
import { S as Skeleton } from "./skeleton-Bzh63SSb.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Textarea } from "./textarea-BRbEq4sW.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BstMKzPM.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { P as ProtocoloPlateau } from "./method-hub-D-otbBYB.mjs";
import { a as useQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as todayISO } from "./calories-D7mpMhLM.mjs";
import { A as ALL_BADGES } from "./badges-DiLEDxIB.mjs";
import { U as Users, j as Dumbbell, k as Utensils, n as Bell, o as ChevronRight, F as Flame, S as Sparkles, C as Check, T as TrendingDown, p as Target, q as UtensilsCrossed, r as Scale, s as CalendarDays, P as Plus, t as LoaderCircle, u as Brain, l as BookOpen, m as Award, v as Lock, w as Heart, x as Beef, y as Droplet, z as TriangleAlert, G as Lightbulb, I as Save } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-id.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const Collapsible = Root;
const CollapsibleTrigger = CollapsibleTrigger$1;
const CollapsibleContent = CollapsibleContent$1;
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
const DIAS_CURTO = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DIAS_LONGO = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const HUMOR_EMOJI = ["😞", "🙁", "😐", "🙂", "🤩"];
const DICAS_DIA = [
  {
    titulo: "Meal Prep da semana",
    texto: "Reserve 60 min hoje para deixar 4–5 marmitas prontas. Proteína + carbo + vegetais. A semana inteira fica leve quando a segunda começa organizada."
  },
  {
    titulo: "Suplementação consciente",
    texto: "O melhor suplemento é a consistência. Antes de comprar qualquer pote, garanta proteína suficiente na comida (1.6–2g/kg) e creatina 3–5g/dia."
  },
  {
    titulo: "Varie 1 estímulo no treino",
    texto: "Troque a ordem de 2 exercícios ou aumente a carga em 5%. O corpo só responde quando você dá um motivo novo para se adaptar."
  },
  {
    titulo: "Hidratação antes do café",
    texto: "Beba 500 ml de água ao acordar, antes do café. Você acorda desidratado e isso confunde fome com sede o dia inteiro."
  },
  {
    titulo: "Cardápio antes do restaurante",
    texto: "Vai sair? Abra o cardápio em casa e escolha agora. Decisão na fome = decisão ruim. Proteína grelhada + 1 carbo + salada quase sempre resolve."
  },
  {
    titulo: "Estratégia de festa",
    texto: "Coma uma refeição com proteína 1h antes. Na festa: regra do prato único, álcool alternado com água, destilado puro melhor que drink doce."
  },
  {
    titulo: "Domingo é sono e revisão",
    texto: "Desligue telas 1h antes de dormir. 8h de sono é o suplemento mais barato. Aproveite e revise o que funcionou na semana — sem julgamento."
  }
];
const HABITOS_DEF = [
  { key: "plano", label: "Segui o plano alimentar", short: "Plano" },
  { key: "treino", label: "Treinei", short: "Treino" },
  { key: "agua", label: "Bebi 2L+ de água", short: "Água" },
  { key: "sono", label: "Dormi 7h+", short: "Sono" },
  { key: "diario", label: "Registrei o diário", short: "Diário" }
];
function emptyHabits() {
  return { plano: false, treino: false, agua: false, sono: false, diario: false };
}
function emptyDay() {
  return { treino: "", refeicoes: "", agua: 0, humor: 3, habitos: emptyHabits() };
}
function emptyPlan() {
  return {
    intencao: "",
    dias: Array.from({ length: 7 }, emptyDay),
    funcionou: "",
    melhorar: "",
    sensacao: ""
  };
}
function weekKey(date = /* @__PURE__ */ new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(
    ((d.getTime() - firstThursday.getTime()) / 864e5 - 3 + (firstThursday.getUTCDay() + 6) % 7) / 7
  );
  return `${d.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}
function mergePlan(raw) {
  const base = emptyPlan();
  if (!raw || typeof raw !== "object") return base;
  const r = raw;
  const dias = Array.from({ length: 7 }, (_, i) => {
    const src = r.dias?.[i] ?? {};
    return {
      ...emptyDay(),
      ...src,
      habitos: { ...emptyHabits(), ...src.habitos ?? {} }
    };
  });
  return {
    intencao: r.intencao ?? "",
    funcionou: r.funcionou ?? "",
    melhorar: r.melhorar ?? "",
    sensacao: r.sensacao ?? "",
    dias
  };
}
function WeeklyPlanner({ currentWeight, goalWeight } = {}) {
  const { user } = useAuth();
  const semanaIso = reactExports.useMemo(() => weekKey(), []);
  const [open, setOpen] = reactExports.useState(false);
  const [plan, setPlan] = reactExports.useState(emptyPlan);
  const [tipDay, setTipDay] = reactExports.useState(null);
  const [plateauOpen, setPlateauOpen] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const loadedRef = reactExports.useRef(false);
  const loadPlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("planner_semanal").select("dados").eq("user_id", user.id).eq("semana_iso", semanaIso).maybeSingle();
      if (error) throw error;
      if (data?.dados) {
        setPlan(mergePlan(data.dados));
      } else {
        try {
          const lsKey = `fenix:planner:${semanaIso}`;
          const raw = localStorage.getItem(lsKey);
          if (raw) {
            const parsed = mergePlan(JSON.parse(raw));
            setPlan(parsed);
            await supabase.from("planner_semanal").upsert(
              { user_id: user.id, semana_iso: semanaIso, dados: parsed },
              { onConflict: "user_id,semana_iso" }
            );
            localStorage.removeItem(lsKey);
          } else {
            setPlan(emptyPlan());
          }
        } catch {
          setPlan(emptyPlan());
        }
      }
    } catch {
      try {
        const raw = localStorage.getItem(`fenix:planner:${semanaIso}`);
        if (raw) setPlan(mergePlan(JSON.parse(raw)));
      } catch {
      }
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!user || loadedRef.current) return;
    loadedRef.current = true;
    loadPlan();
  }, [user]);
  reactExports.useEffect(() => {
    if (open && user) loadPlan();
  }, [open]);
  const setDay = (i, patch) => {
    setPlan((p) => {
      const dias = p.dias.slice();
      dias[i] = { ...dias[i], ...patch };
      return { ...p, dias };
    });
  };
  const toggleHabit = (i, h) => {
    setPlan((p) => {
      const dias = p.dias.slice();
      dias[i] = { ...dias[i], habitos: { ...dias[i].habitos, [h]: !dias[i].habitos[h] } };
      return { ...p, dias };
    });
  };
  const save = async () => {
    if (!user) {
      toast.error("Faça login para salvar o planner.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("planner_semanal").upsert(
        { user_id: user.id, semana_iso: semanaIso, dados: plan },
        { onConflict: "user_id,semana_iso" }
      );
      if (error) throw error;
      toast.success("Planner salvo");
      setOpen(false);
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };
  const peso = typeof currentWeight === "number" && currentWeight > 0 ? currentWeight : null;
  const proteinaMeta = peso ? Math.round(peso * 1.8) : null;
  const aguaMetaL = peso ? Math.max(2, Math.round(peso * 35 / 100) / 10) : 2.5;
  const objetivo = peso == null || goalWeight == null ? null : goalWeight < peso ? "Déficit" : goalWeight > peso ? "Ganho" : "Manutenção";
  const preenchidos = plan.dias.filter(
    (d) => d.treino || d.refeicoes || d.agua > 0 || Object.values(d.habitos).some(Boolean)
  ).length;
  const totalHabitos = plan.dias.reduce(
    (s, d) => s + Object.values(d.habitos).filter(Boolean).length,
    0
  );
  const maxHabitos = 7 * HABITOS_DEF.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "planner-semanal", className: "mt-4 glass rounded-2xl p-5 scroll-mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Planner Semanal" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: plan.intencao ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Intenção: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: plan.intencao })
    ] }) : "Planeje, execute e marque. 2 minutos por dia." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
      preenchidos,
      "/7 dias • ",
      totalHabitos,
      "/",
      maxHabitos,
      " hábitos"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-3 h-10 bg-gradient-ember text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 mr-1" }),
        " Abrir planner"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[88vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Planner Semanal" }) }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }),
        !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 md:grid-cols-4 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaChip,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5" }),
                label: "Objetivo",
                value: objetivo ?? "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaChip,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Beef, { className: "h-3.5 w-3.5" }),
                label: "Proteína/dia",
                value: proteinaMeta ? `${proteinaMeta}g` : "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MetaChip,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-3.5 w-3.5" }),
                label: "Água/dia",
                value: `${aguaMetaL}L`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setPlateauOpen(true),
                className: "flex items-center justify-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/15",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                  "Estagnado?"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "text-xs uppercase tracking-widest text-muted-foreground",
                htmlFor: "intencao",
                children: "Intenção da semana"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "intencao",
                value: plan.intencao,
                onChange: (e) => setPlan((p) => ({ ...p, intencao: e.target.value })),
                placeholder: "Ex: treinar 4x e dormir 8h",
                className: "mt-1.5"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "semana", className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "semana", className: "text-xs", children: "Semana" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "habitos", className: "text-xs", children: "Hábitos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "reflexao", className: "text-xs", children: "Reflexão" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "semana", className: "mt-3 space-y-3", children: DIAS_CURTO.map((nome, i) => {
              const d = plan.dias[i];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/50 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: nome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: HUMOR_EMOJI.map((e, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        "aria-label": `humor ${idx + 1}`,
                        onClick: () => setDay(i, { humor: idx + 1 }),
                        className: `text-base transition ${d.humor === idx + 1 ? "scale-125" : "opacity-40 hover:opacity-80"}`,
                        children: e
                      },
                      idx
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setTipDay(i),
                        className: "flex items-center gap-1 rounded-md border border-accent/40 px-2 py-1 text-[11px] text-accent hover:bg-accent/10",
                        "aria-label": `Dica de ${DIAS_LONGO[i]}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-3 w-3" }),
                          " Dica"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: d.treino,
                      onChange: (e) => setDay(i, { treino: e.target.value }),
                      placeholder: "Treino",
                      "aria-label": `treino ${nome}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: d.refeicoes,
                      onChange: (e) => setDay(i, { refeicoes: e.target.value }),
                      placeholder: "Refeições foco",
                      "aria-label": `refeições ${nome}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Água" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      d.agua,
                      " copos"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "range",
                      min: 0,
                      max: 12,
                      value: d.agua,
                      onChange: (e) => setDay(i, { agua: Number(e.target.value) }),
                      className: "w-full accent-primary",
                      "aria-label": `água ${nome}`
                    }
                  )
                ] })
              ] }, nome);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "habitos", className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-normal pb-2 pr-2", children: "Hábito" }),
                  DIAS_CURTO.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "font-normal pb-2 px-1 text-center", children: d }, d))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: HABITOS_DEF.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-2 text-foreground/85", children: h.label }),
                  plan.dias.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-1 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: d.habitos[h.key],
                      onCheckedChange: () => toggleHabit(i, h.key),
                      "aria-label": `${h.label} ${DIAS_CURTO[i]}`
                    }
                  ) }, i))
                ] }, h.key)) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Marque ao final do dia. Pequenas marcações constroem identidade." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "reflexao", className: "mt-3 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground",
                    htmlFor: "funcionou",
                    children: "O que funcionou?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "funcionou",
                    value: plan.funcionou,
                    onChange: (e) => setPlan((p) => ({ ...p, funcionou: e.target.value })),
                    rows: 2,
                    className: "mt-1.5",
                    placeholder: "Hábitos, decisões, treinos que renderam."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground",
                    htmlFor: "melhorar",
                    children: "O que posso melhorar?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "melhorar",
                    value: plan.melhorar,
                    onChange: (e) => setPlan((p) => ({ ...p, melhorar: e.target.value })),
                    rows: 2,
                    className: "mt-1.5",
                    placeholder: "Um ajuste prático para a próxima semana."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs uppercase tracking-widest text-muted-foreground",
                    htmlFor: "sensacao",
                    children: "Como me senti em relação ao meu corpo?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "sensacao",
                    value: plan.sensacao,
                    onChange: (e) => setPlan((p) => ({ ...p, sensacao: e.target.value })),
                    rows: 2,
                    className: "mt-1.5",
                    placeholder: "Energia, postura, roupas, espelho — sem julgamento."
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: save,
              disabled: saving,
              className: "mt-4 h-12 w-full bg-gradient-ember text-primary-foreground",
              children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
                " Salvando…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1" }),
                " Salvar planner"
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: tipDay !== null, onOpenChange: (v) => !v && setTipDay(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5 text-accent" }),
        tipDay !== null ? `${DIAS_LONGO[tipDay]} — ${DICAS_DIA[tipDay].titulo}` : ""
      ] }) }),
      tipDay !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-foreground/85", children: DICAS_DIA[tipDay].texto })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: plateauOpen, onOpenChange: setPlateauOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtocoloPlateau, {}) }) })
  ] });
}
function MetaChip({ icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/50 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-sm font-semibold", children: value })
  ] });
}
function WelcomeModal({ userId, show, onStart }) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (show) setOpen(true);
  }, [show]);
  const dismiss = async () => {
    if (saving) return;
    setSaving(true);
    setOpen(false);
    try {
      await supabase.from("profiles").update({ has_seen_welcome: true }).eq("id", userId);
      qc.invalidateQueries({ queryKey: ["profile", userId] });
    } catch {
    } finally {
      setSaving(false);
    }
  };
  const handleStart = () => {
    void dismiss();
    onStart?.();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) void dismiss();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg p-0 overflow-hidden border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-ember px-6 pt-8 pb-6 text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20 pointer-events-none [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-background/15 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6", strokeWidth: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] opacity-80", children: "Método Fênix" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg leading-tight", children: "Bem-vindo(a)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "absolute right-5 top-5 h-4 w-4 opacity-70" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl leading-snug", children: "Que bom ter você aqui." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3 text-sm leading-relaxed text-foreground/85", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Você deu um passo importante ao chegar até aqui. A partir de hoje, você tem um caminho claro para seguir, no seu ritmo, rumo à sua melhor versão." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "O seu celular agora joga a seu favor. Vamos construir juntos uma rotina que faça sentido para a sua vida." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/50 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-widest text-muted-foreground mb-2", children: "Por onde começar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-ember text-[11px] font-semibold text-primary-foreground", children: "1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Passe pela aba ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Método" }),
                    " e conheça os princípios que vão guiar a sua jornada."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-ember text-[11px] font-semibold text-primary-foreground", children: "2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Volte para a aba ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Início" }),
                    " e monte o seu Planner da semana com calma."
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80", children: "Estamos com você em cada passo. Vamos juntos." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleStart,
              disabled: saving,
              className: "mt-5 h-12 w-full bg-gradient-ember text-primary-foreground shadow-ember",
              children: "Quero começar meu planejamento"
            }
          )
        ] })
      ] })
    }
  );
}
const MOODS = [
  { key: "muito_baixo", emoji: "😞", label: "Muito desanimado" },
  { key: "baixo", emoji: "🙁", label: "Desanimado" },
  { key: "neutro", emoji: "😐", label: "Neutro" },
  { key: "bom", emoji: "🙂", label: "Animado" },
  { key: "otimo", emoji: "🤩", label: "Muito animado" }
];
const FRASES = {
  muito_baixo: [
    "Dias difíceis fazem parte do processo. Hoje, sua vitória é apenas não desistir.",
    "A Fênix renasce do silêncio. Faça o mínimo combinado — só isso já te coloca à frente de ontem.",
    "Você não precisa estar bem para fazer o certo. Um copo de água, uma respiração, um passo."
  ],
  baixo: [
    "Energia baixa não é desculpa, é informação. Ajuste o ritmo, mas mantenha a direção.",
    "Constância > intensidade. Hoje, entregue 60% com excelência.",
    "Tropeçar não é cair. Levante a cabeça e dê o próximo passo do plano."
  ],
  neutro: [
    "Neutro é solo fértil. Plante uma ação simples e vê o que floresce.",
    "Sem drama, sem desculpa — execute. O resultado vem da repetição, não da motivação.",
    "Dia médio é onde o método trabalha por você. Confia no sistema."
  ],
  bom: [
    "Energia boa? Use para empilhar hábitos: treino + água + sono.",
    "Aproveite o dia bom para deixar a próxima versão de você mais fácil.",
    "Você está em ritmo. Não acelere — sustente."
  ],
  otimo: [
    "Pico de energia é para construir, não para gastar. Ataque o que estava adiando.",
    "Use o dia ótimo para registrar tudo: humor alto + dado bom = roteiro replicável.",
    "Fênix em chamas. Lembre: amanhã, o método continua — mesmo se a chama baixar."
  ]
};
function frasePara(mood) {
  const arr = FRASES[mood];
  return arr[Math.floor(Math.random() * arr.length)];
}
const PERGUNTA = "Como você está hoje?";
function HumorCheckIn() {
  const { user } = useAuth();
  const userId = user?.id;
  const [loaded, setLoaded] = reactExports.useState(false);
  const [savedMood, setSavedMood] = reactExports.useState(null);
  const [frase, setFrase] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      const { data } = await supabase.from("diario_registro").select("humor,resposta").eq("user_id", userId).eq("registrado_em", todayISO()).eq("pergunta", PERGUNTA).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!alive) return;
      if (data?.humor) {
        setSavedMood(data.humor);
        setFrase(data.resposta ?? null);
      }
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);
  const pick = async (mood) => {
    if (!userId || saving) return;
    if (savedMood && !editing) return;
    setSaving(true);
    const novaFrase = frasePara(mood);
    const prevMood = savedMood;
    const prevFrase = frase;
    setSavedMood(mood);
    setFrase(novaFrase);
    setEditing(false);
    try {
      const { error } = await supabase.from("diario_registro").insert({
        user_id: userId,
        pergunta: PERGUNTA,
        humor: mood,
        resposta: novaFrase,
        registrado_em: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      toast.success(prevMood ? "Humor atualizado" : "Humor registrado");
    } catch {
      setSavedMood(prevMood);
      setFrase(prevFrase);
      toast.error("Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };
  if (!loaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 glass rounded-2xl p-5 h-[112px] animate-pulse opacity-60" });
  }
  const locked = !!savedMood && !editing;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 glass rounded-2xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Como você está hoje?" }),
      locked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setEditing(true),
          className: "ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
            " registrado · alterar"
          ]
        }
      ) : savedMood && editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setEditing(false),
          className: "ml-auto text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition",
          children: "cancelar"
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-1.5", children: MOODS.map((m) => {
      const active = savedMood === m.key;
      const dim = locked && !active;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": m.label,
          "aria-pressed": active,
          disabled: locked || saving,
          onClick: () => pick(m.key),
          className: `flex-1 grid place-items-center rounded-xl py-2.5 text-2xl transition ${active ? "bg-gradient-ember shadow-ember scale-110" : dim ? "opacity-30" : "bg-card/40 hover:bg-card hover:scale-110 active:scale-95"} ${locked ? "" : "cursor-pointer"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.emoji })
        },
        m.key
      );
    }) }),
    frase && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 shrink-0 text-primary mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground/90", children: frase })
    ] })
  ] });
}
function computeStreak(dates) {
  const set = new Set(dates);
  let streak = 0;
  const d = /* @__PURE__ */ new Date();
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
function iso(d) {
  return d.toLocaleDateString("sv-SE");
}
const WeightChart = reactExports.lazy(() => import("./weight-chart-BM9qqbYY.mjs"));
function Dashboard() {
  const {
    user
  } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const {
    data: perfil,
    isSuccess: perfilReady
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  reactExports.useEffect(() => {
    if (!perfilReady) return;
    if (perfil?.papel === "admin") navigate({
      to: "/app/instrutor"
    });
  }, [perfilReady, perfil?.papel, navigate]);
  if (!perfilReady) return null;
  if (perfil?.papel === "admin") return null;
  if (perfil?.papel === "instrutor" || perfil?.papel === "nutricionista") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardProfissional, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardAluno, {});
}
function DashboardProfissional() {
  const {
    user
  } = useAuth();
  const userId = user?.id ?? "";
  const {
    data: perfil
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  const {
    data: alunos = [],
    isLoading: loadingAlunos
  } = useQuery({
    ...instrutorAlunosQuery(userId),
    enabled: !!userId
  });
  const {
    data: totalTreinos = 0
  } = useQuery({
    ...planosTreinoInstrutorCountQuery(userId),
    enabled: !!userId
  });
  const {
    data: totalDietas = 0
  } = useQuery({
    ...planosAlimentaresInstrutorCountQuery(userId),
    enabled: !!userId
  });
  const {
    data: avisos = []
  } = useQuery({
    ...avisosInstrutorQuery(userId),
    enabled: !!userId
  });
  const avisosNaoLidos = avisos.filter((a) => !a.lida);
  const papel = perfil?.papel === "nutricionista" ? "Nutricionista" : "Instrutor";
  if (loadingAlunos) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-2xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: papel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl", children: "Gestão de alunos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: "Acompanhe seus alunos, prescreva treinos e organize planos alimentares em um só lugar." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-ember grid place-items-center shadow-ember mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary-foreground", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-gradient-ember", children: alunos.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: alunos.length === 1 ? "Aluno" : "Alunos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-ember grid place-items-center shadow-ember mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4 text-primary-foreground", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-gradient-ember", children: totalTreinos }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: totalTreinos === 1 ? "Plano de treino" : "Planos de treino" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-ember grid place-items-center shadow-ember mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-4 w-4 text-primary-foreground", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl text-gradient-ember", children: totalDietas }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: totalDietas === 1 ? "Plano alimentar" : "Planos alimentares" })
      ] })
    ] }),
    alunos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7 text-primary-foreground", strokeWidth: 2 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Nenhum aluno vinculado ainda" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto", children: "Adicione ou vincule alunos para começar a prescrever treinos e cardápios." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-gradient-ember text-primary-foreground shadow-ember", children: "Gerenciar alunos" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      avisosNaoLidos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-center gap-2 border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium", children: "Atividade recente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground", children: avisosNaoLidos.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: avisosNaoLidos.slice(0, 3).map((aviso) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-3 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-lg border border-primary/20 bg-primary/10 p-1.5 text-primary shrink-0", children: aviso.tipo === "dieta_seguida" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: aviso.titulo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: aviso.aluno_nome ?? "Aluno" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor/$alunoId", params: {
            alunoId: aviso.aluno_id
          }, className: "text-xs text-primary hover:underline shrink-0", children: "Abrir" })
        ] }, aviso.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition cursor-pointer group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary-foreground", strokeWidth: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Gerenciar alunos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Ver lista completa, prescrever treinos e planos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition" })
      ] }) })
    ] })
  ] });
}
function DashboardAluno() {
  const {
    user
  } = useAuth();
  const userId = user?.id ?? "";
  const qc = useQueryClient();
  const {
    data: profile,
    isPending: profilePending
  } = useQuery({
    ...profileQuery(userId),
    enabled: !!userId
  });
  const {
    data: weights = []
  } = useQuery({
    ...weightsQuery(userId),
    enabled: !!userId
  });
  const {
    data: recentMeals = []
  } = useQuery({
    ...mealsRecentQuery(userId),
    enabled: !!userId
  });
  const {
    data: badgeList = []
  } = useQuery({
    ...badgesQuery(userId),
    enabled: !!userId
  });
  const {
    data: guias = []
  } = useQuery(guiasMentaisQuery);
  const checkinKey = ["checkin_diario", userId, todayISO()];
  const {
    data: checkedIn = false
  } = useQuery({
    queryKey: checkinKey,
    enabled: !!userId,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("diario_registro").select("id").eq("user_id", userId).eq("registrado_em", todayISO()).eq("pergunta", "Check-in diário").limit(1).maybeSingle();
      return !!data;
    }
  });
  const {
    data: checkinDates = []
  } = useQuery({
    queryKey: ["checkin_dates", userId],
    enabled: !!userId,
    queryFn: async () => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - 30);
      const since = d.toLocaleDateString("sv-SE");
      const {
        data
      } = await supabase.from("diario_registro").select("registrado_em").eq("user_id", userId).eq("pergunta", "Check-in diário").gte("registrado_em", since);
      return (data ?? []).map((r) => r.registrado_em);
    }
  });
  const [newWeight, setNewWeight] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [savingWeight, setSavingWeight] = reactExports.useState(false);
  const [streakPulse, setStreakPulse] = reactExports.useState(false);
  const today = todayISO();
  const todayMeals = reactExports.useMemo(() => recentMeals.filter((r) => r.logged_date === today), [recentMeals, today]);
  const todayCals = reactExports.useMemo(() => todayMeals.reduce((s, r) => s + r.calories, 0), [todayMeals]);
  const streak = reactExports.useMemo(() => computeStreak([.../* @__PURE__ */ new Set([...recentMeals.map((r) => r.logged_date), ...checkinDates])]), [recentMeals, checkinDates]);
  const unlocked = reactExports.useMemo(() => new Set(badgeList), [badgeList]);
  const streak7Inflight = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!userId || streak < 7 || unlocked.has("streak_7") || streak7Inflight.current) return;
    streak7Inflight.current = true;
    (async () => {
      try {
        const {
          error
        } = await supabase.from("badges").upsert({
          user_id: userId,
          badge_type: "streak_7"
        }, {
          onConflict: "user_id,badge_type"
        });
        if (error) {
          console.error("badge streak_7 upsert failed", error);
          return;
        }
        qc.invalidateQueries({
          queryKey: ["badges", userId]
        });
      } finally {
        streak7Inflight.current = false;
      }
    })();
  }, [streak, unlocked, userId, qc]);
  const celebrate = async () => {
    if (typeof window === "undefined") return;
    const {
      default: confetti
    } = await import("../_libs/canvas-confetti.mjs");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: {
        y: 0.25
      },
      colors: ["#ff7a1a", "#ffb347", "#ffd27a"]
    });
    setStreakPulse(true);
    setTimeout(() => setStreakPulse(false), 1200);
  };
  const checkIn = async () => {
    if (!user || checkedIn) return;
    const {
      error
    } = await supabase.from("diario_registro").insert({
      user_id: user.id,
      pergunta: "Check-in diário",
      resposta: "Check-in realizado",
      registrado_em: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) return toast.error(error.message);
    celebrate();
    toast.success("Check-in registrado. Continue firme!");
    qc.invalidateQueries({
      queryKey: checkinKey
    });
    qc.invalidateQueries({
      queryKey: ["checkin_dates", userId]
    });
  };
  const logWeight = async () => {
    if (!user || !newWeight || savingWeight) return;
    const w = parseFloat(newWeight.replace(",", "."));
    if (!Number.isFinite(w) || w < 30 || w > 300) {
      return toast.error("Peso inválido (30–300 kg)");
    }
    setSavingWeight(true);
    try {
      const [weightRes, profileRes, badgesRes] = await Promise.all([supabase.from("weight_logs").upsert({
        user_id: user.id,
        weight: w,
        logged_date: todayISO()
      }, {
        onConflict: "user_id,logged_date"
      }), supabase.from("profiles").update({
        current_weight: w
      }).eq("id", user.id), supabase.from("badges").select("badge_type").eq("user_id", user.id)]);
      if (weightRes.error) return toast.error(weightRes.error.message);
      if (profileRes.error) {
        console.error("profile update failed", profileRes.error);
        toast.error("Peso salvo, mas o perfil não atualizou.");
      }
      if (badgesRes.error) {
        console.error("badges read failed", badgesRes.error);
      }
      const alreadyHas = new Set((badgesRes.data ?? []).map((r) => r.badge_type));
      const goal = profile?.goal_weight;
      const toUnlock = [];
      if (!alreadyHas.has("first_log")) toUnlock.push("first_log");
      if (goal != null && w <= goal && !alreadyHas.has("goal_reached")) toUnlock.push("goal_reached");
      if (toUnlock.length > 0) {
        const results = await Promise.all(toUnlock.map((badge_type) => supabase.from("badges").upsert({
          user_id: user.id,
          badge_type
        }, {
          onConflict: "user_id,badge_type"
        })));
        const newlyUnlocked = toUnlock.filter((_, i) => !results[i].error);
        results.forEach((r, i) => {
          if (r.error) console.error(`badge ${toUnlock[i]} upsert failed`, r.error);
        });
        if (newlyUnlocked.length > 0) {
          celebrate();
          const titles = newlyUnlocked.map((t) => ALL_BADGES.find((x) => x.type === t)?.title).filter(Boolean);
          toast.success(newlyUnlocked.length === 1 ? `Nova conquista: ${titles[0]} 🔥` : `${newlyUnlocked.length} novas conquistas: ${titles.join(", ")} 🔥`);
        } else {
          toast.success("Registro salvo com sucesso! Conquista em progresso 🔥");
        }
      } else if (goal != null && w <= goal) {
        toast.success("Meta atingida. Renascido. 🔥");
      } else {
        toast.success("Registro salvo com sucesso! Conquista em progresso 🔥");
      }
      setNewWeight("");
      setOpen(false);
      qc.invalidateQueries({
        queryKey: ["profile", userId]
      });
      qc.invalidateQueries({
        queryKey: ["weights", userId]
      });
      qc.invalidateQueries({
        queryKey: ["badges", userId]
      });
    } finally {
      setSavingWeight(false);
    }
  };
  const calGoal = profile?.daily_calorie_goal ?? 2e3;
  const pct = Math.min(100, Math.round(todayCals / calGoal * 100));
  const startW = weights[0]?.weight ?? profile?.current_weight ?? 0;
  const currentW = profile?.current_weight ?? startW;
  const goalW = profile?.goal_weight ?? currentW;
  const totalLoss = Math.max(0, startW - currentW);
  const remaining = Math.max(0, currentW - goalW);
  const motivation = pct === 0 ? "Comece com pequena vitória: registre sua primeira refeição." : pct < 40 ? `Você abriu o dia com ${pct}%. Cada escolha conta.` : pct < 80 ? `Você está a ${pct}% da sua meta. Mantenha o ritmo.` : pct < 100 ? `Quase lá — ${100 - pct}% para fechar o dia.` : pct === 100 ? "Meta atingida. Dia redondo." : "Atenção: você ultrapassou sua meta calórica.";
  if (profilePending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md lg:max-w-6xl px-5 lg:px-8 pt-8 pb-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `glass rounded-2xl p-4 flex items-center gap-4 border-primary/20 ${streakPulse ? "animate-streak" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative h-14 w-14 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember ${streakPulse ? "animate-pop" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7 text-primary-foreground", strokeWidth: 2 }),
          streak >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "absolute -top-1 -right-1 h-4 w-4 text-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Streak" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl text-gradient-ember leading-none", children: streak }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "dias seguidos" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: checkIn, disabled: checkedIn, size: "sm", className: "h-11 px-4 bg-gradient-ember text-primary-foreground shadow-ember disabled:opacity-60 disabled:bg-secondary disabled:bg-none disabled:text-muted-foreground disabled:shadow-none", children: checkedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1" }),
          " Feito"
        ] }) : "Check-in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "mt-6 flex items-end justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Olá," }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl mt-1", children: profile?.display_name ?? "Fênix" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HumorCheckIn, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 glass rounded-3xl p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Meta de hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto mt-4 h-44 w-44", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "h-full w-full -rotate-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "44", fill: "none", stroke: "oklch(0.26 0.008 60)", strokeWidth: "6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "44", fill: "none", stroke: "url(#g)", strokeWidth: "6", strokeLinecap: "round", strokeDasharray: `${pct / 100 * 276} 276` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g", x1: "0", x2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.72 0.18 47)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.82 0.15 65)" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl", children: todayCals }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "/ ",
              calGoal,
              " kcal"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm text-muted-foreground", children: calGoal - todayCals > 0 ? `Restam ${calGoal - todayCals} kcal` : "Meta atingida" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 glass rounded-2xl p-5 border-l-2 border-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
          " Resumo do dia"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed", children: motivation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1.5 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-ember transition-all", style: {
          width: `${pct}%`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-display text-2xl", children: [
            totalLoss.toFixed(1),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: " kg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Perdidos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-display text-2xl", children: [
            remaining.toFixed(1),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: " kg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Faltam" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Ações rápidas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/alimentacao", className: "group glass rounded-2xl p-4 flex flex-col gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Registrar refeição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Diário alimentar" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/treinos", className: "group glass rounded-2xl p-4 flex flex-col gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Marcar treino" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Sessão de hoje" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen(true), className: "group glass rounded-2xl p-4 flex flex-col gap-3 text-left transition hover:border-primary/40 hover:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Registrar peso" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Atualize agora" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => document.getElementById("planner-semanal")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          }), className: "group glass rounded-2xl p-4 flex flex-col gap-3 text-left transition hover:border-primary/40 hover:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Ver planner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Sua semana" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WeeklyPlanner, { currentWeight: profile?.current_weight, goalWeight: profile?.goal_weight }),
      userId && /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeModal, { userId, show: !!profile && profile.onboarding_complete && !profile.has_seen_welcome, onStart: () => {
        requestAnimationFrame(() => {
          document.getElementById("planner-semanal")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Evolução do peso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-gradient-ember text-primary-foreground h-10 px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Registrar"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Peso de hoje" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", placeholder: "kg", value: newWeight, onChange: (e) => setNewWeight(e.target.value), autoFocus: true, className: "h-12 bg-background/40 border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: logWeight, disabled: savingWeight, className: "h-12 bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95 hover:shadow-ember focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-80", children: savingWeight ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
                " Salvando…"
              ] }) : "Salvar" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40", children: weights.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-xs text-muted-foreground", children: "Sem registros ainda" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-full w-full" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeightChart, { data: weights, goal: profile?.goal_weight ?? null }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-11 w-11 shrink-0 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2.25 }),
            streak >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "absolute -top-1 -right-1 h-3.5 w-3.5 text-accent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Dias de Fênix consecutivos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl text-gradient-ember leading-none", children: streak }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: streak === 0 ? "comece hoje — registre uma refeição" : streak === 1 ? "dia — não quebre a sequência" : "dias seguidos — siga firme" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 lg:mt-0 lg:col-span-1 lg:sticky lg:top-6 space-y-4", children: [
      guias.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapsible, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleTrigger, { className: "group glass rounded-2xl p-4 w-full flex items-center gap-3 transition hover:border-primary/40 hover:bg-card data-[state=open]:border-primary/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 2 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Biblioteca de Mentalidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              guias.length,
              " guias para a mente Fênix"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children: guias.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/guias/$chave", params: {
          chave: g.chave
        }, className: "group glass rounded-xl p-3 flex items-center gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.99]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary", strokeWidth: 2 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: g.titulo }),
            g.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: g.descricao })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition group-hover:text-primary" })
        ] }, g.id)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Conquistas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
            unlocked.size,
            "/",
            ALL_BADGES.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ALL_BADGES.map((b) => {
          const has = unlocked.has(b.type);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "img", "aria-label": `${b.title} — ${has ? "desbloqueada" : "bloqueada"}`, className: `rounded-xl p-3 text-center border ${has ? "border-primary/30 bg-primary/5" : "border-border opacity-50"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-auto h-10 w-10 rounded-full flex items-center justify-center ${has ? "bg-gradient-ember shadow-ember" : "bg-secondary"}`, children: has ? /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[11px] font-medium leading-tight", children: b.title })
          ] }, b.type);
        }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
