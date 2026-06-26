import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/calories";

// ─── Constants ────────────────────────────────────────────────────────────────

const BUCKET = "fotos_refeicoes";
const TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024; // 10 MB

const MIME_PARA_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

const TIPOS_ACEITOS = new Set(Object.keys(MIME_PARA_EXT));

// ─── Error ────────────────────────────────────────────────────────────────────

export type FotoRefeicaoErrorCode =
  | "NAO_AUTENTICADO"
  | "ARQUIVO_INVALIDO"
  | "ARQUIVO_MUITO_GRANDE"
  | "UPLOAD_FALHOU"
  | "EDGE_FUNCTION_FALHOU";

export class FotoRefeicaoError extends Error {
  constructor(
    message: string,
    public readonly code: FotoRefeicaoErrorCode,
  ) {
    super(message);
    this.name = "FotoRefeicaoError";
  }
}

/** Extrai mensagem amigável de qualquer erro lançado pelo helper. */
export function mensagemErroFoto(error: unknown): string {
  if (error instanceof FotoRefeicaoError) return error.message;
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao processar a foto.";
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Mapeia para os valores que a Edge Function aceita no campo `tipo`. */
export type TipoRefeicao = "cafe_da_manha" | "almoco" | "jantar" | "lanche";

export interface ItemAlimento {
  id?: string;
  nome_alimento: string;
  quantidade_gramas: number | null;
  calorias: number | null;
  proteinas: number | null;
  carboidratos: number | null;
  gorduras: number | null;
  confianca_ia: number | null;
  created_at?: string;
}

export interface RefeicaoAnalisada {
  id: string;
  user_id: string;
  data: string;
  tipo: string;
  foto_url: string;
  processado_por_ia: boolean;
  confirmado_pelo_usuario: boolean;
  calorias_total: number;
  proteinas_total: number;
  carboidratos_total: number;
  gorduras_total: number;
  created_at: string;
  updated_at: string;
  itens_refeicao: ItemAlimento[];
}

export interface ResultadoUpload {
  /** Storage path relativo: `{user_id}/{yyyy-mm-dd}/{uuid}.{ext}` */
  storagePath: string;
}

export interface ParamsProcessarFoto {
  storagePath: string;
  tipo: TipoRefeicao;
  /** Defaults to today (local date). */
  data?: string;
  /** Passa ID de refeição existente para re-processar. */
  refeicaoId?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Valida tipo e tamanho do arquivo antes de qualquer operação de rede.
 * Lança `FotoRefeicaoError` se inválido.
 */
export function validarArquivo(file: File): void {
  if (!TIPOS_ACEITOS.has(file.type)) {
    throw new FotoRefeicaoError(
      "Formato não aceito. Envie uma foto JPEG, PNG ou WebP.",
      "ARQUIVO_INVALIDO",
    );
  }
  if (file.size > TAMANHO_MAXIMO_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new FotoRefeicaoError(
      `A foto tem ${mb} MB. O limite é 10 MB. Reduza a resolução antes de enviar.`,
      "ARQUIVO_MUITO_GRANDE",
    );
  }
}

// ─── Path ─────────────────────────────────────────────────────────────────────

function gerarPath(userId: string, mimeType: string): string {
  const ext = MIME_PARA_EXT[mimeType] ?? "jpg";
  const uuid = crypto.randomUUID();
  const data = todayISO(); // "yyyy-mm-dd" sem UTC bugs
  return `${userId}/${data}/${uuid}.${ext}`;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Faz upload de uma foto para o bucket privado `fotos_refeicoes`.
 *
 * @returns `storagePath` — path relativo a ser passado para `processarFotoRefeicao`.
 *   Não é uma URL pública (o bucket é privado).
 */
export async function uploadFotoRefeicao(file: File): Promise<ResultadoUpload> {
  validarArquivo(file);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new FotoRefeicaoError(
      "Você precisa estar autenticado para enviar fotos.",
      "NAO_AUTENTICADO",
    );
  }

  const storagePath = gerarPath(session.user.id, file.type);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: false });

  if (error) {
    throw new FotoRefeicaoError(
      `Não foi possível enviar a foto: ${error.message}`,
      "UPLOAD_FALHOU",
    );
  }

  return { storagePath };
}

// ─── Edge Function ────────────────────────────────────────────────────────────

/**
 * Chama a Edge Function `processar-foto-refeicao` com o path do arquivo
 * já enviado ao bucket.
 * O token JWT do usuário é incluído automaticamente pelo cliente Supabase.
 */
export async function processarFotoRefeicao({
  storagePath,
  tipo,
  data,
  refeicaoId,
}: ParamsProcessarFoto): Promise<RefeicaoAnalisada> {
  const { data: result, error } = await supabase.functions.invoke<{
    success: boolean;
    data?: RefeicaoAnalisada;
    error?: string;
  }>("processar-foto-refeicao", {
    body: {
      foto_url: storagePath,
      tipo,
      data: data ?? todayISO(),
      ...(refeicaoId ? { refeicao_id: refeicaoId } : {}),
    },
  });

  if (error) {
    throw new FotoRefeicaoError(`Erro ao analisar foto: ${error.message}`, "EDGE_FUNCTION_FALHOU");
  }

  if (!result?.success || !result.data) {
    throw new FotoRefeicaoError(
      result?.error ?? "Resposta inesperada da análise de foto.",
      "EDGE_FUNCTION_FALHOU",
    );
  }

  return result.data;
}

// ─── Combined ─────────────────────────────────────────────────────────────────

/**
 * Fluxo completo: valida → faz upload → chama Edge Function.
 * Use esta função na tela de alimentação para processar a foto em uma etapa.
 */
export async function uploadEProcessarFoto(
  file: File,
  tipo: TipoRefeicao,
  refeicaoId?: string,
): Promise<RefeicaoAnalisada> {
  const { storagePath } = await uploadFotoRefeicao(file);
  return processarFotoRefeicao({ storagePath, tipo, refeicaoId });
}
