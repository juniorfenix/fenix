export function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  // allow today OR yesterday as start (keeps streak alive until end of next day)
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function iso(d: Date) {
  return d.toLocaleDateString("sv-SE");
}
