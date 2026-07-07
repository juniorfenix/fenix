import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as ExercicioMedia } from "./exercicio-media-BnHIyEAO.mjs";
import { R as Route$2, u as useAuth, a as perfilQuery, i as instrutorAlunosQuery, E as planosTreinoInstrutorQuery, F as planosAlimentaresInstrutorQuery, s as supabase, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, q as planoExerciciosQuery, A as planoRefeicoesQuery, r as conclusoesTreinoQuery, z as adesaoAlimentarQuery, B as exerciciosQuery } from "./router-DSsXXfgN.mjs";
import { B as Button, I as Input } from "./input-VcF1Z4i4.mjs";
import { T as Textarea } from "./textarea-BRbEq4sW.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bccwonsm.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BstMKzPM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as LoaderCircle, A as ArrowLeft, j as Dumbbell, k as Utensils, ad as TrendingUp, P as Plus, ai as Trash2, a8 as Clock, a3 as CircleX, N as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NIVEIS = ["iniciante", "intermediario", "avancado"];
const REFEICOES = ["Café da manhã", "Lanche", "Almoço", "Pré-treino", "Pós-treino", "Jantar", "Ceia"];
function MiniCalendario({
  conclusoes
}) {
  const feitos = new Set(conclusoes.map((c) => c.data));
  const today = /* @__PURE__ */ new Date();
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString("sv-SE"),
      dow: d.getDay()
    });
  }
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 mb-1", children: DIAS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-[9px] text-muted-foreground", children: d[0] }, d)) }),
    weeks.map((week, wi) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({
      length: 7
    }, (_, di) => {
      const cell = week.find((d) => d.dow === di);
      if (!cell) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, di);
      const done = feitos.has(cell.date);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: cell.date, className: `h-5 w-full rounded ${done ? "bg-primary" : "bg-muted/30"}` }, di);
    }) }, wi))
  ] });
}
function ProgressoTreinoCard({
  plano,
  alunoId
}) {
  const {
    data: conclusoes = [],
    isLoading
  } = useQuery(conclusoesTreinoQuery(plano.id, alunoId, 28));
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card/50 p-5 animate-pulse h-24" });
  }
  const porDia = {};
  for (const c of conclusoes) {
    porDia[c.dia_semana] = (porDia[c.dia_semana] ?? 0) + 1;
  }
  const diasAtivos = Object.keys(porDia).map(Number);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: plano.nome }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
        conclusoes.length,
        " treino(s) nos últimos 28 dias"
      ] })
    ] }),
    diasAtivos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[12px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive/60" }),
      "Aluno ainda não registrou nenhum treino deste plano."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: DIAS.map((label, idx) => {
      const feitos = porDia[idx] ?? 0;
      if (feitos === 0) return null;
      const pct = Math.round(feitos / 4 * 100);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-primary/30 bg-primary/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
          feitos,
          "/4 (",
          pct,
          "%)"
        ] })
      ] }, idx);
    }) }),
    conclusoes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Últimas 4 semanas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniCalendario, { conclusoes })
    ] })
  ] });
}
function ProgressoAlimentarCard({
  plano,
  alunoId
}) {
  const {
    data: adesoes = [],
    isLoading
  } = useQuery(adesaoAlimentarQuery(plano.id, alunoId, 30));
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card/50 p-5 animate-pulse h-20" });
  }
  const total = adesoes.length;
  const pct = Math.round(total / 30 * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: plano.nome }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
        total,
        "/30 dias (últimos 30)"
      ] })
    ] }),
    total === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[12px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive/60" }),
      "Aluno ainda não registrou adesão a este plano."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Adesão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
          pct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-ember transition-all", style: {
        width: `${pct}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 pt-1", children: [
        adesoes.slice(0, 10).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: a.data.slice(5) }, a.id)),
        total > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground", children: [
          "+",
          total - 10,
          " mais"
        ] })
      ] })
    ] })
  ] });
}
function PlanoTreinoCard({
  plano,
  instrutorId
}) {
  const queryClient = useQueryClient();
  const [showAddExercicio, setShowAddExercicio] = reactExports.useState(false);
  const [dia, setDia] = reactExports.useState(1);
  const [exercicioId, setExercicioId] = reactExports.useState("");
  const [series, setSeries] = reactExports.useState("3");
  const [reps, setReps] = reactExports.useState("10-12");
  const [descanso, setDescanso] = reactExports.useState("60");
  const [obs, setObs] = reactExports.useState("");
  const {
    data: exerciciosPlano = []
  } = useQuery(planoExerciciosQuery(plano.id));
  const {
    data: todosExercicios = []
  } = useQuery(exerciciosQuery);
  const adicionarExercicio = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("planos_treino_exercicios").insert({
        plano_id: plano.id,
        exercicio_id: Number(exercicioId),
        dia_semana: dia,
        series: Number(series),
        repeticoes: reps,
        descanso_seg: Number(descanso),
        observacoes: obs || null,
        ordem: exerciciosPlano.filter((e) => e.dia_semana === dia).length
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plano-exercicios", plano.id]
      });
      setShowAddExercicio(false);
      setExercicioId("");
      toast.success("Exercício adicionado.");
    },
    onError: (error) => toast.error(errorMessage(error, "Erro ao adicionar exercício."))
  });
  const removerExercicio = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("planos_treino_exercicios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["plano-exercicios", plano.id]
    })
  });
  const desativarPlano = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("planos_treino").update({
        ativo: false
      }).eq("id", plano.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-treino-instrutor", instrutorId, plano.aluno_id]
      });
      toast.success("Plano desativado.");
    }
  });
  const byDay = DIAS.reduce((acc, _, i) => {
    acc[i] = exerciciosPlano.filter((e) => e.dia_semana === i);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/50 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: plano.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground capitalize", children: [
          plano.nivel,
          " · ",
          exerciciosPlano.length,
          " exercício(s)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowAddExercicio(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Exercício"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => desativarPlano.mutate(), className: "text-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }),
    Object.entries(byDay).map(([diaIdx, list]) => {
      if (!list.length) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/20 last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20", children: DIAS[Number(diaIdx)] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/20", children: list.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: item.exercicio.gif_url ?? item.exercicio.video_url, alt: item.exercicio.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: item.exercicio.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary", children: [
              item.series,
              "x",
              item.repeticoes,
              " · ",
              item.descanso_seg,
              "s descanso"
            ] }),
            item.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: item.observacoes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removerExercicio.mutate(item.id), className: "shrink-0 text-destructive/60 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }, item.id)) })
      ] }, diaIdx);
    }),
    exerciciosPlano.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-6 text-center text-sm text-muted-foreground", children: 'Nenhum exercício ainda. Clique em "+ Exercício".' }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddExercicio, onOpenChange: setShowAddExercicio, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar exercício" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Dia da semana" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: String(dia), onValueChange: (v) => setDia(Number(v)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DIAS.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i), children: d }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Exercício" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: exercicioId, onValueChange: setExercicioId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecionar exercício" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: todosExercicios.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(e.id), children: e.nome }, e.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Séries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: series, onChange: (e) => setSeries(e.target.value), className: "h-8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Reps" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: reps, onChange: (e) => setReps(e.target.value), className: "h-8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Descanso (s)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: descanso, onChange: (e) => setDescanso(e.target.value), className: "h-8" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Observações (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: obs, onChange: (e) => setObs(e.target.value), className: "h-16 resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !exercicioId || adicionarExercicio.isPending, onClick: () => adicionarExercicio.mutate(), children: adicionarExercicio.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Adicionar" })
      ] })
    ] }) })
  ] });
}
function CriarPlanoTreino({
  instrutorId,
  alunoId
}) {
  const queryClient = useQueryClient();
  const [nome, setNome] = reactExports.useState("");
  const [nivel, setNivel] = reactExports.useState("iniciante");
  const [open, setOpen] = reactExports.useState(false);
  const criar = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("planos_treino").insert({
        instrutor_id: instrutorId,
        aluno_id: alunoId,
        nome,
        nivel
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-treino-instrutor", instrutorId, alunoId]
      });
      setNome("");
      setOpen(false);
      toast.success("Plano de treino criado.");
    },
    onError: (error) => toast.error(errorMessage(error, "Erro ao criar plano."))
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Novo plano"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo plano de treino" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Nome do plano (ex: Treino A)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: nivel, onValueChange: setNivel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: NIVEIS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: n, className: "capitalize", children: n }, n)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !nome.trim() || criar.isPending, onClick: () => criar.mutate(), children: criar.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Criar" })
      ] })
    ] }) })
  ] });
}
function CriarPlanoAlimentar({
  instrutorId,
  alunoId
}) {
  const queryClient = useQueryClient();
  const [nome, setNome] = reactExports.useState("");
  const [descricao, setDescricao] = reactExports.useState("");
  const [metaKcal, setMetaKcal] = reactExports.useState("");
  const [metaProt, setMetaProt] = reactExports.useState("");
  const [metaCarb, setMetaCarb] = reactExports.useState("");
  const [metaGord, setMetaGord] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const criar = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("planos_alimentares").insert({
        instrutor_id: instrutorId,
        aluno_id: alunoId,
        nome,
        descricao: descricao || null,
        meta_kcal: metaKcal ? Number(metaKcal) : null,
        meta_proteinas_g: metaProt ? Number(metaProt) : null,
        meta_carboidratos_g: metaCarb ? Number(metaCarb) : null,
        meta_gorduras_g: metaGord ? Number(metaGord) : null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-alimentares-instrutor", instrutorId, alunoId]
      });
      setNome("");
      setDescricao("");
      setOpen(false);
      toast.success("Plano alimentar criado.");
    },
    onError: (error) => toast.error(errorMessage(error, "Erro ao criar plano alimentar."))
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Novo plano"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo plano alimentar" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Nome do plano" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: descricao, onChange: (e) => setDescricao(e.target.value), placeholder: "Observações / descrição (opcional)", className: "h-20 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Meta kcal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: metaKcal, onChange: (e) => setMetaKcal(e.target.value), placeholder: "ex: 1800", className: "h-8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Proteínas (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: metaProt, onChange: (e) => setMetaProt(e.target.value), placeholder: "ex: 150", className: "h-8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Carboidratos (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: metaCarb, onChange: (e) => setMetaCarb(e.target.value), placeholder: "ex: 200", className: "h-8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Gorduras (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: metaGord, onChange: (e) => setMetaGord(e.target.value), placeholder: "ex: 60", className: "h-8" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !nome.trim() || criar.isPending, onClick: () => criar.mutate(), children: criar.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Criar" })
      ] })
    ] }) })
  ] });
}
function MacroChip({
  label,
  value,
  unit = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/5 border border-primary/20 p-2 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-primary", children: [
      value,
      unit
    ] })
  ] });
}
function PlanoAlimentarCard({
  plano,
  instrutorId
}) {
  const queryClient = useQueryClient();
  const [showAddRefeicao, setShowAddRefeicao] = reactExports.useState(false);
  const [refeicao, setRefeicao] = reactExports.useState("Almoço");
  const [horario, setHorario] = reactExports.useState("");
  const [descricao, setDescricao] = reactExports.useState("");
  const [kcal, setKcal] = reactExports.useState("");
  const [proteina, setProteina] = reactExports.useState("");
  const [obs, setObs] = reactExports.useState("");
  const {
    data: refeicoes = [],
    isLoading: loadingRefeicoes
  } = useQuery(planoRefeicoesQuery(plano.id));
  const adicionarRefeicao = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("plano_alimentar_refeicoes").insert({
        plano_id: plano.id,
        refeicao,
        horario: horario || null,
        descricao,
        kcal: kcal ? Number(kcal) : null,
        proteina_g: proteina ? Number(proteina) : null,
        observacoes: obs || null,
        ordem: refeicoes.length
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plano-refeicoes", plano.id]
      });
      setShowAddRefeicao(false);
      setDescricao("");
      setHorario("");
      setKcal("");
      setProteina("");
      setObs("");
      toast.success("Refeição adicionada.");
    },
    onError: (error) => toast.error(errorMessage(error, "Erro ao adicionar refeição."))
  });
  const removerRefeicao = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("plano_alimentar_refeicoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["plano-refeicoes", plano.id]
    }),
    onError: (error) => toast.error(errorMessage(error, "Erro ao remover refeição."))
  });
  const desativar = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("planos_alimentares").update({
        ativo: false
      }).eq("id", plano.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-alimentares-instrutor", instrutorId, plano.aluno_id]
      });
      toast.success("Plano desativado.");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border/60 bg-card/50 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: plano.nome }),
        plano.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 whitespace-pre-wrap", children: plano.descricao })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowAddRefeicao(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Refeição"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => desativar.mutate(), className: "text-destructive/60 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }),
    (plano.meta_kcal || plano.meta_proteinas_g) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4", children: [
      plano.meta_kcal && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "kcal", value: plano.meta_kcal }),
      plano.meta_proteinas_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "prot", value: plano.meta_proteinas_g, unit: "g" }),
      plano.meta_carboidratos_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "carb", value: plano.meta_carboidratos_g, unit: "g" }),
      plano.meta_gorduras_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "gord", value: plano.meta_gorduras_g, unit: "g" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border/30 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground", children: "Refeições prescritas" }),
      loadingRefeicoes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) }) : refeicoes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground", children: "Nenhuma refeição detalhada ainda. Adicione as refeições para o aluno seguir." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: refeicoes.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-xl border border-border/50 bg-background/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: item.refeicao }),
            item.horario && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              item.horario
            ] }),
            (item.kcal || item.proteina_g) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-primary", children: [
              item.kcal ? `${item.kcal} kcal` : "",
              item.kcal && item.proteina_g ? " · " : "",
              item.proteina_g ? `${item.proteina_g} g proteína` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground", children: item.descricao }),
          item.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-primary", children: item.observacoes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removerRefeicao.mutate(item.id), className: "shrink-0 text-destructive/60 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] }) }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddRefeicao, onOpenChange: setShowAddRefeicao, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar refeição" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Refeição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: refeicao, onValueChange: setRefeicao, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: REFEICOES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Horário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: horario, onChange: (e) => setHorario(e.target.value), placeholder: "ex: 12:30" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: descricao, onChange: (e) => setDescricao(e.target.value), placeholder: "Ex: 150 g arroz, 120 g frango, salada livre...", className: "h-24 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Kcal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: kcal, onChange: (e) => setKcal(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Proteína (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: proteina, onChange: (e) => setProteina(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: obs, onChange: (e) => setObs(e.target.value), placeholder: "Observação para o aluno (opcional)", className: "h-16 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: !descricao.trim() || adicionarRefeicao.isPending, onClick: () => adicionarRefeicao.mutate(), children: adicionarRefeicao.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Adicionar refeição" })
      ] })
    ] }) })
  ] });
}
function AlunoDetalhe() {
  const {
    alunoId
  } = Route$2.useParams();
  const {
    user
  } = useAuth();
  const instrutorId = user?.id ?? "";
  const {
    data: perfilAluno
  } = useQuery({
    ...perfilQuery(alunoId),
    enabled: !!alunoId
  });
  const {
    data: perfilInstrutor,
    isLoading: loadingPerfilInstrutor
  } = useQuery({
    ...perfilQuery(instrutorId),
    enabled: !!instrutorId
  });
  const isAdmin = perfilInstrutor?.papel === "admin";
  const {
    data: alunosVinculados = [],
    isLoading: loadingVinculo
  } = useQuery({
    ...instrutorAlunosQuery(instrutorId),
    enabled: !!instrutorId && !isAdmin
  });
  const vinculo = isAdmin || alunosVinculados.some((a) => a.aluno_id === alunoId);
  const {
    data: planosTreino = [],
    isLoading: loadingTreino
  } = useQuery({
    ...planosTreinoInstrutorQuery(instrutorId, alunoId),
    enabled: !!instrutorId && !!alunoId && !!vinculo
  });
  const {
    data: planosAlimentares = [],
    isLoading: loadingAlimentar
  } = useQuery({
    ...planosAlimentaresInstrutorQuery(instrutorId, alunoId),
    enabled: !!instrutorId && !!alunoId && !!vinculo
  });
  if (loadingPerfilInstrutor || loadingVinculo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-2xl px-5 pt-8 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) });
  }
  if (!vinculo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-2xl px-5 pt-8 pb-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Aluno não vinculado a este profissional." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Vincule o aluno no painel antes de criar treinos, dietas ou acompanhar progresso." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-2xl px-5 pt-8 pb-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: perfilAluno?.nome ?? "Aluno" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground font-mono", children: alunoId })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "treino", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "treino", className: "flex-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4" }),
          " Treino"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "alimentar", className: "flex-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-4 w-4" }),
          " Dieta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "progresso", className: "flex-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
          " Progresso"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "treino", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            planosTreino.length,
            " plano(s) de treino"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CriarPlanoTreino, { instrutorId, alunoId })
        ] }),
        loadingTreino ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : planosTreino.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "Nenhum plano de treino ainda. Crie o primeiro!" }) : planosTreino.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanoTreinoCard, { plano: p, instrutorId }, p.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "alimentar", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            planosAlimentares.length,
            " plano(s) alimentar(es)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CriarPlanoAlimentar, { instrutorId, alunoId })
        ] }),
        loadingAlimentar ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : planosAlimentares.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "Nenhum plano alimentar ainda. Crie o primeiro!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: planosAlimentares.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanoAlimentarCard, { plano: p, instrutorId }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "progresso", className: "space-y-6 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Conclusões de treino — últimos 28 dias" }),
          planosTreino.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "Nenhum plano de treino criado ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: planosTreino.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressoTreinoCard, { plano: p, alunoId }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Adesão à dieta — últimos 30 dias" }),
          planosAlimentares.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "Nenhum plano alimentar criado ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: planosAlimentares.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressoAlimentarCard, { plano: p, alunoId }, p.id)) })
        ] })
      ] })
    ] })
  ] });
}
function errorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}
export {
  AlunoDetalhe as component
};
