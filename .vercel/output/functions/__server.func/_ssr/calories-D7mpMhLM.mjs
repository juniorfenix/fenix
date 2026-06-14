const ACT = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};
function calculateDailyCalories(opts) {
  const { weight, height, age, gender, activity, goal } = opts;
  const bmr = gender === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * ACT[activity];
  const adjusted = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
  return Math.max(1200, Math.round(adjusted));
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE");
}
export {
  calculateDailyCalories as c,
  todayISO as t
};
