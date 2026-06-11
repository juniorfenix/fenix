export type GeneroPt = "homem" | "mulher";

export function mapGenero(g: string | null | undefined): GeneroPt | null {
  if (g === "male") return "homem";
  if (g === "female") return "mulher";
  return null;
}
