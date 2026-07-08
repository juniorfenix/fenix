import * as React from "react";

import { cn } from "@/lib/utils";

export interface MetricChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Rótulo curto, exibido em caixa alta acima do valor. */
  label: string;
  /** Valor principal (número, string ou node já formatado). */
  value: React.ReactNode;
  /** Sufixo de unidade, exibido junto ao valor (ex.: "g", "kcal"). */
  unit?: string;
  icon?: React.ReactNode;
  /** 0-100. Quando informado, renderiza uma barra de progresso fina abaixo do valor. */
  progress?: number;
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
}

const TONE_TEXT: Record<NonNullable<MetricChipProps["tone"]>, string> = {
  primary: "text-primary",
  success: "text-[var(--success)]",
  warning: "text-[#8A5A00]",
  danger: "text-destructive",
  muted: "text-foreground",
};

const TONE_BAR: Record<NonNullable<MetricChipProps["tone"]>, string> = {
  primary: "bg-primary",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-destructive",
  muted: "bg-muted-foreground",
};

/**
 * Chip de métrica (rótulo + valor) — substitui as implementações locais
 * duplicadas (Stat, MacroChip, MetaChip, Info, Meta) mapeadas no
 * REDESIGN.md seção 6/10.
 */
export function MetricChip({
  label,
  value,
  unit,
  icon,
  progress,
  tone = "primary",
  className,
  ...props
}: MetricChipProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-input)] border border-border bg-card p-2.5 text-center",
        className,
      )}
      {...props}
    >
      {icon && <div className="mb-1 flex items-center justify-center">{icon}</div>}
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-semibold", TONE_TEXT[tone])}>
        {value}
        {unit ? (
          <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      {progress != null && (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full transition-all duration-500", TONE_BAR[tone])}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
