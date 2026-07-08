import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

/**
 * Estado vazio padrão — substitui as variações locais (emoji + texto,
 * ícone solto, texto puro) mapeadas no REDESIGN.md seção 6/10.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-dashed border-border bg-card p-6 text-center",
        className,
      )}
      {...props}
    >
      {Icon && (
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-soft)]">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </div>
      )}
      <div className="text-sm font-semibold">{title}</div>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button size="sm" variant="ember" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
