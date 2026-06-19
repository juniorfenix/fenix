import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  perfilQuery,
  planosTreinoAlunoQuery,
  planosAlimentaresAlunoQuery,
  planoExerciciosQuery,
  planoRefeicoesQuery,
  conclusoesTreinoQuery,
  adesaoAlimentarQuery,
  type PlanoTreinoRow,
  type PlanoAlimentarRow,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyMount } from "@/components/LazyMount";
import { ExercicioMedia } from "@/components/exercicio-media";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/meu-plano")({
  component: MeuPlanoPage,
});

const DIAS_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function todayISO() {
  return new Date().toLocaleDateString("sv-SE");
}

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

  const isPending = marcar.isPending || desmarcar.isPending;

  return (
    <button
      onClick={() => (jaConcluido ? desmarcar.mutate() : marcar.mutate())}
      disabled={isPending}
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

  const byDay = DIAS_LABELS.reduce(
    (acc, _, i) => {
      acc[i] = exercicios.filter((e) => e.dia_semana === i);
      return acc;
    },
    {} as Record<number, typeof exercicios>,
  );

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
        <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
          Seu instrutor ainda não adicionou exercícios a este plano.
        </div>
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
                <span className="text-sm font-semibold">{DIAS_LABELS[dia]}</span>
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
                          <ExercicioMedia
                            url={item.exercicio.gif_url ?? item.exercicio.video_url}
                            alt={item.exercicio.nome}
                          />
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => setSelected(item)}
                              className="text-left text-sm font-medium leading-tight hover:text-primary transition"
                            >
                              {item.exercicio.nome}
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
        <DialogContent className="max-w-md">
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

function MacroChip({ label, value, unit = "" }: { label: string; value: number; unit?: string }) {
  return (
    <div className="rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
        {label}
      </div>
      <div className="text-sm font-bold text-primary">
        {value}
        {unit}
      </div>
    </div>
  );
}

function PlanoAlimentarView({ plano, alunoId }: { plano: PlanoAlimentarRow; alunoId: string }) {
  const queryClient = useQueryClient();
  const today = todayISO();

  const { data: adesoes = [] } = useQuery(adesaoAlimentarQuery(plano.id, alunoId, 30));
  const { data: refeicoes = [], isLoading: loadingRefeicoes } = useQuery(
    planoRefeicoesQuery(plano.id),
  );
  const jaSeguiu = adesoes.some((a) => a.data === today);
  const totalMes = adesoes.length;

  const marcar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("plano_alimentar_adesao").insert({
        plano_id: plano.id,
        aluno_id: alunoId,
        data: today,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adesao-alimentar", plano.id, alunoId] });
      toast.success("Dieta marcada como seguida hoje! 🥗");
    },
    onError: () => toast.error("Erro ao registrar adesão."),
  });

  const desmarcar = useMutation({
    mutationFn: async () => {
      const adesao = adesoes.find((a) => a.data === today);
      if (!adesao) return;
      const { error } = await supabase.from("plano_alimentar_adesao").delete().eq("id", adesao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adesao-alimentar", plano.id, alunoId] });
      toast.success("Adesão desfeita.");
    },
    onError: () => toast.error("Erro ao desfazer adesão."),
  });

  const isPending = marcar.isPending || desmarcar.isPending;

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-sm">{plano.nome}</h2>
        {totalMes > 0 && (
          <span className="text-[11px] text-muted-foreground shrink-0">
            {totalMes} dias seguidos (30d)
          </span>
        )}
      </div>

      {plano.descricao && (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {plano.descricao}
        </p>
      )}

      {(plano.meta_kcal || plano.meta_proteinas_g) && (
        <div className="grid grid-cols-4 gap-2">
          {plano.meta_kcal && <MacroChip label="kcal" value={plano.meta_kcal} />}
          {plano.meta_proteinas_g && (
            <MacroChip label="proteína" value={plano.meta_proteinas_g} unit="g" />
          )}
          {plano.meta_carboidratos_g && (
            <MacroChip label="carboidrato" value={plano.meta_carboidratos_g} unit="g" />
          )}
          {plano.meta_gorduras_g && (
            <MacroChip label="gordura" value={plano.meta_gorduras_g} unit="g" />
          )}
        </div>
      )}

      <div className="border-t border-border/30 pt-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Refeições prescritas
        </div>
        {loadingRefeicoes ? (
          <Skeleton className="h-20 rounded-xl" />
        ) : refeicoes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
            Seu profissional ainda não detalhou as refeições deste plano.
          </div>
        ) : (
          <ul className="space-y-2">
            {refeicoes.map((item) => (
              <li key={item.id} className="rounded-xl border border-border bg-card/50 p-3">
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => (jaSeguiu ? desmarcar.mutate() : marcar.mutate())}
        disabled={isPending}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition border ${
          jaSeguiu
            ? "bg-primary/10 border-primary/40 text-primary"
            : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
        }`}
      >
        {jaSeguiu ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        {jaSeguiu ? "Dieta seguida hoje ✓" : "Marcar dieta como seguida hoje"}
      </button>
    </div>
  );
}

function MeuPlanoPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();

  const { data: perfil, isSuccess: perfilReady } = useQuery({
    ...perfilQuery(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!perfilReady) return;
    if (perfil?.papel !== "aluno") navigate({ to: "/app" });
  }, [perfilReady, perfil?.papel, navigate]);

  const { data: planosTreino = [], isLoading: loadingTreino } = useQuery({
    ...planosTreinoAlunoQuery(userId),
    enabled: !!userId && perfilReady && perfil?.papel === "aluno",
  });

  const { data: planosAlimentares = [], isLoading: loadingAlimentar } = useQuery({
    ...planosAlimentaresAlunoQuery(userId),
    enabled: !!userId && perfilReady && perfil?.papel === "aluno",
  });

  if (!perfilReady || perfil?.papel !== "aluno") return null;

  return (
    <main className="mx-auto max-w-md px-5 pt-8 pb-8">
      <header className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Prescrito pelo instrutor
          </div>
          <h1 className="text-2xl">Meu Plano</h1>
        </div>
      </header>

      <Tabs defaultValue="treino">
        <TabsList className="w-full mb-5">
          <TabsTrigger value="treino" className="flex-1 gap-1.5">
            <Dumbbell className="h-4 w-4" /> Treino
          </TabsTrigger>
          <TabsTrigger value="alimentar" className="flex-1 gap-1.5">
            <Utensils className="h-4 w-4" /> Dieta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treino" className="space-y-4">
          {loadingTreino ? (
            <>
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </>
          ) : planosTreino.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center space-y-2">
              <div className="text-3xl">🏋️</div>
              <div className="text-sm font-medium">Nenhum plano de treino atribuído ainda.</div>
              <div className="text-xs text-muted-foreground">
                Aguarde seu instrutor criar seu plano.
              </div>
            </div>
          ) : (
            planosTreino.map((p) => <PlanoTreinoView key={p.id} plano={p} alunoId={userId} />)
          )}
        </TabsContent>

        <TabsContent value="alimentar" className="space-y-4">
          {loadingAlimentar ? (
            <Skeleton className="h-32 rounded-2xl" />
          ) : planosAlimentares.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center space-y-2">
              <div className="text-3xl">🥗</div>
              <div className="text-sm font-medium">Nenhum plano alimentar atribuído ainda.</div>
              <div className="text-xs text-muted-foreground">
                Aguarde seu instrutor criar sua dieta.
              </div>
            </div>
          ) : (
            planosAlimentares.map((p) => (
              <PlanoAlimentarView key={p.id} plano={p} alunoId={userId} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
