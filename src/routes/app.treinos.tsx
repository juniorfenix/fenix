import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Dumbbell, ChevronDown, Play, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { profileQuery, treinosWeekQuery, type TreinoRow } from "@/lib/queries";
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
      <header className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Sua rotina</div>
          <h1 className="text-2xl">Treinos</h1>
        </div>
      </header>

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
          <div className="glass rounded-2xl p-8 text-center space-y-2">
            <div className="text-3xl">🏗️</div>
            <div className="text-sm font-medium">
              Estamos preparando seu plano de treino deste nível.
            </div>
            <div className="text-xs text-muted-foreground">Em breve, estará disponível!</div>
          </div>
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
