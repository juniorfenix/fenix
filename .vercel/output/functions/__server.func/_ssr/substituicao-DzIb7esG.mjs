const MEAL_LABELS = {
  cafe: "Café da manhã",
  lanche_manha: "Lanche da manhã",
  almoco: "Almoço",
  lanche_tarde: "Lanche da tarde",
  jantar: "Jantar",
  ceia: "Ceia"
};
const MEAL_KEYS = [
  "cafe",
  "lanche_manha",
  "almoco",
  "lanche_tarde",
  "jantar",
  "ceia"
];
const CATEGORIA_LABELS = {
  proteina: "Proteína",
  carboidrato: "Carboidrato",
  gordura: "Gordura",
  vegetal: "Vegetal",
  fruta: "Fruta",
  laticinio: "Laticínio",
  bebida: "Bebida",
  outros: "Outros"
};
function macrosFor(a, gramas) {
  const f = gramas / (a.porcao_referencia_g || 100);
  return {
    kcal: a.calorias * f,
    p: a.proteinas * f,
    c: a.carboidratos * f,
    g: a.gorduras * f
  };
}
function macroDominante(categoria) {
  if (categoria === "proteina" || categoria === "laticinio") return "p";
  if (categoria === "carboidrato" || categoria === "fruta" || categoria === "vegetal") return "c";
  if (categoria === "gordura") return "g";
  return "kcal";
}
function gramasEquivalentes(original, originalGrams, candidato) {
  const alvo = macrosFor(original, originalGrams);
  const dom = macroDominante(candidato.categoria);
  const porPorcao = macrosFor(candidato, candidato.porcao_referencia_g || 100);
  const denom = porPorcao[dom];
  const numer = alvo[dom];
  if (!denom || !Number.isFinite(denom)) return candidato.porcao_referencia_g || 100;
  const grams = numer / denom * (candidato.porcao_referencia_g || 100);
  return Math.max(5, Math.round(grams / 5) * 5);
}
function deltaPercent(original, originalGrams, candidato, candidatoGrams) {
  const o = macrosFor(original, originalGrams);
  const c = macrosFor(candidato, candidatoGrams);
  const pct = (a, b) => b === 0 ? 0 : (a - b) / b * 100;
  return {
    kcal: pct(c.kcal, o.kcal),
    p: pct(c.p, o.p),
    c: pct(c.c, o.c),
    g: pct(c.g, o.g)
  };
}
function encontrarSubstitutos({
  original,
  originalGrams,
  pool,
  bloqueados,
  limite = 3
}) {
  return pool.filter((a) => a.id !== original.id && a.categoria === original.categoria).filter((a) => !bloqueados.has(a.nome.toLowerCase())).map((a) => {
    const g = gramasEquivalentes(original, originalGrams, a);
    const delta = deltaPercent(original, originalGrams, a, g);
    const within10 = Math.abs(delta.p) <= 10 && Math.abs(delta.c) <= 10 && Math.abs(delta.g) <= 10;
    return { alimento: a, gramas: g, delta, within10pct: within10 };
  }).sort((a, b) => {
    const score = (d) => Math.abs(d.p) + Math.abs(d.c) + Math.abs(d.g);
    const aw = a.within10pct ? 0 : 1;
    const bw = b.within10pct ? 0 : 1;
    if (aw !== bw) return aw - bw;
    return score(a.delta) - score(b.delta);
  }).slice(0, limite);
}
export {
  CATEGORIA_LABELS as C,
  MEAL_KEYS as M,
  MEAL_LABELS as a,
  encontrarSubstitutos as e,
  macrosFor as m
};
