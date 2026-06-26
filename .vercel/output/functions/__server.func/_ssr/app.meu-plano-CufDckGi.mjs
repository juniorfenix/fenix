import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, s as supabase } from "./router-CJeOYY3V.mjs";
import { a as perfilQuery, c as planosTreinoAlunoQuery, d as planosAlimentaresAlunoQuery, e as planoExerciciosQuery, f as adesaoAlimentarQuery, h as planoRefeicoesQuery, i as conclusoesTreinoQuery } from "./queries-P0tOdmfu.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D_u1EXWn.mjs";
import { S as Skeleton } from "./skeleton-CoUJiN10.mjs";
import { L as LazyMount } from "./LazyMount-sGAIcH1c.mjs";
import { E as ExercicioMedia } from "./exercicio-media-C1odrHp6.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DUBMlo7Z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Dumbbell, U as Utensils, I as ChevronDown, y as TriangleAlert, O as Clock, Q as CircleCheck, R as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
const DIAS_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
function todayISO() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE");
}
function ConcluirTreinoBtn({
  planoId,
  alunoId,
  diaSemana
}) {
  const queryClient = useQueryClient();
  const today = todayISO();
  const {
    data: conclusoes = []
  } = useQuery(conclusoesTreinoQuery(planoId, alunoId, 1));
  const jaConcluido = conclusoes.some((c) => c.dia_semana === diaSemana && c.data === today);
  const marcar = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("plano_treino_conclusoes").insert({
        plano_id: planoId,
        aluno_id: alunoId,
        dia_semana: diaSemana,
        data: today
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conclusoes-treino", planoId, alunoId]
      });
      toast.success("Treino marcado como concluído! 💪");
    },
    onError: () => toast.error("Erro ao registrar conclusão.")
  });
  const desmarcar = useMutation({
    mutationFn: async () => {
      const conclusao = conclusoes.find((c) => c.dia_semana === diaSemana && c.data === today);
      if (!conclusao) return;
      const {
        error
      } = await supabase.from("plano_treino_conclusoes").delete().eq("id", conclusao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conclusoes-treino", planoId, alunoId]
      });
      toast.success("Conclusão desfeita.");
    },
    onError: () => toast.error("Erro ao desfazer conclusão.")
  });
  const isPending = marcar.isPending || desmarcar.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => jaConcluido ? desmarcar.mutate() : marcar.mutate(), disabled: isPending, className: `mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${jaConcluido ? "bg-primary/10 border-primary/40 text-primary" : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary"}`, children: [
    jaConcluido ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4" }),
    jaConcluido ? "Treino concluído hoje ✓" : "Marcar treino como concluído"
  ] });
}
function PlanoTreinoView({
  plano,
  alunoId
}) {
  const {
    data: exercicios = [],
    isLoading
  } = useQuery(planoExerciciosQuery(plano.id));
  const [openDays, setOpenDays] = reactExports.useState(() => /* @__PURE__ */ new Set([(/* @__PURE__ */ new Date()).getDay()]));
  const [selected, setSelected] = reactExports.useState(null);
  const byDay = DIAS_LABELS.reduce((acc, _, i) => {
    acc[i] = exercicios.filter((e) => e.dia_semana === i);
    return acc;
  }, {});
  const toggleDay = (d) => setOpenDays((prev) => {
    const next = new Set(prev);
    if (next.has(d)) next.delete(d);
    else next.add(d);
    return next;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: plano.nome }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] capitalize text-muted-foreground px-2 py-0.5 rounded-full border border-border", children: plano.nivel })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" })
    ] }) : exercicios.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-8 text-center text-sm text-muted-foreground", children: "Seu instrutor ainda não adicionou exercícios a este plano." }) : [1, 2, 3, 4, 5, 6, 0].map((dia) => {
      const list = byDay[dia];
      if (!list || !list.length) return null;
      const isToday = dia === (/* @__PURE__ */ new Date()).getDay();
      const isOpen = openDays.has(dia);
      const section = /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `glass rounded-2xl overflow-hidden ${isToday ? "border border-primary/40" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleDay(dia), className: "w-full flex items-center gap-2 p-5 text-left", "aria-expanded": isOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: DIAS_LABELS[dia] }),
          isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-ember text-primary-foreground", children: "Hoje" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[11px] text-muted-foreground", children: [
            list.length,
            " exercício(s)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })
        ] }),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: list.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-xl border border-border bg-card/50 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 shrink-0 rounded-md bg-gradient-ember grid place-items-center text-[11px] font-bold text-primary-foreground", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: item.exercicio.gif_url ?? item.exercicio.video_url, alt: item.exercicio.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(item), className: "text-left text-sm font-medium leading-tight hover:text-primary transition", children: item.exercicio.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary mt-0.5 font-medium", children: [
                item.series,
                "x",
                item.repeticoes,
                " · ",
                item.descanso_seg,
                "s"
              ] }),
              item.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1", children: item.observacoes })
            ] })
          ] }) }, item.id)) }),
          isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(ConcluirTreinoBtn, { planoId: plano.id, alunoId, diaSemana: dia })
        ] })
      ] }, dia);
      if (isToday) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: section }, dia);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(LazyMount, { rootMargin: "300px", minHeight: 64, placeholder: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }), children: section }, dia);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: selected.exercicio.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-primary font-medium", children: [
          selected.series,
          "x",
          selected.repeticoes,
          " · ",
          selected.descanso_seg,
          "s descanso"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: selected.exercicio.gif_url ?? selected.exercicio.video_url, alt: selected.exercicio.nome, size: "lg" }),
      selected.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/40 bg-primary/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-semibold mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          "Observação do instrutor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed", children: selected.observacoes })
      ] })
    ] }) }) })
  ] });
}
function MacroChip({
  label,
  value,
  unit = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground truncate", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold text-primary", children: [
      value,
      unit
    ] })
  ] });
}
function PlanoAlimentarView({
  plano,
  alunoId
}) {
  const queryClient = useQueryClient();
  const today = todayISO();
  const {
    data: adesoes = []
  } = useQuery(adesaoAlimentarQuery(plano.id, alunoId, 30));
  const {
    data: refeicoes = [],
    isLoading: loadingRefeicoes
  } = useQuery(planoRefeicoesQuery(plano.id));
  const jaSeguiu = adesoes.some((a) => a.data === today);
  const totalMes = adesoes.length;
  const marcar = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("plano_alimentar_adesao").insert({
        plano_id: plano.id,
        aluno_id: alunoId,
        data: today
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adesao-alimentar", plano.id, alunoId]
      });
      toast.success("Dieta marcada como seguida hoje! 🥗");
    },
    onError: () => toast.error("Erro ao registrar adesão.")
  });
  const desmarcar = useMutation({
    mutationFn: async () => {
      const adesao = adesoes.find((a) => a.data === today);
      if (!adesao) return;
      const {
        error
      } = await supabase.from("plano_alimentar_adesao").delete().eq("id", adesao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adesao-alimentar", plano.id, alunoId]
      });
      toast.success("Adesão desfeita.");
    },
    onError: () => toast.error("Erro ao desfazer adesão.")
  });
  const isPending = marcar.isPending || desmarcar.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm", children: plano.nome }),
      totalMes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground shrink-0", children: [
        totalMes,
        " dias seguidos (30d)"
      ] })
    ] }),
    plano.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap", children: plano.descricao }),
    (plano.meta_kcal || plano.meta_proteinas_g) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
      plano.meta_kcal && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "kcal", value: plano.meta_kcal }),
      plano.meta_proteinas_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "proteína", value: plano.meta_proteinas_g, unit: "g" }),
      plano.meta_carboidratos_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "carboidrato", value: plano.meta_carboidratos_g, unit: "g" }),
      plano.meta_gorduras_g && /* @__PURE__ */ jsxRuntimeExports.jsx(MacroChip, { label: "gordura", value: plano.meta_gorduras_g, unit: "g" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground", children: "Refeições prescritas" }),
      loadingRefeicoes ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }) : refeicoes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground", children: "Seu profissional ainda não detalhou as refeições deste plano." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: refeicoes.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-xl border border-border bg-card/50 p-3", children: [
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
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => jaSeguiu ? desmarcar.mutate() : marcar.mutate(), disabled: isPending, className: `w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${jaSeguiu ? "bg-primary/10 border-primary/40 text-primary" : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary"}`, children: [
      jaSeguiu ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4" }),
      jaSeguiu ? "Dieta seguida hoje ✓" : "Marcar dieta como seguida hoje"
    ] })
  ] });
}
function MeuPlanoPage() {
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
    if (perfil?.papel !== "aluno") navigate({
      to: "/app"
    });
  }, [perfilReady, perfil?.papel, navigate]);
  const {
    data: planosTreino = [],
    isLoading: loadingTreino
  } = useQuery({
    ...planosTreinoAlunoQuery(userId),
    enabled: !!userId && perfilReady && perfil?.papel === "aluno"
  });
  const {
    data: planosAlimentares = [],
    isLoading: loadingAlimentar
  } = useQuery({
    ...planosAlimentaresAlunoQuery(userId),
    enabled: !!userId && perfilReady && perfil?.papel === "aluno"
  });
  if (!perfilReady || perfil?.papel !== "aluno") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Prescrito pelo instrutor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Meu Plano" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "treino", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "treino", className: "flex-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4" }),
          " Treino"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "alimentar", className: "flex-1 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-4 w-4" }),
          " Dieta"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "treino", className: "space-y-4", children: loadingTreino ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" })
      ] }) : planosTreino.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🏋️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Nenhum plano de treino atribuído ainda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Aguarde seu instrutor criar seu plano." })
      ] }) : planosTreino.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanoTreinoView, { plano: p, alunoId: userId }, p.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "alimentar", className: "space-y-4", children: loadingAlimentar ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }) : planosAlimentares.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🥗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Nenhum plano alimentar atribuído ainda." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Aguarde seu instrutor criar sua dieta." })
      ] }) : planosAlimentares.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanoAlimentarView, { plano: p, alunoId: userId }, p.id)) })
    ] })
  ] });
}
export {
  MeuPlanoPage as component
};
