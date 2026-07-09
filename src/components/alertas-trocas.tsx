import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowRightLeft, AlertTriangle } from "lucide-react";

type Row = {
  id: string;
  user_id: string;
  refeicao: string;
  alimento_original_nome: string;
  alimento_substituto_nome: string;
  gramas_substituto: number;
  delta_proteinas_pct: number | null;
  delta_carboidratos_pct: number | null;
  delta_gorduras_pct: number | null;
  created_at: string;
  aluno?: string | null;
};

type Props = {
  /** Filter to a single student (used in the student detail page). Omit to show all. */
  userId?: string;
  /** Max rows. */
  limit?: number;
};

export function AlertasTrocas({ userId, limit = 20 }: Props) {
  const { data = [], isLoading } = useQuery<Row[]>({
    queryKey: ["substituicoes_admin", userId ?? "all", limit],
    queryFn: async () => {
      let q = supabase
        .from("substituicoes_log")
        .select(
          "id,user_id,refeicao,alimento_original_nome,alimento_substituto_nome,gramas_substituto,delta_proteinas_pct,delta_carboidratos_pct,delta_gorduras_pct,created_at",
        )
        .order("created_at", { ascending: false })
        .limit(limit);
      if (userId) q = q.eq("user_id", userId);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as Row[];

      // Join display_name (admin already has SELECT on profiles)
      if (!userId && rows.length) {
        const ids = [...new Set(rows.map((r) => r.user_id))];
        const { data: profs } = await supabase
          .from("profiles")
          .select("id,display_name")
          .in("id", ids);
        const map = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
        for (const r of rows) r.aluno = map.get(r.user_id) ?? null;
      }
      return rows;
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowRightLeft className="h-4 w-4 text-primary" />
          Alertas de Troca
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Carregando…</div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={ArrowRightLeft}
            title={`Nenhuma troca registrada ${userId ? "para este aluno" : "ainda"}.`}
            className="border-none"
          />
        ) : (
          <ul className="divide-y divide-border/40 max-h-96 overflow-auto">
            {data.map((r) => {
              const dp = r.delta_proteinas_pct ?? 0;
              const dc = r.delta_carboidratos_pct ?? 0;
              const dg = r.delta_gorduras_pct ?? 0;
              const fora = Math.abs(dp) > 10 || Math.abs(dc) > 10 || Math.abs(dg) > 10;
              return (
                <li key={r.id} className="p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      {!userId && r.aluno && (
                        <span className="mr-2 rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          {r.aluno}
                        </span>
                      )}
                      <span className="font-medium">{r.alimento_original_nome}</span>
                      <span className="mx-1 text-muted-foreground">→</span>
                      <span className="font-medium">{r.alimento_substituto_nome}</span>
                      <span className="ml-1 text-muted-foreground">({r.gramas_substituto} g)</span>
                    </div>
                    {fora && (
                      <Badge variant="warning" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Fora da margem
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("pt-BR")} ·{" "}
                    <span className="capitalize">{r.refeicao.replaceAll("_", " ")}</span> · P
                    {fmt(dp)} · C{fmt(dc)} · G{fmt(dg)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function fmt(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(0)}%`;
}
