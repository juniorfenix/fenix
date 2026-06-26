import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as ExercicioMedia } from "./exercicio-media-C1odrHp6.mjs";
import { n as exerciciosQuery } from "./queries-P0tOdmfu.mjs";
import { s as supabase } from "./router-CJeOYY3V.mjs";
import { B as Button, I as Input } from "./input-CqozOQNs.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-DUBMlo7Z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ArrowLeft, h as Dumbbell, P as Plus, f as Search, r as LoaderCircle, K as Pencil } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
const GRUPOS = ["Bíceps", "Core", "Costas", "Glúteo", "Ombro", "Peito", "Pernas", "Tríceps"];
const EQUIPAMENTOS = ["Barra", "Cabo", "Halter", "Máquina", "Peso corporal", "Outro"];
const NIVEIS = ["iniciante", "intermediario", "avancado"];
const NIVEL_LABELS = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado"
};
const schema = objectType({
  nome: stringType().min(1, "Nome obrigatório"),
  grupo_muscular: stringType().min(1, "Grupo muscular obrigatório"),
  equipamento: stringType().min(1, "Equipamento obrigatório"),
  nivel: stringType().min(1, "Nível obrigatório"),
  tipo_midia: stringType().default("gif"),
  gif_url: stringType().optional(),
  video_url: stringType().optional(),
  descricao: stringType().optional()
});
const EMPTY = {
  nome: "",
  grupo_muscular: GRUPOS[0],
  equipamento: EQUIPAMENTOS[0],
  nivel: "iniciante",
  tipo_midia: "gif",
  gif_url: "",
  video_url: "",
  descricao: ""
};
function toForm(ex) {
  return {
    nome: ex.nome,
    grupo_muscular: ex.grupo_muscular ?? "",
    equipamento: ex.equipamento,
    nivel: ex.nivel,
    tipo_midia: ex.tipo_midia,
    gif_url: ex.gif_url ?? "",
    video_url: ex.video_url ?? "",
    descricao: ex.descricao ?? ""
  };
}
function ExerciciosPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = reactExports.useState("");
  const [dialog, setDialog] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY);
  const [errors, setErrors] = reactExports.useState({});
  const {
    data: exercicios = [],
    isLoading
  } = useQuery(exerciciosQuery);
  const filtered = exercicios.filter((ex) => {
    const q = busca.trim().toLowerCase();
    if (!q) return true;
    return ex.nome.toLowerCase().includes(q) || (ex.grupo_muscular ?? "").toLowerCase().includes(q) || ex.equipamento.toLowerCase().includes(q);
  });
  const set = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const openEdit = (ex) => {
    setForm(toForm(ex));
    setErrors({});
    setDialog(ex);
  };
  const openNovo = () => {
    setForm(EMPTY);
    setErrors({});
    setDialog("novo");
  };
  const salvar = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) {
        const errs = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (!errs[key]) errs[key] = issue.message;
        }
        setErrors(errs);
        throw new Error("invalid");
      }
      setErrors({});
      const payload = {
        nome: parsed.data.nome,
        grupo_muscular: parsed.data.grupo_muscular || null,
        equipamento: parsed.data.equipamento,
        nivel: parsed.data.nivel,
        tipo_midia: parsed.data.tipo_midia || "gif",
        gif_url: parsed.data.gif_url || null,
        video_url: parsed.data.video_url || null,
        descricao: parsed.data.descricao || null
      };
      if (dialog === "novo") {
        const {
          error
        } = await supabase.from("exercicios").insert(payload);
        if (error) throw error;
      } else if (dialog) {
        const {
          error
        } = await supabase.from("exercicios").update(payload).eq("id", dialog.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercicios"]
      });
      toast.success(dialog === "novo" ? "Exercício criado." : "Exercício atualizado.");
      setDialog(null);
    },
    onError: (e) => {
      if (e.message !== "invalid") toast.error("Erro ao salvar exercício.");
    }
  });
  const previewUrl = form.gif_url || form.video_url || null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/instrutor", className: "text-muted-foreground hover:text-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 shrink-0 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Administração" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Exercícios" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNovo, size: "sm", className: "bg-gradient-ember text-primary-foreground shadow-ember shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        " Novo"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: busca, onChange: (e) => setBusca(e.target.value), placeholder: "Buscar por nome, grupo ou equipamento…", className: "pl-9" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: busca ? "Nenhum exercício encontrado." : "Nenhum exercício cadastrado ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: filtered.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-5 py-3 hover:bg-card/40 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: ex.gif_url ?? ex.video_url, alt: ex.nome, size: "sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: ex.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground", children: [
          ex.grupo_muscular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ex.grupo_muscular }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ex.equipamento }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: NIVEL_LABELS[ex.nivel] ?? ex.nivel })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEdit(ex), className: "shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) })
    ] }, ex.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-center text-muted-foreground", children: [
      exercicios.length,
      " exercício",
      exercicios.length !== 1 ? "s" : "",
      " cadastrado",
      exercicios.length !== 1 ? "s" : "",
      busca && filtered.length !== exercicios.length && ` · ${filtered.length} encontrado${filtered.length !== 1 ? "s" : ""}`
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialog !== null, onOpenChange: (o) => !o && setDialog(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: dialog === "novo" ? "Novo exercício" : "Editar exercício" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden border border-border/40 bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExercicioMedia, { url: previewUrl, alt: form.nome || "Preview", size: "lg" }, previewUrl ?? "__empty"),
          !previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-2 text-center text-[11px] text-muted-foreground", children: "Preview aparece ao informar a URL do GIF ou vídeo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL do GIF", error: errors.gif_url, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.gif_url, onChange: (e) => set("gif_url", e.target.value), placeholder: "https://v2.exercisedb.io/image/…" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL do vídeo (opcional)", error: errors.video_url, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.video_url, onChange: (e) => set("video_url", e.target.value), placeholder: "https://…/exercicio.mp4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome *", error: errors.nome, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.nome, onChange: (e) => set("nome", e.target.value), placeholder: "Ex.: Supino com barra" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Grupo muscular *", error: errors.grupo_muscular, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.grupo_muscular, onValueChange: (v) => set("grupo_muscular", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: GRUPOS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Equipamento *", error: errors.equipamento, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.equipamento, onValueChange: (v) => set("equipamento", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: EQUIPAMENTOS.map((eq) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: eq, children: eq }, eq)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nível *", error: errors.nivel, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: NIVEIS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("nivel", n), className: `flex-1 rounded-xl border-2 py-2 text-sm transition ${form.nivel === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`, children: NIVEL_LABELS[n] }, n)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Descrição", error: errors.descricao, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.descricao, onChange: (e) => set("descricao", e.target.value), placeholder: "Instruções breves de execução…", className: "min-h-[80px] text-sm resize-none" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => salvar.mutate(), disabled: salvar.isPending, className: "w-full bg-gradient-ember text-primary-foreground shadow-ember", children: [
          salvar.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
          dialog === "novo" ? "Criar exercício" : "Salvar alterações"
        ] })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  error,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5 text-sm text-muted-foreground", children: label }),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: error })
  ] });
}
export {
  ExerciciosPage as component
};
