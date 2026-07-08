import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  /** Slot antes do ícone — ex.: link/botão "Voltar". */
  leading?: React.ReactNode;
  /** Slot à direita do título — ex.: botão de ação da tela. */
  action?: React.ReactNode;
}

/**
 * Cabeçalho de página (ícone em badge + eyebrow + h1) — padroniza o
 * cabeçalho repetido quase idêntico em Treinos, Alimentação, Exercícios
 * e Instrutor (REDESIGN.md seção 6/10).
 */
export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  leading,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn("flex items-center gap-3", className)} {...props}>
      {leading}
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-card)] bg-primary shadow-[var(--shadow-sm)]">
        <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{eyebrow}</div>
        <h1 className="truncate text-2xl">{title}</h1>
      </div>
      {action}
    </header>
  );
}
