import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, ClipboardList, Target } from "lucide-react";
import { TrocarAlimentoModal } from "@/components/trocar-alimento-modal";
import {
  macrosFor,
  MEAL_KEYS,
  MEAL_LABELS,
  type Alimento,
} from "@/lib/substituicao";

type ProtocoloRow = {
  id: string;
  meta_kcal: number;
  meta_proteinas: number;
  meta_carboidratos: number;
  meta_gorduras: number;
  observacoes: string | null;
};

type ItemRow = {
  id: string;
  refeicao: string;
  gramas: number;
  ordem: number;
  alimento: Alimento;
};

type Props = {
  userId: string;
};

export function CardapioPrescrito({ userId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["protocolo_aluno", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: prot } = await supabase
        .from("protocolos_prescritos")
        .select("id,meta_kcal,meta_proteinas,meta_carboidratos,meta_gorduras,observacoes")
        .eq("user_id", userId)
        .maybeSingle();
      if (!prot) return { protocolo: null, itens: [] as ItemRow[] };

      const { data: itens } = await supabase
        .from("protocolo_itens")
        .select(
          "id,refeicao,gramas,ordem,alimento:alimentos_padrao(id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras)",
        )
        .eq("protocolo_id", prot.id)
        .order("ordem", { ascending: true });
      return {
        protocolo: prot as ProtocoloRow,
        itens: ((itens ?? []) as unknown as ItemRow[]),
      };
    },
  });

  // Bloqueados = preferences.detestados ∪ profile.alimentos_evitar
  const { data: bloqueados = [] } = useQuery<string[]>({
    queryKey: ["bloqueados_aluno", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [prefRes, profRes] = await Promise.all([
        supabase
          .from("preferencias_alimentares")
          .select("detestados,restricoes")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.from("profiles").select("alimentos_evitar").eq("id", userId).maybeSingle(),
      ]);
      const a = (prefRes.data?.detestados ?? []) as string[];
      const b = (profRes.data?.alimentos_evitar ?? []) as string[];
      return [...new Set([...a, ...b].filter(Boolean))];
    },
  });

  const itensPorRefeicao = useMemo(() => {
    const map = new Map<string, ItemRow[]>();
    for (const k of MEAL_KEYS) map.set(k, []);
    for (const it of data?.itens ?? []) {
      if (!map.has(it.refeicao)) map.set(it.refeicao, []);
      map.get(it.refeicao)!.push(it);
    }
    return map;
  }, [data]);

  const [trocar, setTrocar] = useState<{
    item: ItemRow;
  } | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Carregando seu protocolo…
        </CardContent>
      </Card>
    );
  }

  if (!data?.protocolo) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          <ClipboardList className="mx-auto mb-2 h-5 w-5 text-primary/70" />
          Você ainda não tem um protocolo prescrito. Quando o admin liberar, ele aparecerá aqui.
        </CardContent>
      </Card>
    );
  }

  const p = data.protocolo;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" /> Protocolo Prescrito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <Meta label="Kcal" value={p.meta_kcal} />
          <Meta label="P" value={`${p.meta_proteinas}g`} />
          <Meta label="C" value={`${p.meta_carboidratos}g`} />
          <Meta label="G" value={`${p.meta_gorduras}g`} />
        </div>

        {p.observacoes && (
          <p className="rounded-xl bg-secondary/40 p-3 text-xs italic text-muted-foreground">
            {p.observacoes}
          </p>
        )}

        <div className="space-y-3">
          {MEAL_KEYS.map((m) => {
            const itens = itensPorRefeicao.get(m) ?? [];
            if (itens.length === 0) return null;
            return (
              <div key={m} className="rounded-xl border border-border bg-card/40 p-3">
                <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {MEAL_LABELS[m]}
                </div>
                <ul className="space-y-2">
                  {itens.map((it) => {
                    const macros = macrosFor(it.alimento, it.gramas);
                    return (
                      <li
                        key={it.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{it.alimento.nome}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {it.gramas} g · {Math.round(macros.kcal)} kcal · P{Math.round(macros.p)} ·
                            C{Math.round(macros.c)} · G{Math.round(macros.g)}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTrocar({ item: it })}
                          className="h-8 gap-1 text-xs"
                        >
                          <ArrowRightLeft className="h-3 w-3" /> Trocar
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {(data.itens ?? []).length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              O admin ainda não adicionou alimentos. As metas já estão prescritas.
            </p>
          )}
        </div>
      </CardContent>

      {trocar && (
        <TrocarAlimentoModal
          open={!!trocar}
          onOpenChange={(v) => !v && setTrocar(null)}
          userId={userId}
          refeicao={trocar.item.refeicao}
          protocoloItemId={trocar.item.id}
          original={trocar.item.alimento}
          gramasOriginais={trocar.item.gramas}
          bloqueados={bloqueados}
        />
      )}
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-background/30 p-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
