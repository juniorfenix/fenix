/**
 * Atualiza gif_url de todos os exercícios no Supabase usando a API pública
 * do ExerciseDB OSS (https://oss.exercisedb.dev).
 *
 * Uso:
 *   bun run scripts/seed-exercicios-gifs.ts
 *
 * Requer: VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env
 * Opcional: SUPABASE_SERVICE_ROLE_KEY no .env (necessário se a tabela
 *           exercicios tiver RLS ativada)
 */

import { createClient } from "@supabase/supabase-js";

// ── Variáveis de ambiente (carregadas via --env-file do Node) ──────────────────

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "❌ Variáveis de ambiente não encontradas.\n" +
    "   Rode com: node --env-file=.env --import tsx scripts/seed-exercicios-gifs.ts",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Tabela de mapeamento PT-BR → inglês (nomes na API ExerciseDB) ─────────────

const MAPA: Record<string, string> = {
  // PEITO
  "Supino com barra": "barbell bench press",
  "Supino inclinado com halteres": "dumbbell incline bench press",
  "Supino declinado com barra": "barbell decline bench press",
  "Crucifixo reto com halteres": "dumbbell fly",
  "Crucifixo na polia": "cable fly",
  "Flexão de braço": "push-up",
  "Crossover na polia alta": "cable crossover",
  "Pullover com halter": "dumbbell pullover",
  // COSTAS
  "Puxada frontal": "lat pulldown",
  "Remada curvada com barra": "barbell bent over row",
  "Remada unilateral com halter": "dumbbell one arm row",
  "Barra fixa": "pull-up",
  "Remada na polia baixa": "cable seated row",
  "Levantamento terra": "barbell deadlift",
  "Puxada neutra fechada": "cable close grip lat pulldown",
  "Hiperextensão lombar": "hyperextension",
  // PERNAS
  "Agachamento livre": "barbell squat",
  "Leg press": "leg press",
  "Cadeira extensora": "leg extension",
  "Mesa flexora deitado": "lying leg curl",
  "Avanço com halteres": "dumbbell lunge",
  "Stiff com barra": "barbell romanian deadlift",
  "Agachamento búlgaro": "split squat",
  "Panturrilha em pé na máquina": "calf raise",
  "Panturrilha sentado": "seated calf raise",
  "Adução de quadril na máquina": "adductor",
  // OMBRO
  "Desenvolvimento com halteres": "dumbbell shoulder press",
  "Desenvolvimento militar com barra": "barbell overhead press",
  "Elevação lateral com halteres": "dumbbell lateral raise",
  "Elevação frontal com halteres": "dumbbell front raise",
  "Encolhimento de ombros": "dumbbell shrug",
  "Elevação posterior com halteres": "reverse fly",
  // BÍCEPS
  "Rosca direta com barra": "barbell curl",
  "Rosca alternada com halteres": "dumbbell alternate bicep curl",
  "Rosca concentrada": "concentration curl",
  "Rosca na polia": "cable curl",
  "Rosca martelo": "hammer curl",
  // TRÍCEPS
  "Tríceps na polia": "cable pushdown",
  "Tríceps francês com halter": "dumbbell tricep extension",
  "Mergulho entre bancos": "triceps dip",
  "Tríceps testa com barra": "barbell skullcrusher",
  "Extensão de tríceps acima da cabeça": "overhead tricep extension",
  // CORE
  "Prancha": "plank",
  "Abdominal crunch": "crunch",
  "Abdominal bicicleta": "bicycle crunch",
  "Elevação de pernas suspenso": "hanging leg raise",
  "Russian twist": "russian twist",
  "Abdominal roda": "ab wheel rollout",
  // GLÚTEO
  "Hip thrust com barra": "barbell hip thrust",
  "Glúteo 4 apoios": "donkey kick",
  "Abdução de quadril na máquina": "hip abduction",
  "Ponte de glúteos": "glute bridge",
  "Afundo com barra": "barbell lunge",
  "Coice de glúteo no cabo": "cable kickback",
};

// ── Tipos da API ───────────────────────────────────────────────────────────────

type ApiExercise = {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
};

type ApiResponse = {
  success: boolean;
  meta: { total: number; hasNextPage: boolean; nextCursor?: string };
  data: ApiExercise[];
};

// ── Paginação por cursor (máx 25/página) ───────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url: string, attempt = 1): Promise<ApiResponse> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (res.status === 429) {
    const wait = attempt * 2000;
    process.stdout.write(`\r  Rate limit — aguardando ${wait / 1000}s (tentativa ${attempt})…`);
    await sleep(wait);
    return fetchPage(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<ApiResponse>;
}

async function fetchAllExercises(): Promise<ApiExercise[]> {
  const BASE = "https://oss.exercisedb.dev/api/v1/exercises?limit=25";
  const all: ApiExercise[] = [];
  let cursor: string | undefined;
  let page = 0;
  let maxTotal = Infinity;

  while (true) {
    const url = cursor ? `${BASE}&cursor=${cursor}` : BASE;
    const json = await fetchPage(url);

    // Captura o total real na primeira página e para quando atingi-lo
    if (page === 0) maxTotal = json.meta.total;
    all.push(...json.data);
    page++;
    process.stdout.write(`\r  Página ${page} — ${all.length}/${maxTotal} exercícios`);

    if (all.length >= maxTotal) break;
    if (!json.meta.hasNextPage || !json.meta.nextCursor) break;
    cursor = json.meta.nextCursor;

    await sleep(400);
  }
  process.stdout.write("\n");
  return all;
}

// ── Match fuzzy por palavras (fallback) ────────────────────────────────────────

function scoreMatch(query: string, candidate: string): number {
  const words = query.toLowerCase().split(/[\s-]+/);
  const cand = candidate.toLowerCase();
  const hits = words.filter((w) => w.length > 2 && cand.includes(w));
  return hits.length / words.length;
}

function findBestMatch(
  query: string,
  exercises: ApiExercise[],
  threshold = 0.6,
): ApiExercise | undefined {
  let best: ApiExercise | undefined;
  let bestScore = 0;
  for (const ex of exercises) {
    const score = scoreMatch(query, ex.name);
    if (score > bestScore) {
      bestScore = score;
      best = ex;
    }
  }
  return bestScore >= threshold ? best : undefined;
}

// ── Resolve gifUrl ─────────────────────────────────────────────────────────────

function resolveGifUrl(ex: ApiExercise): string {
  if (ex.gifUrl?.startsWith("http")) return ex.gifUrl;
  return `https://static.exercisedb.dev/media/${ex.exerciseId}.gif`;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Busca todos os exercícios da API OSS (cursor pagination)
  console.log("⬇  Buscando todos os exercícios em https://oss.exercisedb.dev …");
  const apiExercises = await fetchAllExercises();
  console.log(`✅ ${apiExercises.length} exercícios carregados da API.\n`);

  // Índice: nome em minúsculas → exercício
  const byExactName = new Map<string, ApiExercise>();
  for (const ex of apiExercises) {
    byExactName.set(ex.name.toLowerCase().trim(), ex);
  }

  // 2. Busca exercícios do Supabase
  const { data: dbExercicios, error: dbErr } = await supabase
    .from("exercicios")
    .select("id, nome");
  if (dbErr) throw new Error(`Supabase: ${dbErr.message}`);

  // 3. Match e update
  const matched: string[] = [];
  const fuzzyMatched: string[] = [];
  const missed: string[] = [];

  for (const row of dbExercicios ?? []) {
    const englishName = MAPA[row.nome];
    let apiEx: ApiExercise | undefined;
    let matchType = "exato";

    if (englishName) {
      apiEx = byExactName.get(englishName.toLowerCase());
      if (!apiEx) {
        // Sem match exato → tenta fuzzy com o nome inglês do mapa
        apiEx = findBestMatch(englishName, apiExercises);
        matchType = "fuzzy-mapa";
      }
    }

    if (!apiEx) {
      // Sem mapa → tenta fuzzy com o nome em PT-BR
      apiEx = findBestMatch(row.nome, apiExercises, 0.5);
      matchType = "fuzzy-pt";
    }

    if (!apiEx) {
      missed.push(row.nome);
      continue;
    }

    const gifUrl = resolveGifUrl(apiEx);

    const { error: updateErr } = await supabase
      .from("exercicios")
      .update({ gif_url: gifUrl, tipo_midia: "gif" })
      .eq("id", row.id);

    if (updateErr) {
      console.error(`  ❌ Erro ao atualizar "${row.nome}": ${updateErr.message}`);
      missed.push(row.nome);
    } else {
      const line = `  ${row.nome}  →  ${apiEx.name}  [${matchType}]`;
      if (matchType === "exato") {
        matched.push(line);
      } else {
        fuzzyMatched.push(line);
      }
    }
  }

  // 4. Relatório
  console.log("=".repeat(70));
  console.log(`✅ MATCH EXATO (${matched.length})`);
  for (const m of matched) console.log(m);

  if (fuzzyMatched.length > 0) {
    console.log(`\n🔶 MATCH FUZZY — confira se estão corretos (${fuzzyMatched.length})`);
    for (const m of fuzzyMatched) console.log(m);
  }

  if (missed.length > 0) {
    console.log(`\n❌ SEM MATCH — gif_url não atualizado (${missed.length})`);
    for (const m of missed) console.log(`  ${m}`);
    console.log("\nDica: adicione esses exercícios ao MAPA no topo do script e rode novamente.");
  }

  console.log("=".repeat(70));
  console.log(
    `\nFim: ${matched.length + fuzzyMatched.length} atualizados, ${missed.length} sem match.`,
  );
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
