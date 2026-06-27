import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { k as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as perfilQuery, n as planosTreinoAlunoQuery, p as profileQuery, t as treinosWeekQuery, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, o as DialogDescription, q as planoExerciciosQuery, r as conclusoesTreinoQuery, s as supabase } from "./router-CcOOaUOf.mjs";
import { S as Skeleton } from "./skeleton-DHtiC9Nz.mjs";
import { L as LazyMount } from "./LazyMount-sGAIcH1c.mjs";
import { E as ExercicioMedia } from "./exercicio-media-C1odrHp6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as todayISO } from "./calories-D7mpMhLM.mjs";
import { j as Dumbbell, z as TriangleAlert, J as ChevronDown, K as Play, N as CircleCheck, O as Circle } from "../_libs/lucide-react.mjs";
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
const NIVEIS = ["Iniciante I", "Iniciante II", "Intermediário I", "Intermediário II", "Avançado I", "Avançado II"];
const GENEROS = ["Masculino", "Feminino"];
const LOCAIS = ["Academia", "Casa"];
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const STORAGE_KEY = "treino-filters";
function loadFilters(fallbackGenero) {
  const fallback = {
    nivel: "Iniciante I",
    genero: fallbackGenero,
    local: "Academia"
  };
  if (typeof window === "undefined") return {
    filters: fallback,
    hasSaved: false
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        filters: {
          ...fallback,
          ...parsed
        },
        hasSaved: true
      };
    }
  } catch {
  }
  return {
    filters: fallback,
    hasSaved: false
  };
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => jaConcluido ? desmarcar.mutate() : marcar.mutate(), disabled: marcar.isPending || desmarcar.isPending, className: `mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${jaConcluido ? "bg-primary/10 border-primary/40 text-primary" : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary"}`, children: [
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
  const byDay = reactExports.useMemo(() => {
    const map = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const e of exercicios) map[e.dia_semana] = [...map[e.dia_semana] ?? [], e];
    return map;
  }, [exercicios]);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: DIAS[dia] }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(LazyMount, { rootMargin: "200px", placeholder: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 shrink-0 rounded-lg bg-muted/30" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: item.exercicio.gif_url ?? item.exercicio.video_url, alt: item.exercicio.nome }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(item), className: "text-left text-sm font-medium leading-tight hover:text-primary transition inline-flex items-center gap-1", children: [
                item.exercicio.nome,
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3 opacity-60" })
              ] }),
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
function Pills({
  label,
  value,
  options,
  onChange,
  onPrefetch
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: options.map((opt) => {
      const active = value === opt;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(opt), onMouseEnter: () => onPrefetch?.(opt), onTouchStart: () => onPrefetch?.(opt), className: `px-3 py-1.5 rounded-full text-xs font-medium transition border ${active ? "bg-gradient-ember text-primary-foreground border-transparent shadow-ember" : "border-border bg-card/50 text-muted-foreground hover:border-primary/40"}`, children: opt }, opt);
    }) })
  ] });
}
const DayCard = reactExports.memo(function DayCard2({
  dia,
  list,
  isToday,
  open,
  onToggle,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `glass rounded-2xl overflow-hidden ${isToday ? "border border-primary/40" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onToggle, className: "w-full flex items-center gap-2 p-5 text-left", "aria-expanded": open, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: DIAS[dia] }),
      isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-ember text-primary-foreground", children: "Hoje" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[11px] text-muted-foreground", children: [
        list.length,
        " exercícios"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 px-5 pb-5", children: list.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-xl border border-border bg-card/50 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 shrink-0 rounded-md bg-gradient-ember grid place-items-center text-[11px] font-bold text-primary-foreground", children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LazyMount, { rootMargin: "200px", placeholder: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 shrink-0 rounded-lg bg-muted/30" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: t.url_midia, alt: t.exercicio }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSelect(t), className: "text-left text-sm font-medium leading-tight hover:text-primary transition inline-flex items-center gap-1", children: [
          t.exercicio,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3 opacity-60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-primary mt-0.5 font-medium", children: t.series_repeticoes }),
        t.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1 leading-snug", children: t.observacoes })
      ] })
    ] }) }, t.id)) })
  ] });
});
function TreinosPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: perfil,
    isSuccess: perfilReady
  } = useQuery({
    ...perfilQuery(user?.id ?? ""),
    enabled: !!user?.id
  });
  reactExports.useEffect(() => {
    if (!perfilReady) return;
    const papel = perfil?.papel;
    if (papel === "instrutor" || papel === "nutricionista" || papel === "admin") {
      navigate({
        to: "/app/instrutor"
      });
    }
  }, [perfilReady, perfil?.papel, navigate]);
  if (perfilReady && (perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin")) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TreinosAluno, {});
}
function TreinosAluno() {
  const {
    user
  } = useAuth();
  const {
    data: planosTreino = [],
    isLoading: loadingPlanos
  } = useQuery({
    ...planosTreinoAlunoQuery(user?.id ?? ""),
    enabled: !!user?.id
  });
  if (loadingPlanos) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Sua rotina" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Treinos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" })
      ] })
    ] });
  }
  if (planosTreino.length > 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TreinosPrescritosAluno, { planosTreino, alunoId: user.id });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TreinosGenericosAluno, {});
}
function TreinosPrescritosAluno({
  planosTreino,
  alunoId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Prescrito pelo profissional" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Treinos" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: planosTreino.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanoTreinoView, { plano: p, alunoId }, p.id)) })
  ] });
}
function TreinosGenericosAluno() {
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: profile
  } = useQuery({
    ...profileQuery(user?.id ?? ""),
    enabled: !!user?.id
  });
  const fallbackGenero = profile?.gender === "female" ? "Feminino" : "Masculino";
  const [filters, setFilters] = reactExports.useState(() => loadFilters(fallbackGenero).filters);
  const [hasSavedFilters] = reactExports.useState(() => loadFilters(fallbackGenero).hasSaved);
  const today = (/* @__PURE__ */ new Date()).getDay();
  const [openDays, setOpenDays] = reactExports.useState(() => /* @__PURE__ */ new Set([today]));
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (hasSavedFilters) return;
    if (!profile?.gender) return;
    const desired = profile.gender === "female" ? "Feminino" : "Masculino";
    setFilters((f) => f.genero === desired ? f : {
      ...f,
      genero: desired
    });
  }, [profile?.gender, hasSavedFilters]);
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
    }
  }, [filters]);
  const {
    data: treinos = [],
    isPending,
    isFetching
  } = useQuery({
    ...treinosWeekQuery(filters),
    placeholderData: keepPreviousData
  });
  const byDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const t of treinos) {
      const arr = map.get(t.dia_semana) ?? [];
      arr.push(t);
      map.set(t.dia_semana, arr);
    }
    return map;
  }, [treinos]);
  const orderedDays = [1, 2, 3, 4, 5, 6, 0];
  const prefetch = reactExports.useCallback((next) => {
    const merged = {
      ...filters,
      ...next
    };
    queryClient.prefetchQuery(treinosWeekQuery(merged));
  }, [filters, queryClient]);
  const toggleDay = reactExports.useCallback((dia) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dia)) next.delete(dia);
      else next.add(dia);
      return next;
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-8 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Sua rotina" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Treinos" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 mb-5 text-center space-y-2 border border-dashed border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🏋️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Nenhum treino prescrito ainda" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Assim que seu profissional montar seu treino, ele aparecerá aqui." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-1", children: "Biblioteca de treinos" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pills, { label: "Nível", value: filters.nivel, options: NIVEIS, onChange: (v) => setFilters((f) => ({
        ...f,
        nivel: v
      })), onPrefetch: (v) => prefetch({
        nivel: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pills, { label: "Local", value: filters.local, options: LOCAIS, onChange: (v) => setFilters((f) => ({
        ...f,
        local: v
      })), onPrefetch: (v) => prefetch({
        local: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pills, { label: "Gênero", value: filters.genero, options: GENEROS, onChange: (v) => setFilters((f) => ({
        ...f,
        genero: v
      })), onPrefetch: (v) => prefetch({
        genero: v
      }) }),
      isFetching && !isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Atualizando…" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-3", children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" })
    ] }) : treinos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🏗️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Estamos preparando seu plano de treino deste nível." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Em breve, estará disponível!" })
    ] }) : orderedDays.map((dia) => {
      const list = byDay.get(dia);
      if (!list || list.length === 0) return null;
      const isToday = dia === today;
      const card = /* @__PURE__ */ jsxRuntimeExports.jsx(DayCard, { dia, list, isToday, open: openDays.has(dia), onToggle: () => toggleDay(dia), onSelect: setSelected });
      if (isToday) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: card }, dia);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(LazyMount, { rootMargin: "300px", minHeight: 64, placeholder: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }), children: card }, dia);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "pr-8", children: selected.exercicio }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-primary font-medium", children: selected.series_repeticoes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: selected.url_midia, alt: selected.exercicio, size: "lg" }),
      selected.instrucao && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5", children: "Como executar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed whitespace-pre-line", children: selected.instrucao })
      ] }),
      selected.dica_seguranca && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/40 bg-primary/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-semibold mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          "Atenção Fênix"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed", children: selected.dica_seguranca })
      ] }),
      selected.observacoes && !selected.instrucao && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: selected.observacoes })
    ] }) }) })
  ] });
}
export {
  TreinosPage as component
};
