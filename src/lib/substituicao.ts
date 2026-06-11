// Pure logic for the smart food substitution algorithm.
// No React, no Supabase — easy to unit test and reuse.

export type Alimento = {
  id: string;
  nome: string;
  categoria: string;
  porcao_referencia_g: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};

export type Macros = { kcal: number; p: number; c: number; g: number };

export type Candidato = {
  alimento: Alimento;
  gramas: number;
  delta: Macros; // % difference vs original (kcal/p/c/g)
  within10pct: boolean;
};

export const MEAL_LABELS: Record<string, string> = {
  cafe: "Café da manhã",
  lanche_manha: "Lanche da manhã",
  almoco: "Almoço",
  lanche_tarde: "Lanche da tarde",
  jantar: "Jantar",
  ceia: "Ceia",
};

export const MEAL_KEYS = [
  "cafe",
  "lanche_manha",
  "almoco",
  "lanche_tarde",
  "jantar",
  "ceia",
] as const;

export const CATEGORIA_LABELS: Record<string, string> = {
  proteina: "Proteína",
  carboidrato: "Carboidrato",
  gordura: "Gordura",
  vegetal: "Vegetal",
  fruta: "Fruta",
  laticinio: "Laticínio",
  bebida: "Bebida",
  outros: "Outros",
};

/** Macros for a given amount in grams of an alimento. */
export function macrosFor(a: Alimento, gramas: number): Macros {
  const f = gramas / (a.porcao_referencia_g || 100);
  return {
    kcal: a.calorias * f,
    p: a.proteinas * f,
    c: a.carboidratos * f,
    g: a.gorduras * f,
  };
}

/** Which macro should drive the equivalence calculation for a given category. */
export function macroDominante(categoria: string): keyof Macros {
  if (categoria === "proteina" || categoria === "laticinio") return "p";
  if (categoria === "carboidrato" || categoria === "fruta" || categoria === "vegetal") return "c";
  if (categoria === "gordura") return "g";
  return "kcal";
}

/** Compute the grams of a candidate to match the dominant macro of the original. */
export function gramasEquivalentes(
  original: Alimento,
  originalGrams: number,
  candidato: Alimento,
): number {
  const alvo = macrosFor(original, originalGrams);
  const dom = macroDominante(candidato.categoria);
  const porPorcao = macrosFor(candidato, candidato.porcao_referencia_g || 100);
  const denom = porPorcao[dom];
  const numer = alvo[dom];
  if (!denom || !Number.isFinite(denom)) return candidato.porcao_referencia_g || 100;
  const grams = (numer / denom) * (candidato.porcao_referencia_g || 100);
  // Round to nearest 5 g, never below 5 g.
  return Math.max(5, Math.round(grams / 5) * 5);
}

/** % delta of each macro (candidate vs original). */
export function deltaPercent(
  original: Alimento,
  originalGrams: number,
  candidato: Alimento,
  candidatoGrams: number,
): Macros {
  const o = macrosFor(original, originalGrams);
  const c = macrosFor(candidato, candidatoGrams);
  const pct = (a: number, b: number) => (b === 0 ? 0 : ((a - b) / b) * 100);
  return {
    kcal: pct(c.kcal, o.kcal),
    p: pct(c.p, o.p),
    c: pct(c.c, o.c),
    g: pct(c.g, o.g),
  };
}

/** Top 3 candidates: same category, not blocked, ordered by smallest macro deviation. */
export function encontrarSubstitutos({
  original,
  originalGrams,
  pool,
  bloqueados,
  limite = 3,
}: {
  original: Alimento;
  originalGrams: number;
  pool: Alimento[];
  bloqueados: Set<string>; // lowercased names that must be excluded
  limite?: number;
}): Candidato[] {
  return pool
    .filter((a) => a.id !== original.id && a.categoria === original.categoria)
    .filter((a) => !bloqueados.has(a.nome.toLowerCase()))
    .map<Candidato>((a) => {
      const g = gramasEquivalentes(original, originalGrams, a);
      const delta = deltaPercent(original, originalGrams, a, g);
      const within10 = Math.abs(delta.p) <= 10 && Math.abs(delta.c) <= 10 && Math.abs(delta.g) <= 10;
      return { alimento: a, gramas: g, delta, within10pct: within10 };
    })
    .sort((a, b) => {
      const score = (d: Macros) => Math.abs(d.p) + Math.abs(d.c) + Math.abs(d.g);
      // Prefer matches within 10% first, then lowest deviation.
      const aw = a.within10pct ? 0 : 1;
      const bw = b.within10pct ? 0 : 1;
      if (aw !== bw) return aw - bw;
      return score(a.delta) - score(b.delta);
    })
    .slice(0, limite);
}
