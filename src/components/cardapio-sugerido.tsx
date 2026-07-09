import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Clock, Flame, Beef, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PrefillRefeicao } from "@/components/minha-alimentacao";

type CardapioRow = {
  id: string;
  refeicao: string;
  horario: string | null;
  opcao_numero: number;
  opcao_nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  descricao: string;
  ordem: number;
};

type Objetivo = "perda" | "ganho" | "reeducacao";

const ACCENT: Record<Objetivo, { text: string; border: string; bg: string; label: string }> = {
  perda: {
    text: "text-primary",
    border: "border-primary/40",
    bg: "bg-primary/10",
    label: "Déficit",
  },
  ganho: { text: "text-accent", border: "border-accent/30", bg: "bg-accent/10", label: "Ganho" },
  reeducacao: {
    text: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/10",
    label: "Equilíbrio",
  },
};

export function CardapioSugerido({
  objetivo,
  genero,
  onSelect,
}: {
  objetivo: Objetivo;
  genero: "homem" | "mulher" | null;
  onSelect?: (p: PrefillRefeicao) => void;
}) {
  const enabled = !!genero;
  const { data: rows = [], isPending } = useQuery({
    queryKey: ["cardapios", objetivo, genero],
    enabled,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<CardapioRow[]> => {
      const { data, error } = await supabase
        .from("cardapios")
        .select(
          "id,refeicao,horario,opcao_numero,opcao_nome,calorias,proteinas,carboidratos,gorduras,descricao,ordem",
        )
        .eq("objetivo", objetivo)
        .eq("genero", genero!)
        .order("ordem", { ascending: true })
        .order("opcao_numero", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CardapioRow[];
    },
  });

  const grupos = useMemo(() => {
    const map = new Map<
      string,
      { refeicao: string; horario: string | null; ordem: number; opcoes: CardapioRow[] }
    >();
    for (const r of rows) {
      const key = `${r.ordem}-${r.refeicao}`;
      const g = map.get(key) ?? {
        refeicao: r.refeicao,
        horario: r.horario,
        ordem: r.ordem,
        opcoes: [],
      };
      g.opcoes.push(r);
      map.set(key, g);
    }
    return Array.from(map.values()).sort((a, b) => a.ordem - b.ordem);
  }, [rows]);

  const accent = ACCENT[objetivo];

  if (!enabled) {
    return (
      <section className="glass rounded-2xl p-5 border border-border/40">
        <header className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Cardápio Sugerido</h2>
        </header>
        <p className="text-sm text-muted-foreground">
          Defina seu gênero no perfil para receber o cardápio personalizado.
        </p>
      </section>
    );
  }

  return (
    <section
      key={`${objetivo}-${genero}`}
      className="glass rounded-2xl p-5 border border-border/40 space-y-4 animate-fade-in"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className={`h-5 w-5 ${accent.text}`} />
          <h2 className="font-semibold">Cardápio Sugerido</h2>
        </div>
        <span className={`text-[10px] uppercase tracking-widest font-semibold ${accent.text}`}>
          {accent.label} · {genero === "homem" ? "Homem" : "Mulher"}
        </span>
      </header>

      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      ) : grupos.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum cardápio cadastrado para esta combinação ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {grupos.map((g) => (
            <div key={`${g.ordem}-${g.refeicao}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{g.refeicao}</h3>
                {g.horario && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {g.horario}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {g.opcoes.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() =>
                      onSelect?.({
                        refeicao: g.refeicao,
                        nome: `${g.refeicao} · ${o.opcao_nome}`,
                        calorias: o.calorias,
                        proteinas: o.proteinas,
                        carboidratos: o.carboidratos,
                        gorduras: o.gorduras,
                      })
                    }
                    className="w-full text-left rounded-xl bg-background/30 border border-border/30 p-3 hover:border-primary/50 hover:bg-background/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] uppercase tracking-wide font-semibold ${accent.text}`}
                      >
                        {o.opcao_nome}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-primary" /> {o.calorias} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Beef className="h-3 w-3 text-accent" /> {o.proteinas}g
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-snug">{o.descricao}</p>
                    {onSelect && (
                      <div
                        className={`flex items-center gap-1 mt-2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity ${accent.text}`}
                      >
                        <Plus className="h-3 w-3" /> Registrar esta opção
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
