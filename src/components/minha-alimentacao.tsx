import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { todayISO } from "@/lib/calories";

import {
  Coffee,
  UtensilsCrossed,
  Apple,
  Moon,
  Plus,
  Pencil,
  Trash2,
  Flame,
  Zap,
  Dumbbell,
  Loader2,
  Search,
  Check,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const REFEICOES = [
  { key: "Café", icon: Coffee },
  { key: "Lanche da manhã", icon: Apple },
  { key: "Pré-treino", icon: Dumbbell },
  { key: "Almoço", icon: UtensilsCrossed },
  { key: "Lanche da tarde", icon: Apple },
  { key: "Pós-treino", icon: Dumbbell },
  { key: "Jantar", icon: Moon },
  { key: "Outro", icon: Plus },
] as const;

type RefeicaoKey = (typeof REFEICOES)[number]["key"];

type DiarioRow = {
  id: string;
  refeicao: string;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  observacoes: string | null;
  data: string;
  created_at?: string;
};

const formSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome").max(120),
  calorias: z.coerce.number().int().min(0).max(5000),
  proteinas: z.coerce.number().int().min(0).max(500),
  carboidratos: z.coerce.number().int().min(0).max(1000),
  gorduras: z.coerce.number().int().min(0).max(500),
  observacoes: z.string().trim().max(500).optional().or(z.literal("")),
});

function defaultRefeicaoForNow(): RefeicaoKey {
  const h = new Date().getHours();
  if (h < 10) return "Café";
  if (h < 12) return "Lanche da manhã";
  if (h < 14) return "Almoço";
  if (h < 17) return "Lanche da tarde";
  return "Jantar";
}

type AlimentoPadrao = {
  id: string;
  nome: string;
  icone: string | null;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};

export type PrefillRefeicao = {
  refeicao?: string;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};

type MacroGoals = { prot: number; carb: number; gord: number };

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE");
}

export function MinhaAlimentacao({
  objetivo = "perda",
  metaKcal = 2000,
  macroGoals,
  prefill = null,
  onPrefillConsumed,
}: {
  objetivo?: "perda" | "ganho" | "reeducacao";
  metaKcal?: number;
  macroGoals?: MacroGoals;
  prefill?: PrefillRefeicao | null;
  onPrefillConsumed?: () => void;
} = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";

  const today = todayISO();
  const queryKey = ["diario_alimentar", userId, today] as const;

  // Today's entries
  const { data: registros = [], isPending } = useQuery({
    queryKey,
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async (): Promise<DiarioRow[]> => {
      const { data, error } = await supabase
        .from("diario_alimentar")
        .select(
          "id,refeicao,nome,calorias,proteinas,carboidratos,gorduras,observacoes,data,created_at",
        )
        .eq("user_id", userId)
        .eq("data", today)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as DiarioRow[];
    },
  });

  // All standard foods (search needs full list)
  const { data: alimentosPadrao = [] } = useQuery({
    queryKey: ["alimentos_padrao"],
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<AlimentoPadrao[]> => {
      const { data, error } = await supabase
        .from("alimentos_padrao")
        .select("id,nome,icone,calorias,proteinas,carboidratos,gorduras")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as AlimentoPadrao[];
    },
  });

  // Recent meals (last 30d) — used for "suggestions per meal type"
  const { data: recent = [] } = useQuery({
    queryKey: ["diario_alimentar", userId, "recent30"],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async (): Promise<DiarioRow[]> => {
      const { data, error } = await supabase
        .from("diario_alimentar")
        .select(
          "id,refeicao,nome,calorias,proteinas,carboidratos,gorduras,observacoes,data,created_at",
        )
        .eq("user_id", userId)
        .gte("data", isoDaysAgo(30))
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as DiarioRow[];
    },
  });

  const totals = useMemo(
    () =>
      registros.reduce(
        (acc, r) => ({
          kcal: acc.kcal + r.calorias,
          prot: acc.prot + r.proteinas,
          carb: acc.carb + r.carboidratos,
          gord: acc.gord + r.gorduras,
        }),
        { kcal: 0, prot: 0, carb: 0, gord: 0 },
      ),
    [registros],
  );

  const progressoReal = Math.round((totals.kcal / metaKcal) * 100);
  const progresso = Math.min(100, progressoReal);
  const metaBatida = totals.kcal >= metaKcal;

  // Suggestions per meal type — top 3 most-used items in that meal in last 30d
  const suggestionsByMeal = useMemo(() => {
    const map = new Map<string, Map<string, { row: DiarioRow; count: number }>>();
    for (const r of recent) {
      const m = map.get(r.refeicao) ?? new Map();
      const key = r.nome.toLowerCase();
      const ex = m.get(key);
      if (ex) ex.count += 1;
      else m.set(key, { row: r, count: 1 });
      map.set(r.refeicao, m);
    }
    const result: Record<string, DiarioRow[]> = {};
    for (const [meal, items] of map) {
      result[meal] = [...items.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((x) => x.row);
    }
    return result;
  }, [recent]);

  // Today's meals grouped by refeicao (for badges and history grouping)
  const todayByMeal = useMemo(() => {
    const map: Record<string, DiarioRow[]> = {};
    for (const r of registros) (map[r.refeicao] ??= []).push(r);
    return map;
  }, [registros]);

  // dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DiarioRow | null>(null);
  const [refeicao, setRefeicao] = useState<RefeicaoKey>("Café");
  const [form, setForm] = useState({
    nome: "",
    calorias: "",
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    observacoes: "",
  });
  const [search, setSearch] = useState("");

  function openNew(r: RefeicaoKey) {
    setEditing(null);
    setRefeicao(r);
    setForm({
      nome: "",
      calorias: "",
      proteinas: "",
      carboidratos: "",
      gorduras: "",
      observacoes: "",
    });
    setSearch("");
    setOpen(true);
  }

  function fillFromItem(a: {
    nome: string;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  }) {
    setForm({
      nome: a.nome,
      calorias: String(a.calorias),
      proteinas: String(a.proteinas),
      carboidratos: String(a.carboidratos),
      gorduras: String(a.gorduras),
      observacoes: "",
    });
  }

  // External prefill (e.g. from cardápio sugerido)
  useEffect(() => {
    if (!prefill) return;
    setEditing(null);
    const r =
      (prefill.refeicao && REFEICOES.find((x) => x.key === prefill.refeicao)?.key) ||
      defaultRefeicaoForNow();
    setRefeicao(r as RefeicaoKey);
    fillFromItem(prefill);
    setSearch("");
    setOpen(true);
    onPrefillConsumed?.();
  }, [prefill, onPrefillConsumed]);

  function openEdit(row: DiarioRow) {
    setEditing(row);
    setRefeicao((row.refeicao as RefeicaoKey) ?? "Outro");
    setForm({
      nome: row.nome,
      calorias: String(row.calorias),
      proteinas: String(row.proteinas),
      carboidratos: String(row.carboidratos),
      gorduras: String(row.gorduras),
      observacoes: row.observacoes ?? "",
    });
    setSearch("");
    setOpen(true);
  }

  // Save mutation — optimistic
  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = formSchema.parse(form);
      const payload = {
        user_id: userId,
        data: today,
        refeicao,
        nome: parsed.nome,
        calorias: parsed.calorias,
        proteinas: parsed.proteinas,
        carboidratos: parsed.carboidratos,
        gorduras: parsed.gorduras,
        observacoes: parsed.observacoes || null,
      };
      if (editing) {
        const { error } = await supabase
          .from("diario_alimentar")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("diario_alimentar").insert(payload);
        if (error) throw error;
      }
    },
    onMutate: async () => {
      // Validate before touching cache so we error early
      try {
        formSchema.parse(form);
      } catch (e) {
        throw e;
      }
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<DiarioRow[]>([...queryKey]) ?? [];
      const optimistic: DiarioRow = {
        id: editing?.id ?? `tmp-${Date.now()}`,
        refeicao,
        nome: form.nome,
        calorias: Number(form.calorias) || 0,
        proteinas: Number(form.proteinas) || 0,
        carboidratos: Number(form.carboidratos) || 0,
        gorduras: Number(form.gorduras) || 0,
        observacoes: form.observacoes || null,
        data: today,
        created_at: editing?.created_at ?? new Date().toISOString(),
      };
      const next = editing
        ? prev.map((r) => (r.id === editing.id ? { ...r, ...optimistic, id: editing.id } : r))
        : [...prev, optimistic];
      queryClient.setQueryData<DiarioRow[]>([...queryKey], next);

      setOpen(false);
      return { prev };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData([...queryKey], ctx.prev);
      const msg =
        e instanceof z.ZodError
          ? (e.issues[0]?.message ?? "Dados inválidos")
          : (e as Error).message;
      toast.error(msg);
      setOpen(true); // reopen so user can fix
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["meals", userId, "recent30"] });
      queryClient.invalidateQueries({ queryKey: ["diario_alimentar", userId, "recent30"] });
      toast.success(editing ? "Registro salvo" : "Registro salvo 🔥");
    },
  });

  // Delete mutation with UNDO
  const deleteWithUndo = (row: DiarioRow) => {
    // Optimistic remove
    const prev = queryClient.getQueryData<DiarioRow[]>([...queryKey]) ?? [];
    queryClient.setQueryData<DiarioRow[]>(
      [...queryKey],
      prev.filter((r) => r.id !== row.id),
    );

    let undone = false;
    const t = window.setTimeout(async () => {
      if (undone) return;
      const { error } = await supabase.from("diario_alimentar").delete().eq("id", row.id);
      if (error) {
        queryClient.setQueryData([...queryKey], prev);
        toast.error("Erro ao remover: " + error.message);
      } else {
        queryClient.invalidateQueries({ queryKey: ["meals", userId, "recent30"] });
      }
    }, 5000);

    toast("Registro removido", {
      description: row.nome,
      duration: 5000,
      action: {
        label: "Desfazer",
        onClick: () => {
          undone = true;
          clearTimeout(t);
          queryClient.setQueryData([...queryKey], prev);
          toast.success("Registro restaurado");
        },
      },
    });
  };

  // Search results for the dialog
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return alimentosPadrao.filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 8);
  }, [search, alimentosPadrao]);

  const currentSuggestions = suggestionsByMeal[refeicao] ?? [];

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Hoje</div>
          <h2 className="text-lg font-semibold">Registro do dia</h2>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Flame className={`h-4 w-4 ${metaBatida ? "text-accent" : "text-primary"}`} />
          <span className="font-semibold">{totals.kcal}</span>
          <span className="text-muted-foreground">/ {metaKcal} kcal</span>
        </div>
      </header>

      {/* Progress bar */}
      <div>
        <div className="h-3 w-full rounded-full bg-background/40 border border-border/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-ember transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>{progressoReal}% da meta</span>
          {metaBatida ? (
            <span className="text-accent font-medium">
              {progressoReal > 100 ? `+${totals.kcal - metaKcal} kcal acima` : "Meta batida 🎉"}
            </span>
          ) : (
            <span>Faltam {Math.max(0, metaKcal - totals.kcal)} kcal</span>
          )}
        </div>
      </div>

      {/* Macros with progress vs goal */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <MacroCell label="Proteínas" value={totals.prot} goal={macroGoals?.prot} color="primary" />
        <MacroCell label="Carbos" value={totals.carb} goal={macroGoals?.carb} color="accent" />
        <MacroCell
          label="Gorduras"
          value={totals.gord}
          goal={macroGoals?.gord}
          color="primary-soft"
        />
      </div>

      {/* Quick add buttons with "has entries" badge */}
      <div className="grid grid-cols-4 gap-2">
        {REFEICOES.map((r) => {
          const entries = todayByMeal[r.key] ?? [];
          const hasEntries = entries.length > 0;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => openNew(r.key)}
              className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 border transition-colors min-h-[60px] ${
                hasEntries
                  ? "bg-primary/10 border-primary/40 hover:border-primary/60"
                  : "bg-background/40 border-border/40 hover:border-primary/50"
              }`}
            >
              {hasEntries && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center">
                  {entries.length}
                </span>
              )}
              <r.icon className={`h-4 w-4 ${hasEntries ? "text-primary" : "text-primary/70"}`} />
              <span className="text-[10px] font-medium text-center leading-tight">{r.key}</span>
            </button>
          );
        })}
      </div>

      {/* History grouped by refeicao */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Registros de hoje
        </div>
        {isPending ? (
          <Skeleton className="h-16 rounded-xl" />
        ) : registros.length === 0 ? (
          <EmptyState onCta={() => openNew(defaultRefeicaoForNow())} />
        ) : (
          <div className="space-y-3">
            {REFEICOES.filter((r) => (todayByMeal[r.key]?.length ?? 0) > 0).map((r) => {
              const items = todayByMeal[r.key] ?? [];
              const kcalGroup = items.reduce((a, b) => a + b.calorias, 0);
              return (
                <div
                  key={r.key}
                  className="rounded-xl bg-background/20 border border-border/30 p-2.5"
                >
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <r.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] uppercase tracking-wide font-semibold text-primary">
                        {r.key}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{kcalGroup} kcal</span>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((row) => (
                      <li
                        key={row.id}
                        className="rounded-lg bg-background/40 border border-border/20 p-2.5 flex items-start gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium leading-snug truncate">
                            {row.nome}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {row.calorias} kcal · P {row.proteinas}g · C {row.carboidratos}g · G{" "}
                            {row.gorduras}g
                          </div>
                          {row.observacoes && (
                            <div className="text-[11px] text-muted-foreground mt-1 italic">
                              {row.observacoes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-background/60 text-muted-foreground hover:text-foreground active:scale-95 transition"
                            aria-label="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteWithUndo(row)}
                            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive active:scale-95 transition"
                            aria-label="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar" : "Registrar"} · {refeicao}
              </DialogTitle>
            </DialogHeader>

            <fieldset disabled={saveMutation.isPending} className="space-y-3">
              {/* Search base nutricional */}
              {!editing && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar alimento (ex: arroz, frango...)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <ul className="rounded-lg border border-border/40 bg-background/40 max-h-48 overflow-y-auto divide-y divide-border/30">
                      {searchResults.map((a) => (
                        <li key={a.id}>
                          <button
                            type="button"
                            onClick={() => {
                              fillFromItem(a);
                              setSearch("");
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-primary/10 flex items-center gap-2"
                          >
                            <span className="text-base">{a.icone ?? "🍽️"}</span>
                            <span className="flex-1 text-sm font-medium truncate">{a.nome}</span>
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                              {a.calorias}kcal · P{a.proteinas} C{a.carboidratos} G{a.gorduras}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Suggestions: usados nessa refeição */}
                  {!search && currentSuggestions.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Você costuma comer
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentSuggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => fillFromItem(s)}
                            className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs hover:bg-primary/20 transition"
                          >
                            {s.nome}{" "}
                            <span className="text-muted-foreground">· {s.calorias}kcal</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="nome">Nome da refeição</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  maxLength={120}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: 2 ovos mexidos + pão integral"
                />
              </div>
              <div>
                <Label htmlFor="calorias">Calorias (kcal)</Label>
                <Input
                  id="calorias"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={5000}
                  value={form.calorias}
                  onChange={(e) => setForm((f) => ({ ...f, calorias: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="prot">Prot (g)</Label>
                  <Input
                    id="prot"
                    type="number"
                    min={0}
                    max={500}
                    value={form.proteinas}
                    onChange={(e) => setForm((f) => ({ ...f, proteinas: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="carb">Carb (g)</Label>
                  <Input
                    id="carb"
                    type="number"
                    min={0}
                    max={1000}
                    value={form.carboidratos}
                    onChange={(e) => setForm((f) => ({ ...f, carboidratos: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gord">Gord (g)</Label>
                  <Input
                    id="gord"
                    type="number"
                    min={0}
                    max={500}
                    value={form.gorduras}
                    onChange={(e) => setForm((f) => ({ ...f, gorduras: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="obs">Observações</Label>
                <Textarea
                  id="obs"
                  rows={2}
                  maxLength={500}
                  value={form.observacoes}
                  onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                  placeholder="Opcional"
                />
              </div>
            </fieldset>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={saveMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !form.nome.trim()}
                className="bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95 disabled:opacity-80"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando…
                  </>
                ) : editing ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Registrar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

function MacroCell({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal?: number;
  color: "primary" | "accent" | "primary-soft";
}) {
  const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  const txt =
    color === "accent"
      ? "text-accent"
      : color === "primary-soft"
        ? "text-primary/80"
        : "text-primary";
  const bar = color === "accent" ? "bg-accent" : "bg-primary";
  return (
    <div className="rounded-lg bg-background/30 border border-border/30 py-2 px-2.5 text-center">
      <div className={`font-semibold ${txt}`}>
        {value}
        <span className="text-muted-foreground font-normal text-[10px]">
          {goal ? `/${goal}` : ""}g
        </span>
      </div>
      <div className="text-muted-foreground">{label}</div>
      {goal ? (
        <div className="mt-1 h-1 rounded-full bg-background/60 overflow-hidden">
          <div
            className={`h-full ${bar} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({ onCta }: { onCta: () => void }) {
  const next = defaultRefeicaoForNow();
  return (
    <div className="rounded-xl bg-background/20 border border-dashed border-border/40 p-5 text-center space-y-3">
      <div className="text-3xl">🍽️</div>
      <div className="text-sm font-medium">Nada registrado ainda hoje</div>
      <div className="text-xs text-muted-foreground">Comece pelo que faz sentido agora.</div>
      <Button
        onClick={onCta}
        className="bg-gradient-ember text-primary-foreground shadow-ember hover:opacity-95"
      >
        <Plus className="h-4 w-4 mr-1.5" /> Registrar {next}
      </Button>
    </div>
  );
}
