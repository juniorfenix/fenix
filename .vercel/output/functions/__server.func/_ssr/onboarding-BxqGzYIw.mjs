import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-CJeOYY3V.mjs";
import { B as Button, I as Input } from "./input-CqozOQNs.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { c as calculateDailyCalories, t as todayISO } from "./calories-D7mpMhLM.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as Flame, S as Sparkles, A as ArrowLeft, a as ArrowRight, C as Check, b as Apple, D as Drumstick, W as Wheat, M as Milk, c as Salad, d as Soup, Z as Zap, e as ChefHat, L as Leaf, f as Search, X, B as Ban } from "../_libs/lucide-react.mjs";
import { o as objectType, c as coerce } from "../_libs/zod.mjs";
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
const ESSENCIAIS = [{
  key: "Frutas",
  label: "Frutas",
  Icon: Apple
}, {
  key: "Proteínas",
  label: "Proteínas",
  Icon: Drumstick
}, {
  key: "Carboidratos",
  label: "Carboidratos",
  Icon: Wheat
}, {
  key: "Laticínios",
  label: "Laticínios",
  Icon: Milk
}, {
  key: "Vegetais",
  label: "Vegetais",
  Icon: Salad
}];
const ESTILOS = [{
  key: "caseira",
  label: "Caseira",
  sub: "Comida de casa, tradicional",
  Icon: Soup
}, {
  key: "pratica",
  label: "Prática / Rápida",
  sub: "Pouco preparo, sem complicação",
  Icon: Zap
}, {
  key: "gourmet",
  label: "Gourmet",
  sub: "Receitas elaboradas",
  Icon: ChefHat
}, {
  key: "saudavel",
  label: "Saudável",
  sub: "Foco em nutrição limpa",
  Icon: Leaf
}];
const RESTRICOES_ALIM = ["Sem glúten", "Sem lactose", "Vegano", "Vegetariano", "Nenhuma"];
const FAVORITOS = ["Arroz e feijão", "Frango grelhado", "Massas", "Carne vermelha", "Peixes", "Saladas", "Ovos", "Doces"];
const EVITAR = ["Lactose", "Glúten", "Carne vermelha", "Frutos do mar", "Amendoim", "Ovos", "Açúcar refinado", "Nenhum"];
const dadosSchema = objectType({
  current_weight: coerce.number({
    invalid_type_error: "Informe o peso"
  }).min(20, "Mínimo 20 kg").max(300, "Máximo 300 kg"),
  goal_weight: coerce.number({
    invalid_type_error: "Informe o peso desejado"
  }).min(20, "Mínimo 20 kg").max(300, "Máximo 300 kg"),
  height: coerce.number({
    invalid_type_error: "Informe a altura"
  }).int("Use números inteiros").min(100, "Mínimo 100 cm").max(250, "Máximo 250 cm"),
  age: coerce.number({
    invalid_type_error: "Informe a idade"
  }).int("Use números inteiros").min(5, "Mínimo 5 anos").max(120, "Máximo 120 anos")
});
const ENCOURAGE = {
  0: "Perfeito, estamos moldando sua fênix.",
  1: "Excelente. Cada detalhe importa.",
  2: "Ótimo. Vamos respeitar o seu corpo.",
  3: "Isso é muito importante para sua evolução.",
  4: "Sabendo o que você ama, fica mais fácil.",
  5: "Anotado. Sua dieta vai respeitar isso.",
  6: "Cuidar de você é prioridade. Anotado.",
  7: "Agora sim. O caminho está claro.",
  8: "Suas escolhas vão guiar seu cardápio.",
  9: "Combinou com seu estilo. Vamos adiante.",
  10: "Pronto. Sua fênix está se formando."
};
function Onboarding() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const [preparing, setPreparing] = reactExports.useState(false);
  const [prepStage, setPrepStage] = reactExports.useState(0);
  const [showEncourage, setShowEncourage] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    current_weight: "",
    goal_weight: "",
    height: "",
    age: "",
    gender: "female",
    activity: "moderate",
    alimento_favorito: "",
    alimentos_evitar: [],
    tem_restricao: null,
    restricao_descricao: "",
    objetivo_fenix: "",
    essenciais: [],
    detestados: [],
    estilo_refeicao: "",
    restricoes_alimentares: []
  });
  const set = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const [dadosErrors, setDadosErrors] = reactExports.useState({});
  const validateDados = (field, value) => {
    const result = dadosSchema.shape[field].safeParse(value);
    setDadosErrors((prev) => ({
      ...prev,
      [field]: result.success ? void 0 : result.error.errors[0].message
    }));
  };
  const mountedRef = reactExports.useRef(true);
  reactExports.useEffect(() => () => {
    mountedRef.current = false;
  }, []);
  const steps = reactExports.useMemo(() => ["dados", "objetivo_peso", "atividade", "objetivo_fenix", "favorito", "evitar", "restricao", "essenciais", "detestados", "estilo", "restricoes_alim", "pronto"], []);
  const total = steps.length;
  const current = steps[step];
  const canNext = (() => {
    switch (current) {
      case "dados":
        return !!(form.current_weight && form.height && form.age) && !dadosErrors.current_weight && !dadosErrors.height && !dadosErrors.age;
      case "objetivo_peso":
        return !!form.goal_weight && !dadosErrors.goal_weight;
      case "atividade":
        return !!form.activity;
      case "objetivo_fenix":
        return !!form.objetivo_fenix;
      case "favorito":
        return !!form.alimento_favorito;
      case "evitar":
        return form.alimentos_evitar.length > 0;
      case "restricao":
        if (form.tem_restricao === null) return false;
        if (form.tem_restricao && !form.restricao_descricao.trim()) return false;
        return true;
      case "essenciais":
        return form.essenciais.length > 0;
      case "detestados":
        return true;
      // pode pular sem marcar nada
      case "estilo":
        return !!form.estilo_refeicao;
      case "restricoes_alim":
        return form.restricoes_alimentares.length > 0;
      default:
        return true;
    }
  })();
  const goNext = () => {
    if (!canNext || showEncourage) return;
    setShowEncourage(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setShowEncourage(false);
      setStep((s) => Math.min(s + 1, total - 1));
    }, 700);
  };
  const goBack = () => {
    if (showEncourage) return;
    setStep((s) => Math.max(0, s - 1));
  };
  const finish = async () => {
    if (!user) return;
    const w = parseFloat(form.current_weight);
    const gw = parseFloat(form.goal_weight);
    const h = parseFloat(form.height);
    const a = parseInt(form.age, 10);
    if (![w, gw, h, a].every((n) => Number.isFinite(n) && n > 0)) {
      toast.error("Preencha todos os campos com valores válidos.");
      return;
    }
    if (w < 20 || w > 300 || gw < 20 || gw > 300) {
      toast.error("Peso fora do intervalo permitido (20–300 kg).");
      return;
    }
    if (h < 100 || h > 250) {
      toast.error("Altura fora do intervalo permitido (100–250 cm).");
      return;
    }
    if (a < 5 || a > 120) {
      toast.error("Idade fora do intervalo permitido (5–120 anos).");
      return;
    }
    setBusy(true);
    setPreparing(true);
    const stages = ["Analisando seu perfil metabólico…", "Calculando sua meta calórica…", "Montando seu plano Fênix…", "Tudo pronto. Renascendo."];
    let i = 0;
    const tick = setInterval(() => {
      if (!mountedRef.current) return;
      i = Math.min(i + 1, stages.length - 1);
      setPrepStage(i);
    }, 800);
    try {
      const calories = calculateDailyCalories({
        weight: w,
        height: h,
        age: a,
        gender: form.gender,
        activity: form.activity,
        goal: form.objetivo_fenix === "emagrecer" ? "lose" : form.objetivo_fenix === "ganhar_musculo" ? "gain" : "maintain"
      });
      const {
        error
      } = await supabase.from("profiles").update({
        current_weight: w,
        goal_weight: gw,
        height: h,
        age: a,
        gender: form.gender,
        activity_level: form.activity,
        daily_calorie_goal: calories,
        onboarding_complete: true,
        alimento_favorito: form.alimento_favorito,
        alimentos_evitar: form.alimentos_evitar,
        tem_restricao: form.tem_restricao ?? false,
        restricao_descricao: form.tem_restricao ? form.restricao_descricao.trim() : null,
        objetivo_fenix: form.objetivo_fenix
      }).eq("id", user.id);
      if (error) throw error;
      await supabase.from("weight_logs").upsert({
        user_id: user.id,
        weight: w,
        logged_date: todayISO()
      }, {
        onConflict: "user_id,logged_date"
      });
      await supabase.from("badges").upsert({
        user_id: user.id,
        badge_type: "first_log"
      }, {
        onConflict: "user_id,badge_type"
      });
      await supabase.from("preferencias_alimentares").upsert({
        user_id: user.id,
        essenciais: form.essenciais,
        detestados: form.detestados,
        estilo_refeicao: form.estilo_refeicao || null,
        restricoes: form.restricoes_alimentares
      }, {
        onConflict: "user_id"
      });
      await new Promise((r) => setTimeout(r, 3200));
      clearInterval(tick);
      if (!mountedRef.current) return;
      queryClient.setQueryData(["profile", user.id], (old) => ({
        ...old ?? {},
        current_weight: w,
        goal_weight: gw,
        height: h,
        age: a,
        gender: form.gender,
        activity_level: form.activity,
        daily_calorie_goal: calories,
        onboarding_complete: true,
        has_seen_welcome: old?.has_seen_welcome ?? false,
        display_name: old?.display_name ?? null
      }));
      queryClient.invalidateQueries({
        queryKey: ["profile", user.id]
      });
      toast.success("Sua jornada começa agora.");
      navigate({
        to: "/app"
      });
    } catch (e) {
      clearInterval(tick);
      if (!mountedRef.current) return;
      setPreparing(false);
      toast.error(e.message ?? "Erro");
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };
  if (preparing) {
    const stages = ["Analisando seu perfil metabólico…", "Calculando sua meta calórica…", "Montando seu plano Fênix…", "Tudo pronto. Renascendo."];
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-background px-6 py-10 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-20 w-20 rounded-full bg-gradient-ember grid place-items-center shadow-ember animate-pop", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-9 w-9 text-primary-foreground", strokeWidth: 2 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-8 text-3xl", children: "Preparando seu plano" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground min-h-[2.5rem] transition-all", children: stages[prepStage] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 h-2 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-ember animate-loading-bar" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs uppercase tracking-widest text-muted-foreground", children: "Método Fênix" })
    ] }) });
  }
  const progress = (step + 1) / total * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,90,30,0.12),transparent_60%)] bg-background text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex min-h-screen max-w-xl flex-col px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg", children: "Fênix" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: [
        step + 1,
        " / ",
        total
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-ember transition-all duration-500", style: {
      width: `${progress}%`
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col justify-center py-10", children: showEncourage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pop text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mx-auto h-8 w-8 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-2xl leading-snug", children: ENCOURAGE[step] ?? "Vamos em frente." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StepScreen, { step: current, form, set, onEnter: canNext ? goNext : void 0, dadosErrors, validateDados }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pb-2", children: [
      step > 0 && !showEncourage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: goBack, className: "h-14 flex-1 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
        " Voltar"
      ] }),
      !showEncourage && (step < total - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goNext, disabled: !canNext, className: "h-14 flex-[2] text-base bg-gradient-ember text-primary-foreground shadow-ember", children: [
        "Continuar ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: finish, disabled: busy, className: "h-14 flex-[2] text-base bg-gradient-ember text-primary-foreground shadow-ember", children: busy ? "Salvando…" : "Renascer agora" }))
    ] })
  ] }) });
}
function StepScreen({
  step,
  form,
  set,
  onEnter,
  dadosErrors,
  validateDados
}) {
  if (step === "dados") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Vamos começar pelo básico." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Esses dados calibram tudo: dieta, treino e meta calórica." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BigField, { label: "Peso (kg)", value: form.current_weight, onChange: (v) => {
          set("current_weight", v);
          validateDados?.("current_weight", v);
        }, type: "number", max: 300, error: dadosErrors?.current_weight }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BigField, { label: "Altura (cm)", value: form.height, onChange: (v) => {
          set("height", v);
          validateDados?.("height", v);
        }, type: "number", max: 250, error: dadosErrors?.height }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BigField, { label: "Idade", value: form.age, onChange: (v) => {
          set("age", v);
          validateDados?.("age", v);
        }, type: "number", max: 120, error: dadosErrors?.age }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-sm text-muted-foreground", children: "Gênero" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["female", "male"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("gender", g), className: `flex-1 rounded-xl border-2 px-3 py-3 text-base transition ${form.gender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`, children: g === "female" ? "Feminino" : "Masculino" }, g)) })
        ] })
      ] })
    ] });
  }
  if (step === "objetivo_peso") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Qual peso você quer alcançar?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Sem pressa. Vamos respeitar o seu ritmo." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BigField, { label: "Peso desejado (kg)", value: form.goal_weight, onChange: (v) => {
        set("goal_weight", v);
        validateDados?.("goal_weight", v);
      }, type: "number", max: 300, error: dadosErrors?.goal_weight, onEnter }) })
    ] });
  }
  if (step === "atividade") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Como é sua rotina hoje?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Quanto você se move durante a semana?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-2", children: [["sedentary", "Sedentário", "Pouco ou nenhum exercício"], ["light", "Leve", "1 a 3x por semana"], ["moderate", "Moderado", "3 a 5x por semana"], ["active", "Ativo", "6 a 7x por semana"], ["very_active", "Muito ativo", "Treino intenso diário"]].map(([k, t, d]) => /* @__PURE__ */ jsxRuntimeExports.jsx(BigChoice, { selected: form.activity === k, onClick: () => set("activity", k), title: t, subtitle: d }, k)) })
    ] });
  }
  if (step === "objetivo_fenix") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Qual seu maior objetivo?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Escolha o foco principal da sua fênix." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-2", children: [["emagrecer", "Emagrecer", "Perder gordura e ganhar leveza"], ["ganhar_musculo", "Ganhar Músculo", "Hipertrofia e força"], ["condicionamento", "Condicionamento", "Saúde, energia e disposição"]].map(([k, t, d]) => /* @__PURE__ */ jsxRuntimeExports.jsx(BigChoice, { selected: form.objetivo_fenix === k, onClick: () => set("objetivo_fenix", k), title: t, subtitle: d }, k)) })
    ] });
  }
  if (step === "favorito") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Qual seu alimento favorito?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Escolha apenas um. Vamos montar uma dieta que você queira seguir." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-2", children: FAVORITOS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("alimento_favorito", f), className: `rounded-xl border-2 px-4 py-4 text-left text-base transition ${form.alimento_favorito === f ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: f }, f)) })
    ] });
  }
  if (step === "evitar") {
    const toggle = (item) => {
      const has = form.alimentos_evitar.includes(item);
      if (item === "Nenhum") {
        set("alimentos_evitar", has ? [] : ["Nenhum"]);
        return;
      }
      const next = has ? form.alimentos_evitar.filter((x) => x !== item) : [...form.alimentos_evitar.filter((x) => x !== "Nenhum"), item];
      set("alimentos_evitar", next);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "O que você não come de jeito nenhum?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Pode marcar mais de um. Sua dieta vai respeitar isso." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-2", children: EVITAR.map((f) => {
        const active = form.alimentos_evitar.includes(f);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(f), className: `relative rounded-xl border-2 px-4 py-4 text-left text-base transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: [
          f,
          active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" })
        ] }, f);
      }) })
    ] });
  }
  if (step === "restricao") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Possui alguma restrição médica ou lesão?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Sua segurança vem antes de qualquer treino." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("tem_restricao", false), className: `rounded-xl border-2 px-4 py-5 text-base transition ${form.tem_restricao === false ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: "Não tenho" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => set("tem_restricao", true), className: `rounded-xl border-2 px-4 py-5 text-base transition ${form.tem_restricao === true ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: "Sim, tenho" })
      ] }),
      form.tem_restricao && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-sm text-muted-foreground", children: "Conta o que você precisa que a gente saiba." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.restricao_descricao, onChange: (e) => set("restricao_descricao", e.target.value), placeholder: "Ex.: lesão no joelho direito, hipertensão, problema lombar…", className: "min-h-[120px] text-base" })
      ] })
    ] });
  }
  if (step === "essenciais") {
    const toggle = (k) => {
      const has = form.essenciais.includes(k);
      set("essenciais", has ? form.essenciais.filter((x) => x !== k) : [...form.essenciais, k]);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "O que não pode faltar na sua mesa?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Toque em tudo que faz parte do seu dia a dia." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3", children: ESSENCIAIS.map(({
        key,
        label,
        Icon
      }) => {
        const active = form.essenciais.includes(key);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(key), className: `group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition ${active ? "border-primary bg-primary/10 text-primary shadow-ember" : "border-border hover:border-primary/40"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-12 w-12 place-items-center rounded-xl transition ${active ? "bg-gradient-ember text-primary-foreground" : "bg-secondary text-foreground/70"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: label }),
          active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "absolute right-2 top-2 h-4 w-4" })
        ] }, key);
      }) })
    ] });
  }
  if (step === "detestados") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DetestadosStep, { form, set });
  }
  if (step === "estilo") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Qual seu estilo de refeição?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Escolha o que combina com a sua rotina." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-3", children: ESTILOS.map(({
        key,
        label,
        sub,
        Icon
      }) => {
        const active = form.estilo_refeicao === key;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => set("estilo_refeicao", key), className: `flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-12 w-12 place-items-center rounded-xl ${active ? "bg-gradient-ember text-primary-foreground" : "bg-secondary text-foreground/70"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: sub })
          ] })
        ] }, key);
      }) })
    ] });
  }
  if (step === "restricoes_alim") {
    const toggle = (item) => {
      const has = form.restricoes_alimentares.includes(item);
      if (item === "Nenhuma") {
        set("restricoes_alimentares", has ? [] : ["Nenhuma"]);
        return;
      }
      const next = has ? form.restricoes_alimentares.filter((x) => x !== item) : [...form.restricoes_alimentares.filter((x) => x !== "Nenhuma"), item];
      set("restricoes_alimentares", next);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Você segue alguma restrição alimentar?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Pode marcar mais de uma. Sua dieta vai respeitar tudo." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-2", children: RESTRICOES_ALIM.map((f) => {
        const active = form.restricoes_alimentares.includes(f);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(f), className: `relative rounded-xl border-2 px-4 py-4 text-left text-base transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: [
          f,
          active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" })
        ] }, f);
      }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-gradient-ember grid place-items-center shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-8 w-8 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-3xl leading-tight sm:text-4xl", children: "Sua fênix está pronta para renascer." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Baseado nas suas escolhas, seu protocolo Fênix será exclusivo e pensado exatamente para o seu paladar." })
  ] });
}
function DetestadosStep({
  form,
  set
}) {
  const [q, setQ] = reactExports.useState("");
  const {
    data: alimentos
  } = useQuery({
    queryKey: ["alimentos_padrao_onboarding"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("alimentos_padrao").select("id,nome").eq("ativo", true).order("nome", {
        ascending: true
      }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1e3
  });
  const term = q.trim().toLowerCase();
  const filtered = (alimentos ?? []).filter((a) => term ? a.nome.toLowerCase().includes(term) : true).slice(0, 60);
  const toggle = (nome) => {
    const has = form.detestados.includes(nome);
    set("detestados", has ? form.detestados.filter((x) => x !== nome) : [...form.detestados, nome]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl leading-tight sm:text-4xl", children: "Quais alimentos você detesta?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Busque na lista e marque tudo que não entra de jeito nenhum." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar alimento…", className: "h-12 rounded-xl border-2 pl-10 text-base" })
    ] }),
    form.detestados.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: form.detestados.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(d), className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary", children: [
      d,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
    ] }, d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 max-h-[42vh] overflow-y-auto rounded-xl border border-border", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Nenhum alimento encontrado. Você pode seguir sem marcar nada." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: filtered.map((a) => {
      const active = form.detestados.includes(a.nome);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(a.nome), className: `flex w-full items-center justify-between px-4 py-3 text-left text-base transition ${active ? "bg-primary/10 text-primary" : "hover:bg-secondary/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Apple, { className: "h-4 w-4 text-muted-foreground" }),
          a.nome
        ] }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
      ] }) }, a.id);
    }) }) })
  ] });
}
function BigField({
  label,
  value,
  onChange,
  type = "text",
  onEnter,
  error,
  max
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type, inputMode: type === "number" ? "decimal" : void 0, value, onChange: (e) => {
      let v = e.target.value;
      if (type === "number" && max !== void 0 && v !== "" && Number(v) > max) {
        v = String(max);
      }
      onChange(v);
    }, onKeyDown: (e) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
    }, className: `h-14 rounded-xl border-2 text-lg${error ? " border-destructive" : ""}` }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-destructive", children: error })
  ] });
}
function BigChoice({
  selected,
  onClick,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: `w-full rounded-xl border-2 px-5 py-4 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: subtitle })
  ] });
}
export {
  Onboarding as component
};
