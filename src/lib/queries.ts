import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ActivityLevel } from "@/lib/calories";

// ---------- Types ----------
export type ProfileRow = {
  display_name: string | null;
  current_weight: number | null;
  goal_weight: number | null;
  daily_calorie_goal: number | null;
  height: number | null;
  age: number | null;
  gender: "male" | "female" | null;
  activity_level: ActivityLevel | null;
  onboarding_complete: boolean;
  has_seen_welcome: boolean;
};

type ProfileLiteRow = {
  id: string;
  display_name: string | null;
  email?: string | null;
};

export type WeightRow = { logged_date: string; weight: number };
export type MealRow = {
  id: string;
  name: string;
  calories: number;
  meal_type: string;
  logged_date: string;
  created_at: string;
};

// ---------- Helpers ----------
// Local date N days ago — stays consistent with `todayISO()`
function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE");
}

// ---------- Query options ----------
// Each one is keyed by userId so different users don't share cache entries.

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<ProfileRow> => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "display_name,current_weight,goal_weight,daily_calorie_goal,height,age,gender,activity_level,onboarding_complete,has_seen_welcome",
        )
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data as ProfileRow;
    },
  });

// Last 30 weight logs — already small, good for chart.
export const weightsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["weights", userId],
    queryFn: async (): Promise<WeightRow[]> => {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("logged_date,weight")
        .eq("user_id", userId)
        .order("logged_date", { ascending: true })
        .limit(30);
      if (error) throw error;
      return (data ?? []).map((r) => ({ logged_date: r.logged_date, weight: Number(r.weight) }));
    },
  });

// Last 30 days of meals from diario_alimentar (source of truth for the food diary).
// Mapped to MealRow shape so the Dashboard (today + streak) stays untouched.
export const mealsRecentQuery = (userId: string) =>
  queryOptions({
    queryKey: ["meals", userId, "recent30"],
    queryFn: async (): Promise<MealRow[]> => {
      const { data, error } = await supabase
        .from("diario_alimentar")
        .select("id,nome,calorias,refeicao,data,created_at")
        .eq("user_id", userId)
        .gte("data", isoDaysAgo(30))
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        name: r.nome,
        calories: r.calorias,
        meal_type: r.refeicao ?? "",
        logged_date: r.data,
        created_at: r.created_at ?? "",
      }));
    },
  });

export const badgesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["badges", userId],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("badges")
        .select("badge_type")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((r) => r.badge_type);
    },
  });

export type GuiaMental = {
  id: string;
  chave: string;
  titulo: string;
  descricao: string | null;
  conteudo: string;
  ordem: number;
};

// Public table — same for every user, cached indefinitely-ish.
export const guiasMentaisQuery = queryOptions({
  queryKey: ["guias_mentais"],
  queryFn: async (): Promise<GuiaMental[]> => {
    const { data, error } = await supabase
      .from("guias_mentais")
      .select("id,chave,titulo,descricao,conteudo,ordem")
      .order("ordem", { ascending: true });
    if (error) throw error;
    return (data ?? []) as GuiaMental[];
  },
  staleTime: 10 * 60 * 1000,
});

export type TreinoRow = {
  id: string;
  nivel: string;
  genero: string;
  local: string;
  dia_semana: number;
  exercicio: string;
  series_repeticoes: string;
  observacoes: string | null;
  ordem: number;
  url_midia: string | null;
  instrucao: string | null;
  dica_seguranca: string | null;
};

export const treinosQuery = (params: {
  nivel: string;
  genero: string;
  local: string;
  dia_semana: number;
}) =>
  queryOptions({
    queryKey: ["treinos", params],
    queryFn: async (): Promise<TreinoRow[]> => {
      const { data, error } = await supabase
        .from("treinos")
        .select(
          "id,nivel,genero,local,dia_semana,exercicio,series_repeticoes,observacoes,ordem,url_midia,instrucao,dica_seguranca",
        )
        .eq("nivel", params.nivel)
        .eq("genero", params.genero)
        .eq("local", params.local)
        .eq("dia_semana", params.dia_semana)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []) as TreinoRow[];
    },
    staleTime: 10 * 60 * 1000,
  });

// All workouts across the week for a given (nivel, genero, local)
export const treinosWeekQuery = (params: { nivel: string; genero: string; local: string }) =>
  queryOptions({
    queryKey: ["treinos-week", params],
    queryFn: async (): Promise<TreinoRow[]> => {
      const { data, error } = await supabase
        .from("treinos")
        .select(
          "id,nivel,genero,local,dia_semana,exercicio,series_repeticoes,observacoes,ordem,url_midia,instrucao,dica_seguranca",
        )
        .eq("nivel", params.nivel)
        .eq("genero", params.genero)
        .eq("local", params.local)
        .order("dia_semana", { ascending: true })
        .order("ordem", { ascending: true })
        .limit(300);
      if (error) throw error;
      return (data ?? []) as TreinoRow[];
    },
    staleTime: 10 * 60 * 1000,
  });

export type DietaRow = {
  id: string;
  categoria: string;
  genero: string;
  fase: string;
  refeicao: string;
  horario: string;
  opcao: number;
  descricao: string;
  kcal: number;
  proteina_g: number;
  ordem: number;
};

export type DietaDicaRow = { id: string; dica: string; ordem: number };

// ---------- Perfil (novo backend sqcnmqvtbpyryiqhlaja) ----------

export type PapelUsuario = "aluno" | "instrutor" | "nutricionista" | "admin";

export type PerfilRow = {
  id: string;
  nome: string | null;
  papel: PapelUsuario;
};

export const perfilQuery = (userId: string) =>
  queryOptions({
    queryKey: ["perfil", userId],
    queryFn: async (): Promise<PerfilRow | null> => {
      const { data, error } = await supabase
        .from("perfis")
        .select("id,nome,papel")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data as PerfilRow | null;
    },
  });

// ---------- Instrutor / Planos ----------

export type InstrutorAlunoRow = {
  id: string;
  aluno_id: string;
  aluno_nome: string | null;
  aluno_email: string | null;
  created_at: string;
  ultimo_treino_em: string | null;
  ultima_dieta_em: string | null;
};

type InstrutorAlunoRecord = {
  id: string;
  aluno_id: string;
  created_at: string | null;
  perfis?: { nome: string | null } | null;
};

export const instrutorAlunosQuery = (instrutorId: string) =>
  queryOptions({
    queryKey: ["instrutor-alunos", instrutorId],
    queryFn: async (): Promise<InstrutorAlunoRow[]> => {
      const { data, error } = await supabase
        .from("instrutores_alunos")
        .select("id,aluno_id,created_at,perfis!instrutores_alunos_aluno_id_fkey(nome)")
        .eq("instrutor_id", instrutorId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = data ?? [];
      const alunoIds = rows.map((r) => r.aluno_id);

      const [profilesMap, treinoMap, dietaMap] = await Promise.all([
        profilesById(alunoIds),
        ultimoTreinoPorAluno(instrutorId, alunoIds),
        ultimaDietaPorAluno(instrutorId, alunoIds),
      ]);

      return rows.map((row) => {
        const r = row as InstrutorAlunoRecord;
        const profile = profilesMap.get(r.aluno_id);
        return {
          id: r.id,
          aluno_id: r.aluno_id,
          aluno_nome: r.perfis?.nome ?? profile?.display_name ?? null,
          aluno_email: profile?.email ?? null,
          created_at: r.created_at ?? "",
          ultimo_treino_em: treinoMap.get(r.aluno_id) ?? null,
          ultima_dieta_em: dietaMap.get(r.aluno_id) ?? null,
        };
      });
    },
  });

export type AlunoBuscaRow = {
  id: string;
  nome: string | null;
  email: string | null;
  papel: PapelUsuario;
  vinculado: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const alunosBuscaQuery = (instrutorId: string, termo: string) =>
  queryOptions({
    queryKey: ["alunos-busca", instrutorId, termo.trim()],
    queryFn: async (): Promise<AlunoBuscaRow[]> => {
      const clean = termo.trim();
      if (!clean || (clean.length < 2 && !UUID_RE.test(clean))) return [];

      const queryProfiles = async (column: "id" | "display_name" | "email") => {
        const query = supabase.from("profiles").select("id,display_name,email").limit(8);
        if (column === "id") return query.eq("id", clean);
        return query.ilike(column, `%${clean}%`);
      };

      const profileRequests = UUID_RE.test(clean)
        ? [queryProfiles("id")]
        : [queryProfiles("display_name"), queryProfiles("email")];

      const profileResponses = await Promise.all(profileRequests);
      const firstError = profileResponses.find((res) => res.error)?.error;
      if (firstError) throw firstError;

      const profiles = new Map<string, ProfileLiteRow>();
      for (const res of profileResponses) {
        for (const p of res.data ?? []) profiles.set(p.id, p);
      }

      const ids = [...profiles.keys()];
      if (ids.length === 0) return [];

      const [{ data: perfis, error: perfilError }, { data: vinculos, error: vinculoError }] =
        await Promise.all([
          supabase.from("perfis").select("id,nome,papel").in("id", ids),
          supabase
            .from("instrutores_alunos")
            .select("aluno_id")
            .eq("instrutor_id", instrutorId)
            .in("aluno_id", ids),
        ]);
      if (perfilError) throw perfilError;
      if (vinculoError) throw vinculoError;

      const perfilMap = new Map((perfis ?? []).map((p) => [p.id, p as PerfilRow]));
      const vinculados = new Set((vinculos ?? []).map((v) => v.aluno_id));

      return ids
        .map((id) => {
          const profile = profiles.get(id);
          const perfil = perfilMap.get(id);
          return {
            id,
            nome: perfil?.nome ?? profile?.display_name ?? null,
            email: profile?.email ?? null,
            papel: (perfil?.papel ?? "aluno") as PapelUsuario,
            vinculado: vinculados.has(id),
          };
        })
        .filter((aluno) => aluno.papel === "aluno");
    },
  });

async function profilesById(ids: string[]) {
  const map = new Map<string, ProfileLiteRow>();
  if (ids.length === 0) return map;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,display_name,email")
    .in("id", ids);
  if (error) throw error;
  for (const profile of data ?? []) map.set(profile.id, profile);
  return map;
}

async function ultimoTreinoPorAluno(instrutorId: string, alunoIds: string[]) {
  const map = new Map<string, string>();
  if (alunoIds.length === 0) return map;

  const { data: planos, error: planosError } = await supabase
    .from("planos_treino")
    .select("id,aluno_id")
    .eq("instrutor_id", instrutorId)
    .in("aluno_id", alunoIds);
  if (planosError) throw planosError;

  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;

  const { data, error } = await supabase
    .from("plano_treino_conclusoes")
    .select("plano_id,aluno_id,data,created_at")
    .in("plano_id", planoIds)
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) throw error;

  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}

async function ultimaDietaPorAluno(instrutorId: string, alunoIds: string[]) {
  const map = new Map<string, string>();
  if (alunoIds.length === 0) return map;

  const { data: planos, error: planosError } = await supabase
    .from("planos_alimentares")
    .select("id,aluno_id")
    .eq("instrutor_id", instrutorId)
    .in("aluno_id", alunoIds);
  if (planosError) throw planosError;

  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;

  const { data, error } = await supabase
    .from("plano_alimentar_adesao")
    .select("plano_id,aluno_id,data,created_at")
    .in("plano_id", planoIds)
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) throw error;

  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}

export type InstrutorAvisoRow = {
  id: string;
  tipo: "treino_concluido" | "dieta_seguida" | string;
  aluno_id: string;
  aluno_nome: string | null;
  plano_id: string | null;
  titulo: string;
  corpo: string | null;
  data_ref: string | null;
  lida: boolean;
  created_at: string;
};

type InstrutorAvisoRecord = {
  id: string;
  tipo: string;
  aluno_id: string;
  plano_id: string | null;
  titulo: string;
  corpo: string | null;
  data_ref: string | null;
  lida: boolean | null;
  created_at: string;
  perfis?: { nome: string | null } | null;
};

export const avisosInstrutorQuery = (instrutorId: string) =>
  queryOptions({
    queryKey: ["avisos-instrutor", instrutorId],
    queryFn: async (): Promise<InstrutorAvisoRow[]> => {
      const { data, error } = await supabase
        .from("notificacoes_instrutor")
        .select(
          "id,tipo,aluno_id,plano_id,titulo,corpo,data_ref,lida,created_at,perfis!notificacoes_instrutor_aluno_id_fkey(nome)",
        )
        .eq("instrutor_id", instrutorId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;

      return (data ?? []).map((row) => {
        const r = row as InstrutorAvisoRecord;
        return {
          id: r.id,
          tipo: r.tipo,
          aluno_id: r.aluno_id,
          aluno_nome: r.perfis?.nome ?? null,
          plano_id: r.plano_id ?? null,
          titulo: r.titulo,
          corpo: r.corpo ?? null,
          data_ref: r.data_ref ?? null,
          lida: Boolean(r.lida),
          created_at: r.created_at,
        };
      });
    },
    refetchInterval: 30_000,
  });

export type PlanoTreinoRow = {
  id: string;
  instrutor_id: string;
  aluno_id: string;
  nome: string;
  nivel: string;
  dias_semana: string[] | null;
  ativo: boolean;
  created_at: string;
};

export const planosTreinoAlunoQuery = (alunoId: string) =>
  queryOptions({
    queryKey: ["planos-treino-aluno", alunoId],
    queryFn: async (): Promise<PlanoTreinoRow[]> => {
      const { data, error } = await supabase
        .from("planos_treino")
        .select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at")
        .eq("aluno_id", alunoId)
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PlanoTreinoRow[];
    },
  });

export const planosTreinoInstrutorQuery = (instrutorId: string, alunoId: string) =>
  queryOptions({
    queryKey: ["planos-treino-instrutor", instrutorId, alunoId],
    queryFn: async (): Promise<PlanoTreinoRow[]> => {
      const { data, error } = await supabase
        .from("planos_treino")
        .select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at")
        .eq("instrutor_id", instrutorId)
        .eq("aluno_id", alunoId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PlanoTreinoRow[];
    },
  });

export type PlanoExercicioRow = {
  id: string;
  plano_id: string;
  dia_semana: number;
  series: number;
  repeticoes: string;
  descanso_seg: number;
  ordem: number;
  observacoes: string | null;
  exercicio: {
    id: number;
    nome: string;
    grupo_muscular: string | null;
    gif_url: string | null;
    video_url: string | null;
    tipo_midia: string;
  };
};

type PlanoExercicioRecord = Omit<PlanoExercicioRow, "exercicio"> & {
  exercicios: PlanoExercicioRow["exercicio"];
};

export const planoExerciciosQuery = (planoId: string) =>
  queryOptions({
    queryKey: ["plano-exercicios", planoId],
    queryFn: async (): Promise<PlanoExercicioRow[]> => {
      const { data, error } = await supabase
        .from("planos_treino_exercicios")
        .select(
          "id,plano_id,dia_semana,series,repeticoes,descanso_seg,ordem,observacoes,exercicios(id,nome,grupo_muscular,gif_url,video_url,tipo_midia)",
        )
        .eq("plano_id", planoId)
        .order("dia_semana", { ascending: true })
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => {
        const r = row as PlanoExercicioRecord;
        const { exercicios, ...rest } = r;
        return {
          ...rest,
          exercicio: exercicios,
        };
      }) as PlanoExercicioRow[];
    },
  });

export type PlanoAlimentarRow = {
  id: string;
  instrutor_id: string;
  aluno_id: string;
  nome: string;
  descricao: string | null;
  meta_kcal: number | null;
  meta_proteinas_g: number | null;
  meta_carboidratos_g: number | null;
  meta_gorduras_g: number | null;
  ativo: boolean;
  created_at: string;
};

export type PlanoRefeicaoRow = {
  id: string;
  plano_id: string;
  refeicao: string;
  horario: string | null;
  descricao: string;
  kcal: number | null;
  proteina_g: number | null;
  ordem: number;
  observacoes: string | null;
  created_at: string | null;
};

export const planosAlimentaresAlunoQuery = (alunoId: string) =>
  queryOptions({
    queryKey: ["planos-alimentares-aluno", alunoId],
    queryFn: async (): Promise<PlanoAlimentarRow[]> => {
      const { data, error } = await supabase
        .from("planos_alimentares")
        .select(
          "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at",
        )
        .eq("aluno_id", alunoId)
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PlanoAlimentarRow[];
    },
  });

export const planosAlimentaresInstrutorQuery = (instrutorId: string, alunoId: string) =>
  queryOptions({
    queryKey: ["planos-alimentares-instrutor", instrutorId, alunoId],
    queryFn: async (): Promise<PlanoAlimentarRow[]> => {
      const { data, error } = await supabase
        .from("planos_alimentares")
        .select(
          "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at",
        )
        .eq("instrutor_id", instrutorId)
        .eq("aluno_id", alunoId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PlanoAlimentarRow[];
    },
  });

export const planoRefeicoesQuery = (planoId: string) =>
  queryOptions({
    queryKey: ["plano-refeicoes", planoId],
    queryFn: async (): Promise<PlanoRefeicaoRow[]> => {
      const { data, error } = await supabase
        .from("plano_alimentar_refeicoes")
        .select(
          "id,plano_id,refeicao,horario,descricao,kcal,proteina_g,ordem,observacoes,created_at",
        )
        .eq("plano_id", planoId)
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PlanoRefeicaoRow[];
    },
  });

export type ExercicioRow = {
  id: number;
  nome: string;
  descricao: string | null;
  equipamento: string;
  gif_url: string | null;
  grupo_muscular: string | null;
  nivel: string;
  tipo_midia: string;
  video_url: string | null;
};

export const exerciciosQuery = queryOptions({
  queryKey: ["exercicios"],
  queryFn: async (): Promise<ExercicioRow[]> => {
    const { data, error } = await supabase
      .from("exercicios")
      .select("id,nome,grupo_muscular,nivel,equipamento,gif_url,video_url,tipo_midia,descricao")
      .order("nome", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ExercicioRow[];
  },
  staleTime: 10 * 60 * 1000,
});

// ---------- Conclusões de treino / Adesão alimentar ----------

export type ConclusaoTreinoRow = {
  id: string;
  plano_id: string;
  aluno_id: string;
  dia_semana: number;
  data: string;
};

export const conclusoesTreinoQuery = (planoId: string, alunoId: string, days = 30) =>
  queryOptions({
    queryKey: ["conclusoes-treino", planoId, alunoId, days],
    queryFn: async (): Promise<ConclusaoTreinoRow[]> => {
      const desde = new Date();
      desde.setDate(desde.getDate() - days);
      const { data, error } = await supabase
        .from("plano_treino_conclusoes")
        .select("id,plano_id,aluno_id,dia_semana,data")
        .eq("plano_id", planoId)
        .eq("aluno_id", alunoId)
        .gte("data", desde.toISOString().slice(0, 10))
        .order("data", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ConclusaoTreinoRow[];
    },
  });

export type AdesaoAlimentarRow = {
  id: string;
  plano_id: string;
  aluno_id: string;
  data: string;
};

export const adesaoAlimentarQuery = (planoId: string, alunoId: string, days = 30) =>
  queryOptions({
    queryKey: ["adesao-alimentar", planoId, alunoId, days],
    queryFn: async (): Promise<AdesaoAlimentarRow[]> => {
      const desde = new Date();
      desde.setDate(desde.getDate() - days);
      const { data, error } = await supabase
        .from("plano_alimentar_adesao")
        .select("id,plano_id,aluno_id,data")
        .eq("plano_id", planoId)
        .eq("aluno_id", alunoId)
        .gte("data", desde.toISOString().slice(0, 10))
        .order("data", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdesaoAlimentarRow[];
    },
  });

// ---------- Fase 5: Refeições com IA ----------

export type RefeicaoTipo = "cafe_da_manha" | "almoco" | "jantar" | "lanche";

export type RefeicaoRow = {
  id: string;
  user_id: string;
  data: string;
  tipo: RefeicaoTipo;
  foto_url: string | null;
  processado_por_ia: boolean;
  confirmado_pelo_usuario: boolean;
  calorias_total: number;
  proteinas_total: number;
  carboidratos_total: number;
  gorduras_total: number;
  created_at: string;
  updated_at: string;
};

export type ItemRefeicaoRow = {
  id: string;
  refeicao_id: string;
  nome_alimento: string;
  quantidade_gramas: number | null;
  calorias: number | null;
  proteinas: number | null;
  carboidratos: number | null;
  gorduras: number | null;
  confianca_ia: number | null;
  created_at: string;
};

export type RefeicaoComItensRow = RefeicaoRow & { itens: ItemRefeicaoRow[] };

export type MacrosTotais = {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};

export function calcularMacrosTotais(itens: ItemRefeicaoRow[]): MacrosTotais {
  return itens.reduce(
    (acc, item) => ({
      calorias: acc.calorias + (item.calorias ?? 0),
      proteinas: acc.proteinas + (item.proteinas ?? 0),
      carboidratos: acc.carboidratos + (item.carboidratos ?? 0),
      gorduras: acc.gorduras + (item.gorduras ?? 0),
    }),
    { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 },
  );
}

export const refeicoesDataQuery = (userId: string, data: string) =>
  queryOptions({
    queryKey: ["refeicoes", userId, "data", data],
    queryFn: async (): Promise<RefeicaoRow[]> => {
      const { data: rows, error } = await supabase
        .from("refeicoes")
        .select(
          "id,user_id,data,tipo,foto_url,processado_por_ia,confirmado_pelo_usuario,calorias_total,proteinas_total,carboidratos_total,gorduras_total,created_at,updated_at",
        )
        .eq("user_id", userId)
        .eq("data", data)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (rows ?? []) as RefeicaoRow[];
    },
  });

export const refeicaoComItensQuery = (refeicaoId: string) =>
  queryOptions({
    queryKey: ["refeicao-com-itens", refeicaoId],
    queryFn: async (): Promise<RefeicaoComItensRow> => {
      const { data, error } = await supabase
        .from("refeicoes")
        .select(
          "id,user_id,data,tipo,foto_url,processado_por_ia,confirmado_pelo_usuario,calorias_total,proteinas_total,carboidratos_total,gorduras_total,created_at,updated_at,itens_refeicao(id,refeicao_id,nome_alimento,quantidade_gramas,calorias,proteinas,carboidratos,gorduras,confianca_ia,created_at)",
        )
        .eq("id", refeicaoId)
        .single();
      if (error) throw error;
      const { itens_refeicao: itens, ...refeicao } = data as RefeicaoRow & {
        itens_refeicao: ItemRefeicaoRow[];
      };
      return { ...refeicao, itens: itens ?? [] };
    },
  });

export const refeicaoHistoricoQuery = (userId: string, dataInicio: string, dataFim: string) =>
  queryOptions({
    queryKey: ["refeicoes", userId, "historico", dataInicio, dataFim],
    queryFn: async (): Promise<RefeicaoRow[]> => {
      const { data, error } = await supabase
        .from("refeicoes")
        .select(
          "id,user_id,data,tipo,foto_url,processado_por_ia,confirmado_pelo_usuario,calorias_total,proteinas_total,carboidratos_total,gorduras_total,created_at,updated_at",
        )
        .eq("user_id", userId)
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RefeicaoRow[];
    },
  });

export const dietasQuery = (params: { categoria: string; genero: string }) =>
  queryOptions({
    queryKey: ["dietas", params],
    queryFn: async (): Promise<{ refeicoes: DietaRow[]; dicas: DietaDicaRow[] }> => {
      const [refRes, dicasRes] = await Promise.all([
        supabase
          .from("dietas")
          .select("id,categoria,genero,fase,refeicao,horario,opcao,descricao,kcal,proteina_g,ordem")
          .eq("categoria", params.categoria)
          .eq("genero", params.genero)
          .order("ordem", { ascending: true })
          .order("opcao", { ascending: true })
          .limit(300),
        supabase
          .from("dietas_dicas")
          .select("id,dica,ordem")
          .eq("genero", params.genero)
          .order("ordem", { ascending: true })
          .limit(20),
      ]);
      if (refRes.error) throw refRes.error;
      if (dicasRes.error) throw dicasRes.error;
      return {
        refeicoes: (refRes.data ?? []) as DietaRow[],
        dicas: (dicasRes.data ?? []) as DietaDicaRow[],
      };
    },
    staleTime: 10 * 60 * 1000,
  });
