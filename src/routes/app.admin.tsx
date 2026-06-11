import { createFileRoute, useNavigate, Outlet, useChildMatches } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, Shield, ChevronRight } from "lucide-react";
import { AlertasTrocas } from "@/components/alertas-trocas";

export const Route = createFileRoute("/app/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return <Outlet />;
  return <AdminAlunosPage />;
}

type AlunoRow = {
  id: string;
  display_name: string | null;
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  ultimo_peso: number | null;
  ultimo_peso_data: string | null;
  objetivo: string | null;
};

function AdminAlunosPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  // Gate: only admin
  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  useEffect(() => {
    if (loading || roleLoading) return;
    if (!user || isAdmin === false) navigate({ to: "/app" });
  }, [user, isAdmin, loading, roleLoading, navigate]);

  const { data: alunos, isLoading } = useQuery({
    queryKey: ["admin-alunos"],
    enabled: !!isAdmin,
    queryFn: async (): Promise<AlunoRow[]> => {
      const [profilesRes, weightsRes, metasRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,display_name,current_weight,goal_weight,height")
          .order("created_at", { ascending: false }),
        supabase
          .from("weight_logs")
          .select("user_id,weight,logged_date")
          .order("logged_date", { ascending: false }),
        supabase.from("metas_usuario").select("user_id,objetivo_ativo"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (weightsRes.error) throw weightsRes.error;
      if (metasRes.error) throw metasRes.error;

      const lastByUser = new Map<string, { weight: number; date: string }>();
      for (const r of weightsRes.data ?? []) {
        if (!lastByUser.has(r.user_id))
          lastByUser.set(r.user_id, { weight: Number(r.weight), date: r.logged_date });
      }
      const metaByUser = new Map<string, string>();
      for (const m of metasRes.data ?? []) metaByUser.set(m.user_id, m.objetivo_ativo);

      return (profilesRes.data ?? []).map((p) => {
        const last = lastByUser.get(p.id);
        return {
          id: p.id,
          display_name: p.display_name,
          current_weight: p.current_weight,
          goal_weight: p.goal_weight,
          height: p.height,
          ultimo_peso: last?.weight ?? null,
          ultimo_peso_data: last?.date ?? null,
          objetivo: metaByUser.get(p.id) ?? null,
        };
      });
    },
  });

  const filtered = useMemo(() => {
    if (!alunos) return [];
    const t = q.trim().toLowerCase();
    if (!t) return alunos;
    return alunos.filter((a) => (a.display_name ?? "").toLowerCase().includes(t));
  }, [alunos, q]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = [
      "Nome",
      "Peso Atual (kg)",
      "Altura (cm)",
      "Meta (kg)",
      "Objetivo",
      "Último Peso Registrado (kg)",
      "Data Último Registro",
    ];
    const rows = filtered.map((a) => [
      a.display_name ?? "",
      a.current_weight ?? "",
      a.height ?? "",
      a.goal_weight ?? "",
      objetivoLabel(a.objetivo),
      a.ultimo_peso ?? "",
      a.ultimo_peso_data ?? "",
    ]);
    downloadCSV("alunos.csv", [headers, ...rows]);
  };

  if (loading || roleLoading || !isAdmin) {
    return <div className="p-6 text-sm text-muted-foreground">Verificando acesso…</div>;
  }

  return (
    <div className="container max-w-6xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Painel do Admin</h1>
        </div>
        <Button onClick={exportCSV} disabled={!filtered.length}>
          <Download className="h-4 w-4" /> Gerar Relatório (CSV)
        </Button>
      </div>

      <AlertasTrocas limit={15} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between gap-3 flex-wrap">
            <span>{alunos?.length ?? 0} alunos cadastrados</span>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nome…"
                className="pl-8 h-9"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                  <TableHead className="text-right">Altura</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Último registro</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer hover:bg-secondary/40"
                    onClick={() => navigate({ to: "/app/admin/$userId", params: { userId: a.id } })}
                  >
                    <TableCell className="font-medium">{a.display_name ?? "Sem nome"}</TableCell>
                    <TableCell className="text-right">
                      {a.ultimo_peso ?? a.current_weight ?? "—"} kg
                    </TableCell>
                    <TableCell className="text-right">{a.height ?? "—"} cm</TableCell>
                    <TableCell>{objetivoLabel(a.objetivo)}</TableCell>
                    <TableCell>{a.ultimo_peso_data ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <ChevronRight className="h-4 w-4 text-muted-foreground inline" />
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum aluno encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function objetivoLabel(o: string | null) {
  if (o === "perda") return "Déficit";
  if (o === "ganho") return "Ganho";
  if (o === "reeducacao" || o === "manutencao") return "Reeducação";
  return o ?? "—";
}

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((v) => {
          const s = String(v ?? "");
          return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
