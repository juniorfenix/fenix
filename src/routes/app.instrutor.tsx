import {
  createFileRoute,
  useNavigate,
  Link,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Dumbbell,
  Loader2,
  Mail,
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
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function InstrutorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const [buscaAluno, setBuscaAluno] = useState("");

  const { data: perfil } = useQuery({ ...perfilQuery(userId), enabled: !!userId });
  const isProfissional =
    perfil?.papel === "instrutor" || perfil?.papel === "nutricionista" || perfil?.papel === "admin";

  const { data: alunos = [], isLoading } = useQuery({
    ...instrutorAlunosQuery(userId),
    enabled: !!userId && isProfissional,
  });
  const { data: alunosEncontrados = [], isFetching: buscandoAlunos } = useQuery({
    ...alunosBuscaQuery(userId, buscaAluno),
    enabled: !!userId && isProfissional && !!buscaAluno.trim(),
  });
  const { data: avisos = [], isLoading: loadingAvisos } = useQuery({
    ...avisosInstrutorQuery(userId),
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
      setBuscaAluno("");
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

  useEffect(() => {
    if (perfil?.papel === "aluno") navigate({ to: "/app/meu-plano" });
  }, [perfil?.papel, navigate]);

  if (perfil?.papel === "aluno") return null;

  const termoLimpo = buscaAluno.trim();
  const podeAdicionarUuid =
    UUID_RE.test(termoLimpo) && !alunosEncontrados.some((a) => a.id === termoLimpo);
  const avisosNaoLidos = avisos.filter((a) => !a.lida).length;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6">
      <header className="flex items-center gap-3 mb-2">
        <div className="h-11 w-11 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Painel</div>
          <h1 className="text-2xl">Meus Alunos</h1>
        </div>
      </header>

      <Card className="glass">
        <CardContent className="py-4 px-5 flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
            <Dumbbell className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Banco de exercícios</div>
            <div className="text-[11px] text-muted-foreground">
              Criar e editar exercícios disponíveis nos planos
            </div>
          </div>
          <Link
            to="/app/instrutor/exercicios"
            className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Abrir <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Vincular aluno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={buscaAluno}
              onChange={(e) => setBuscaAluno(e.target.value)}
              placeholder="Buscar por nome, e-mail ou UUID"
              className="pl-9"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            O aluno precisa estar cadastrado no sistema. A busca aceita e-mail, nome ou UUID.
          </p>

          {buscaAluno.trim() && (
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
                      {termoLimpo}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={adicionarAluno.isPending}
                    onClick={() => adicionarAluno.mutate(termoLimpo)}
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
            <ul className="divide-y divide-border/40">
              {avisos.slice(0, 6).map((aviso) => (
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
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {alunos.length} aluno{alunos.length !== 1 ? "s" : ""} vinculado
            {alunos.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-6 py-8 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : alunos.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Nenhum aluno vinculado ainda.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {alunos.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 px-6 py-4 hover:bg-card/40 transition sm:flex-row sm:items-center"
                >
                  <AlunoIdentidade nome={a.aluno_nome} email={a.aluno_email} id={a.aluno_id} />
                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <AtividadeChip
                      icon={Dumbbell}
                      label="Treino"
                      value={a.ultimo_treino_em ? formatDate(a.ultimo_treino_em) : "sem registro"}
                    />
                    <AtividadeChip
                      icon={Utensils}
                      label="Dieta"
                      value={a.ultima_dieta_em ? formatDate(a.ultima_dieta_em) : "sem registro"}
                    />
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <Link
                      to="/app/instrutor/$alunoId"
                      params={{ alunoId: a.aluno_id }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Dumbbell className="h-3.5 w-3.5" /> Gerenciar
                    </Link>
                    <button
                      onClick={() => removerAluno.mutate(a.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remover
                    </button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
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

function AtividadeChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="font-medium text-foreground">{label}</span>
      {value}
    </span>
  );
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
