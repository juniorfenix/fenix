import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, f as useChildMatches, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as perfilQuery, i as instrutorAlunosQuery, v as alunosBuscaQuery, j as avisosInstrutorQuery, s as supabase } from "./router-DSsXXfgN.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BhVAEIE0.mjs";
import { I as Input, B as Button } from "./input-VcF1Z4i4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { U as Users, j as Dumbbell, o as ChevronRight, aa as UserPlus, f as Search, t as LoaderCircle, n as Bell, ab as CheckCheck, k as Utensils, ac as Mail } from "../_libs/lucide-react.mjs";
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
function InstrutorLayout() {
  const {
    user
  } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const {
    data: perfil,
    isSuccess
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  const childMatches = useChildMatches();
  const isProfissional = perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin";
  reactExports.useEffect(() => {
    if (!isSuccess) return;
    if (!isProfissional) navigate({
      to: "/app"
    });
  }, [isSuccess, isProfissional, navigate]);
  if (!isSuccess || !isProfissional) return null;
  if (childMatches.length > 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InstrutorPage, {});
}
function InstrutorPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const [buscaAluno, setBuscaAluno] = reactExports.useState("");
  const {
    data: perfil
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  const isProfissional = perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin";
  const {
    data: alunos = [],
    isLoading
  } = useQuery({
    ...instrutorAlunosQuery(userId),
    enabled: !!userId && isProfissional
  });
  const {
    data: alunosEncontrados = [],
    isFetching: buscandoAlunos
  } = useQuery({
    ...alunosBuscaQuery(userId, buscaAluno),
    enabled: !!userId && isProfissional && !!buscaAluno.trim()
  });
  const {
    data: avisos = [],
    isLoading: loadingAvisos
  } = useQuery({
    ...avisosInstrutorQuery(userId),
    enabled: !!userId && isProfissional
  });
  const adicionarAluno = useMutation({
    mutationFn: async (alunoId) => {
      const {
        error
      } = await supabase.from("instrutores_alunos").insert({
        instrutor_id: userId,
        aluno_id: alunoId
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instrutor-alunos", userId]
      });
      queryClient.invalidateQueries({
        queryKey: ["alunos-busca", userId]
      });
      setBuscaAluno("");
      toast.success("Aluno adicionado com sucesso.");
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Erro ao adicionar aluno."));
    }
  });
  const removerAluno = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("instrutores_alunos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instrutor-alunos", userId]
      });
      toast.success("Aluno removido.");
    }
  });
  const marcarAvisoLido = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("notificacoes_instrutor").update({
        lida: true
      }).eq("id", id).eq("instrutor_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["avisos-instrutor", userId]
    })
  });
  const marcarTodosLidos = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("notificacoes_instrutor").update({
        lida: true
      }).eq("instrutor_id", userId).eq("lida", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["avisos-instrutor", userId]
    })
  });
  reactExports.useEffect(() => {
    if (perfil?.papel === "aluno") navigate({
      to: "/app/meu-plano"
    });
  }, [perfil?.papel, navigate]);
  if (perfil?.papel === "aluno") return null;
  const termoLimpo = buscaAluno.trim();
  const podeAdicionarUuid = UUID_RE.test(termoLimpo) && !alunosEncontrados.some((a) => a.id === termoLimpo);
  const avisosNaoLidos = avisos.filter((a) => !a.lida).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Painel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Meus Alunos" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-4 px-5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 rounded-xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Banco de exercícios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Criar e editar exercícios disponíveis nos planos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/instrutor/exercicios", className: "shrink-0 flex items-center gap-1 text-xs text-primary hover:underline", children: [
        "Abrir ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Vincular aluno"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: buscaAluno, onChange: (e) => setBuscaAluno(e.target.value), placeholder: "Buscar por nome, e-mail ou UUID", className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-2", children: "O aluno precisa estar cadastrado no sistema. A busca aceita e-mail, nome ou UUID." }),
        buscaAluno.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/50 overflow-hidden", children: buscandoAlunos ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Buscando alunos..."
        ] }) : alunosEncontrados.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: alunosEncontrados.map((aluno) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlunoIdentidade, { nome: aluno.nome, email: aluno.email, id: aluno.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: aluno.vinculado ? "outline" : "default", disabled: aluno.vinculado || adicionarAluno.isPending, onClick: () => adicionarAluno.mutate(aluno.id), children: aluno.vinculado ? "Vinculado" : "Adicionar" })
        ] }, aluno.id)) }) : podeAdicionarUuid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "UUID informado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground font-mono truncate", children: termoLimpo })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", disabled: adicionarAluno.isPending, onClick: () => adicionarAluno.mutate(termoLimpo), children: "Adicionar" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 text-xs text-muted-foreground", children: "Nenhum aluno encontrado para esse termo." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
          "Avisos recentes",
          avisosNaoLidos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground", children: avisosNaoLidos })
        ] }),
        avisosNaoLidos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => marcarTodosLidos.mutate(), disabled: marcarTodosLidos.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
          " Marcar lidos"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingAvisos ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : avisos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6 text-center text-sm text-muted-foreground", children: "Quando um aluno concluir treino ou marcar dieta seguida, o aviso aparece aqui." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: avisos.slice(0, 6).map((aviso) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: `px-6 py-4 ${aviso.lida ? "bg-transparent" : "bg-primary/5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary", children: aviso.tipo === "dieta_seguida" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: aviso.titulo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            aviso.aluno_nome ?? "Aluno",
            " · ",
            formatDateTime(aviso.created_at)
          ] }),
          aviso.corpo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: aviso.corpo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor/$alunoId", params: {
            alunoId: aviso.aluno_id
          }, className: "text-xs text-primary hover:underline", children: "Abrir" }),
          !aviso.lida && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => marcarAvisoLido.mutate(aviso.id), className: "text-xs text-muted-foreground hover:text-foreground", children: "Lido" })
        ] })
      ] }) }, aviso.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm", children: [
        alunos.length,
        " aluno",
        alunos.length !== 1 ? "s" : "",
        " vinculado",
        alunos.length !== 1 ? "s" : ""
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-8 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : alunos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-8 text-center text-sm text-muted-foreground", children: "Nenhum aluno vinculado ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: alunos.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-col gap-3 px-6 py-4 hover:bg-card/40 transition sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlunoIdentidade, { nome: a.aluno_nome, email: a.aluno_email, id: a.aluno_id }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 sm:ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AtividadeChip, { icon: Dumbbell, label: "Treino", value: a.ultimo_treino_em ? formatDate(a.ultimo_treino_em) : "sem registro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AtividadeChip, { icon: Utensils, label: "Dieta", value: a.ultima_dieta_em ? formatDate(a.ultima_dieta_em) : "sem registro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/instrutor/$alunoId", params: {
            alunoId: a.aluno_id
          }, className: "flex items-center gap-1 text-xs text-primary hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }),
            " Gerenciar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removerAluno.mutate(a.id), className: "text-xs text-destructive hover:underline", children: "Remover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        ] })
      ] }, a.id)) }) })
    ] })
  ] });
}
function AlunoIdentidade({
  nome,
  email,
  id
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: nome ?? "Aluno sem nome" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground", children: [
      email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex min-w-0 items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono truncate", children: id })
    ] })
  ] });
}
function AtividadeChip({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: label }),
    value
  ] });
}
function formatDate(value) {
  return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  });
}
function formatDateTime(value) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function errorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}
export {
  InstrutorLayout as component
};
