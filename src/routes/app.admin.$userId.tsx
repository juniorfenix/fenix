import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { perfilQuery } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { ProtocoloEditor } from "@/components/protocolo-editor";
import { AlertasTrocas } from "@/components/alertas-trocas";

export const Route = createFileRoute("/app/admin/$userId")({
  component: AdminAlunoDetalhe,
});

function AdminAlunoDetalhe() {
  const { userId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    ...perfilQuery(user?.id ?? ""),
    enabled: !!user?.id,
    select: (data) => data?.papel === "admin",
  });

  useEffect(() => {
    if (loading || roleLoading) return;
    if (!user || isAdmin === false) navigate({ to: "/app" });
  }, [user, isAdmin, loading, roleLoading, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-aluno", userId],
    enabled: !!isAdmin,
    queryFn: async () => {
      const [profile, weights, diario, alimentar, metas, hidrat, prefs] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
          .from("weight_logs")
          .select("logged_date,weight")
          .eq("user_id", userId)
          .order("logged_date", { ascending: false }),
        supabase
          .from("diario_registro")
          .select("registrado_em,pergunta,resposta,humor")
          .eq("user_id", userId)
          .order("registrado_em", { ascending: false })
          .limit(200),
        supabase
          .from("diario_alimentar")
          .select("data,refeicao,nome,calorias,proteinas,carboidratos,gorduras")
          .eq("user_id", userId)
          .order("data", { ascending: false })
          .limit(300),
        supabase.from("metas_usuario").select("objetivo_ativo").eq("user_id", userId).maybeSingle(),
        supabase
          .from("hidratacao_diaria")
          .select("data,copos")
          .eq("user_id", userId)
          .order("data", { ascending: false })
          .limit(60),
        supabase
          .from("preferencias_alimentares")
          .select("essenciais,detestados,estilo_refeicao,restricoes")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);
      return {
        profile: profile.data,
        weights: weights.data ?? [],
        diario: diario.data ?? [],
        alimentar: alimentar.data ?? [],
        objetivo: metas.data?.objetivo_ativo ?? null,
        hidrat: hidrat.data ?? [],
        prefs: prefs.data ?? null,
      };
    },
  });

  if (loading || roleLoading || !isAdmin) {
    return <div className="p-6 text-sm text-muted-foreground">Verificando acesso…</div>;
  }
  if (isLoading || !data)
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  const { profile, weights, diario, alimentar, objetivo, hidrat, prefs } = data;

  const exportFull = () => {
    const sections: (string | number)[][] = [];
    sections.push(["Aluno", profile?.display_name ?? "—"]);
    sections.push(["Objetivo", objetivo ?? "—"]);
    sections.push(["Peso atual (kg)", profile?.current_weight ?? "—"]);
    sections.push(["Meta (kg)", profile?.goal_weight ?? "—"]);
    sections.push(["Altura (cm)", profile?.height ?? "—"]);
    sections.push([]);
    sections.push(["=== Histórico de Peso ==="]);
    sections.push(["Data", "Peso (kg)"]);
    weights.forEach((w) => sections.push([w.logged_date, Number(w.weight)]));
    sections.push([]);
    sections.push(["=== Diário Alimentar ==="]);
    sections.push(["Data", "Refeição", "Item", "Kcal", "Prot", "Carb", "Gord"]);
    alimentar.forEach((m) =>
      sections.push([
        m.data,
        m.refeicao ?? "",
        m.nome,
        m.calorias,
        m.proteinas,
        m.carboidratos,
        m.gorduras,
      ]),
    );
    sections.push([]);
    sections.push(["=== Reflexões ==="]);
    sections.push(["Data", "Humor", "Pergunta", "Resposta"]);
    diario.forEach((d) =>
      sections.push([d.registrado_em, d.humor ?? "", d.pergunta, d.resposta ?? ""]),
    );
    sections.push([]);
    sections.push(["=== Hidratação ==="]);
    sections.push(["Data", "Copos"]);
    hidrat.forEach((h) => sections.push([h.data, h.copos]));

    downloadCSV(`aluno-${(profile?.display_name ?? userId).replace(/\s+/g, "_")}.csv`, sections);
  };

  return (
    <div className="container max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to="/app/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
        <Button onClick={exportFull}>
          <Download className="h-4 w-4" /> Exportar tudo (CSV)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile?.display_name ?? "Aluno"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Info label="Peso atual" value={`${profile?.current_weight ?? "—"} kg`} />
          <Info label="Meta" value={`${profile?.goal_weight ?? "—"} kg`} />
          <Info label="Altura" value={`${profile?.height ?? "—"} cm`} />
          <Info label="Idade" value={`${profile?.age ?? "—"}`} />
          <Info
            label="Gênero"
            value={
              profile?.gender === "male"
                ? "Masculino"
                : profile?.gender === "female"
                  ? "Feminino"
                  : "—"
            }
          />
          <Info label="Atividade" value={profile?.activity_level ?? "—"} />
          <Info label="Meta diária" value={`${profile?.daily_calorie_goal ?? "—"} kcal`} />
          <Info
            label="Objetivo Fênix"
            value={objetivoFenixLabel((profile as any)?.objetivo_fenix) ?? objetivo ?? "—"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Respostas do Quiz de Cadastro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Info label="Alimento favorito" value={(profile as any)?.alimento_favorito ?? "—"} />
          <Info
            label="Não come de jeito nenhum"
            value={
              Array.isArray((profile as any)?.alimentos_evitar) &&
              (profile as any).alimentos_evitar.length
                ? (profile as any).alimentos_evitar.join(", ")
                : "—"
            }
          />
          <Info
            label="Tem restrição médica / lesão"
            value={
              (profile as any)?.tem_restricao === true
                ? "Sim"
                : (profile as any)?.tem_restricao === false
                  ? "Não"
                  : "—"
            }
          />
          <div className="sm:col-span-2">
            <div className="text-xs text-muted-foreground">Descrição da restrição</div>
            <div className="whitespace-pre-wrap font-medium">
              {(profile as any)?.restricao_descricao || "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferências Alimentares</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Info
            label="Não pode faltar na mesa"
            value={prefs?.essenciais?.length ? prefs.essenciais.join(", ") : "—"}
          />
          <Info label="Estilo de refeição" value={prefs?.estilo_refeicao ?? "—"} />
          <Info
            label="Restrições alimentares"
            value={prefs?.restricoes?.length ? prefs.restricoes.join(", ") : "—"}
          />
          <div className="sm:col-span-2">
            <div className="text-xs text-muted-foreground">Alimentos que detesta</div>
            <div className="font-medium">
              {prefs?.detestados?.length ? prefs.detestados.join(", ") : "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      <ProtocoloEditor userId={userId} />

      <AlertasTrocas userId={userId} limit={50} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Peso ({weights.length})</CardTitle>
        </CardHeader>
        <CardContent className="max-h-80 overflow-auto">
          <ul className="text-sm space-y-1">
            {weights.map((w, i) => (
              <li key={i} className="flex justify-between border-b border-border/40 py-1">
                <span className="text-muted-foreground">{w.logged_date}</span>
                <span className="font-medium">{Number(w.weight)} kg</span>
              </li>
            ))}
            {!weights.length && <li className="text-muted-foreground">Sem registros.</li>}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reflexões do Diário ({diario.length})</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-auto space-y-3">
          {diario.map((d, i) => (
            <div key={i} className="border-l-2 border-primary/40 pl-3">
              <div className="text-xs text-muted-foreground">
                {d.registrado_em} {d.humor ? `· ${d.humor}` : ""}
              </div>
              <div className="text-sm font-medium">{d.pergunta}</div>
              <div className="text-sm">{d.resposta}</div>
            </div>
          ))}
          {!diario.length && <p className="text-sm text-muted-foreground">Sem reflexões.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diário Alimentar ({alimentar.length})</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-auto">
          <ul className="text-sm divide-y divide-border/40">
            {alimentar.map((m, i) => (
              <li key={i} className="py-1.5 flex justify-between gap-2">
                <span>
                  <span className="text-muted-foreground">{m.data}</span> ·{" "}
                  <span className="capitalize">{m.refeicao}</span> · {m.nome}
                </span>
                <span className="font-medium">{m.calorias} kcal</span>
              </li>
            ))}
            {!alimentar.length && <li className="text-muted-foreground">Sem registros.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function objetivoFenixLabel(o: string | null | undefined) {
  if (o === "emagrecer") return "Emagrecer";
  if (o === "ganhar_musculo") return "Ganhar Músculo";
  if (o === "condicionamento") return "Condicionamento";
  return null;
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
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
