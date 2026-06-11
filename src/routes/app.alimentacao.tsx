import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Utensils, Droplet, Target, Beef, Wheat, Salad, TrendingDown, TrendingUp, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { profileQuery } from "@/lib/queries";
import { MinhaAlimentacao, type PrefillRefeicao } from "@/components/minha-alimentacao";
import { CardapioSugerido } from "@/components/cardapio-sugerido";
import { CardapioPrescrito } from "@/components/cardapio-prescrito";
import { LazyMount } from "@/components/LazyMount";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapGenero } from "@/lib/profile";
import { todayISO } from "@/lib/calories";


export const Route = createFileRoute("/app/alimentacao")({
  head: () => ({
    meta: [
      { title: "Minha Alimentação" },
      { name: "description", content: "Metas nutricionais, progresso diário e registro de refeições." },
    ],
  }),
  component: AlimentacaoPage,
});

const ML_POR_COPO = 250;
const ML_POR_KG = 35;
const META_COPOS_FALLBACK = 8;


type Objetivo = "perda" | "ganho" | "reeducacao";

function AlimentacaoPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({ ...profileQuery(user?.id ?? ""), enabled: !!user });
  const today = todayISO();



  // Meta de hidratação dinâmica: peso (kg) * 35ml; copo = 250ml
  const pesoKg = Number(profile?.current_weight) || 0;
  const metaMl = pesoKg > 0 ? Math.round(pesoKg * ML_POR_KG) : META_COPOS_FALLBACK * ML_POR_COPO;
  const metaCopos = Math.max(1, Math.ceil(metaMl / ML_POR_COPO));
  const metaLitros = metaMl / 1000;

  // Hydration — persisted in DB
  const hydroKey = ["hidratacao_diaria", user?.id, today];
  const { data: copos = 0 } = useQuery({
    queryKey: hydroKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hidratacao_diaria")
        .select("copos")
        .eq("user_id", user!.id)
        .eq("data", today)
        .maybeSingle();
      if (error) throw error;
      return data?.copos ?? 0;
    },
  });

  const setCoposMut = useMutation({
    mutationFn: async (novo: number) => {
      if (!user) throw new Error("no user");
      const c = Math.max(0, Math.min(metaCopos, novo));
      const { error } = await supabase
        .from("hidratacao_diaria")
        .upsert({ user_id: user.id, data: today, copos: c }, { onConflict: "user_id,data" });
      if (error) throw error;
      return c;
    },
    onMutate: async (novo) => {
      await qc.cancelQueries({ queryKey: hydroKey });
      const prev = qc.getQueryData<number>(hydroKey);
      const next = Math.max(0, Math.min(metaCopos, novo));
      qc.setQueryData(hydroKey, next);
      // Celebrate hitting the goal (only on the transition)
      if ((prev ?? 0) < metaCopos && next >= metaCopos) {
        toast.success("Meta de hidratação batida 💧", {
          description: `Você bebeu ${metaLitros.toFixed(2)}L hoje. Mandou bem!`,
          duration: 4000,
        });
        if (typeof window !== "undefined") {
          import("canvas-confetti").then(({ default: confetti }) => {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.3 },
              colors: ["#38bdf8", "#0ea5e9", "#7dd3fc"],
            });
          }).catch(() => {});
        }
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(hydroKey, ctx.prev);
      toast.error("Não foi possível salvar a hidratação.");
    },

  });



  // Objetivo
  const metaKey = ["metas_usuario", user?.id];
  const { data: metaRow } = useQuery({
    queryKey: metaKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metas_usuario")
        .select("objetivo_ativo")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data?.objetivo_ativo ?? "perda") as Objetivo;
    },
  });
  const objetivo: Objetivo = (metaRow as Objetivo | undefined) ?? "perda";

  const baseKcal = profile?.daily_calorie_goal ?? 2000;
  const kcalFor = (o: Objetivo) =>
    o === "perda" ? Math.max(1200, baseKcal - 500) : o === "ganho" ? baseKcal + 300 : baseKcal;
  const metaKcal = kcalFor(objetivo);

  const setObjetivo = useMutation({
    mutationFn: async (novo: Objetivo) => {
      if (!user) throw new Error("no user");
      const { error } = await supabase
        .from("metas_usuario")
        .upsert({ user_id: user.id, objetivo_ativo: novo }, { onConflict: "user_id" });
      if (error) throw error;
      return novo;
    },
    onMutate: async (novo) => {
      await qc.cancelQueries({ queryKey: metaKey });
      const prev = qc.getQueryData(metaKey);
      qc.setQueryData(metaKey, novo);
      return { prev, anterior: (prev as Objetivo | undefined) ?? objetivo };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(metaKey, ctx.prev);
      toast.error("Não foi possível atualizar a meta.");
    },
    onSuccess: (novo, _v, ctx) => {
      const antigo = ctx?.anterior ?? "perda";
      const antesKcal = kcalFor(antigo);
      const depoisKcal = kcalFor(novo);
      const delta = depoisKcal - antesKcal;
      const deltaTxt = delta === 0 ? "Meta calórica mantida" : `Meta: ${antesKcal} → ${depoisKcal} kcal (${delta > 0 ? "+" : ""}${delta})`;
      const titulo =
        novo === "ganho" ? "Modo ganho ativado 💪" :
        novo === "reeducacao" ? "Modo reeducação ativado 🌱" :
        "Modo perda ativado 🔥";
      toast.success(titulo, { description: deltaTxt, duration: 4000 });
    },
  });


  const macros = useMemo(() => {
    const split =
      objetivo === "perda"
        ? { p: 0.35, c: 0.35, g: 0.30 }
        : objetivo === "ganho"
          ? { p: 0.30, c: 0.50, g: 0.20 }
          : { p: 0.25, c: 0.50, g: 0.25 };
    return {
      prot: Math.round((metaKcal * split.p) / 4),
      carb: Math.round((metaKcal * split.c) / 4),
      gord: Math.round((metaKcal * split.g) / 9),
    };
  }, [metaKcal, objetivo]);

  const accent =
    objetivo === "ganho"
      ? { text: "text-accent", border: "border-accent/30", bgInner: "bg-accent/10 border-accent/30", textStrong: "text-accent", gradient: "from-accent/10 via-primary/5 to-transparent" }
      : objetivo === "reeducacao"
        ? { text: "text-primary", border: "border-primary/30", bgInner: "bg-primary/10 border-primary/30", textStrong: "text-primary", gradient: "from-primary/10 via-accent/5 to-transparent" }
        : { text: "text-primary", border: "border-primary/40", bgInner: "bg-primary/10 border-primary/40", textStrong: "text-gradient-ember", gradient: "from-primary/15 via-accent/5 to-transparent" };

  const objetivoLabel = objetivo === "perda" ? "Déficit" : objetivo === "ganho" ? "Superávit" : "Equilíbrio";

  // Prefill bridge: CardapioSugerido → MinhaAlimentacao
  const [prefill, setPrefill] = useState<PrefillRefeicao | null>(null);

  return (
    <main className="mx-auto max-w-md px-5 pt-8 pb-8 space-y-5">
      <header className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
          <Utensils className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Hoje</div>
          <h1 className="text-2xl">Minha Alimentação</h1>
        </div>
      </header>

      {/* Protocolo prescrito pelo admin (se houver) */}
      {user?.id && <CardapioPrescrito userId={user.id} />}


      {/* Hydration */}
      <section className="glass rounded-2xl p-4 border border-border/40">
        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-sky-500/80" />
            <span className="font-semibold">Hidratação</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {copos}/{metaCopos} copos · {((copos * ML_POR_COPO) / 1000).toFixed(2)}L de {metaLitros.toFixed(2)}L
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {pesoKg > 0
            ? `Meta personalizada: ${pesoKg}kg × 35ml = ${metaLitros.toFixed(2)}L`
            : "Cadastre seu peso no Perfil para personalizar a meta."}
        </p>
        {metaCopos > 16 ? (
          <div className="space-y-2">
            <div className="relative h-4 rounded-full bg-background/40 border border-sky-500/20 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-600/60 to-sky-500/70 transition-all"
                style={{ width: `${Math.min(100, (copos / metaCopos) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setCoposMut.mutate(copos - 1)}
                disabled={copos <= 0 || setCoposMut.isPending}
                className="px-3 py-1.5 rounded-lg border border-border/60 bg-background/40 text-sm hover:border-sky-500/30 disabled:opacity-40"
              >
                − 250ml
              </button>
              <span className="text-xs text-muted-foreground">
                {Math.round((copos / metaCopos) * 100)}% da meta
              </span>
              <button
                type="button"
                onClick={() => setCoposMut.mutate(copos + 1)}
                disabled={copos >= metaCopos || setCoposMut.isPending}
                className="px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300/90 text-sm hover:bg-sky-500/20 disabled:opacity-40"
              >
                + 250ml
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-2 ${
              metaCopos <= 8 ? "grid-cols-8" : "grid-cols-8 sm:grid-cols-12"
            }`}
          >
            {Array.from({ length: metaCopos }).map((_, i) => {
              const active = i < copos;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCoposMut.mutate(active ? i : i + 1)}
                  aria-label={`Marcar copo ${i + 1}`}
                  className={`aspect-square rounded-lg border flex items-center justify-center transition-colors ${
                    active
                      ? "bg-sky-500/15 border-sky-500/40 text-sky-300/90"
                      : "bg-background/40 border-border/40 text-muted-foreground hover:border-sky-500/30"
                  }`}
                >
                  <Droplet className="h-4 w-4" fill={active ? "currentColor" : "none"} />
                </button>
              );
            })}
          </div>
        )}


      </section>


      {/* Objective Toggle (3 options) */}
      <section className="glass rounded-2xl p-2 border border-border/40">
        <div className="grid grid-cols-3 gap-1.5">
          {([
            {
              key: "perda",
              label: "Perda",
              Icon: TrendingDown,
              activeCls: "bg-gradient-to-br from-rose-500 to-red-700 text-white border-rose-400 shadow-[0_0_20px_-4px_rgba(244,63,94,0.6)]",
              idleCls: "text-rose-300/80 hover:text-rose-200 hover:border-rose-500/50",
            },
            {
              key: "reeducacao",
              label: "Reeducação",
              Icon: Leaf,
              activeCls: "bg-gradient-to-br from-emerald-500 to-green-700 text-white border-emerald-400 shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)]",
              idleCls: "text-emerald-300/80 hover:text-emerald-200 hover:border-emerald-500/50",
            },
            {
              key: "ganho",
              label: "Ganho",
              Icon: TrendingUp,
              activeCls: "bg-gradient-ember text-primary-foreground border-primary shadow-ember",
              idleCls: "text-orange-300/80 hover:text-orange-200 hover:border-primary/50",
            },
          ] as const).map(({ key, label, Icon, activeCls, idleCls }) => {
            const active = objetivo === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => !active && setObjetivo.mutate(key)}
                disabled={setObjetivo.isPending}
                className={`relative overflow-hidden rounded-xl px-2 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border ${
                  active ? `${activeCls} scale-[1.03]` : `bg-[#0f0f0f] border-border/60 ${idleCls}`
                }`}
                aria-pressed={active}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </section>




      {/* Nutritional Goals Card */}
      <section
        key={objetivo}
        className={`rounded-2xl p-5 border transition-colors duration-500 animate-fade-in backdrop-blur-md bg-gradient-to-br ${accent.gradient} ${accent.border}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className={`h-5 w-5 transition-colors duration-500 ${accent.text}`} />
            <h2 className="font-semibold">Meta Nutricional</h2>
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${accent.text}`}>
            {objetivoLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl border p-3 col-span-2 transition-colors duration-500 ${accent.bgInner}`}>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Calorias diárias</div>
            <div className={`text-2xl font-bold mt-1 transition-colors duration-500 ${accent.textStrong}`}>
              {metaKcal} <span className="text-sm text-muted-foreground font-normal">kcal</span>
            </div>
          </div>
          <div className="rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2">
            <Beef className="h-4 w-4 text-primary" />
            <div>
              <div className="text-[11px] text-muted-foreground">Proteínas</div>
              <div className="text-sm font-semibold">{macros.prot}g</div>
            </div>
          </div>
          <div className="rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2">
            <Wheat className="h-4 w-4 text-accent" />
            <div>
              <div className="text-[11px] text-muted-foreground">Carboidratos</div>
              <div className="text-sm font-semibold">{macros.carb}g</div>
            </div>
          </div>
          <div className="rounded-xl bg-background/30 border border-border/30 p-3 flex items-center gap-2 col-span-2">
            <Salad className="h-4 w-4 text-primary/80" />
            <div>
              <div className="text-[11px] text-muted-foreground">Gorduras</div>
              <div className="text-sm font-semibold">{macros.gord}g</div>
            </div>
          </div>
        </div>
        {!profile?.daily_calorie_goal && (
          <p className="text-[11px] text-muted-foreground mt-3 italic">
            Defina sua meta no perfil para personalizar (usando 2000 kcal por padrão).
          </p>
        )}
      </section>

      {/* Progress + Register + History */}
      <MinhaAlimentacao
        objetivo={objetivo}
        metaKcal={metaKcal}
        macroGoals={macros}
        prefill={prefill}
        onPrefillConsumed={() => setPrefill(null)}
      />

      {/* Suggested meal plan based on objective + gender */}
      <LazyMount
        rootMargin="300px"
        minHeight={320}
        placeholder={<div className="glass rounded-2xl h-[320px] animate-pulse" aria-hidden />}
      >
        <CardapioSugerido
          objetivo={objetivo}
          genero={mapGenero(profile?.gender)}
          onSelect={(p) => setPrefill(p)}
        />
      </LazyMount>
    </main>
  );
}
