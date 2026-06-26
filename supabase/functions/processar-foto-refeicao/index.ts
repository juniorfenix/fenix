// Edge Function: processar-foto-refeicao
// Recebe foto de refeição, chama API de visão, persiste resultado e retorna para confirmação.
//
// Secrets obrigatórios (supabase secrets set ...):
//   SUPABASE_SERVICE_ROLE_KEY  — chave service role do projeto
//   VISION_API_KEY             — chave da API de visão (ex: OpenAI, Anthropic, etc.)
//
// Secrets opcionais:
//   VISION_API_BASE_URL        — URL base da API (padrão: https://api.openai.com/v1)
//   VISION_API_MODEL           — modelo de visão (padrão: gpt-4o)

import { createClient } from "npm:@supabase/supabase-js@2";

// ─── Constantes ───────────────────────────────────────────────────────────────

const BUCKET = "fotos_refeicoes";

const TIPOS_VALIDOS = new Set(["cafe_da_manha", "almoco", "jantar", "lanche"]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ItemAlimento {
  nome_alimento: string;
  quantidade_gramas: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  confianca_ia: number;
}

interface RespostaVisao {
  alimentos: ItemAlimento[];
  calorias_total: number;
  proteinas_total: number;
  carboidratos_total: number;
  gorduras_total: number;
}

interface Payload {
  foto_url: string;
  tipo: string;
  data: string;
  refeicao_id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function erro(mensagem: string, status: number): Response {
  return jsonResponse({ success: false, error: mensagem }, status);
}

/**
 * Extrai o storage path de um foto_url.
 * Aceita path relativo ("userId/data/uuid.jpg") ou URL completa do Supabase.
 */
function extrairStoragePath(fotoUrl: string): string {
  try {
    const url = new URL(fotoUrl);
    // URL Supabase: .../storage/v1/object/{type}/fotos_refeicoes/{path}
    const match = url.pathname.match(
      /\/storage\/v1\/object\/(?:public|sign|authenticated)\/fotos_refeicoes\/(.+)/,
    );
    if (match) return match[1];
  } catch {
    // não é uma URL — trata como path relativo
  }
  return fotoUrl.replace(/^fotos_refeicoes\//, "");
}

/**
 * Valida que o storage path pertence ao usuário autenticado.
 * O path deve começar com {userId}/ (formato: {user_id}/{yyyy-mm-dd}/{uuid}.jpg).
 */
function pathPertenceAoUsuario(storagePath: string, userId: string): boolean {
  return storagePath.startsWith(`${userId}/`);
}

// ─── Integração com API de Visão ──────────────────────────────────────────────

async function analisarImagemComIA(imagemBase64: string, mimeType: string): Promise<RespostaVisao> {
  const apiKey = Deno.env.get("VISION_API_KEY");
  const baseUrl = Deno.env.get("VISION_API_BASE_URL") ?? "https://api.openai.com/v1";
  const modelo = Deno.env.get("VISION_API_MODEL") ?? "gpt-4o";

  if (!apiKey) {
    throw new Error(
      "VISION_API_KEY não configurada. Execute: supabase secrets set VISION_API_KEY=...",
    );
  }

  const promptSistema = `Você é um nutricionista especializado em análise de imagens de refeições.
Analise a imagem fornecida e identifique TODOS os alimentos visíveis.
Para cada alimento, estime a quantidade em gramas e os macronutrientes.
Retorne EXCLUSIVAMENTE um JSON válido, sem markdown, sem explicações, com este contrato exato:
{
  "alimentos": [
    {
      "nome_alimento": "string",
      "quantidade_gramas": number,
      "calorias": number,
      "proteinas": number,
      "carboidratos": number,
      "gorduras": number,
      "confianca_ia": number (entre 0 e 1)
    }
  ],
  "calorias_total": number,
  "proteinas_total": number,
  "carboidratos_total": number,
  "gorduras_total": number
}`;

  const resposta = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptSistema },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imagemBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "sem detalhes");
    throw new Error(`API de visão retornou status ${resposta.status}: ${detalhe}`);
  }

  const json = await resposta.json();
  const conteudo: string = json?.choices?.[0]?.message?.content ?? "";

  let analise: RespostaVisao;
  try {
    const jsonLimpo = conteudo
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    analise = JSON.parse(jsonLimpo);
  } catch {
    throw new Error(`Resposta da IA não é JSON válido: ${conteudo.slice(0, 200)}`);
  }

  if (!Array.isArray(analise?.alimentos)) {
    throw new Error('Resposta da IA fora do contrato esperado (campo "alimentos" ausente).');
  }

  // Recalcula totais do lado do servidor para garantir consistência
  const totais = analise.alimentos.reduce(
    (acc, item) => ({
      calorias: acc.calorias + (item.calorias ?? 0),
      proteinas: acc.proteinas + (item.proteinas ?? 0),
      carboidratos: acc.carboidratos + (item.carboidratos ?? 0),
      gorduras: acc.gorduras + (item.gorduras ?? 0),
    }),
    { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 },
  );

  return {
    alimentos: analise.alimentos,
    calorias_total: Math.round(totais.calorias * 10) / 10,
    proteinas_total: Math.round(totais.proteinas * 10) / 10,
    carboidratos_total: Math.round(totais.carboidratos * 10) / 10,
    gorduras_total: Math.round(totais.gorduras * 10) / 10,
  };
}

// ─── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return erro("Método não permitido. Use POST.", 405);
  }

  // ── 1. Autenticação via JWT ──────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return erro("Não autenticado. Envie o token JWT no header Authorization: Bearer {token}.", 401);
  }
  const jwt = authHeader.replace("Bearer ", "").trim();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    return erro(
      "Configuração interna incompleta (SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes).",
      500,
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);
  if (authError || !user) {
    return erro("Token JWT inválido ou expirado. Faça login novamente.", 401);
  }

  // ── 2. Validação de payload ──────────────────────────────────────────────────
  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return erro("Body inválido. Envie um JSON com foto_url, tipo e data.", 400);
  }

  const { foto_url, tipo, data, refeicao_id } = payload;

  if (!foto_url || typeof foto_url !== "string" || foto_url.trim() === "") {
    return erro('Campo "foto_url" é obrigatório.', 400);
  }

  if (!tipo || !TIPOS_VALIDOS.has(tipo)) {
    return erro(
      `Campo "tipo" é obrigatório e deve ser um de: ${[...TIPOS_VALIDOS].join(", ")}.`,
      400,
    );
  }

  if (!data || !DATA_REGEX.test(data)) {
    return erro('Campo "data" é obrigatório e deve estar no formato yyyy-mm-dd.', 400);
  }

  // ── 3. Verificação de posse da foto no bucket ────────────────────────────────
  const storagePath = extrairStoragePath(foto_url.trim());

  if (!pathPertenceAoUsuario(storagePath, user.id)) {
    return erro("Acesso negado. A foto não pertence ao seu espaço de armazenamento.", 403);
  }

  // ── 4. Download da imagem do bucket privado ──────────────────────────────────
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (downloadError || !downloadData) {
    return erro(
      `Não foi possível acessar a foto no bucket. Detalhe: ${downloadError?.message ?? "arquivo não encontrado"}`,
      404,
    );
  }

  const arrayBuffer = await downloadData.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...bytes));
  const mimeType = downloadData.type || "image/jpeg";

  // ── 5. Análise com IA ────────────────────────────────────────────────────────
  let analise: RespostaVisao;
  try {
    analise = await analisarImagemComIA(base64, mimeType);
  } catch (err: unknown) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return erro(`Erro ao processar imagem com IA: ${mensagem}`, 502);
  }

  // ── 6. Persistência no banco ─────────────────────────────────────────────────
  let refeicaoId = refeicao_id ?? null;

  if (refeicaoId) {
    // Atualiza refeição existente (garante ownership via user_id)
    const { error: updateError } = await supabase
      .from("refeicoes")
      .update({
        foto_url: storagePath,
        processado_por_ia: true,
        confirmado_pelo_usuario: false,
        calorias_total: analise.calorias_total,
        proteinas_total: analise.proteinas_total,
        carboidratos_total: analise.carboidratos_total,
        gorduras_total: analise.gorduras_total,
      })
      .eq("id", refeicaoId)
      .eq("user_id", user.id);

    if (updateError) {
      return erro(`Erro ao atualizar refeição no banco: ${updateError.message}`, 500);
    }

    // Remove itens anteriores para reinserir com a nova análise
    const { error: deleteError } = await supabase
      .from("itens_refeicao")
      .delete()
      .eq("refeicao_id", refeicaoId);

    if (deleteError) {
      return erro(`Erro ao limpar itens anteriores: ${deleteError.message}`, 500);
    }
  } else {
    // Cria nova refeição
    const { data: novaRefeicao, error: insertError } = await supabase
      .from("refeicoes")
      .insert({
        user_id: user.id,
        data,
        tipo,
        foto_url: storagePath,
        processado_por_ia: true,
        confirmado_pelo_usuario: false,
        calorias_total: analise.calorias_total,
        proteinas_total: analise.proteinas_total,
        carboidratos_total: analise.carboidratos_total,
        gorduras_total: analise.gorduras_total,
      })
      .select("id")
      .single();

    if (insertError || !novaRefeicao) {
      return erro(`Erro ao criar refeição no banco: ${insertError?.message ?? "sem retorno"}`, 500);
    }

    refeicaoId = novaRefeicao.id;
  }

  // Insere os itens identificados pela IA
  const itensParaInserir = analise.alimentos.map((item) => ({
    refeicao_id: refeicaoId!,
    nome_alimento: item.nome_alimento,
    quantidade_gramas: item.quantidade_gramas ?? null,
    calorias: item.calorias ?? null,
    proteinas: item.proteinas ?? null,
    carboidratos: item.carboidratos ?? null,
    gorduras: item.gorduras ?? null,
    confianca_ia: item.confianca_ia ?? null,
  }));

  const { error: itensError } = await supabase.from("itens_refeicao").insert(itensParaInserir);

  if (itensError) {
    return erro(`Erro ao inserir itens da refeição: ${itensError.message}`, 500);
  }

  // ── 7. Retorna refeição completa para a UI confirmar/editar ──────────────────
  const { data: refeicaoCompleta, error: fetchError } = await supabase
    .from("refeicoes")
    .select(
      `
      id,
      user_id,
      data,
      tipo,
      foto_url,
      processado_por_ia,
      confirmado_pelo_usuario,
      calorias_total,
      proteinas_total,
      carboidratos_total,
      gorduras_total,
      created_at,
      updated_at,
      itens_refeicao (
        id,
        nome_alimento,
        quantidade_gramas,
        calorias,
        proteinas,
        carboidratos,
        gorduras,
        confianca_ia,
        created_at
      )
    `,
    )
    .eq("id", refeicaoId)
    .single();

  if (fetchError || !refeicaoCompleta) {
    return erro(`Erro ao buscar refeição criada: ${fetchError?.message ?? "não encontrada"}`, 500);
  }

  return jsonResponse({ success: true, data: refeicaoCompleta });
});
