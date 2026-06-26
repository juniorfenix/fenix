import type { PapelUsuario } from "@/lib/queries";

export function isAluno(papel: PapelUsuario | null | undefined): boolean {
  return papel === "aluno";
}

export function isProfissional(papel: PapelUsuario | null | undefined): boolean {
  return papel === "instrutor" || papel === "nutricionista";
}

export function isAdmin(papel: PapelUsuario | null | undefined): boolean {
  return papel === "admin";
}
