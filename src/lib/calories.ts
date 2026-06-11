// Calorie + helper math
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const ACT: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateDailyCalories(opts: {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: "male" | "female";
  activity: ActivityLevel;
  goal: "lose" | "maintain" | "gain";
}): number {
  // Mifflin-St Jeor
  const { weight, height, age, gender, activity, goal } = opts;
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * ACT[activity];
  const adjusted = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
  return Math.max(1200, Math.round(adjusted));
}

export function todayISO(): string {
  // Local date (not UTC) — avoids day-rollover bugs in negative-UTC timezones.
  return new Date().toLocaleDateString("sv-SE");
}
