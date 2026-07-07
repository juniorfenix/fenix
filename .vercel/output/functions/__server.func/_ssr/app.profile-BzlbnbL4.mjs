import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as perfilQuery, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, p as profileQuery, k as badgesQuery, w as weightsQuery, s as supabase } from "./router-DSsXXfgN.mjs";
import { B as Button, I as Input } from "./input-VcF1Z4i4.mjs";
import { L as Label } from "./label-D_Mx-HSc.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bccwonsm.mjs";
import { c as calculateDailyCalories } from "./calories-D7mpMhLM.mjs";
import { A as ALL_BADGES } from "./badges-DiLEDxIB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Q as Briefcase, R as Pencil, V as LogOut, F as Flame, r as Scale, m as Award, v as Lock } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
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
const editSchema = objectType({
  display_name: stringType().trim().min(1, "Informe um nome").max(60, "Máx. 60 caracteres"),
  goal_weight: numberType({
    invalid_type_error: "Peso inválido"
  }).min(30, "Mínimo 30 kg").max(300, "Máximo 300 kg"),
  activity_level: enumType(["sedentary", "light", "moderate", "active", "very_active"])
});
const ACTIVITY_OPTIONS = [{
  value: "sedentary",
  label: "Sedentário"
}, {
  value: "light",
  label: "Leve"
}, {
  value: "moderate",
  label: "Moderado"
}, {
  value: "active",
  label: "Ativo"
}, {
  value: "very_active",
  label: "Muito ativo"
}];
const profissionalSchema = objectType({
  nome: stringType().trim().min(1, "Informe um nome").max(80, "Máx. 80 caracteres"),
  especialidade: stringType().trim().max(120, "Máx. 120 caracteres").optional()
});
const PAPEL_LABEL = {
  instrutor: "Instrutor",
  nutricionista: "Nutricionista",
  admin: "Administrador"
};
function ProfileProfissional() {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const qc = useQueryClient();
  const {
    data: perfil
  } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId
  });
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    nome: "",
    especialidade: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const openEdit = () => {
    if (!perfil) return;
    setErrors({});
    setForm({
      nome: perfil.nome ?? "",
      especialidade: perfil.especialidade ?? ""
    });
    setEditOpen(true);
  };
  const saveEdit = async () => {
    if (!user) return;
    const parsed = profissionalSchema.safeParse({
      nome: form.nome,
      especialidade: form.especialidade || void 0
    });
    if (!parsed.success) {
      const fe = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Verifique os campos");
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const {
        nome,
        especialidade
      } = parsed.data;
      const {
        error
      } = await supabase.from("perfis").update({
        nome,
        especialidade: especialidade ?? null
      }).eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil atualizado");
      setEditOpen(false);
      qc.invalidateQueries({
        queryKey: ["perfil", userId]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-10 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-ember shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-9 w-9 text-primary-foreground", strokeWidth: 1.4 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl", children: perfil?.nome ?? "Profissional" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user?.email }),
      perfil?.papel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary", children: PAPEL_LABEL[perfil.papel] ?? perfil.papel }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openEdit, variant: "outline", size: "sm", className: "mt-4 h-10", disabled: !perfil, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 mr-1.5" }),
        " Editar perfil"
      ] })
    ] }),
    perfil?.especialidade && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Informações profissionais" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl px-4 py-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Especialidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: perfil.especialidade })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: PAPEL_LABEL[perfil.papel] ?? perfil.papel })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Conta" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-[200px]", children: user?.email })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSignOut, variant: "outline", className: "mt-10 w-full h-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
      " Sair"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar perfil" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.nome, onChange: (e) => setForm({
            ...form,
            nome: e.target.value
          }), maxLength: 80, placeholder: "Seu nome completo", "aria-invalid": !!errors.nome }),
          errors.nome && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.nome })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Especialidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.especialidade, onChange: (e) => setForm({
            ...form,
            especialidade: e.target.value
          }), maxLength: 120, placeholder: "Ex: Musculação, Nutrição esportiva…", "aria-invalid": !!errors.especialidade }),
          errors.especialidade && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.especialidade })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground", children: [
          "Tipo de conta:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: PAPEL_LABEL[perfil?.papel ?? ""] ?? perfil?.papel ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveEdit, disabled: saving, className: "w-full h-12 bg-gradient-ember text-primary-foreground shadow-ember", children: saving ? "Salvando…" : "Salvar" })
      ] })
    ] }) })
  ] });
}
function Profile() {
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
  if (perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileProfissional, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileAluno, {});
}
function ProfileAluno() {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const qc = useQueryClient();
  const {
    data: profile = null
  } = useQuery({
    ...profileQuery(userId),
    enabled: !!userId
  });
  const {
    data: badgeList = []
  } = useQuery({
    ...badgesQuery(userId),
    enabled: !!userId
  });
  const {
    data: weights = []
  } = useQuery({
    ...weightsQuery(userId),
    enabled: !!userId
  });
  const unlocked = new Set(badgeList);
  const totalRegistros = weights.length;
  const isUnlocked = (type) => {
    if (unlocked.has(type)) return true;
    if (type === "first_log") return totalRegistros >= 1;
    if (type === "streak_7") return totalRegistros >= 7;
    if (type === "goal_reached" && profile?.goal_weight && profile?.current_weight) return profile.current_weight <= profile.goal_weight;
    return false;
  };
  const historico = [...weights].reverse();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    display_name: "",
    goal_weight: "",
    activity_level: "moderate"
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const load = () => {
    qc.invalidateQueries({
      queryKey: ["profile", userId]
    });
    qc.invalidateQueries({
      queryKey: ["badges", userId]
    });
  };
  const openEdit = () => {
    if (!profile) return;
    setErrors({});
    setForm({
      display_name: profile.display_name ?? "",
      goal_weight: profile.goal_weight?.toString() ?? "",
      activity_level: profile.activity_level ?? "moderate"
    });
    setEditOpen(true);
  };
  const saveEdit = async () => {
    if (!user || !profile) return;
    const parsed = editSchema.safeParse({
      display_name: form.display_name,
      goal_weight: form.goal_weight ? parseFloat(form.goal_weight.replace(",", ".")) : NaN,
      activity_level: form.activity_level
    });
    if (!parsed.success) {
      const fe = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Verifique os campos");
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const {
        display_name,
        goal_weight,
        activity_level
      } = parsed.data;
      let daily_calorie_goal = profile.daily_calorie_goal;
      if (profile.current_weight && profile.height && profile.age && profile.gender) {
        daily_calorie_goal = calculateDailyCalories({
          weight: profile.current_weight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
          activity: activity_level,
          goal: goal_weight < profile.current_weight ? "lose" : goal_weight > profile.current_weight ? "gain" : "maintain"
        });
      }
      const {
        error
      } = await supabase.from("profiles").update({
        display_name,
        goal_weight,
        activity_level,
        daily_calorie_goal
      }).eq("id", user.id);
      if (error) throw error;
      toast.success(daily_calorie_goal && daily_calorie_goal !== profile.daily_calorie_goal ? `Perfil atualizado · nova meta: ${daily_calorie_goal} kcal` : "Perfil atualizado");
      setEditOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate({
      to: "/"
    });
  };
  const previewCalories = (() => {
    if (!profile?.current_weight || !profile.height || !profile.age || !profile.gender) return null;
    const gw = parseFloat(form.goal_weight.replace(",", "."));
    if (!Number.isFinite(gw) || gw < 30 || gw > 300) return null;
    return calculateDailyCalories({
      weight: profile.current_weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activity: form.activity_level,
      goal: gw < profile.current_weight ? "lose" : gw > profile.current_weight ? "gain" : "maintain"
    });
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5 pt-10 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-ember shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-9 w-9 text-primary-foreground", strokeWidth: 1.4 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl", children: profile?.display_name ?? "Fênix" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user?.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openEdit, variant: "outline", size: "sm", className: "mt-4 h-10", disabled: !profile, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 mr-1.5" }),
        " Editar perfil"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Atual", value: profile?.current_weight ? `${profile.current_weight}kg` : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Meta", value: profile?.goal_weight ? `${profile.goal_weight}kg` : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Kcal/dia", value: profile?.daily_calorie_goal ?? "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Histórico de peso" }),
        historico.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[10px] text-muted-foreground", children: [
          historico.length,
          " ",
          historico.length === 1 ? "registro" : "registros"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl divide-y divide-border/40 overflow-hidden", children: [
        historico.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground text-center", children: "Nenhum registro ainda." }) : historico.slice(0, 10).map((w, idx) => {
          const d = /* @__PURE__ */ new Date(w.logged_date + "T00:00:00");
          const label = d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
          });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
              w.weight,
              " kg"
            ] })
          ] }, `${w.logged_date}-${idx}`);
        }),
        historico.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 text-[11px] text-muted-foreground text-center bg-background/20", children: [
          "Mostrando os 10 mais recentes de ",
          historico.length
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Conquistas" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ALL_BADGES.map((b) => {
        const has = isUnlocked(b.type);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `glass rounded-2xl p-3 flex flex-col items-center text-center gap-2 transition ${has ? "" : "grayscale opacity-60"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-full flex items-center justify-center ${has ? "bg-gradient-ember shadow-ember" : "bg-secondary"}`, children: has ? /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold leading-tight", children: b.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 leading-snug", children: b.desc })
          ] })
        ] }, b.type);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSignOut, variant: "outline", className: "mt-10 w-full h-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
      " Sair"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar perfil" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.display_name, onChange: (e) => setForm({
            ...form,
            display_name: e.target.value
          }), maxLength: 60, "aria-invalid": !!errors.display_name }),
          errors.display_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.display_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Peso desejado (kg)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", min: 30, max: 300, value: form.goal_weight, onChange: (e) => setForm({
            ...form,
            goal_weight: e.target.value
          }), "aria-invalid": !!errors.goal_weight }),
          errors.goal_weight && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.goal_weight })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nível de atividade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.activity_level, onValueChange: (v) => setForm({
            ...form,
            activity_level: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ACTIVITY_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs", children: previewCalories != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Nova meta calórica: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
            previewCalories,
            " kcal/dia"
          ] }),
          profile?.daily_calorie_goal && previewCalories !== profile.daily_calorie_goal && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            " ",
            "(era ",
            profile.daily_calorie_goal,
            ")"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Informe um peso válido para ver a nova meta." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveEdit, disabled: saving, className: "w-full h-12 bg-gradient-ember text-primary-foreground shadow-ember", children: saving ? "Salvando…" : "Salvar" })
      ] })
    ] }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mt-1", children: label })
  ] });
}
export {
  Profile as component
};
