/**
 * Aplica as gif_urls corretas para todos os 54 exercícios do banco.
 * Uso: node --env-file=.env --experimental-strip-types scripts/apply-gif-urls.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Variáveis de ambiente não encontradas.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mapeamento nome PT-BR → exerciseId da ExerciseDB OSS
// GIF URL: https://static.exercisedb.dev/media/{exerciseId}.gif
const UPDATES: Record<string, string> = {
  // PEITO
  "Supino com barra": "EIeI8Vf",
  "Supino inclinado com halteres": "ns0SIbU",
  "Supino declinado com barra": "GrO65fd",
  "Crucifixo reto com halteres": "yz9nUhF",
  "Crucifixo na polia": "xLYSdtg",
  "Flexão de braço": "I4hDWkc",
  "Crossover na polia alta": "j7XMAyn",
  "Pullover com halter": "9XjtHvS",
  // COSTAS
  "Puxada frontal": "LEprlgG",
  "Remada curvada com barra": "eZyBC3j",
  "Remada unilateral com halter": "C0MA9bC",
  "Barra fixa": "lBDjFxJ",
  "Remada na polia baixa": "fUBheHs",
  "Levantamento terra": "ila4NZS",
  "Puxada neutra fechada": "rkg41Fb",
  "Hiperextensão lombar": "zhMwOwE",
  // PERNAS
  "Agachamento livre": "qXTaZnJ",
  "Leg press": "10Z2DXU",
  "Cadeira extensora": "my33uHU",
  "Mesa flexora deitado": "17lJ1kr",
  "Avanço com halteres": "RRWFUcw",
  "Stiff com barra": "wQ2c4XD",
  "Agachamento búlgaro": "HBYyX94",
  "Panturrilha em pé na máquina": "ykUOVze",
  "Panturrilha sentado": "bOOdeyc",
  "Adução de quadril na máquina": "oHsrypV",
  // OMBRO
  "Desenvolvimento com halteres": "znQUdHY",
  "Desenvolvimento militar com barra": "kTbSH9h",
  "Elevação lateral com halteres": "DsgkuIt",
  "Elevação frontal com halteres": "3eGE2JC",
  "Encolhimento de ombros": "dG7tG5y",
  "Elevação posterior com halteres": "EAs3xL9",
  // BÍCEPS
  "Rosca direta com barra": "25GPyDY",
  "Rosca alternada com halteres": "BU15nH4",
  "Rosca concentrada": "k5IpyHg",
  "Rosca na polia": "G08RZcQ",
  "Rosca martelo": "GNhAeJ0",
  // TRÍCEPS
  "Tríceps na polia": "3ZflifB",
  "Tríceps francês com halter": "mpKZGWz",
  "Mergulho entre bancos": "Wgbn9qo",
  "Tríceps testa com barra": "h8LFzo9",
  "Extensão de tríceps acima da cabeça": "NN8nSNT",
  // CORE
  Prancha: "VBAWRPG",
  "Abdominal crunch": "kjJ3VoQ",
  "Abdominal bicicleta": "tZkGYZ9",
  "Elevação de pernas suspenso": "I3tsCnC",
  "Russian twist": "WU9BLIs",
  "Abdominal roda": "xnInPfE",
  // GLÚTEO
  "Hip thrust com barra": "qKBpF7I",
  "Glúteo 4 apoios": "OPqShYN",
  "Abdução de quadril na máquina": "CHpahtl",
  "Ponte de glúteos": "u0cNiij",
  "Afundo com barra": "t8iSghb",
  "Coice de glúteo no cabo": "HEJ6DIX",
};

async function main() {
  const CDN = "https://static.exercisedb.dev/media";
  let ok = 0,
    fail = 0;

  for (const [nome, exerciseId] of Object.entries(UPDATES)) {
    const gif_url = `${CDN}/${exerciseId}.gif`;
    const { error } = await supabase
      .from("exercicios")
      .update({ gif_url, tipo_midia: "gif" })
      .eq("nome", nome);

    if (error) {
      console.error(`  ❌ ${nome}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${nome}`);
      ok++;
    }
  }

  console.log(`\n${ok} atualizados, ${fail} erros.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
