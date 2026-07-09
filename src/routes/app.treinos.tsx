import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ChevronDown, Circle, Dumbbell, Play } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  profileQuery,
  perfilQuery,
  treinosWeekQuery,
  planosTreinoAlunoQuery,
  planoExerciciosQuery,
  conclusoesTreinoQuery,
  type TreinoRow,
  type PlanoTreinoRow,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyMount } from "@/components/LazyMount";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExercicioMedia } from "@/components/exercicio-media";
import { toast } from "sonner";
import { todayISO } from "@/lib/calories";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/app/treinos")({
  component: TreinosPage,
});

const NIVEIS = [
  "Iniciante I",
  "Iniciante II",
  "Intermediário I",
  "Intermediário II",
  "Avançado I",
  "Avançado II",
] as const;
const GENEROS = ["Masculino", "Feminino"] as const;
const LOCAIS = ["Academia", "Casa"] as const;
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const STORAGE_KEY = "treino-filters";

type Filters = { nivel: string; genero: string; local: string };

function loadFilters(fallbackGenero: string): { filters: Filters; hasSaved: boolean } {
  const fallback: Filters = { nivel: "Iniciante I", genero: fallbackGenero, local: "Academia" };
  if (typeof window === "undefined") return { filters: fallback, hasSaved: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Filters>;
      return {
        filters: { ...fallback, ...parsed },
        hasSaved: true,
      };
    }
  } catch {}
  return { filters: fallback, hasSaved: false };
}

// ─── Prescribed plan components ──────────────────────────────────────────────

function ConcluirTreinoBtn({
  planoId,
  alunoId,
  diaSemana,
}: {
  planoId: string;
  alunoId: string;
  diaSemana: number;
}) {
  const queryClient = useQueryClient();
  const today = todayISO();
  const { data: conclusoes = [] } = useQuery(conclusoesTreinoQuery(planoId, alunoId, 1));
  const jaConcluido = conclusoes.some((c) => c.dia_semana === diaSemana && c.data === today);

  const marcar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("plano_treino_conclusoes").insert({
        plano_id: planoId,
        aluno_id: alunoId,
        dia_semana: diaSemana,
        data: today,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conclusoes-treino", planoId, alunoId] });
      toast.success("Treino marcado como concluído! 💪");
    },
    onError: () => toast.error("Erro ao registrar conclusão."),
  });

  const desmarcar = useMutation({
    mutationFn: async () => {
      const conclusao = conclusoes.find((c) => c.dia_semana === diaSemana && c.data === today);
      if (!conclusao) return;
      const { error } = await supabase
        .from("plano_treino_conclusoes")
        .delete()
        .eq("id", conclusao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conclusoes-treino", planoId, alunoId] });
      toast.success("Conclusão desfeita.");
    },
    onError: () => toast.error("Erro ao desfazer conclusão."),
  });

  return (
    <button
      onClick={() => (jaConcluido ? desmarcar.mutate() : marcar.mutate())}
      disabled={marcar.isPending || desmarcar.isPending}
      className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${
        jaConcluido
          ? "bg-primary/10 border-primary/40 text-primary"
          : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      {jaConcluido ? (
        <CheckCircle2 className="h-4 w-4 text-primary" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {jaConcluido ? "Treino concluído hoje ✓" : "Marcar treino como concluído"}
    </button>
  );
}

function PlanoTreinoView({ plano, alunoId }: { plano: PlanoTreinoRow; alunoId: string }) {
  const { data: exercicios = [], isLoading } = useQuery(planoExerciciosQuery(plano.id));
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set([new Date().getDay()]));
  const [selected, setSelected] = useState<(typeof exercicios)[number] | null>(null);

  const byDay = useMemo(() => {
    const map: Record<number, typeof exercicios> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const e of exercicios) map[e.dia_semana] = [...(map[e.dia_semana] ?? []), e];
    return map;
  }, [exercicios]);

  const toggleDay = (d: number) =>
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold text-sm">{plano.nome}</h2>
        <span className="text-[11px] capitalize text-muted-foreground px-2 py-0.5 rounded-full border border-border">
          {plano.nivel}
        </span>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </>
      ) : exercicios.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Seu instrutor ainda não adicionou exercícios a este plano."
        />
      ) : (
        [1, 2, 3, 4, 5, 6, 0].map((dia) => {
          const list = byDay[dia];
          if (!list || !list.length) return null;
          const isToday = dia === new Date().getDay();
          const isOpen = openDays.has(dia);
          const section = (
            <section
              key={dia}
              className={`glass rounded-2xl overflow-hidden ${isToday ? "border border-primary/40" : ""}`}
            >
              <button
                onClick={() => toggleDay(dia)}
                className="w-full flex items-center gap-2 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold">{DIAS[dia]}</span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-ember text-primary-foreground">
                    Hoje
                  </span>
                )}
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {list.length} exercício(s)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <ul className="space-y-2">
                    {list.map((item, i) => (
                      <li key={item.id} className="rounded-xl border border-border bg-card/50 p-3">
                        <div className="flex items-start gap-3">
                          <div className="h-7 w-7 shrink-0 rounded-md bg-gradient-ember grid place-items-center text-[11px] font-bold text-primary-foreground">
                            {i + 1}
                          </div>
                          <LazyMount
                            rootMargin="200px"
                            placeholder={
                              <div className="h-16 w-16 shrink-0 rounded-lg bg-muted/30" />
                            }
                          >
                            <ExercicioMedia
                              url={item.exercicio.gif_url ?? item.exercicio.video_url}
                              alt={item.exercicio.nome}
                            />
                          </LazyMount>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => setSelected(item)}
                              className="text-left text-sm font-medium leading-tight hover:text-primary transition inline-flex items-center gap-1"
                            >
                              {item.exercicio.nome}
                              <Play className="h-3 w-3 opacity-60" />
                            </button>
                            <div className="text-xs text-primary mt-0.5 font-medium">
                              {item.series}x{item.repeticoes} · {item.descanso_seg}s
                            </div>
                            {item.observacoes && (
                              <div className="text-[11px] text-muted-foreground mt-1">
                                {item.observacoes}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {isToday && (
                    <ConcluirTreinoBtn planoId={plano.id} alunoId={alunoId} diaSemana={dia} />
                  )}
                </div>
              )}
            </section>
          );
          if (isToday) return <div key={dia}>{section}</div>;
          return (
            <LazyMount
              key={dia}
              rootMargin="300px"
              minHeight={64}
              placeholder={<Skeleton className="h-16 rounded-2xl" />}
            >
              {section}
            </LazyMount>
          );
        })
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.exercicio.nome}</DialogTitle>
                <DialogDescription className="text-primary font-medium">
                  {selected.series}x{selected.repeticoes} · {selected.descanso_seg}s descanso
                </DialogDescription>
              </DialogHeader>
              <ExercicioMedia
                url={selected.exercicio.gif_url ?? selected.exercicio.video_url}
                alt={selected.exercicio.nome}
                size="lg"
              />
              <div className="flex flex-wrap gap-2">
                {selected.exercicio.grupo_muscular && (
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground capitalize">
                    {selected.exercicio.grupo_muscular}
                  </span>
                )}
                {selected.exercicio.equipamento && (
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground capitalize">
                    {selected.exercicio.equipamento}
                  </span>
                )}
                {selected.exercicio.nivel && (
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground capitalize">
                    {selected.exercicio.nivel}
                  </span>
                )}
              </div>
              {selected.exercicio.descricao && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Como executar
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {selected.exercicio.descricao}
                  </p>
                </div>
              )}
              {selected.observacoes && (
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    Observação do instrutor
                  </div>
                  <p className="text-xs leading-relaxed">{selected.observacoes}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Generic workout components ──────────────────────────────────────────────

function Pills({
  label,
  value,
  options,
  onChange,
  onPrefetch,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  onPrefetch?: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              onMouseEnter={() => onPrefetch?.(opt)}
              onTouchStart={() => onPrefetch?.(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                active
                  ? "bg-gradient-ember text-primary-foreground border-transparent shadow-ember"
                  : "border-border bg-card/50 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DayCard = memo(function DayCard({
  dia,
  list,
  isToday,
  open,
  onToggle,
  onSelect,
}: {
  dia: number;
  list: TreinoRow[];
  isToday: boolean;
  open: boolean;
  onToggle: () => void;
  onSelect: (t: TreinoRow) => void;
}) {
  return (
    <section
      className={`glass rounded-2xl overflow-hidden ${isToday ? "border border-primary/40" : ""}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 p-5 text-left"
        aria-expanded={open}
      >
        <h2 className="text-sm font-semibold">{DIAS[dia]}</h2>
        {isToday && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-ember text-primary-foreground">
            Hoje
          </span>
        )}
        <span className="ml-auto text-[11px] text-muted-foreground">{list.length} exercícios</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="space-y-2 px-5 pb-5">
          {list.map((t, i) => (
            <li key={t.id} className="rounded-xl border border-border bg-card/50 p-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 shrink-0 rounded-md bg-gradient-ember grid place-items-center text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <LazyMount
                  rootMargin="200px"
                  placeholder={<div className="h-16 w-16 shrink-0 rounded-lg bg-muted/30" />}
                >
                  <ExercicioMedia url={t.url_midia} alt={t.exercicio} />
                </LazyMount>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onSelect(t)}
                    className="text-left text-sm font-medium leading-tight hover:text-primary transition inline-flex items-center gap-1"
                  >
                    {t.exercicio}
                    <Play className="h-3 w-3 opacity-60" />
                  </button>
                  <div className="text-xs text-primary mt-0.5 font-medium">
                    {t.series_repeticoes}
                  </div>
                  {t.observacoes && (
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {t.observacoes}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

function TreinosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: perfil, isSuccess: perfilReady } = useQuery({
    ...perfilQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!perfilReady) return;
    const papel = perfil?.papel;
    if (papel === "instrutor" || papel === "nutricionista" || papel === "admin") {
      navigate({ to: "/app/instrutor" });
    }
  }, [perfilReady, perfil?.papel, navigate]);

  if (
    perfilReady &&
    (perfil?.papel === "instrutor" ||
      perfil?.papel === "nutricionista" ||
      perfil?.papel === "admin")
  ) {
    return null;
  }

  return <TreinosAluno />;
}

// Dispatcher: prescribed plan takes priority over generic workouts
function TreinosAluno() {
  const { user } = useAuth();

  const { data: planosTreino = [], isLoading: loadingPlanos } = useQuery({
    ...planosTreinoAlunoQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  if (loadingPlanos) {
    return (
      <main className="mx-auto max-w-md px-5 pt-8 pb-8">
        <PageHeader icon={Dumbbell} eyebrow="Sua rotina" title="Treinos" className="mb-5" />
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (planosTreino.length > 0) {
    return <TreinosPrescritosAluno planosTreino={planosTreino} alunoId={user!.id} />;
  }

  return <TreinosGenericosAluno />;
}

function TreinosPrescritosAluno({
  planosTreino,
  alunoId,
}: {
  planosTreino: PlanoTreinoRow[];
  alunoId: string;
}) {
  return (
    <main className="mx-auto max-w-md px-5 pt-8 pb-8">
      <PageHeader
        icon={Dumbbell}
        eyebrow="Prescrito pelo profissional"
        title="Treinos"
        className="mb-6"
      />
      <div className="space-y-6">
        {planosTreino.map((p) => (
          <PlanoTreinoView key={p.id} plano={p} alunoId={alunoId} />
        ))}
      </div>
    </main>
  );
}

function TreinosGenericosAluno() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ ...profileQuery(user?.id ?? ""), enabled: !!user?.id });
  const fallbackGenero = profile?.gender === "female" ? "Feminino" : "Masculino";
  const [filters, setFilters] = useState<Filters>(() => loadFilters(fallbackGenero).filters);
  const [hasSavedFilters] = useState<boolean>(() => loadFilters(fallbackGenero).hasSaved);
  const today = new Date().getDay();
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set([today]));
  const [selected, setSelected] = useState<TreinoRow | null>(null);

  // Sync the gender filter to the loaded profile when the user has never
  // saved filters manually. Prevents female users from seeing the masculine
  // plan (or vice-versa) just because the profile loaded after first render.
  useEffect(() => {
    if (hasSavedFilters) return;
    if (!profile?.gender) return;
    const desired = profile.gender === "female" ? "Feminino" : "Masculino";
    setFilters((f) => (f.genero === desired ? f : { ...f, genero: desired }));
  }, [profile?.gender, hasSavedFilters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  const {
    data: treinos = [],
    isPending,
    isFetching,
  } = useQuery({
    ...treinosWeekQuery(filters),
    placeholderData: keepPreviousData,
  });

  const byDay = useMemo(() => {
    const map = new Map<number, TreinoRow[]>();
    for (const t of treinos) {
      const arr = map.get(t.dia_semana) ?? [];
      arr.push(t);
      map.set(t.dia_semana, arr);
    }
    return map;
  }, [treinos]);

  const orderedDays = [1, 2, 3, 4, 5, 6, 0];

  const prefetch = useCallback(
    (next: Partial<Filters>) => {
      const merged = { ...filters, ...next };
      queryClient.prefetchQuery(treinosWeekQuery(merged));
    },
    [filters, queryClient],
  );

  const toggleDay = useCallback((dia: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dia)) next.delete(dia);
      else next.add(dia);
      return next;
    });
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 pt-8 pb-8">
      <PageHeader icon={Dumbbell} eyebrow="Sua rotina" title="Treinos" className="mb-5" />

      <EmptyState
        icon={Dumbbell}
        title="Nenhum treino prescrito ainda"
        description="Assim que seu profissional montar seu treino, ele aparecerá aqui."
        className="mb-5"
      />

      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-1">
        Biblioteca de treinos
      </div>

      <section className="glass rounded-2xl p-5 space-y-3">
        <Pills
          label="Nível"
          value={filters.nivel}
          options={NIVEIS}
          onChange={(v) => setFilters((f) => ({ ...f, nivel: v }))}
          onPrefetch={(v) => prefetch({ nivel: v })}
        />
        <Pills
          label="Local"
          value={filters.local}
          options={LOCAIS}
          onChange={(v) => setFilters((f) => ({ ...f, local: v }))}
          onPrefetch={(v) => prefetch({ local: v })}
        />
        <Pills
          label="Gênero"
          value={filters.genero}
          options={GENEROS}
          onChange={(v) => setFilters((f) => ({ ...f, genero: v }))}
          onPrefetch={(v) => prefetch({ genero: v })}
        />
        {isFetching && !isPending && (
          <div className="text-[10px] text-muted-foreground">Atualizando…</div>
        )}
      </section>

      <div className="mt-5 space-y-3">
        {isPending ? (
          <>
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </>
        ) : treinos.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="Estamos preparando seu plano de treino deste nível."
            description="Em breve, estará disponível!"
          />
        ) : (
          orderedDays.map((dia) => {
            const list = byDay.get(dia);
            if (!list || list.length === 0) return null;
            const isToday = dia === today;
            const card = (
              <DayCard
                dia={dia}
                list={list}
                isToday={isToday}
                open={openDays.has(dia)}
                onToggle={() => toggleDay(dia)}
                onSelect={setSelected}
              />
            );
            // Today renders eagerly (it's open by default). Other days
            // lazy-mount as the user scrolls near them.
            if (isToday) return <div key={dia}>{card}</div>;
            return (
              <LazyMount
                key={dia}
                rootMargin="300px"
                minHeight={64}
                placeholder={<Skeleton className="h-16 rounded-2xl" />}
              >
                {card}
              </LazyMount>
            );
          })
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{selected.exercicio}</DialogTitle>
                <DialogDescription className="text-primary font-medium">
                  {selected.series_repeticoes}
                </DialogDescription>
              </DialogHeader>
              <ExercicioMedia url={selected.url_midia} alt={selected.exercicio} size="lg" />
              {selected.instrucao && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Como executar
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {selected.instrucao}
                  </p>
                </div>
              )}
              {selected.dica_seguranca && (
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
                    <AlertTriangle className="h-3 w-3" />
                    Atenção Fênix
                  </div>
                  <p className="text-xs leading-relaxed">{selected.dica_seguranca}</p>
                </div>
              )}
              {selected.observacoes && !selected.instrucao && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.observacoes}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
