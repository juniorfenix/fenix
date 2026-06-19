import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  ArrowLeft,
  Dumbbell,
  Loader2,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { ExercicioMedia } from "@/components/exercicio-media";
import { exerciciosQuery, type ExercicioRow } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/instrutor/exercicios")({
  component: ExerciciosPage,
});

const GRUPOS = ["Bíceps", "Core", "Costas", "Glúteo", "Ombro", "Peito", "Pernas", "Tríceps"];
const EQUIPAMENTOS = ["Barra", "Cabo", "Halter", "Máquina", "Peso corporal", "Outro"];
const NIVEIS = ["iniciante", "intermediario", "avancado"] as const;
const NIVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  grupo_muscular: z.string().min(1, "Grupo muscular obrigatório"),
  equipamento: z.string().min(1, "Equipamento obrigatório"),
  nivel: z.string().min(1, "Nível obrigatório"),
  tipo_midia: z.string().default("gif"),
  gif_url: z.string().optional(),
  video_url: z.string().optional(),
  descricao: z.string().optional(),
});

type FormState = {
  nome: string;
  grupo_muscular: string;
  equipamento: string;
  nivel: string;
  tipo_midia: string;
  gif_url: string;
  video_url: string;
  descricao: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  nome: "",
  grupo_muscular: GRUPOS[0],
  equipamento: EQUIPAMENTOS[0],
  nivel: "iniciante",
  tipo_midia: "gif",
  gif_url: "",
  video_url: "",
  descricao: "",
};

function toForm(ex: ExercicioRow): FormState {
  return {
    nome: ex.nome,
    grupo_muscular: ex.grupo_muscular ?? "",
    equipamento: ex.equipamento,
    nivel: ex.nivel,
    tipo_midia: ex.tipo_midia,
    gif_url: ex.gif_url ?? "",
    video_url: ex.video_url ?? "",
    descricao: ex.descricao ?? "",
  };
}

function ExerciciosPage() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [dialog, setDialog] = useState<"novo" | ExercicioRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: exercicios = [], isLoading } = useQuery(exerciciosQuery);

  const filtered = exercicios.filter((ex) => {
    const q = busca.trim().toLowerCase();
    if (!q) return true;
    return (
      ex.nome.toLowerCase().includes(q) ||
      (ex.grupo_muscular ?? "").toLowerCase().includes(q) ||
      ex.equipamento.toLowerCase().includes(q)
    );
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const openEdit = (ex: ExercicioRow) => {
    setForm(toForm(ex));
    setErrors({});
    setDialog(ex);
  };

  const openNovo = () => {
    setForm(EMPTY);
    setErrors({});
    setDialog("novo");
  };

  const salvar = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) {
        const errs: FormErrors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof FormState;
          if (!errs[key]) errs[key] = issue.message;
        }
        setErrors(errs);
        throw new Error("invalid");
      }
      setErrors({});
      const payload = {
        nome: parsed.data.nome,
        grupo_muscular: parsed.data.grupo_muscular || null,
        equipamento: parsed.data.equipamento,
        nivel: parsed.data.nivel,
        tipo_midia: parsed.data.tipo_midia || "gif",
        gif_url: parsed.data.gif_url || null,
        video_url: parsed.data.video_url || null,
        descricao: parsed.data.descricao || null,
      };

      if (dialog === "novo") {
        const { error } = await supabase.from("exercicios").insert(payload);
        if (error) throw error;
      } else if (dialog) {
        const { error } = await supabase
          .from("exercicios")
          .update(payload)
          .eq("id", (dialog as ExercicioRow).id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercicios"] });
      toast.success(dialog === "novo" ? "Exercício criado." : "Exercício atualizado.");
      setDialog(null);
    },
    onError: (e: Error) => {
      if (e.message !== "invalid") toast.error("Erro ao salvar exercício.");
    },
  });

  const previewUrl = form.gif_url || form.video_url || null;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-8 space-y-6">
      <header className="flex items-center gap-3">
        <Link
          to="/app/instrutor"
          className="text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-ember grid place-items-center shadow-ember">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Administração
          </div>
          <h1 className="text-2xl">Exercícios</h1>
        </div>
        <Button
          onClick={openNovo}
          size="sm"
          className="bg-gradient-ember text-primary-foreground shadow-ember shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, grupo ou equipamento…"
          className="pl-9"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {busca ? "Nenhum exercício encontrado." : "Nenhum exercício cadastrado ainda."}
          </p>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-card/40 transition"
              >
                <ExercicioMedia url={ex.gif_url ?? ex.video_url} alt={ex.nome} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{ex.nome}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
                    {ex.grupo_muscular && <span>{ex.grupo_muscular}</span>}
                    <span>·</span>
                    <span>{ex.equipamento}</span>
                    <span>·</span>
                    <span>{NIVEL_LABELS[ex.nivel] ?? ex.nivel}</span>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(ex)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-[11px] text-center text-muted-foreground">
        {exercicios.length} exercício{exercicios.length !== 1 ? "s" : ""} cadastrado
        {exercicios.length !== 1 ? "s" : ""}
        {busca && filtered.length !== exercicios.length && ` · ${filtered.length} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </div>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialog === "novo" ? "Novo exercício" : "Editar exercício"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="rounded-xl overflow-hidden border border-border/40 bg-muted/20">
              <ExercicioMedia
                key={previewUrl ?? "__empty"}
                url={previewUrl}
                alt={form.nome || "Preview"}
                size="lg"
              />
              {!previewUrl && (
                <p className="py-2 text-center text-[11px] text-muted-foreground">
                  Preview aparece ao informar a URL do GIF ou vídeo
                </p>
              )}
            </div>

            <Field label="URL do GIF" error={errors.gif_url}>
              <Input
                value={form.gif_url}
                onChange={(e) => set("gif_url", e.target.value)}
                placeholder="https://v2.exercisedb.io/image/…"
              />
            </Field>

            <Field label="URL do vídeo (opcional)" error={errors.video_url}>
              <Input
                value={form.video_url}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://…/exercicio.mp4"
              />
            </Field>

            <Field label="Nome *" error={errors.nome}>
              <Input
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Ex.: Supino com barra"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Grupo muscular *" error={errors.grupo_muscular}>
                <Select
                  value={form.grupo_muscular}
                  onValueChange={(v) => set("grupo_muscular", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRUPOS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Equipamento *" error={errors.equipamento}>
                <Select
                  value={form.equipamento}
                  onValueChange={(v) => set("equipamento", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPAMENTOS.map((eq) => (
                      <SelectItem key={eq} value={eq}>
                        {eq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Nível *" error={errors.nivel}>
              <div className="flex gap-2">
                {NIVEIS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("nivel", n)}
                    className={`flex-1 rounded-xl border-2 py-2 text-sm transition ${
                      form.nivel === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {NIVEL_LABELS[n]}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Descrição" error={errors.descricao}>
              <Textarea
                value={form.descricao}
                onChange={(e) => set("descricao", e.target.value)}
                placeholder="Instruções breves de execução…"
                className="min-h-[80px] text-sm resize-none"
              />
            </Field>

            <Button
              onClick={() => salvar.mutate()}
              disabled={salvar.isPending}
              className="w-full bg-gradient-ember text-primary-foreground shadow-ember"
            >
              {salvar.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {dialog === "novo" ? "Criar exercício" : "Salvar alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm text-muted-foreground">{label}</div>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
