export type BadgeType = "first_log" | "streak_7" | "goal_reached";

export const ALL_BADGES: { type: BadgeType; title: string; desc: string }[] = [
  { type: "first_log", title: "Primeira fagulha", desc: "Primeiro peso registrado" },
  { type: "streak_7", title: "7 dias de chama", desc: "Uma semana consecutiva de registros" },
  { type: "goal_reached", title: "Renascido", desc: "Atingiu o peso desejado" },
];
