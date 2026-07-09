import { useEffect, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string;
  show: boolean;
  /** Called after the user clicks the CTA, so the parent can scroll to the planner. */
  onStart?: () => void;
};

export function WelcomeModal({ userId, show, onStart }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Open once the parent says we should — controlled but can be dismissed.
  useEffect(() => {
    if (show) setOpen(true);
  }, [show]);

  const dismiss = async () => {
    if (saving) return;
    setSaving(true);
    setOpen(false);
    try {
      await supabase.from("profiles").update({ has_seen_welcome: true }).eq("id", userId);
      qc.invalidateQueries({ queryKey: ["profile", userId] });
    } catch {
      /* silent — flag will retry on next mount */
    } finally {
      setSaving(false);
    }
  };

  const handleStart = () => {
    // Fire-and-forget so the parent can scroll immediately
    void dismiss();
    onStart?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) void dismiss();
      }}
    >
      <DialogContent className="max-w-lg p-0 overflow-hidden border-primary/20">
        {/* Hero */}
        <div className="relative bg-gradient-ember px-6 pt-8 pb-6 text-primary-foreground">
          <div className="absolute inset-0 opacity-20 pointer-events-none [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-background/15 backdrop-blur-sm">
              <Flame className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">Método Fênix</div>
              <div className="font-display text-lg leading-tight">Bem-vindo(a)</div>
            </div>
          </div>
          <Sparkles className="absolute right-5 top-5 h-4 w-4 opacity-70" />
        </div>

        <div className="px-6 pt-5 pb-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl leading-snug">
              Que bom ter você aqui.
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              Você deu um passo importante ao chegar até aqui. A partir de hoje, você tem um caminho
              claro para seguir, no seu ritmo, rumo à sua melhor versão.
            </p>
            <p>
              O seu celular agora joga a seu favor. Vamos construir juntos uma rotina que faça
              sentido para a sua vida.
            </p>

            <div className="rounded-xl border border-border bg-card/50 p-4">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                Por onde começar
              </div>
              <ol className="space-y-2">
                <li className="flex gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-ember text-[11px] font-semibold text-primary-foreground">
                    1
                  </span>
                  <span>
                    Passe pela aba <strong>Método</strong> e conheça os princípios que vão guiar a
                    sua jornada.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-gradient-ember text-[11px] font-semibold text-primary-foreground">
                    2
                  </span>
                  <span>
                    Volte para a aba <strong>Início</strong> e monte o seu Planner da semana com
                    calma.
                  </span>
                </li>
              </ol>
            </div>

            <p className="text-foreground/80">Estamos com você em cada passo. Vamos juntos.</p>
          </div>

          <Button
            onClick={handleStart}
            disabled={saving}
            className="mt-5 h-12 w-full bg-gradient-ember text-primary-foreground shadow-ember"
          >
            Quero começar meu planejamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
