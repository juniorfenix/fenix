import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";
import { treinosQuery } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

const NIVEIS = ["Iniciante I", "Iniciante II"] as const;
const GENEROS = ["Masculino", "Feminino"] as const;
const LOCAIS = ["Academia", "Casa"] as const;
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

type Filters = { nivel: string; genero: string; local: string };
const STORAGE_KEY = "treino-filters";

function loadFilters(): Filters {
  if (typeof window === "undefined") return { nivel: "Iniciante I", genero: "Masculino", local: "Academia" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Filters;
  } catch {}
  return { nivel: "Iniciante I", genero: "Masculino", local: "Academia" };
}

export function TreinoFilters() {
  const [filters, setFilters] = useState<Filters>(() => loadFilters());
  const diaSemana = new Date().getDay(); // 0=Dom, 1=Seg...

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filters)); } catch {}
  }, [filters]);

  const { data: treinos = [], isPending } = useQuery(
    treinosQuery({ ...filters, dia_semana: diaSemana })
  );

  const Pills = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (v: string) => void;
  }) => (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
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

  return (
    <section className="mt-4 glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Dumbbell className="h-4 w-4 text-primary" />
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Treino de hoje</h3>
        <span className="ml-auto text-[11px] text-muted-foreground">{DIAS[diaSemana]}</span>
      </div>

      <div className="space-y-3">
        <Pills label="Nível" value={filters.nivel} options={NIVEIS} onChange={(v) => setFilters((f) => ({ ...f, nivel: v }))} />
        <Pills label="Gênero" value={filters.genero} options={GENEROS} onChange={(v) => setFilters((f) => ({ ...f, genero: v }))} />
        <Pills label="Local" value={filters.local} options={LOCAIS} onChange={(v) => setFilters((f) => ({ ...f, local: v }))} />
      </div>

      <div className="mt-4 border-t border-border pt-4">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        ) : treinos.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-6">
            Sem treino cadastrado para esta combinação em {DIAS[diaSemana]}.
          </div>
        ) : (
          <ul className="space-y-2">
            {treinos.map((t, i) => (
              <li
                key={t.id}
                className="rounded-xl border border-border bg-card/50 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 shrink-0 rounded-md bg-gradient-ember grid place-items-center text-[11px] font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-tight">{t.exercicio}</div>
                    <div className="text-xs text-primary mt-0.5 font-medium">{t.series_repeticoes}</div>
                    {t.observacoes && (
                      <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.observacoes}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
