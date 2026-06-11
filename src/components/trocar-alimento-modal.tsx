import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRightLeft, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  encontrarSubstitutos,
  type Alimento,
  type Candidato,
  CATEGORIA_LABELS,
} from "@/lib/substituicao";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  refeicao: string;
  protocoloItemId?: string;
  original: Alimento;
  gramasOriginais: number;
  /** Lowercased names that must NEVER be suggested. */
  bloqueados: string[];
  /** Called when the substitution is committed so the parent can refresh UI. */
  onSubstituted?: (escolhido: Candidato) => void;
};

export function TrocarAlimentoModal({
  open,
  onOpenChange,
  userId,
  refeicao,
  protocoloItemId,
  original,
  gramasOriginais,
  bloqueados,
  onSubstituted,
}: Props) {
  const qc = useQueryClient();
  const [picked, setPicked] = useState<string | null>(null);

  // Load same-category alimentos once per category.
  const { data: pool = [], isLoading } = useQuery<Alimento[]>({
    queryKey: ["alimentos_por_categoria", original.categoria],
    enabled: open,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alimentos_padrao")
        .select("id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras")
        .eq("ativo", true)
        .eq("categoria", original.categoria)
        .order("nome", { ascending: true })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Alimento[];
    },
  });

  const candidatos = useMemo(() => {
    if (!pool.length) return [];
    return encontrarSubstitutos({
      original,
      originalGrams: gramasOriginais,
      pool,
      bloqueados: new Set(bloqueados.map((b) => b.toLowerCase())),
      limite: 3,
    });
  }, [pool, original, gramasOriginais, bloqueados]);

  const confirmar = useMutation({
    mutationFn: async (c: Candidato) => {
      const { error } = await supabase.from("substituicoes_log").insert({
        user_id: userId,
        protocolo_item_id: protocoloItemId ?? null,
        refeicao,
        alimento_original_id: original.id,
        alimento_original_nome: original.nome,
        gramas_original: gramasOriginais,
        alimento_substituto_id: c.alimento.id,
        alimento_substituto_nome: c.alimento.nome,
        gramas_substituto: c.gramas,
        delta_proteinas_pct: Number(c.delta.p.toFixed(2)),
        delta_carboidratos_pct: Number(c.delta.c.toFixed(2)),
        delta_gorduras_pct: Number(c.delta.g.toFixed(2)),
      });
      if (error) throw error;
      return c;
    },
    onSuccess: (c) => {
      toast.success("Troca registrada", {
        description: `${original.nome} → ${c.alimento.nome} (${c.gramas} g)`,
      });
      qc.invalidateQueries({ queryKey: ["substituicoes_log"] });
      qc.invalidateQueries({ queryKey: ["substituicoes_admin"] });
      onSubstituted?.(c);
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message ?? "Não foi possível registrar a troca."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Trocar alimento
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-card/40 p-3 text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Original</div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-semibold">{original.nome}</span>
            <span className="text-muted-foreground">{gramasOriginais} g</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Categoria: {CATEGORIA_LABELS[original.categoria] ?? original.categoria}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Buscando opções equivalentes…
          </div>
        ) : candidatos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <Ban className="mx-auto mb-2 h-5 w-5" />
            Nenhuma substituição disponível nessa categoria que respeite suas restrições.
          </div>
        ) : (
          <ul className="space-y-2">
            {candidatos.map((c) => {
              const isPicked = picked === c.alimento.id;
              return (
                <li key={c.alimento.id}>
                  <button
                    type="button"
                    onClick={() => setPicked(c.alimento.id)}
                    className={`w-full rounded-xl border-2 p-3 text-left transition ${
                      isPicked
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{c.alimento.nome}</span>
                      <span className="text-sm font-medium">{c.gramas} g</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      {c.within10pct ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Equivalente (±10%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-400">
                          <AlertTriangle className="h-3 w-3" /> Fora da margem
                        </span>
                      )}
                      <DeltaChip label="P" v={c.delta.p} />
                      <DeltaChip label="C" v={c.delta.c} />
                      <DeltaChip label="G" v={c.delta.g} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <Button
          disabled={!picked || confirmar.isPending}
          onClick={() => {
            const c = candidatos.find((x) => x.alimento.id === picked);
            if (c) confirmar.mutate(c);
          }}
          className="h-12 w-full bg-gradient-ember text-primary-foreground shadow-ember"
        >
          {confirmar.isPending ? "Registrando…" : "Confirmar troca"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function DeltaChip({ label, v }: { label: string; v: number }) {
  const sign = v > 0 ? "+" : "";
  const ok = Math.abs(v) <= 10;
  return (
    <span
      className={`rounded-full px-2 py-0.5 ${
        ok ? "bg-secondary text-foreground/70" : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {label} {sign}
      {v.toFixed(0)}%
    </span>
  );
}
