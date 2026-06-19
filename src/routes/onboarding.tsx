import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Flame, ArrowRight, ArrowLeft, Check, Sparkles, Search,
  Apple, Drumstick, Wheat, Milk, Salad, Soup, Zap, ChefHat, Leaf,
  Ban, X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { calculateDailyCalories, todayISO, type ActivityLevel } from "@/lib/calories";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

type Form = {
  current_weight: string;
  goal_weight: string;
  height: string;
  age: string;
  gender: "male" | "female";
  activity: ActivityLevel;
  alimento_favorito: string;
  alimentos_evitar: string[];
  tem_restricao: boolean | null;
  restricao_descricao: string;
  objetivo_fenix: "emagrecer" | "ganhar_musculo" | "condicionamento" | "";
  // Preferências alimentares
  essenciais: string[];
  detestados: string[];
  estilo_refeicao: "caseira" | "pratica" | "gourmet" | "saudavel" | "";
  restricoes_alimentares: string[];
};

const ESSENCIAIS: { key: string; label: string; Icon: typeof Apple }[] = [
  { key: "Frutas", label: "Frutas", Icon: Apple },
  { key: "Proteínas", label: "Proteínas", Icon: Drumstick },
  { key: "Carboidratos", label: "Carboidratos", Icon: Wheat },
  { key: "Laticínios", label: "Laticínios", Icon: Milk },
  { key: "Vegetais", label: "Vegetais", Icon: Salad },
];

const ESTILOS: { key: Form["estilo_refeicao"]; label: string; sub: string; Icon: typeof Soup }[] = [
  { key: "caseira", label: "Caseira", sub: "Comida de casa, tradicional", Icon: Soup },
  { key: "pratica", label: "Prática / Rápida", sub: "Pouco preparo, sem complicação", Icon: Zap },
  { key: "gourmet", label: "Gourmet", sub: "Receitas elaboradas", Icon: ChefHat },
  { key: "saudavel", label: "Saudável", sub: "Foco em nutrição limpa", Icon: Leaf },
];

const RESTRICOES_ALIM = [
  "Sem glúten",
  "Sem lactose",
  "Vegano",
  "Vegetariano",
  "Nenhuma",
];

const FAVORITOS = [
  "Arroz e feijão",
  "Frango grelhado",
  "Massas",
  "Carne vermelha",
  "Peixes",
  "Saladas",
  "Ovos",
  "Doces",
];

const EVITAR = [
  "Lactose",
  "Glúten",
  "Carne vermelha",
  "Frutos do mar",
  "Amendoim",
  "Ovos",
  "Açúcar refinado",
  "Nenhum",
];

const dadosSchema = z.object({
  current_weight: z.coerce
    .number({ invalid_type_error: "Informe o peso" })
    .min(20, "Mínimo 20 kg")
    .max(300, "Máximo 300 kg"),
  goal_weight: z.coerce
    .number({ invalid_type_error: "Informe o peso desejado" })
    .min(20, "Mínimo 20 kg")
    .max(300, "Máximo 300 kg"),
  height: z.coerce
    .number({ invalid_type_error: "Informe a altura" })
    .int("Use números inteiros")
    .min(100, "Mínimo 100 cm")
    .max(250, "Máximo 250 cm"),
  age: z.coerce
    .number({ invalid_type_error: "Informe a idade" })
    .int("Use números inteiros")
    .min(5, "Mínimo 5 anos")
    .max(120, "Máximo 120 anos"),
});

type DadosErrors = Partial<Record<keyof typeof dadosSchema.shape, string>>;

const ENCOURAGE: Record<number, string> = {
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
  10: "Pronto. Sua fênix está se formando.",
};

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [prepStage, setPrepStage] = useState(0);
  const [showEncourage, setShowEncourage] = useState(false);
  const [form, setForm] = useState<Form>({
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
    restricoes_alimentares: [],
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const [dadosErrors, setDadosErrors] = useState<DadosErrors>({});
  const validateDados = (field: keyof DadosErrors, value: string) => {
    const result = dadosSchema.shape[field].safeParse(value);
    setDadosErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.errors[0].message,
    }));
  };

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // Build the list of steps; each is a screen with a question.
  const steps = useMemo(() => [
    "dados",
    "objetivo_peso",
    "atividade",
    "objetivo_fenix",
    "favorito",
    "evitar",
    "restricao",
    "essenciais",
    "detestados",
    "estilo",
    "restricoes_alim",
    "pronto",
  ] as const, []);

  const total = steps.length;
  const current = steps[step];

  const canNext = (() => {
    switch (current) {
      case "dados":
        return !!(form.current_weight && form.height && form.age) &&
          !dadosErrors.current_weight && !dadosErrors.height && !dadosErrors.age;
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
        return true; // pode pular sem marcar nada
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
    // brief encouragement flash
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
    const stages = [
      "Analisando seu perfil metabólico…",
      "Calculando sua meta calórica…",
      "Montando seu plano Fênix…",
      "Tudo pronto. Renascendo.",
    ];
    let i = 0;
    const tick = setInterval(() => {
      if (!mountedRef.current) return;
      i = Math.min(i + 1, stages.length - 1);
      setPrepStage(i);
    }, 800);
    try {
      const calories = calculateDailyCalories({
        weight: w, height: h, age: a,
        gender: form.gender, activity: form.activity,
        goal: form.objetivo_fenix === "emagrecer" ? "lose"
            : form.objetivo_fenix === "ganhar_musculo" ? "gain"
            : "maintain",
      });
      const { error } = await supabase.from("profiles").update({
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
        objetivo_fenix: form.objetivo_fenix,
      }).eq("id", user.id);
      if (error) throw error;
      await supabase.from("weight_logs").upsert(
        { user_id: user.id, weight: w, logged_date: todayISO() },
        { onConflict: "user_id,logged_date" },
      );
      await supabase.from("badges").upsert(
        { user_id: user.id, badge_type: "first_log" },
        { onConflict: "user_id,badge_type" },
      );
      await supabase.from("preferencias_alimentares").upsert(
        {
          user_id: user.id,
          essenciais: form.essenciais,
          detestados: form.detestados,
          estilo_refeicao: form.estilo_refeicao || null,
          restricoes: form.restricoes_alimentares,
        },
        { onConflict: "user_id" },
      );
      await new Promise((r) => setTimeout(r, 3200));
      clearInterval(tick);
      if (!mountedRef.current) return;
      queryClient.setQueryData(["profile", user.id], (old: any) => ({
        ...(old ?? {}),
        current_weight: w, goal_weight: gw, height: h, age: a,
        gender: form.gender, activity_level: form.activity,
        daily_calorie_goal: calories,
        onboarding_complete: true,
        has_seen_welcome: old?.has_seen_welcome ?? false,
        display_name: old?.display_name ?? null,
      }));
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Sua jornada começa agora.");
      navigate({ to: "/app" });
    } catch (e: any) {
      clearInterval(tick);
      if (!mountedRef.current) return;
      setPreparing(false);
      toast.error(e.message ?? "Erro");
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };

  if (preparing) {
    const stages = [
      "Analisando seu perfil metabólico…",
      "Calculando sua meta calórica…",
      "Montando seu plano Fênix…",
      "Tudo pronto. Renascendo.",
    ];
    return (
      <main className="min-h-screen bg-background px-6 py-10 grid place-items-center">
        <div className="mx-auto max-w-md w-full text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-ember grid place-items-center shadow-ember animate-pop">
            <Flame className="h-9 w-9 text-primary-foreground" strokeWidth={2} />
          </div>
          <h2 className="mt-8 text-3xl">Preparando seu plano</h2>
          <p className="mt-2 text-sm text-muted-foreground min-h-[2.5rem] transition-all">
            {stages[prepStage]}
          </p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-ember animate-loading-bar" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Método Fênix</p>
        </div>
      </main>
    );
  }

  const progress = ((step + 1) / total) * 100;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,90,30,0.12),transparent_60%)] bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display text-lg">Fênix</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {step + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-gradient-ember transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question area */}
        <div className="flex-1 flex flex-col justify-center py-10">
          {showEncourage ? (
            <div className="animate-pop text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 font-display text-2xl leading-snug">
                {ENCOURAGE[step] ?? "Vamos em frente."}
              </p>
            </div>
          ) : (
            <StepScreen
              step={current}
              form={form}
              set={set}
              onEnter={canNext ? goNext : undefined}
              dadosErrors={dadosErrors}
              validateDados={validateDados}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 pb-2">
          {step > 0 && !showEncourage && (
            <Button
              variant="outline"
              onClick={goBack}
              className="h-14 flex-1 text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          )}
          {!showEncourage && (
            step < total - 1 ? (
              <Button
                onClick={goNext}
                disabled={!canNext}
                className="h-14 flex-[2] text-base bg-gradient-ember text-primary-foreground shadow-ember"
              >
                Continuar <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={finish}
                disabled={busy}
                className="h-14 flex-[2] text-base bg-gradient-ember text-primary-foreground shadow-ember"
              >
                {busy ? "Salvando…" : "Renascer agora"}
              </Button>
            )
          )}
        </div>
      </div>
    </main>
  );
}

function StepScreen({
  step,
  form,
  set,
  onEnter,
  dadosErrors,
  validateDados,
}: {
  step: string;
  form: Form;
  set: <K extends keyof Form>(k: K, v: Form[K]) => void;
  onEnter?: () => void;
  dadosErrors?: DadosErrors;
  validateDados?: (field: keyof DadosErrors, value: string) => void;
}) {
  if (step === "dados") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Vamos começar pelo básico.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Esses dados calibram tudo: dieta, treino e meta calórica.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <BigField
            label="Peso (kg)"
            value={form.current_weight}
            onChange={(v) => { set("current_weight", v); validateDados?.("current_weight", v); }}
            type="number"
            max={300}
            error={dadosErrors?.current_weight}
          />
          <BigField
            label="Altura (cm)"
            value={form.height}
            onChange={(v) => { set("height", v); validateDados?.("height", v); }}
            type="number"
            max={250}
            error={dadosErrors?.height}
          />
          <BigField
            label="Idade"
            value={form.age}
            onChange={(v) => { set("age", v); validateDados?.("age", v); }}
            type="number"
            max={120}
            error={dadosErrors?.age}
          />
          <div className="col-span-2">
            <div className="mb-2 text-sm text-muted-foreground">Gênero</div>
            <div className="flex gap-2">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set("gender", g)}
                  className={`flex-1 rounded-xl border-2 px-3 py-3 text-base transition ${
                    form.gender === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {g === "female" ? "Feminino" : "Masculino"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "objetivo_peso") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Qual peso você quer alcançar?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Sem pressa. Vamos respeitar o seu ritmo.
        </p>
        <div className="mt-8">
          <BigField
            label="Peso desejado (kg)"
            value={form.goal_weight}
            onChange={(v) => { set("goal_weight", v); validateDados?.("goal_weight", v); }}
            type="number"
            max={300}
            error={dadosErrors?.goal_weight}
            onEnter={onEnter}
          />
        </div>
      </div>
    );
  }

  if (step === "atividade") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Como é sua rotina hoje?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Quanto você se move durante a semana?
        </p>
        <div className="mt-8 space-y-2">
          {([
            ["sedentary", "Sedentário", "Pouco ou nenhum exercício"],
            ["light", "Leve", "1 a 3x por semana"],
            ["moderate", "Moderado", "3 a 5x por semana"],
            ["active", "Ativo", "6 a 7x por semana"],
            ["very_active", "Muito ativo", "Treino intenso diário"],
          ] as const).map(([k, t, d]) => (
            <BigChoice
              key={k}
              selected={form.activity === k}
              onClick={() => set("activity", k as ActivityLevel)}
              title={t}
              subtitle={d}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === "objetivo_fenix") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Qual seu maior objetivo?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Escolha o foco principal da sua fênix.
        </p>
        <div className="mt-8 space-y-2">
          {([
            ["emagrecer", "Emagrecer", "Perder gordura e ganhar leveza"],
            ["ganhar_musculo", "Ganhar Músculo", "Hipertrofia e força"],
            ["condicionamento", "Condicionamento", "Saúde, energia e disposição"],
          ] as const).map(([k, t, d]) => (
            <BigChoice
              key={k}
              selected={form.objetivo_fenix === k}
              onClick={() => set("objetivo_fenix", k)}
              title={t}
              subtitle={d}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === "favorito") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Qual seu alimento favorito?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Escolha apenas um. Vamos montar uma dieta que você queira seguir.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          {FAVORITOS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => set("alimento_favorito", f)}
              className={`rounded-xl border-2 px-4 py-4 text-left text-base transition ${
                form.alimento_favorito === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "evitar") {
    const toggle = (item: string) => {
      const has = form.alimentos_evitar.includes(item);
      if (item === "Nenhum") {
        set("alimentos_evitar", has ? [] : ["Nenhum"]);
        return;
      }
      const next = has
        ? form.alimentos_evitar.filter((x) => x !== item)
        : [...form.alimentos_evitar.filter((x) => x !== "Nenhum"), item];
      set("alimentos_evitar", next);
    };
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          O que você não come de jeito nenhum?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Pode marcar mais de um. Sua dieta vai respeitar isso.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          {EVITAR.map((f) => {
            const active = form.alimentos_evitar.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggle(f)}
                className={`relative rounded-xl border-2 px-4 py-4 text-left text-base transition ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
              >
                {f}
                {active && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "restricao") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Possui alguma restrição médica ou lesão?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Sua segurança vem antes de qualquer treino.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => set("tem_restricao", false)}
            className={`rounded-xl border-2 px-4 py-5 text-base transition ${
              form.tem_restricao === false
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            Não tenho
          </button>
          <button
            type="button"
            onClick={() => set("tem_restricao", true)}
            className={`rounded-xl border-2 px-4 py-5 text-base transition ${
              form.tem_restricao === true
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            Sim, tenho
          </button>
        </div>
        {form.tem_restricao && (
          <div className="mt-5">
            <div className="mb-2 text-sm text-muted-foreground">
              Conta o que você precisa que a gente saiba.
            </div>
            <Textarea
              value={form.restricao_descricao}
              onChange={(e) => set("restricao_descricao", e.target.value)}
              placeholder="Ex.: lesão no joelho direito, hipertensão, problema lombar…"
              className="min-h-[120px] text-base"
            />
          </div>
        )}
      </div>
    );
  }

  if (step === "essenciais") {
    const toggle = (k: string) => {
      const has = form.essenciais.includes(k);
      set("essenciais", has ? form.essenciais.filter((x) => x !== k) : [...form.essenciais, k]);
    };
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          O que não pode faltar na sua mesa?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Toque em tudo que faz parte do seu dia a dia.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ESSENCIAIS.map(({ key, label, Icon }) => {
            const active = form.essenciais.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-ember"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl transition ${
                    active ? "bg-gradient-ember text-primary-foreground" : "bg-secondary text-foreground/70"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold">{label}</div>
                {active && <Check className="absolute right-2 top-2 h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "detestados") {
    return <DetestadosStep form={form} set={set} />;
  }

  if (step === "estilo") {
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Qual seu estilo de refeição?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Escolha o que combina com a sua rotina.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {ESTILOS.map(({ key, label, sub, Icon }) => {
            const active = form.estilo_refeicao === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => set("estilo_refeicao", key)}
                className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition ${
                  active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${
                    active ? "bg-gradient-ember text-primary-foreground" : "bg-secondary text-foreground/70"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "restricoes_alim") {
    const toggle = (item: string) => {
      const has = form.restricoes_alimentares.includes(item);
      if (item === "Nenhuma") {
        set("restricoes_alimentares", has ? [] : ["Nenhuma"]);
        return;
      }
      const next = has
        ? form.restricoes_alimentares.filter((x) => x !== item)
        : [...form.restricoes_alimentares.filter((x) => x !== "Nenhuma"), item];
      set("restricoes_alimentares", next);
    };
    return (
      <div>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Você segue alguma restrição alimentar?
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Pode marcar mais de uma. Sua dieta vai respeitar tudo.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-2">
          {RESTRICOES_ALIM.map((f) => {
            const active = form.restricoes_alimentares.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggle(f)}
                className={`relative rounded-xl border-2 px-4 py-4 text-left text-base transition ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
              >
                {f}
                {active && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // pronto
  return (
    <div className="text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-gradient-ember grid place-items-center shadow-ember">
        <Flame className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">
        Sua fênix está pronta para renascer.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Baseado nas suas escolhas, seu protocolo Fênix será exclusivo e
        pensado exatamente para o seu paladar.
      </p>
    </div>
  );
}

function DetestadosStep({
  form, set,
}: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  const [q, setQ] = useState("");
  const { data: alimentos } = useQuery<{ id: string; nome: string }[]>({
    queryKey: ["alimentos_padrao_onboarding"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alimentos_padrao")
        .select("id,nome")
        .eq("ativo", true)
        .order("nome", { ascending: true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as { id: string; nome: string }[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const term = q.trim().toLowerCase();
  const filtered = (alimentos ?? []).filter((a) =>
    term ? a.nome.toLowerCase().includes(term) : true,
  ).slice(0, 60);

  const toggle = (nome: string) => {
    const has = form.detestados.includes(nome);
    set("detestados", has ? form.detestados.filter((x) => x !== nome) : [...form.detestados, nome]);
  };

  return (
    <div>
      <h1 className="font-display text-3xl leading-tight sm:text-4xl">
        Quais alimentos você detesta?
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Busque na lista e marque tudo que não entra de jeito nenhum.
      </p>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar alimento…"
          className="h-12 rounded-xl border-2 pl-10 text-base"
        />
      </div>

      {form.detestados.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {form.detestados.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
            >
              {d} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 max-h-[42vh] overflow-y-auto rounded-xl border border-border">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Nenhum alimento encontrado. Você pode seguir sem marcar nada.
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((a) => {
              const active = form.detestados.includes(a.nome);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => toggle(a.nome)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-base transition ${
                      active ? "bg-primary/10 text-primary" : "hover:bg-secondary/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {active ? <Ban className="h-4 w-4" /> : <Apple className="h-4 w-4 text-muted-foreground" />}
                      {a.nome}
                    </span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function BigField({
  label, value, onChange, type = "text", onEnter, error, max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onEnter?: () => void;
  error?: string;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">{label}</div>
      <Input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => {
          let v = e.target.value;
          if (type === "number" && max !== undefined && v !== "" && Number(v) > max) {
            v = String(max);
          }
          onChange(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        className={`h-14 rounded-xl border-2 text-lg${error ? " border-destructive" : ""}`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function BigChoice({
  selected, onClick, title, subtitle,
}: { selected: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-2 px-5 py-4 text-left transition ${
        selected ? "border-primary bg-primary/10" : "border-border"
      }`}
    >
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </button>
  );
}
