import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, Dumbbell, Download, Loader2, Pencil, Plus, Search } from "lucide-react";
import { ExercicioMedia } from "@/components/exercicio-media";
import {
  exerciciosQuery,
  exerciseDbSearchQuery,
  type ExercicioRow,
  type ExerciseDBExercise,
} from "@/lib/queries";
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
import { Skeleton } from "@/components/ui/skeleton";
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

// ExerciseDB difficulty → exercicios.nivel
const DIFFICULTY_TO_NIVEL: Record<string, string> = {
  beginner: "iniciante",
  intermediate: "intermediario",
  advanced: "avancado",
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
  const [importOpen, setImportOpen] = useState(false);

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
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setImportOpen(true)}
            size="sm"
            variant="outline"
            className="border-border/60"
          >
            <Download className="h-4 w-4 mr-1" /> Importar
          </Button>
          <Button
            onClick={openNovo}
            size="sm"
            className="bg-gradient-ember text-primary-foreground shadow-ember"
          >
            <Plus className="h-4 w-4 mr-1" /> Novo
          </Button>
        </div>
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
        {busca &&
          filtered.length !== exercicios.length &&
          ` · ${filtered.length} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {/* ── Edit / Create dialog ──────────────────────────────────────────────── */}
      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog === "novo" ? "Novo exercício" : "Editar exercício"}</DialogTitle>
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
                <Select value={form.grupo_muscular} onValueChange={(v) => set("grupo_muscular", v)}>
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
                <Select value={form.equipamento} onValueChange={(v) => set("equipamento", v)}>
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

      {/* ── ExerciseDB import dialog ──────────────────────────────────────────── */}
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => {
          queryClient.invalidateQueries({ queryKey: ["exercicios"] });
          setImportOpen(false);
        }}
      />
    </main>
  );
}

// ── ImportDialog ────────────────────────────────────────────────────────────

function ImportDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [importingId, setImportingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset search when dialog opens
  useEffect(() => {
    if (!open) return;
    setSearch("");
    setDebouncedSearch("");
    setImportingId(null);
  }, [open]);

  // 500 ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const {
    data: results = [],
    isFetching,
    isError,
  } = useQuery(exerciseDbSearchQuery(debouncedSearch));

  const importExercise = useMutation({
    mutationFn: async (exercise: ExerciseDBExercise) => {
      // ── Build stable GIF URL (no token — doesn't expire with the session) ────
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const gifUrl = `${supabaseUrl}/functions/v1/exercise-gif?id=${exercise.id}&resolution=360`;

      // ── Translate to pt-BR via Anthropic ────────────────────────────────────
      let nome = exercise.name;
      let grupo_muscular: string | null = exercise.bodyPart || null;
      let equipamento = exercise.equipment;

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 300,
            messages: [
              {
                role: "user",
                content: `Translate these fitness exercise fields from English to Brazilian Portuguese. Return ONLY a JSON object with keys: nome, grupo_muscular, equipamento. No explanation, no markdown.

Input:
name: "${exercise.name}"
bodyPart: "${exercise.bodyPart}"
equipment: "${exercise.equipment}"

Rules:
- nome: translate the exercise name naturally (e.g. "Bench Press" → "Supino com barra")
- grupo_muscular: translate anatomical terms (e.g. "upper arms" → "Bíceps")
- equipamento: translate equipment (e.g. "barbell" → "Barra", "dumbbell" → "Halter", "body weight" → "Peso corporal", "cable" → "Cabo", "machine" → "Máquina")
- Keep proper nouns as-is if no Portuguese equivalent exists`,
              },
            ],
          }),
        });
        const data = await res.json();
        const raw: string = data.content?.[0]?.text ?? "{}";
        const clean = raw
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        const translated = JSON.parse(clean) as {
          nome?: string;
          grupo_muscular?: string;
          equipamento?: string;
        };
        if (translated.nome) nome = translated.nome;
        if (translated.grupo_muscular) grupo_muscular = translated.grupo_muscular;
        if (translated.equipamento) equipamento = translated.equipamento;
      } catch {
        // fall back to original English values
      }

      // ── Insert into Supabase ────────────────────────────────────────────────
      const payload = {
        nome,
        grupo_muscular,
        equipamento,
        nivel: DIFFICULTY_TO_NIVEL[exercise.difficulty] ?? "iniciante",
        tipo_midia: "gif",
        gif_url: gifUrl,
        video_url: null as string | null,
        descricao: exercise.description || null,
      };
      const { error } = await supabase.from("exercicios").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Exercício importado com sucesso!");
      onImported();
    },
    onError: () => {
      toast.error("Não foi possível importar o exercício. Tente novamente.");
    },
    onSettled: () => {
      setImportingId(null);
    },
  });

  const handleImport = (exercise: ExerciseDBExercise) => {
    setImportingId(exercise.id);
    importExercise.mutate(exercise);
  };

  const showSkeleton = isFetching && results.length === 0;
  const showEmpty =
    !isFetching && !isError && debouncedSearch.trim().length >= 2 && results.length === 0;
  const showError = isError && !isFetching;
  const showPrompt = debouncedSearch.trim().length < 2 && !isFetching;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Importar do ExerciseDB</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="px-6 pb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar exercício em inglês (ex.: bench press)…"
              className="pl-9"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {showPrompt && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Digite ao menos 2 caracteres para buscar.
            </p>
          )}

          {showSkeleton && (
            <ul className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
                </li>
              ))}
            </ul>
          )}

          {showEmpty && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhum exercício encontrado para &quot;{debouncedSearch}&quot;.
            </p>
          )}

          {showError && (
            <p className="py-10 text-center text-sm text-destructive">
              Erro ao buscar exercícios. Verifique sua conexão e tente novamente.
            </p>
          )}

          {!showSkeleton && results.length > 0 && (
            <ul className="space-y-3">
              {results.map((exercise) => (
                <ExerciseResultCard
                  key={exercise.id}
                  exercise={exercise}
                  isImporting={importingId === exercise.id}
                  onImport={handleImport}
                />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── ExerciseResultCard ──────────────────────────────────────────────────────

function ExerciseResultCard({
  exercise,
  isImporting,
  onImport,
}: {
  exercise: ExerciseDBExercise;
  isImporting: boolean;
  onImport: (exercise: ExerciseDBExercise) => void;
}) {
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadGif() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      if (!token) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const params = new URLSearchParams({ id: exercise.id, resolution: "180" });
      const url = `${supabaseUrl}/functions/v1/exercise-gif?${params}`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok || cancelled) return;
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setGifSrc(objectUrl);
      } catch {
        // silently fail — placeholder stays
      }
    }

    void loadGif();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [exercise.id]);

  const difficultyLabel =
    { beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado" }[
      exercise.difficulty
    ] ?? exercise.difficulty;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3">
      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
        {(!gifSrc || !imgLoaded) && (
          <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
        )}
        {gifSrc && (
          <img
            src={gifSrc}
            alt={exercise.name}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-200 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate capitalize">{exercise.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground truncate capitalize">
          {exercise.bodyPart}
          {exercise.equipment ? ` · ${exercise.equipment}` : ""}
        </p>
        {difficultyLabel && (
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {difficultyLabel}
          </span>
        )}
      </div>

      <Button
        size="sm"
        disabled={isImporting}
        onClick={() => onImport(exercise)}
        className="shrink-0 bg-gradient-ember text-primary-foreground shadow-ember"
      >
        {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Importar"}
      </Button>
    </li>
  );
}

// ── Field helper ────────────────────────────────────────────────────────────

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
