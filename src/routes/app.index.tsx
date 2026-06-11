import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";

import {
  Flame,
  Plus,
  TrendingDown,
  Target,
  Check,
  Sparkles,
  Award,
  Lock,
  BookOpen,
  ChevronRight,
  UtensilsCrossed,
  Dumbbell,
  Scale,
  CalendarDays,
  Brain,
  Loader2,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const WeightChart = lazy(() => import("@/components/weight-chart"));
import { WeeklyPlanner } from "@/components/weekly-planner";
import { WelcomeModal } from "@/components/welcome-modal";
import { HumorCheckIn } from "@/components/humor-checkin";
import { todayISO } from "@/lib/calories";
import { computeStreak } from "@/lib/streak";
import { ALL_BADGES } from "@/lib/badges";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  profileQuery,
  weightsQuery,
  mealsRecentQuery,
  badgesQuery,
  guiasMentaisQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const qc = useQueryClient();

  // All four reads are cached by React Query (staleTime 1min, gcTime 5min).
  // Revisiting the Dashboard within that window paints instantly from cache
  // while a background refresh keeps data current.
  const { data: profile, isPending: profilePending } = useQuery({
    ...profileQuery(userId),
    enabled: !!userId,
  });
  const { data: weights = [] } = useQuery({ ...weightsQuery(userId), enabled: !!userId });
  const { data: recentMeals = [] } = useQuery({ ...mealsRecentQuery(userId), enabled: !!userId });
  const { data: badgeList = [] } = useQuery({ ...badgesQuery(userId), enabled: !!userId });
  const { data: guias = [] } = useQuery(guiasMentaisQuery);

  // Check-in diário: lê de diario_registro (não polui o diário alimentar).
  const checkinKey = ["checkin_diario", userId, todayISO()] as const;
  const { data: checkedIn = false } = useQuery({
    queryKey: checkinKey,
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("diario_registro")
        .select("id")
        .eq("user_id", userId)
        .eq("registrado_em", todayISO())
        .eq("pergunta", "Check-in diário")
        .limit(1)
        .maybeSingle();
      return !!data;
    },
  });

  // Datas dos últimos 30 dias com check-in (para o streak).
  const { data: checkinDates = [] } = useQuery({
    queryKey: ["checkin_dates", userId],
    enabled: !!userId,
    queryFn: async (): Promise<string[]> => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      const since = d.toLocaleDateString("sv-SE");
      const { data } = await supabase
        .from("diario_registro")
        .select("registrado_em")
        .eq("user_id", userId)
        .eq("pergunta", "Check-in diário")
        .gte("registrado_em", since);
      return (data ?? []).map((r) => r.registrado_em);
    },
  });

  const [newWeight, setNewWeight] = useState("");
  const [open, setOpen] = useState(false);
  const [savingWeight, setSavingWeight] = useState(false);
  const [streakPulse, setStreakPulse] = useState(false);

  // Derive everything from the cached meal list — no extra requests.
  const today = todayISO();
  const todayMeals = useMemo(
    () => recentMeals.filter((r) => r.logged_date === today),
    [recentMeals, today],
  );
  const todayCals = useMemo(() => todayMeals.reduce((s, r) => s + r.calories, 0), [todayMeals]);
  const streak = useMemo(
    () => computeStreak([...new Set([...recentMeals.map((r) => r.logged_date), ...checkinDates])]),
    [recentMeals, checkinDates],
  );

  const unlocked = useMemo(() => new Set(badgeList), [badgeList]);

  // Side-effect badge: unlock streak_7 once threshold is reached.
  // Guard against StrictMode/double-invoke firing two upserts.
  const streak7Inflight = useRef(false);
  useEffect(() => {
    if (!userId || streak < 7 || unlocked.has("streak_7") || streak7Inflight.current) return;
    streak7Inflight.current = true;
    (async () => {
      try {
        const { error } = await supabase
          .from("badges")
          .upsert(
            { user_id: userId, badge_type: "streak_7" },
            { onConflict: "user_id,badge_type" },
          );
        if (error) {
          console.error("badge streak_7 upsert failed", error);
          return;
        }
        qc.invalidateQueries({ queryKey: ["badges", userId] });
      } finally {
        streak7Inflight.current = false;
      }
    })();
  }, [streak, unlocked, userId, qc]);

  const celebrate = async () => {
    if (typeof window === "undefined") return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.25 },
      colors: ["#ff7a1a", "#ffb347", "#ffd27a"],
    });
    setStreakPulse(true);
    setTimeout(() => setStreakPulse(false), 1200);
  };

  const checkIn = async () => {
    if (!user || checkedIn) return;
    const { error } = await supabase.from("diario_registro").insert({
      user_id: user.id,
      pergunta: "Check-in diário",
      resposta: "Check-in realizado",
      registrado_em: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    celebrate();
    toast.success("Check-in registrado. Continue firme!");
    qc.invalidateQueries({ queryKey: checkinKey });
    qc.invalidateQueries({ queryKey: ["checkin_dates", userId] });
  };

  const logWeight = async () => {
    if (!user || !newWeight || savingWeight) return;
    const w = parseFloat(newWeight.replace(",", "."));
    if (!Number.isFinite(w) || w < 30 || w > 300) {
      return toast.error("Peso inválido (30–300 kg)");
    }
    setSavingWeight(true);
    try {
      // Step 1: do the weight upsert, profile update, and badge read in parallel.
      const [weightRes, profileRes, badgesRes] = await Promise.all([
        supabase
          .from("weight_logs")
          .upsert(
            { user_id: user.id, weight: w, logged_date: todayISO() },
            { onConflict: "user_id,logged_date" },
          ),
        supabase.from("profiles").update({ current_weight: w }).eq("id", user.id),
        supabase.from("badges").select("badge_type").eq("user_id", user.id),
      ]);
      if (weightRes.error) return toast.error(weightRes.error.message);
      if (profileRes.error) {
        console.error("profile update failed", profileRes.error);
        toast.error("Peso salvo, mas o perfil não atualizou.");
      }
      if (badgesRes.error) {
        console.error("badges read failed", badgesRes.error);
      }

      // Step 2: figure out which badges to unlock and upsert them in parallel.
      const alreadyHas = new Set((badgesRes.data ?? []).map((r) => r.badge_type));
      const goal = profile?.goal_weight;
      const toUnlock: string[] = [];
      if (!alreadyHas.has("first_log")) toUnlock.push("first_log");
      if (goal != null && w <= goal && !alreadyHas.has("goal_reached"))
        toUnlock.push("goal_reached");

      if (toUnlock.length > 0) {
        const results = await Promise.all(
          toUnlock.map((badge_type) =>
            supabase
              .from("badges")
              .upsert({ user_id: user.id, badge_type }, { onConflict: "user_id,badge_type" }),
          ),
        );
        const newlyUnlocked = toUnlock.filter((_, i) => !results[i].error);
        results.forEach((r, i) => {
          if (r.error) console.error(`badge ${toUnlock[i]} upsert failed`, r.error);
        });

        if (newlyUnlocked.length > 0) {
          celebrate();
          const titles = newlyUnlocked
            .map((t) => ALL_BADGES.find((x) => x.type === t)?.title)
            .filter(Boolean);
          toast.success(
            newlyUnlocked.length === 1
              ? `Nova conquista: ${titles[0]} 🔥`
              : `${newlyUnlocked.length} novas conquistas: ${titles.join(", ")} 🔥`,
          );
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
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      qc.invalidateQueries({ queryKey: ["weights", userId] });
      qc.invalidateQueries({ queryKey: ["badges", userId] });
    } finally {
      setSavingWeight(false);
    }
  };

  const calGoal = profile?.daily_calorie_goal ?? 2000;
  const pct = Math.min(100, Math.round((todayCals / calGoal) * 100));
  const startW = weights[0]?.weight ?? profile?.current_weight ?? 0;
  const currentW = profile?.current_weight ?? startW;
  const goalW = profile?.goal_weight ?? currentW;
  const totalLoss = Math.max(0, startW - currentW);
  const remaining = Math.max(0, currentW - goalW);

  const motivation =
    pct === 0
      ? "Comece com pequena vitória: registre sua primeira refeição."
      : pct < 40
        ? `Você abriu o dia com ${pct}%. Cada escolha conta.`
        : pct < 80
          ? `Você está a ${pct}% da sua meta. Mantenha o ritmo.`
          : pct < 100
            ? `Quase lá — ${100 - pct}% para fechar o dia.`
            : pct === 100
              ? "Meta atingida. Dia redondo."
              : "Atenção: você ultrapassou sua meta calórica.";

  // Above-the-fold skeleton while the first profile fetch is in flight
  // (cached visits skip this entirely because data is already available).
  if (profilePending) {
    return (
      <main className="mx-auto max-w-md px-5 pt-8 pb-8 space-y-4">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md lg:max-w-6xl px-5 lg:px-8 pt-8 pb-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
      <div className="lg:col-span-2">
        {/* Streak — top hero */}
        <section
          className={`glass rounded-2xl p-4 flex items-center gap-4 border-primary/20 ${streakPulse ? "animate-streak" : ""}`}
        >
          <div
            className={`relative h-14 w-14 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember ${streakPulse ? "animate-pop" : ""}`}
          >
            <Flame className="h-7 w-7 text-primary-foreground" strokeWidth={2} />
            {streak >= 7 && <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent" />}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Streak</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl text-gradient-ember leading-none">
                {streak}
              </span>
              <span className="text-sm text-muted-foreground">dias seguidos</span>
            </div>
          </div>
          <Button
            onClick={checkIn}
            disabled={checkedIn}
            size="sm"
            className="h-11 px-4 bg-gradient-ember text-primary-foreground shadow-ember disabled:opacity-60 disabled:bg-secondary disabled:bg-none disabled:text-muted-foreground disabled:shadow-none"
          >
            {checkedIn ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Feito
              </>
            ) : (
              "Check-in"
            )}
          </Button>
        </section>

        <header className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Olá,</div>
            <h1 className="text-3xl mt-1">{profile?.display_name ?? "Fênix"}</h1>
          </div>
        </header>

        <HumorCheckIn />

        {/* Calorie ring */}
        <section className="mt-6 glass rounded-3xl p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Meta de hoje
          </div>
          <div className="relative mx-auto mt-4 h-44 w-44">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="oklch(0.26 0.008 60)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#g)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 276} 276`}
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 47)" />
                  <stop offset="100%" stopColor="oklch(0.82 0.15 65)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-4xl">{todayCals}</div>
              <div className="text-xs text-muted-foreground">/ {calGoal} kcal</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {calGoal - todayCals > 0 ? `Restam ${calGoal - todayCals} kcal` : "Meta atingida"}
          </div>
        </section>

        {/* Daily summary */}
        <section className="mt-4 glass rounded-2xl p-5 border-l-2 border-primary">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Resumo do dia
          </div>
          <p className="mt-2 text-sm leading-relaxed">{motivation}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-ember transition-all" style={{ width: `${pct}%` }} />
          </div>
        </section>

        {/* Quick stats */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-4">
            <TrendingDown className="h-4 w-4 text-primary" />
            <div className="mt-2 font-display text-2xl">
              {totalLoss.toFixed(1)}
              <span className="text-sm text-muted-foreground"> kg</span>
            </div>
            <div className="text-xs text-muted-foreground">Perdidos</div>
          </div>
          <div className="glass rounded-2xl p-4">
            <Target className="h-4 w-4 text-accent" />
            <div className="mt-2 font-display text-2xl">
              {remaining.toFixed(1)}
              <span className="text-sm text-muted-foreground"> kg</span>
            </div>
            <div className="text-xs text-muted-foreground">Faltam</div>
          </div>
        </section>

        {/* Ações rápidas */}
        <section className="mt-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Ações rápidas
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/app/alimentacao"
              className="group glass rounded-2xl p-4 flex flex-col gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.98]"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold">Registrar refeição</div>
                <div className="text-xs text-muted-foreground">Diário alimentar</div>
              </div>
            </Link>

            <Link
              to="/app/treinos"
              className="group glass rounded-2xl p-4 flex flex-col gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.98]"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
                <Dumbbell className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold">Marcar treino</div>
                <div className="text-xs text-muted-foreground">Sessão de hoje</div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group glass rounded-2xl p-4 flex flex-col gap-3 text-left transition hover:border-primary/40 hover:bg-card active:scale-[0.98]"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
                <Scale className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold">Registrar peso</div>
                <div className="text-xs text-muted-foreground">Atualize agora</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("planner-semanal")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="group glass rounded-2xl p-4 flex flex-col gap-3 text-left transition hover:border-primary/40 hover:bg-card active:scale-[0.98]"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
                <CalendarDays className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-semibold">Ver planner</div>
                <div className="text-xs text-muted-foreground">Sua semana</div>
              </div>
            </button>
          </div>
        </section>

        {/* Planner Semanal */}
        <WeeklyPlanner currentWeight={profile?.current_weight} goalWeight={profile?.goal_weight} />

        {userId && (
          <WelcomeModal
            userId={userId}
            show={!!profile && profile.onboarding_complete && !profile.has_seen_welcome}
            onStart={() => {
              requestAnimationFrame(() => {
                document
                  .getElementById("planner-semanal")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              });
            }}
          />
        )}

        {/* Chart */}
        <section className="mt-4 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Evolução do peso</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-ember text-primary-foreground h-10 px-4">
                  <Plus className="h-4 w-4 mr-1" /> Registrar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Peso de hoje</DialogTitle>
                </DialogHeader>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="kg"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                  className="h-12 bg-background/40 border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
                />
                <Button
                  onClick={logWeight}
                  disabled={savingWeight}
                  className="h-12 bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95 hover:shadow-ember focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-80"
                >
                  {savingWeight ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando…
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="h-40">
            {weights.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Sem registros ainda
              </div>
            ) : (
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <WeightChart data={weights} goal={profile?.goal_weight ?? null} />
              </Suspense>
            )}
          </div>

          {/* Dias de Fênix consecutivos */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-3">
            <div className="relative h-11 w-11 shrink-0 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
              <Flame className="h-5 w-5 text-primary-foreground" strokeWidth={2.25} />
              {streak >= 7 && (
                <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-accent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Dias de Fênix consecutivos
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-gradient-ember leading-none">
                  {streak}
                </span>
                <span className="text-xs text-muted-foreground">
                  {streak === 0
                    ? "comece hoje — registre uma refeição"
                    : streak === 1
                      ? "dia — não quebre a sequência"
                      : "dias seguidos — siga firme"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 lg:mt-0 lg:col-span-1 lg:sticky lg:top-6 space-y-4">
        {/* Biblioteca de Mentalidade */}
        {guias.length > 0 && (
          <section className="mt-4">
            <Collapsible>
              <CollapsibleTrigger className="group glass rounded-2xl p-4 w-full flex items-center gap-3 transition hover:border-primary/40 hover:bg-card data-[state=open]:border-primary/40">
                <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember shrink-0">
                  <Brain className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold">Biblioteca de Mentalidade</div>
                  <div className="text-xs text-muted-foreground">
                    {guias.length} guias para a mente Fênix
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="mt-2 space-y-2">
                  {guias.map((g) => (
                    <Link
                      key={g.id}
                      to="/app/guias/$chave"
                      params={{ chave: g.chave }}
                      className="group glass rounded-xl p-3 flex items-center gap-3 transition hover:border-primary/40 hover:bg-card active:scale-[0.99]"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{g.titulo}</div>
                        {g.descricao && (
                          <div className="text-xs text-muted-foreground truncate">
                            {g.descricao}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>
        )}

        {/* Badges */}
        <section className="mt-4 glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-accent" />
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Conquistas</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {unlocked.size}/{ALL_BADGES.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ALL_BADGES.map((b) => {
              const has = unlocked.has(b.type);
              return (
                <div
                  key={b.type}
                  role="img"
                  aria-label={`${b.title} — ${has ? "desbloqueada" : "bloqueada"}`}
                  className={`rounded-xl p-3 text-center border ${has ? "border-primary/30 bg-primary/5" : "border-border opacity-50"}`}
                >
                  <div
                    className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center ${has ? "bg-gradient-ember shadow-ember" : "bg-secondary"}`}
                  >
                    {has ? (
                      <Award className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="mt-2 text-[11px] font-medium leading-tight">{b.title}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
