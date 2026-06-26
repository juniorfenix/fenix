import { q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./router-CJeOYY3V.mjs";
function isoDaysAgo(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE");
}
const profileQuery = (userId) => queryOptions({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("profiles").select(
      "display_name,current_weight,goal_weight,daily_calorie_goal,height,age,gender,activity_level,onboarding_complete,has_seen_welcome"
    ).eq("id", userId).single();
    if (error) throw error;
    return data;
  }
});
const weightsQuery = (userId) => queryOptions({
  queryKey: ["weights", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("weight_logs").select("logged_date,weight").eq("user_id", userId).order("logged_date", { ascending: true }).limit(30);
    if (error) throw error;
    return (data ?? []).map((r) => ({ logged_date: r.logged_date, weight: Number(r.weight) }));
  }
});
const mealsRecentQuery = (userId) => queryOptions({
  queryKey: ["meals", userId, "recent30"],
  queryFn: async () => {
    const { data, error } = await supabase.from("diario_alimentar").select("id,nome,calorias,refeicao,data,created_at").eq("user_id", userId).gte("data", isoDaysAgo(30)).order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.nome,
      calories: r.calorias,
      meal_type: r.refeicao ?? "",
      logged_date: r.data,
      created_at: r.created_at ?? ""
    }));
  }
});
const badgesQuery = (userId) => queryOptions({
  queryKey: ["badges", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("badges").select("badge_type").eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => r.badge_type);
  }
});
const guiasMentaisQuery = queryOptions({
  queryKey: ["guias_mentais"],
  queryFn: async () => {
    const { data, error } = await supabase.from("guias_mentais").select("id,chave,titulo,descricao,conteudo,ordem").order("ordem", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const treinosWeekQuery = (params) => queryOptions({
  queryKey: ["treinos-week", params],
  queryFn: async () => {
    const { data, error } = await supabase.from("treinos").select(
      "id,nivel,genero,local,dia_semana,exercicio,series_repeticoes,observacoes,ordem,url_midia,instrucao,dica_seguranca"
    ).eq("nivel", params.nivel).eq("genero", params.genero).eq("local", params.local).order("dia_semana", { ascending: true }).order("ordem", { ascending: true }).limit(300);
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const perfilQuery = (userId) => queryOptions({
  queryKey: ["perfil", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("perfis").select("id,nome,papel").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  }
});
const instrutorAlunosQuery = (instrutorId) => queryOptions({
  queryKey: ["instrutor-alunos", instrutorId],
  queryFn: async () => {
    const { data, error } = await supabase.from("instrutores_alunos").select("id,aluno_id,created_at,perfis!instrutores_alunos_aluno_id_fkey(nome)").eq("instrutor_id", instrutorId).order("created_at", { ascending: true });
    if (error) throw error;
    const rows = data ?? [];
    const alunoIds = rows.map((r) => r.aluno_id);
    const [profilesMap, treinoMap, dietaMap] = await Promise.all([
      profilesById(alunoIds),
      ultimoTreinoPorAluno(instrutorId, alunoIds),
      ultimaDietaPorAluno(instrutorId, alunoIds)
    ]);
    return rows.map((row) => {
      const r = row;
      const profile = profilesMap.get(r.aluno_id);
      return {
        id: r.id,
        aluno_id: r.aluno_id,
        aluno_nome: r.perfis?.nome ?? profile?.display_name ?? null,
        aluno_email: profile?.email ?? null,
        created_at: r.created_at ?? "",
        ultimo_treino_em: treinoMap.get(r.aluno_id) ?? null,
        ultima_dieta_em: dietaMap.get(r.aluno_id) ?? null
      };
    });
  }
});
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const alunosBuscaQuery = (instrutorId, termo) => queryOptions({
  queryKey: ["alunos-busca", instrutorId, termo.trim()],
  queryFn: async () => {
    const clean = termo.trim();
    if (!clean || clean.length < 2 && !UUID_RE.test(clean)) return [];
    const queryProfiles = async (column) => {
      const query = supabase.from("profiles").select("id,display_name,email").limit(8);
      if (column === "id") return query.eq("id", clean);
      return query.ilike(column, `%${clean}%`);
    };
    const profileRequests = UUID_RE.test(clean) ? [queryProfiles("id")] : [queryProfiles("display_name"), queryProfiles("email")];
    const profileResponses = await Promise.all(profileRequests);
    const firstError = profileResponses.find((res) => res.error)?.error;
    if (firstError) throw firstError;
    const profiles = /* @__PURE__ */ new Map();
    for (const res of profileResponses) {
      for (const p of res.data ?? []) profiles.set(p.id, p);
    }
    const ids = [...profiles.keys()];
    if (ids.length === 0) return [];
    const [{ data: perfis, error: perfilError }, { data: vinculos, error: vinculoError }] = await Promise.all([
      supabase.from("perfis").select("id,nome,papel").in("id", ids),
      supabase.from("instrutores_alunos").select("aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", ids)
    ]);
    if (perfilError) throw perfilError;
    if (vinculoError) throw vinculoError;
    const perfilMap = new Map((perfis ?? []).map((p) => [p.id, p]));
    const vinculados = new Set((vinculos ?? []).map((v) => v.aluno_id));
    return ids.map((id) => {
      const profile = profiles.get(id);
      const perfil = perfilMap.get(id);
      return {
        id,
        nome: perfil?.nome ?? profile?.display_name ?? null,
        email: profile?.email ?? null,
        papel: perfil?.papel ?? "aluno",
        vinculado: vinculados.has(id)
      };
    }).filter((aluno) => aluno.papel === "aluno");
  }
});
async function profilesById(ids) {
  const map = /* @__PURE__ */ new Map();
  if (ids.length === 0) return map;
  const { data, error } = await supabase.from("profiles").select("id,display_name,email").in("id", ids);
  if (error) throw error;
  for (const profile of data ?? []) map.set(profile.id, profile);
  return map;
}
async function ultimoTreinoPorAluno(instrutorId, alunoIds) {
  const map = /* @__PURE__ */ new Map();
  if (alunoIds.length === 0) return map;
  const { data: planos, error: planosError } = await supabase.from("planos_treino").select("id,aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", alunoIds);
  if (planosError) throw planosError;
  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;
  const { data, error } = await supabase.from("plano_treino_conclusoes").select("plano_id,aluno_id,data,created_at").in("plano_id", planoIds).order("created_at", { ascending: false }).limit(80);
  if (error) throw error;
  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}
async function ultimaDietaPorAluno(instrutorId, alunoIds) {
  const map = /* @__PURE__ */ new Map();
  if (alunoIds.length === 0) return map;
  const { data: planos, error: planosError } = await supabase.from("planos_alimentares").select("id,aluno_id").eq("instrutor_id", instrutorId).in("aluno_id", alunoIds);
  if (planosError) throw planosError;
  const planoAluno = new Map((planos ?? []).map((p) => [p.id, p.aluno_id]));
  const planoIds = [...planoAluno.keys()];
  if (planoIds.length === 0) return map;
  const { data, error } = await supabase.from("plano_alimentar_adesao").select("plano_id,aluno_id,data,created_at").in("plano_id", planoIds).order("created_at", { ascending: false }).limit(80);
  if (error) throw error;
  for (const row of data ?? []) {
    if (!map.has(row.aluno_id)) map.set(row.aluno_id, row.data);
  }
  return map;
}
const avisosInstrutorQuery = (instrutorId) => queryOptions({
  queryKey: ["avisos-instrutor", instrutorId],
  queryFn: async () => {
    const { data, error } = await supabase.from("notificacoes_instrutor").select(
      "id,tipo,aluno_id,plano_id,titulo,corpo,data_ref,lida,created_at,perfis!notificacoes_instrutor_aluno_id_fkey(nome)"
    ).eq("instrutor_id", instrutorId).order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    return (data ?? []).map((row) => {
      const r = row;
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
        created_at: r.created_at
      };
    });
  },
  refetchInterval: 3e4
});
const planosTreinoAlunoQuery = (alunoId) => queryOptions({
  queryKey: ["planos-treino-aluno", alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino").select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at").eq("aluno_id", alunoId).eq("ativo", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planosTreinoInstrutorQuery = (instrutorId, alunoId) => queryOptions({
  queryKey: ["planos-treino-instrutor", instrutorId, alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino").select("id,instrutor_id,aluno_id,nome,nivel,dias_semana,ativo,created_at").eq("instrutor_id", instrutorId).eq("aluno_id", alunoId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planoExerciciosQuery = (planoId) => queryOptions({
  queryKey: ["plano-exercicios", planoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_treino_exercicios").select(
      "id,plano_id,dia_semana,series,repeticoes,descanso_seg,ordem,observacoes,exercicios(id,nome,grupo_muscular,gif_url,video_url,tipo_midia)"
    ).eq("plano_id", planoId).order("dia_semana", { ascending: true }).order("ordem", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => {
      const r = row;
      const { exercicios, ...rest } = r;
      return {
        ...rest,
        exercicio: exercicios
      };
    });
  }
});
const planosAlimentaresAlunoQuery = (alunoId) => queryOptions({
  queryKey: ["planos-alimentares-aluno", alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_alimentares").select(
      "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at"
    ).eq("aluno_id", alunoId).eq("ativo", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planosAlimentaresInstrutorQuery = (instrutorId, alunoId) => queryOptions({
  queryKey: ["planos-alimentares-instrutor", instrutorId, alunoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("planos_alimentares").select(
      "id,instrutor_id,aluno_id,nome,descricao,meta_kcal,meta_proteinas_g,meta_carboidratos_g,meta_gorduras_g,ativo,created_at"
    ).eq("instrutor_id", instrutorId).eq("aluno_id", alunoId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const planoRefeicoesQuery = (planoId) => queryOptions({
  queryKey: ["plano-refeicoes", planoId],
  queryFn: async () => {
    const { data, error } = await supabase.from("plano_alimentar_refeicoes").select(
      "id,plano_id,refeicao,horario,descricao,kcal,proteina_g,ordem,observacoes,created_at"
    ).eq("plano_id", planoId).order("ordem", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
});
const exerciciosQuery = queryOptions({
  queryKey: ["exercicios"],
  queryFn: async () => {
    const { data, error } = await supabase.from("exercicios").select("id,nome,grupo_muscular,nivel,equipamento,gif_url,video_url,tipo_midia,descricao").order("nome", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 10 * 60 * 1e3
});
const conclusoesTreinoQuery = (planoId, alunoId, days = 30) => queryOptions({
  queryKey: ["conclusoes-treino", planoId, alunoId, days],
  queryFn: async () => {
    const desde = /* @__PURE__ */ new Date();
    desde.setDate(desde.getDate() - days);
    const { data, error } = await supabase.from("plano_treino_conclusoes").select("id,plano_id,aluno_id,dia_semana,data").eq("plano_id", planoId).eq("aluno_id", alunoId).gte("data", desde.toISOString().slice(0, 10)).order("data", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
const adesaoAlimentarQuery = (planoId, alunoId, days = 30) => queryOptions({
  queryKey: ["adesao-alimentar", planoId, alunoId, days],
  queryFn: async () => {
    const desde = /* @__PURE__ */ new Date();
    desde.setDate(desde.getDate() - days);
    const { data, error } = await supabase.from("plano_alimentar_adesao").select("id,plano_id,aluno_id,data").eq("plano_id", planoId).eq("aluno_id", alunoId).gte("data", desde.toISOString().slice(0, 10)).order("data", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
});
export {
  perfilQuery as a,
  badgesQuery as b,
  planosTreinoAlunoQuery as c,
  planosAlimentaresAlunoQuery as d,
  planoExerciciosQuery as e,
  adesaoAlimentarQuery as f,
  guiasMentaisQuery as g,
  planoRefeicoesQuery as h,
  conclusoesTreinoQuery as i,
  instrutorAlunosQuery as j,
  alunosBuscaQuery as k,
  avisosInstrutorQuery as l,
  mealsRecentQuery as m,
  exerciciosQuery as n,
  planosTreinoInstrutorQuery as o,
  profileQuery as p,
  planosAlimentaresInstrutorQuery as q,
  treinosWeekQuery as t,
  weightsQuery as w
};
