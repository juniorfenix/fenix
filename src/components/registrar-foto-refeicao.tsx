import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coffee,
  UtensilsCrossed,
  Moon,
  Apple,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  uploadFotoRefeicao,
  processarFotoRefeicao,
  mensagemErroFoto,
  type TipoRefeicao,
  type RefeicaoAnalisada,
} from "@/lib/foto-refeicao";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { todayISO } from "@/lib/calories";
import { useQueryClient } from "@tanstack/react-query";

// ─── Config ───────────────────────────────────────────────────────────────────

type TipoConfig = { value: TipoRefeicao; label: string; diarioKey: string; Icon: LucideIcon };

const TIPOS: TipoConfig[] = [
  { value: "cafe_da_manha", label: "Café da Manhã", diarioKey: "Café", Icon: Coffee },
  { value: "almoco", label: "Almoço", diarioKey: "Almoço", Icon: UtensilsCrossed },
  { value: "jantar", label: "Jantar", diarioKey: "Jantar", Icon: Moon },
  { value: "lanche", label: "Lanche", diarioKey: "Lanche da tarde", Icon: Apple },
];

// ─── State machine ────────────────────────────────────────────────────────────

type FlowPhase =
  | { phase: "idle" }
  | { phase: "preview"; file: File; previewUrl: string; tipo: TipoRefeicao | null }
  | { phase: "sending"; previewUrl: string; tipo: TipoRefeicao }
  | { phase: "analyzing"; previewUrl: string; tipo: TipoRefeicao }
  | { phase: "result"; result: RefeicaoAnalisada; previewUrl: string; tipo: TipoRefeicao }
  | { phase: "error"; message: string; previewUrl?: string };

// ─── Main component ───────────────────────────────────────────────────────────

export function RegistrarFotoRefeicao() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galeriaRef = useRef<HTMLInputElement>(null);
  const [flow, setFlow] = useState<FlowPhase>({ phase: "idle" });

  const dialogOpen = flow.phase !== "idle";

  function handleFile(file: File | null) {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFlow({ phase: "preview", file, previewUrl, tipo: null });
  }

  function fechar() {
    if ("previewUrl" in flow && flow.previewUrl) {
      URL.revokeObjectURL(flow.previewUrl);
    }
    if (cameraRef.current) cameraRef.current.value = "";
    if (galeriaRef.current) galeriaRef.current.value = "";
    setFlow({ phase: "idle" });
  }

  async function analisar() {
    if (flow.phase !== "preview" || !flow.tipo) return;
    const { file, tipo, previewUrl } = flow;

    try {
      setFlow({ phase: "sending", previewUrl, tipo });
      const { storagePath } = await uploadFotoRefeicao(file);
      setFlow({ phase: "analyzing", previewUrl, tipo });
      const result = await processarFotoRefeicao({ storagePath, tipo });
      setFlow({ phase: "result", result, previewUrl, tipo });
    } catch (err) {
      setFlow({ phase: "error", message: mensagemErroFoto(err), previewUrl });
    }
  }

  async function salvarNoDiario() {
    if (flow.phase !== "result" || !user) return;
    const { result } = flow;
    const today = todayISO();
    const diarioKey = TIPOS.find((t) => t.value === result.tipo)?.diarioKey ?? "Outro";

    try {
      const { error } = await supabase.from("diario_alimentar").insert({
        user_id: user.id,
        data: today,
        refeicao: diarioKey,
        nome: "Refeição por foto (IA)",
        calorias: result.calorias_total,
        proteinas: result.proteinas_total,
        carboidratos: result.carboidratos_total,
        gorduras: result.gorduras_total,
        observacoes: result.itens_refeicao.map((i) => i.nome_alimento).join(", ") || null,
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["diario_alimentar", user.id, today] });
      toast.success("Refeição adicionada ao diário!");
      fechar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar no diário.");
    }
  }

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden={true}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={galeriaRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden={true}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {/* CTA card */}
      <section className="glass rounded-2xl p-4 border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-ember grid place-items-center shadow-ember shrink-0">
            <Camera className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Registrar refeição por foto</div>
            <div className="text-xs text-muted-foreground">
              IA identifica alimentos e calcula os macros
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-primary/30 hover:border-primary/60 hover:bg-primary/10 gap-1.5"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Câmera
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border/40 hover:border-primary/40 hover:bg-primary/5 gap-1.5"
            onClick={() => galeriaRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
            Galeria
          </Button>
        </div>
      </section>

      {/* Flow dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) fechar();
        }}
      >
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4 text-primary" />
              Refeição por foto
            </DialogTitle>
          </DialogHeader>

          {flow.phase === "preview" && (
            <FlowPreview
              previewUrl={flow.previewUrl}
              tipo={flow.tipo}
              onTipoChange={(t) => setFlow((f) => (f.phase === "preview" ? { ...f, tipo: t } : f))}
              onAnalisar={analisar}
              onCancel={fechar}
            />
          )}

          {(flow.phase === "sending" || flow.phase === "analyzing") && (
            <FlowLoading phase={flow.phase} previewUrl={flow.previewUrl} />
          )}

          {flow.phase === "result" && (
            <FlowResult
              result={flow.result}
              previewUrl={flow.previewUrl}
              onSave={salvarNoDiario}
              onClose={fechar}
            />
          )}

          {flow.phase === "error" && <FlowError message={flow.message} onClose={fechar} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FlowPreview({
  previewUrl,
  tipo,
  onTipoChange,
  onAnalisar,
  onCancel,
}: {
  previewUrl: string;
  tipo: TipoRefeicao | null;
  onTipoChange: (t: TipoRefeicao) => void;
  onAnalisar: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-border/30 bg-background/20">
        <img src={previewUrl} alt="Preview da refeição" className="w-full h-48 object-cover" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Qual refeição é essa?</p>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onTipoChange(value)}
              className={`rounded-xl py-3 px-3 border flex items-center gap-2 text-sm transition-all ${
                tipo === value
                  ? "bg-gradient-ember text-primary-foreground border-primary shadow-ember scale-[1.02]"
                  : "bg-background/40 border-border/40 hover:border-primary/50 text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button
          onClick={onAnalisar}
          disabled={!tipo}
          className="flex-1 bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          Analisar
        </Button>
      </div>
    </div>
  );
}

const LOADING_LABELS = {
  sending: { title: "Enviando imagem…", desc: "Fazendo upload da foto com segurança." },
  analyzing: {
    title: "Analisando com IA…",
    desc: "Nossa IA está identificando os alimentos e calculando os macros. Isso pode levar alguns segundos.",
  },
} as const;

function FlowLoading({
  phase,
  previewUrl,
}: {
  phase: "sending" | "analyzing";
  previewUrl: string;
}) {
  const { title, desc } = LOADING_LABELS[phase];
  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-border/30">
        <img src={previewUrl} alt="Refeição" className="w-full h-40 object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 backdrop-blur-[2px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">{desc}</p>
    </div>
  );
}

function FlowResult({
  result,
  previewUrl,
  onSave,
  onClose,
}: {
  result: RefeicaoAnalisada;
  previewUrl: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const tipoLabel = TIPOS.find((t) => t.value === result.tipo)?.label ?? result.tipo;

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-border/30">
        <img src={previewUrl} alt="Refeição analisada" className="w-full h-36 object-cover" />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)] text-white text-[11px] px-2 py-1 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Análise pronta
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{tipoLabel}</span>
        <span className="text-lg font-bold text-gradient-ember">{result.calorias_total} kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-background/30 border border-border/30 py-2 px-2.5 text-center">
          <div className="font-semibold text-primary">{result.proteinas_total}g</div>
          <div className="text-muted-foreground">Proteínas</div>
        </div>
        <div className="rounded-lg bg-background/30 border border-border/30 py-2 px-2.5 text-center">
          <div className="font-semibold text-accent">{result.carboidratos_total}g</div>
          <div className="text-muted-foreground">Carbos</div>
        </div>
        <div className="rounded-lg bg-background/30 border border-border/30 py-2 px-2.5 text-center">
          <div className="font-semibold text-primary/80">{result.gorduras_total}g</div>
          <div className="text-muted-foreground">Gorduras</div>
        </div>
      </div>

      {result.itens_refeicao.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Itens identificados
          </p>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {result.itens_refeicao.map((item, i) => (
              <li
                key={i}
                className="rounded-lg bg-background/20 border border-border/20 px-3 py-2 text-sm flex justify-between items-center gap-2"
              >
                <span className="truncate">{item.nome_alimento}</span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {item.calorias != null ? `${item.calorias} kcal` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Fechar
        </Button>
        <Button
          onClick={onSave}
          className="flex-1 bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95"
        >
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          Salvar no diário
        </Button>
      </div>
    </div>
  );
}

function FlowError({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="space-y-4 text-center py-4">
      <div className="h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/30 grid place-items-center mx-auto">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-sm">Algo deu errado</p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={onClose} className="border-border/60">
        Tentar novamente
      </Button>
    </div>
  );
}
