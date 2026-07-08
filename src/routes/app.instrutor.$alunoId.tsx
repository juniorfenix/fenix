import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Utensils,
  Plus,
  Trash2,
  Loader2,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ExercicioMedia } from "@/components/exercicio-media";
import { useAuth } from "@/hooks/use-auth";
import {
  perfilQuery,
  planosTreinoInstrutorQuery,
  planosAlimentaresInstrutorQuery,
  planoExerciciosQuery,
  planoRefeicoesQuery,
  exerciciosQuery,
  conclusoesTreinoQuery,
  adesaoAlimentarQuery,
  instrutorAlunosQuery,
  type PlanoTreinoRow,
  type PlanoAlimentarRow,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type AlunoTab = "treino" | "alimentar" | "progresso";

const ALUNO_TABS: AlunoTab[] = ["treino", "alimentar", "progresso"];

export const Route = createFileRoute("/app/instrutor/$alunoId")({
  validateSearch: (search: Record<string, unknown>): { tab?: AlunoTab } => ({
    tab: ALUNO_TABS.includes(search.tab as AlunoTab) ? (search.tab as AlunoTab) : undefined,
  }),
  component: AlunoDetalhe,
});

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NIVEIS = ["iniciante", "intermediario", "avancado"];
const REFEICOES = [
  "Café da manhã",
  "Lanche",
  "Almoço",
  "Pré-treino",
  "Pós-treino",
  "Jantar",
  "Ceia",
];

// ---------- Aba Progresso ----------

function MiniCalendario({ conclusoes }: { conclusoes: { data: string; dia_semana: number }[] }) {
  const feitos = new Set(conclusoes.map((c) => c.data));
  const today = new Date();
  const days: { date: string; dow: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toLocaleDateString("sv-SE"), dow: d.getDay() });
  }
  const weeks: { date: string; dow: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-[9px] text-muted-foreground">
            {d[0]}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, di) => {
            const cell = week.find((d) => d.dow === di);
            if (!cell) return <div key={di} />;
            const done = feitos.has(cell.date);
            return (
              <div
                key={di}
                title={cell.date}
                className={`h-5 w-full rounded ${done ? "bg-primary" : "bg-muted/30"}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ProgressoTreinoCard({ plano, alunoId }: { plano: PlanoTreinoRow; alunoId: string }) {
  const { data: conclusoes = [], isLoading } = useQuery(
    conclusoesTreinoQuery(plano.id, alunoId, 28),
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 animate-pulse h-24" />
    );
  }

  const porDia: Record<number, number> = {};
  for (const c of conclusoes) {
    porDia[c.dia_semana] = (porDia[c.dia_semana] ?? 0) + 1;
  }
  const diasAtivos = Object.keys(porDia).map(Number);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">{plano.nome}</div>
        <div className="text-[11px] text-muted-foreground">
          {conclusoes.length} treino(s) nos últimos 28 dias
        </div>
      </div>

      {diasAtivos.length === 0 ? (
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <XCircle className="h-4 w-4 text-destructive/60" />
          Aluno ainda não registrou nenhum treino deste plano.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {DIAS.map((label, idx) => {
            const feitos = porDia[idx] ?? 0;
            if (feitos === 0) return null;
            const pct = Math.round((feitos / 4) * 100);
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-primary/30 bg-primary/5"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">{label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {feitos}/4 ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      )}

      {conclusoes.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Últimas 4 semanas
          </div>
          <MiniCalendario conclusoes={conclusoes} />
        </div>
      )}
    </div>
  );
}

function ProgressoAlimentarCard({ plano, alunoId }: { plano: PlanoAlimentarRow; alunoId: string }) {
  const { data: adesoes = [], isLoading } = useQuery(adesaoAlimentarQuery(plano.id, alunoId, 30));

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 animate-pulse h-20" />
    );
  }

  const total = adesoes.length;
  const pct = Math.round((total / 30) * 100);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">{plano.nome}</div>
        <div className="text-[11px] text-muted-foreground">{total}/30 dias (últimos 30)</div>
      </div>

      {total === 0 ? (
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <XCircle className="h-4 w-4 text-destructive/60" />
          Aluno ainda não registrou adesão a este plano.
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Adesão</span>
            <span className="font-semibold text-primary">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-ember transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {adesoes.slice(0, 10).map((a) => (
              <span
                key={a.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {a.data.slice(5)}
              </span>
            ))}
            {total > 10 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                +{total - 10} mais
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Aba Treino ----------

function PlanoTreinoCard({ plano, instrutorId }: { plano: PlanoTreinoRow; instrutorId: string }) {
  const queryClient = useQueryClient();
  const [showAddExercicio, setShowAddExercicio] = useState(false);
  const [dia, setDia] = useState(1);
  const [exercicioId, setExercicioId] = useState("");
  const [series, setSeries] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [descanso, setDescanso] = useState("60");
  const [obs, setObs] = useState("");

  const { data: exerciciosPlano = [] } = useQuery(planoExerciciosQuery(plano.id));
  const { data: todosExercicios = [] } = useQuery(exerciciosQuery);

  const adicionarExercicio = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("planos_treino_exercicios").insert({
        plano_id: plano.id,
        exercicio_id: Number(exercicioId),
        dia_semana: dia,
        series: Number(series),
        repeticoes: reps,
        descanso_seg: Number(descanso),
        observacoes: obs || null,
        ordem: exerciciosPlano.filter((e) => e.dia_semana === dia).length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plano-exercicios", plano.id] });
      setShowAddExercicio(false);
      setExercicioId("");
      toast.success("Exercício adicionado.");
    },
    onError: (error: unknown) => toast.error(errorMessage(error, "Erro ao adicionar exercício.")),
  });

  const removerExercicio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("planos_treino_exercicios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plano-exercicios", plano.id] }),
  });

  const desativarPlano = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("planos_treino")
        .update({ ativo: false })
        .eq("id", plano.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-treino-instrutor", instrutorId, plano.aluno_id],
      });
      toast.success("Plano desativado.");
    },
  });

  const byDay = DIAS.reduce(
    (acc, _, i) => {
      acc[i] = exerciciosPlano.filter((e) => e.dia_semana === i);
      return acc;
    },
    {} as Record<number, typeof exerciciosPlano>,
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div>
          <div className="font-semibold text-sm">{plano.nome}</div>
          <div className="text-[11px] text-muted-foreground capitalize">
            {plano.nivel} · {exerciciosPlano.length} exercício(s)
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAddExercicio(true)}>
            <Plus className="h-3.5 w-3.5" /> Exercício
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => desativarPlano.mutate()}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {Object.entries(byDay).map(([diaIdx, list]) => {
        if (!list.length) return null;
        return (
          <div key={diaIdx} className="border-b border-border/20 last:border-0">
            <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
              {DIAS[Number(diaIdx)]}
            </div>
            <ul className="divide-y divide-border/20">
              {list.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <ExercicioMedia
                    url={item.exercicio.gif_url ?? item.exercicio.video_url}
                    alt={item.exercicio.nome}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.exercicio.nome}</div>
                    <div className="text-xs text-primary">
                      {item.series}x{item.repeticoes} · {item.descanso_seg}s descanso
                    </div>
                    {item.observacoes && (
                      <div className="text-[11px] text-muted-foreground">{item.observacoes}</div>
                    )}
                  </div>
                  <button
                    onClick={() => removerExercicio.mutate(item.id)}
                    className="shrink-0 text-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {exerciciosPlano.length === 0 && (
        <div className="px-5 py-6 text-center text-sm text-muted-foreground">
          Nenhum exercício ainda. Clique em "+ Exercício".
        </div>
      )}

      <Dialog open={showAddExercicio} onOpenChange={setShowAddExercicio}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar exercício</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Dia da semana</label>
              <Select value={String(dia)} onValueChange={(v) => setDia(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIAS.map((d, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Exercício</label>
              <Select value={exercicioId} onValueChange={setExercicioId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar exercício" />
                </SelectTrigger>
                <SelectContent>
                  {todosExercicios.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Séries</label>
                <Input value={series} onChange={(e) => setSeries(e.target.value)} className="h-8" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
                <Input value={reps} onChange={(e) => setReps(e.target.value)} className="h-8" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descanso (s)</label>
                <Input
                  value={descanso}
                  onChange={(e) => setDescanso(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Observações (opcional)
              </label>
              <Textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                className="h-16 resize-none"
              />
            </div>
            <Button
              className="w-full"
              disabled={!exercicioId || adicionarExercicio.isPending}
              onClick={() => adicionarExercicio.mutate()}
            >
              {adicionarExercicio.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Adicionar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CriarPlanoTreino({ instrutorId, alunoId }: { instrutorId: string; alunoId: string }) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [nivel, setNivel] = useState("iniciante");
  const [open, setOpen] = useState(false);

  const criar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("planos_treino").insert({
        instrutor_id: instrutorId,
        aluno_id: alunoId,
        nome,
        nivel,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-treino-instrutor", instrutorId, alunoId],
      });
      setNome("");
      setOpen(false);
      toast.success("Plano de treino criado.");
    },
    onError: (error: unknown) => toast.error(errorMessage(error, "Erro ao criar plano.")),
  });

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" /> Novo plano
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo plano de treino</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do plano (ex: Treino A)"
            />
            <Select value={nivel} onValueChange={setNivel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NIVEIS.map((n) => (
                  <SelectItem key={n} value={n} className="capitalize">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={!nome.trim() || criar.isPending}
              onClick={() => criar.mutate()}
            >
              {criar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CriarPlanoAlimentar({ instrutorId, alunoId }: { instrutorId: string; alunoId: string }) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [metaKcal, setMetaKcal] = useState("");
  const [metaProt, setMetaProt] = useState("");
  const [metaCarb, setMetaCarb] = useState("");
  const [metaGord, setMetaGord] = useState("");
  const [open, setOpen] = useState(false);

  const criar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("planos_alimentares").insert({
        instrutor_id: instrutorId,
        aluno_id: alunoId,
        nome,
        descricao: descricao || null,
        meta_kcal: metaKcal ? Number(metaKcal) : null,
        meta_proteinas_g: metaProt ? Number(metaProt) : null,
        meta_carboidratos_g: metaCarb ? Number(metaCarb) : null,
        meta_gorduras_g: metaGord ? Number(metaGord) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-alimentares-instrutor", instrutorId, alunoId],
      });
      setNome("");
      setDescricao("");
      setOpen(false);
      toast.success("Plano alimentar criado.");
    },
    onError: (error: unknown) => toast.error(errorMessage(error, "Erro ao criar plano alimentar.")),
  });

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" /> Novo plano
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo plano alimentar</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do plano"
            />
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Observações / descrição (opcional)"
              className="h-20 resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Meta kcal</label>
                <Input
                  value={metaKcal}
                  onChange={(e) => setMetaKcal(e.target.value)}
                  placeholder="ex: 1800"
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Proteínas (g)</label>
                <Input
                  value={metaProt}
                  onChange={(e) => setMetaProt(e.target.value)}
                  placeholder="ex: 150"
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Carboidratos (g)</label>
                <Input
                  value={metaCarb}
                  onChange={(e) => setMetaCarb(e.target.value)}
                  placeholder="ex: 200"
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Gorduras (g)</label>
                <Input
                  value={metaGord}
                  onChange={(e) => setMetaGord(e.target.value)}
                  placeholder="ex: 60"
                  className="h-8"
                />
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!nome.trim() || criar.isPending}
              onClick={() => criar.mutate()}
            >
              {criar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MacroChip({ label, value, unit = "" }: { label: string; value: number; unit?: string }) {
  return (
    <div className="rounded-xl bg-primary/5 border border-primary/20 p-2 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-primary">
        {value}
        {unit}
      </div>
    </div>
  );
}

function PlanoAlimentarCard({
  plano,
  instrutorId,
}: {
  plano: PlanoAlimentarRow;
  instrutorId: string;
}) {
  const queryClient = useQueryClient();
  const [showAddRefeicao, setShowAddRefeicao] = useState(false);
  const [refeicao, setRefeicao] = useState("Almoço");
  const [horario, setHorario] = useState("");
  const [descricao, setDescricao] = useState("");
  const [kcal, setKcal] = useState("");
  const [proteina, setProteina] = useState("");
  const [obs, setObs] = useState("");

  const { data: refeicoes = [], isLoading: loadingRefeicoes } = useQuery(
    planoRefeicoesQuery(plano.id),
  );

  const adicionarRefeicao = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("plano_alimentar_refeicoes").insert({
        plano_id: plano.id,
        refeicao,
        horario: horario || null,
        descricao,
        kcal: kcal ? Number(kcal) : null,
        proteina_g: proteina ? Number(proteina) : null,
        observacoes: obs || null,
        ordem: refeicoes.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plano-refeicoes", plano.id] });
      setShowAddRefeicao(false);
      setDescricao("");
      setHorario("");
      setKcal("");
      setProteina("");
      setObs("");
      toast.success("Refeição adicionada.");
    },
    onError: (error: unknown) => toast.error(errorMessage(error, "Erro ao adicionar refeição.")),
  });

  const removerRefeicao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plano_alimentar_refeicoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plano-refeicoes", plano.id] }),
    onError: (error: unknown) => toast.error(errorMessage(error, "Erro ao remover refeição.")),
  });

  const desativar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("planos_alimentares")
        .update({ ativo: false })
        .eq("id", plano.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planos-alimentares-instrutor", instrutorId, plano.aluno_id],
      });
      toast.success("Plano desativado.");
    },
  });

  return (
    <li className="rounded-2xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{plano.nome}</div>
          {plano.descricao && (
            <div className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
              {plano.descricao}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAddRefeicao(true)}>
            <Plus className="h-3.5 w-3.5" /> Refeição
          </Button>
          <button
            onClick={() => desativar.mutate()}
            className="text-destructive/60 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(plano.meta_kcal || plano.meta_proteinas_g) && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {plano.meta_kcal && <MacroChip label="kcal" value={plano.meta_kcal} />}
          {plano.meta_proteinas_g && (
            <MacroChip label="prot" value={plano.meta_proteinas_g} unit="g" />
          )}
          {plano.meta_carboidratos_g && (
            <MacroChip label="carb" value={plano.meta_carboidratos_g} unit="g" />
          )}
          {plano.meta_gorduras_g && (
            <MacroChip label="gord" value={plano.meta_gorduras_g} unit="g" />
          )}
        </div>
      )}

      <div className="mt-4 border-t border-border/30 pt-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Refeições prescritas
        </div>
        {loadingRefeicoes ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : refeicoes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
            Nenhuma refeição detalhada ainda. Adicione as refeições para o aluno seguir.
          </div>
        ) : (
          <ul className="space-y-2">
            {refeicoes.map((item) => (
              <li key={item.id} className="rounded-xl border border-border/50 bg-background/30 p-3">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{item.refeicao}</span>
                      {item.horario && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.horario}
                        </span>
                      )}
                      {(item.kcal || item.proteina_g) && (
                        <span className="text-[10px] text-primary">
                          {item.kcal ? `${item.kcal} kcal` : ""}
                          {item.kcal && item.proteina_g ? " · " : ""}
                          {item.proteina_g ? `${item.proteina_g} g proteína` : ""}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                      {item.descricao}
                    </p>
                    {item.observacoes && (
                      <p className="mt-1 text-[11px] text-primary">{item.observacoes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removerRefeicao.mutate(item.id)}
                    className="shrink-0 text-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={showAddRefeicao} onOpenChange={setShowAddRefeicao}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar refeição</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Refeição</label>
                <Select value={refeicao} onValueChange={setRefeicao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFEICOES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Horário</label>
                <Input
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  placeholder="ex: 12:30"
                />
              </div>
            </div>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: 150 g arroz, 120 g frango, salada livre..."
              className="h-24 resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kcal</label>
                <Input value={kcal} onChange={(e) => setKcal(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Proteína (g)</label>
                <Input value={proteina} onChange={(e) => setProteina(e.target.value)} />
              </div>
            </div>
            <Textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Observação para o aluno (opcional)"
              className="h-16 resize-none"
            />
            <Button
              className="w-full"
              disabled={!descricao.trim() || adicionarRefeicao.isPending}
              onClick={() => adicionarRefeicao.mutate()}
            >
              {adicionarRefeicao.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Adicionar refeição"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}

// ---------- Página principal ----------

function AlunoDetalhe() {
  const { alunoId } = Route.useParams();
  const { tab } = Route.useSearch();
  const [activeTab, setActiveTab] = useState<AlunoTab>(tab ?? "treino");
  const { user } = useAuth();
  const instrutorId = user?.id ?? "";

  const { data: perfilAluno } = useQuery({ ...perfilQuery(alunoId), enabled: !!alunoId });
  const { data: perfilInstrutor, isLoading: loadingPerfilInstrutor } = useQuery({
    ...perfilQuery(instrutorId),
    enabled: !!instrutorId,
  });
  const isAdmin = perfilInstrutor?.papel === "admin";
  const { data: alunosVinculados = [], isLoading: loadingVinculo } = useQuery({
    ...instrutorAlunosQuery(instrutorId),
    enabled: !!instrutorId && !isAdmin,
  });
  const vinculo = isAdmin || alunosVinculados.some((a) => a.aluno_id === alunoId);
  const { data: planosTreino = [], isLoading: loadingTreino } = useQuery({
    ...planosTreinoInstrutorQuery(instrutorId, alunoId),
    enabled: !!instrutorId && !!alunoId && !!vinculo,
  });
  const { data: planosAlimentares = [], isLoading: loadingAlimentar } = useQuery({
    ...planosAlimentaresInstrutorQuery(instrutorId, alunoId),
    enabled: !!instrutorId && !!alunoId && !!vinculo,
  });

  if (loadingPerfilInstrutor || loadingVinculo) {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-8">
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (!vinculo) {
    return (
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-8 space-y-6">
        <Link to="/app/instrutor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-sm font-semibold">Aluno não vinculado a este profissional.</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Vincule o aluno no painel antes de criar treinos, dietas ou acompanhar progresso.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pt-8 pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/app/instrutor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">{perfilAluno?.nome ?? "Aluno"}</h1>
          <div className="text-[11px] text-muted-foreground font-mono">{alunoId}</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AlunoTab)}>
        <TabsList className="w-full">
          <TabsTrigger value="treino" className="flex-1 gap-1.5">
            <Dumbbell className="h-4 w-4" /> Treino
          </TabsTrigger>
          <TabsTrigger value="alimentar" className="flex-1 gap-1.5">
            <Utensils className="h-4 w-4" /> Dieta
          </TabsTrigger>
          <TabsTrigger value="progresso" className="flex-1 gap-1.5">
            <TrendingUp className="h-4 w-4" /> Progresso
          </TabsTrigger>
        </TabsList>

        {/* ABA TREINO */}
        <TabsContent value="treino" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {planosTreino.length} plano(s) de treino
            </div>
            <CriarPlanoTreino instrutorId={instrutorId} alunoId={alunoId} />
          </div>
          {loadingTreino ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : planosTreino.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              Nenhum plano de treino ainda. Crie o primeiro!
            </div>
          ) : (
            planosTreino.map((p) => (
              <PlanoTreinoCard key={p.id} plano={p} instrutorId={instrutorId} />
            ))
          )}
        </TabsContent>

        {/* ABA DIETA */}
        <TabsContent value="alimentar" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {planosAlimentares.length} plano(s) alimentar(es)
            </div>
            <CriarPlanoAlimentar instrutorId={instrutorId} alunoId={alunoId} />
          </div>
          {loadingAlimentar ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : planosAlimentares.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              Nenhum plano alimentar ainda. Crie o primeiro!
            </div>
          ) : (
            <ul className="space-y-3">
              {planosAlimentares.map((p) => (
                <PlanoAlimentarCard key={p.id} plano={p} instrutorId={instrutorId} />
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ABA PROGRESSO */}
        <TabsContent value="progresso" className="space-y-6 mt-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Conclusões de treino — últimos 28 dias
            </div>
            {planosTreino.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
                Nenhum plano de treino criado ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {planosTreino.map((p) => (
                  <ProgressoTreinoCard key={p.id} plano={p} alunoId={alunoId} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Adesão à dieta — últimos 30 dias
            </div>
            {planosAlimentares.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
                Nenhum plano alimentar criado ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {planosAlimentares.map((p) => (
                  <ProgressoAlimentarCard key={p.id} plano={p} alunoId={alunoId} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
