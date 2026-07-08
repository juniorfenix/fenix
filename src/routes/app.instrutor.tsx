import {
  createFileRoute,
  useNavigate,
  Link,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  Dumbbell,
  Loader2,
  Mail,
  MoreVertical,
  Search,
  UserPlus,
  Users,
  Utensils,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  alunosBuscaQuery,
  avisosInstrutorQuery,
  perfilQuery,
  instrutorAlunosQuery,
  planosAlimentaresInstrutorCountQuery,
  planosTreinoInstrutorCountQuery,
  type InstrutorAlunoRow,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentActionSheet } from "@/components/student-action-sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/app/instrutor")({
  component: InstrutorLayout,
});

function InstrutorLayout() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const navigate = useNavigate();
  const { data: perfil, isSuccess } = useQuery({ ...perfilQuery(userId), enabled: !!userId });
  const childMatches = useChildMatches();

  const isProfissional =
    perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin";

  useEffect(() => {
    if (!isSuccess) return;
    if (!isProfissional) navigate({ to: "/app" });
  }, [isSuccess, isProfissional, navigate]);

  if (!isSuccess || !isProfissional) return null;
  if (childMatches.length > 0) return <Outlet />;
  return <InstrutorPage />;
}

type Filtro = "todos" | "sem-treino" | "sem-dieta" | "com-aviso";

const FILTROS: { key: Filtro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "sem-treino", label: "Sem treino" },
  { key: "sem-dieta", label: "Sem dieta" },
  { key: "com-aviso", label: "Com aviso" },
];

function InstrutorPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const [buscaVincular, setBuscaVincular] = useState("");
  const [buscaLista, setBuscaLista] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [alunoAcoes, setAlunoAcoes] = useState<InstrutorAlunoRow | null>(null);
  const [avisosExpandido, setAvisosExpandido] = useState(false);

  const { data: perfil } = useQuery({ ...perfilQuery(userId), enabled: !!userId });
  const isProfissional =
    perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin";
  const papelLabel = perfil?.papel === "nutricionista" ? "Nutricionista" : "Instrutor";

  const { data: alunos = [], isLoading } = useQuery({
    ...instrutorAlunosQuery(userId),
    enabled: !!userId && isProfissional,
  });
  const { data: alunosEncontrados = [], isFetching: buscandoAlunos } = useQuery({
    ...alunosBuscaQuery(userId, buscaVincular),
    enabled: !!userId && isProfissional && !!buscaVincular.trim(),
  });
  const { data: avisos = [], isLoading: loadingAvisos } = useQuery({
    ...avisosInstrutorQuery(userId),
    enabled: !!userId && isProfissional,
  });
  const { data: totalTreinos = 0 } = useQuery({
    ...planosTreinoInstrutorCountQuery(userId),
    enabled: !!userId && isProfissional,
  });
  const { data: totalDietas = 0 } = useQuery({
    ...planosAlimentaresInstrutorCountQuery(userId),
    enabled: !!userId && isProfissional,
  });

  const adicionarAluno = useMutation({
    mutationFn: async (alunoId: string) => {
      const { error } = await supabase
        .from("instrutores_alunos")
        .insert({ instrutor_id: userId, aluno_id: alunoId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instrutor-alunos", userId] });
      queryClient.invalidateQueries({ queryKey: ["alunos-busca", userId] });
      setBuscaVincular("");
      toast.success("Aluno adicionado com sucesso.");
    },
    onError: (error: unknown) => {
      toast.error(errorMessage(error, "Erro ao adicionar aluno."));
    },
  });

  const removerAluno = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("instrutores_alunos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instrutor-alunos", userId] });
      setAlunoAcoes(null);
      toast.success("Aluno removido.");
    },
  });

  const marcarAvisoLido = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notificacoes_instrutor")
        .update({ lida: true })
        .eq("id", id)
        .eq("instrutor_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avisos-instrutor", userId] }),
  });

  const marcarTodosLidos = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notificacoes_instrutor")
        .update({ lida: true })
        .eq("instrutor_id", userId)
        .eq("lida", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avisos-instrutor", userId] }),
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (perfil?.papel === "aluno") navigate({ to: "/app/meu-plano" });
  }, [perfil?.papel, navigate]);

  const alunosComAviso = useMemo(
    () => new Set(avisos.filter((a) => !a.lida).map((a) => a.aluno_id)),
    [avisos],
  );

  const alunosFiltrados = useMemo(() => {
    const termo = buscaLista.trim().toLowerCase();
    return alunos.filter((a) => {
      if (termo) {
        const alvo = `${a.aluno_nome ?? ""} ${a.aluno_email ?? ""}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      if (filtro === "sem-treino" && a.tem_plano_treino) return false;
      if (filtro === "sem-dieta" && a.tem_plano_alimentar) return false;
      if (filtro === "com-aviso" && !alunosComAviso.has(a.aluno_id)) return false;
      return true;
    });
  }, [alunos, buscaLista, filtro, alunosComAviso]);

  if (perfil?.papel === "aluno") return null;

  const termoVincular = buscaVincular.trim();
  const podeAdicionarUuid =
    UUID_RE.test(termoVincular) && !alunosEncontrados.some((a) => a.id === termoVincular);
  const avisosNaoLidos = avisos.filter((a) => !a.lida).length;
  const avisosVisiveis = avisosExpandido ? avisos.slice(0, 10) : avisos.slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6">
      <div className="space-y-3">
        <header className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {papelLabel}
            </div>
            <h1 className="text-2xl">Gestão de alunos</h1>
          </div>
        </header>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Acompanhe treino, dieta e avisos dos seus alunos em um só lugar.
        </p>
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4" /> Vincular aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Vincular aluno</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={buscaVincular}
                    onChange={(e) => setBuscaVincular(e.target.value)}
                    placeholder="Buscar por nome, e-mail ou UUID"
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  O aluno precisa estar cadastrado no sistema. A busca aceita e-mail, nome ou UUID.
                </p>

                {termoVincular && (
                  <div className="rounded-2xl border border-border/50 overflow-hidden">
                    {buscandoAlunos ? (
                      <div className="px-4 py-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Buscando alunos...
                      </div>
                    ) : alunosEncontrados.length > 0 ? (
                      <ul className="divide-y divide-border/40">
                        {alunosEncontrados.map((aluno) => (
                          <li key={aluno.id} className="flex items-center gap-3 px-4 py-3">
                            <AlunoIdentidade nome={aluno.nome} email={aluno.email} id={aluno.id} />
                            <Button
                              size="sm"
                              variant={aluno.vinculado ? "outline" : "default"}
                              disabled={aluno.vinculado || adicionarAluno.isPending}
                              onClick={() => adicionarAluno.mutate(aluno.id)}
                            >
                              {aluno.vinculado ? "Vinculado" : "Adicionar"}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : podeAdicionarUuid ? (
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">UUID informado</div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            {termoVincular}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={adicionarAluno.isPending}
                          onClick={() => adicionarAluno.mutate(termoVincular)}
                        >
                          Adicionar
                        </Button>
                      </div>
                    ) : (
                      <div className="px-4 py-4 text-xs text-muted-foreground">
                        Nenhum aluno encontrado para esse termo.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" variant="outline" asChild>
            <Link to="/app/instrutor/exercicios">
              <Dumbbell className="h-4 w-4" /> Banco de exercícios
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          icon={Users}
          value={alunos.length}
          label={alunos.length === 1 ? "Aluno" : "Alunos"}
        />
        <SummaryCard
          icon={Dumbbell}
          value={totalTreinos}
          label={totalTreinos === 1 ? "Plano de treino" : "Planos de treino"}
        />
        <SummaryCard
          icon={Utensils}
          value={totalDietas}
          label={totalDietas === 1 ? "Plano alimentar" : "Planos alimentares"}
        />
        <SummaryCard icon={Bell} value={avisosNaoLidos} label="Avisos" />
      </section>

      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Alunos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={buscaLista}
              onChange={(e) => setBuscaLista(e.target.value)}
              placeholder="Buscar aluno vinculado por nome ou e-mail"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <FiltroChip
                key={f.key}
                label={f.label}
                active={filtro === f.key}
                onClick={() => setFiltro(f.key)}
              />
            ))}
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : alunos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              Nenhum aluno vinculado ainda. Use "Vincular aluno" para começar.
            </div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              Nenhum aluno encontrado para essa busca/filtro.
            </div>
          ) : (
            <ul className="space-y-3">
              {alunosFiltrados.map((a) => (
                <AlunoCard
                  key={a.id}
                  aluno={a}
                  temAviso={alunosComAviso.has(a.aluno_id)}
                  onAbrirAcoes={() => setAlunoAcoes(a)}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Avisos recentes
              {avisosNaoLidos > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {avisosNaoLidos}
                </span>
              )}
            </CardTitle>
            {avisosNaoLidos > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => marcarTodosLidos.mutate()}
                disabled={marcarTodosLidos.isPending}
              >
                <CheckCheck className="h-3.5 w-3.5" /> Marcar lidos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingAvisos ? (
            <div className="px-6 py-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : avisos.length === 0 ? (
            <div className="px-6 py-6 text-center text-sm text-muted-foreground">
              Quando um aluno concluir treino ou marcar dieta seguida, o aviso aparece aqui.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-border/40">
                {avisosVisiveis.map((aviso) => (
                  <li
                    key={aviso.id}
                    className={`px-6 py-4 ${aviso.lida ? "bg-transparent" : "bg-primary/5"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
                        {aviso.tipo === "dieta_seguida" ? (
                          <Utensils className="h-4 w-4" />
                        ) : (
                          <Dumbbell className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{aviso.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {aviso.aluno_nome ?? "Aluno"} · {formatDateTime(aviso.created_at)}
                        </div>
                        {aviso.corpo && (
                          <p className="mt-1 text-xs text-muted-foreground">{aviso.corpo}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/app/instrutor/$alunoId"
                          params={{ alunoId: aviso.aluno_id }}
                          className="text-xs text-primary hover:underline"
                        >
                          Abrir
                        </Link>
                        {!aviso.lida && (
                          <button
                            onClick={() => marcarAvisoLido.mutate(aviso.id)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Lido
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {avisos.length > 3 && (
                <div className="px-6 py-3 border-t border-border/40">
                  <button
                    onClick={() => setAvisosExpandido((v) => !v)}
                    className="text-xs text-primary hover:underline"
                  >
                    {avisosExpandido ? "Ver menos" : "Ver todos"}
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <StudentActionSheet
        aluno={alunoAcoes}
        open={alunoAcoes != null}
        onOpenChange={(open) => {
          if (!open) setAlunoAcoes(null);
        }}
        onRemove={(id) => removerAluno.mutate(id)}
        removing={removerAluno.isPending}
      />
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="h-9 w-9 rounded-xl bg-gradient-ember grid place-items-center shadow-ember mb-3">
        <Icon className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
      </div>
      <div className="font-display text-3xl text-gradient-ember">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FiltroChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-transparent bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function AlunoCard({
  aluno,
  temAviso,
  onAbrirAcoes,
}: {
  aluno: InstrutorAlunoRow;
  temAviso: boolean;
  onAbrirAcoes: () => void;
}) {
  const ultimaAtividade = maisRecente(aluno.ultimo_treino_em, aluno.ultima_dieta_em);
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 transition hover:border-primary/30 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">
            {aluno.aluno_nome ?? "Aluno sem nome"}
          </span>
          {temAviso && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" title="Aviso não lido" />
          )}
        </div>
        {aluno.aluno_email && (
          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{aluno.aluno_email}</span>
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant={aluno.tem_plano_treino ? "default" : "outline"} className="text-[10px]">
            {aluno.tem_plano_treino ? "Treino ativo" : "Sem treino"}
          </Badge>
          <Badge
            variant={aluno.tem_plano_alimentar ? "default" : "outline"}
            className="text-[10px]"
          >
            {aluno.tem_plano_alimentar ? "Dieta ativa" : "Sem dieta"}
          </Badge>
          {ultimaAtividade && (
            <span className="text-[10px] text-muted-foreground">
              Última atividade: {formatDate(ultimaAtividade)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0">
        <Button size="sm" variant="outline" asChild>
          <Link to="/app/instrutor/$alunoId" params={{ alunoId: aluno.aluno_id }}>
            Gerenciar
          </Link>
        </Button>
        <Button size="icon" variant="ghost" onClick={onAbrirAcoes} aria-label="Mais ações do aluno">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

function AlunoIdentidade({
  nome,
  email,
  id,
}: {
  nome: string | null;
  email: string | null;
  id: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="font-medium text-sm truncate">{nome ?? "Aluno sem nome"}</div>
      <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
        {email && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{email}</span>
          </span>
        )}
        <span className="font-mono truncate">{id}</span>
      </div>
    </div>
  );
}

function maisRecente(a: string | null, b: string | null) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
