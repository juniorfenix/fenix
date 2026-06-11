import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, ClipboardList, Search } from "lucide-react";
import { toast } from "sonner";
import { MEAL_KEYS, MEAL_LABELS, CATEGORIA_LABELS, type Alimento } from "@/lib/substituicao";

type Item = {
  id: string;
  refeicao: string;
  alimento_id: string;
  gramas: number;
  ordem: number;
  alimento: Alimento;
};

type Props = {
  userId: string;
};

export function ProtocoloEditor({ userId }: Props) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["protocolo_admin", userId],
    queryFn: async () => {
      const { data: prot } = await supabase
        .from("protocolos_prescritos")
        .select("id,meta_kcal,meta_proteinas,meta_carboidratos,meta_gorduras,observacoes")
        .eq("user_id", userId)
        .maybeSingle();
      let itens: Item[] = [];
      if (prot) {
        const res = await supabase
          .from("protocolo_itens")
          .select(
            "id,refeicao,alimento_id,gramas,ordem,alimento:alimentos_padrao(id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras)",
          )
          .eq("protocolo_id", prot.id)
          .order("ordem", { ascending: true });
        itens = (res.data ?? []) as unknown as Item[];
      }
      return { protocolo: prot, itens };
    },
  });

  const { data: alimentos = [] } = useQuery<Alimento[]>({
    queryKey: ["alimentos_padrao_all"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alimentos_padrao")
        .select("id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras")
        .eq("ativo", true)
        .order("nome", { ascending: true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as Alimento[];
    },
  });

  const [metas, setMetas] = useState<{
    meta_kcal: string;
    meta_proteinas: string;
    meta_carboidratos: string;
    meta_gorduras: string;
    observacoes: string;
  } | null>(null);

  // Hydrate local form when data loads
  const protocolo = data?.protocolo;
  const formInit = useMemo(
    () =>
      protocolo
        ? {
            meta_kcal: String(protocolo.meta_kcal ?? 0),
            meta_proteinas: String(protocolo.meta_proteinas ?? 0),
            meta_carboidratos: String(protocolo.meta_carboidratos ?? 0),
            meta_gorduras: String(protocolo.meta_gorduras ?? 0),
            observacoes: protocolo.observacoes ?? "",
          }
        : { meta_kcal: "", meta_proteinas: "", meta_carboidratos: "", meta_gorduras: "", observacoes: "" },
    [protocolo],
  );
  const form = metas ?? formInit;

  // Reset local form state when switching students
  useEffect(() => {
    setMetas(null);
  }, [userId]);

  const saveMetas = useMutation({
    mutationFn: async () => {
      const payload = {
        user_id: userId,
        meta_kcal: parseInt(form.meta_kcal || "0", 10),
        meta_proteinas: parseFloat(form.meta_proteinas || "0"),
        meta_carboidratos: parseFloat(form.meta_carboidratos || "0"),
        meta_gorduras: parseFloat(form.meta_gorduras || "0"),
        observacoes: form.observacoes.trim() || null,
      };
      const { error } = await supabase
        .from("protocolos_prescritos")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Metas salvas.");
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Erro ao salvar."),
  });

  const addItem = useMutation({
    mutationFn: async (input: { refeicao: string; alimento_id: string; gramas: number }) => {
      let protId = protocolo?.id;
      if (!protId) {
        // Re-check to avoid race on UNIQUE(user_id) when adding the first item twice quickly
        const { data: existing } = await supabase
          .from("protocolos_prescritos")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        if (existing?.id) {
          protId = existing.id;
        } else {
          const { data: created, error } = await supabase
            .from("protocolos_prescritos")
            .insert({ user_id: userId })
            .select("id")
            .single();
          if (error) throw error;
          protId = created.id;
        }
      }
      const ordem = (data?.itens ?? []).filter((i) => i.refeicao === input.refeicao).length;
      const { error: ie } = await supabase.from("protocolo_itens").insert({
        protocolo_id: protId,
        refeicao: input.refeicao,
        alimento_id: input.alimento_id,
        gramas: input.gramas,
        ordem,
      });
      if (ie) throw ie;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Erro ao adicionar item."),
  });

  const delItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("protocolo_itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Carregando protocolo…</CardContent>
      </Card>
    );
  }

  const itensPorRefeicao = (data?.itens ?? []).reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.refeicao] ??= []).push(it);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4 text-primary" /> Protocolo Prescrito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Metas */}
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Kcal" value={form.meta_kcal} onChange={(v) => setMetas({ ...form, meta_kcal: v })} />
          <Field label="Proteínas (g)" value={form.meta_proteinas} onChange={(v) => setMetas({ ...form, meta_proteinas: v })} />
          <Field label="Carbo (g)" value={form.meta_carboidratos} onChange={(v) => setMetas({ ...form, meta_carboidratos: v })} />
          <Field label="Gord. (g)" value={form.meta_gorduras} onChange={(v) => setMetas({ ...form, meta_gorduras: v })} />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Observações</div>
          <Textarea
            value={form.observacoes}
            onChange={(e) => setMetas({ ...form, observacoes: e.target.value })}
            placeholder="Notas para o aluno (opcional)…"
            className="min-h-[60px]"
          />
        </div>
        <Button
          onClick={() => saveMetas.mutate()}
          disabled={saveMetas.isPending}
          className="bg-gradient-ember text-primary-foreground"
        >
          <Save className="h-4 w-4" /> {saveMetas.isPending ? "Salvando…" : "Salvar metas"}
        </Button>

        {/* Itens por refeição */}
        <div className="space-y-3 pt-2">
          {MEAL_KEYS.map((m) => (
            <RefeicaoBloco
              key={m}
              refeicao={m}
              itens={itensPorRefeicao[m] ?? []}
              alimentos={alimentos}
              onAdd={(alimento_id, gramas) =>
                addItem.mutate({ refeicao: m, alimento_id, gramas })
              }
              onDelete={(id) => delItem.mutate(id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <Input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function RefeicaoBloco({
  refeicao,
  itens,
  alimentos,
  onAdd,
  onDelete,
}: {
  refeicao: string;
  itens: Item[];
  alimentos: Alimento[];
  onAdd: (alimento_id: string, gramas: number) => void;
  onDelete: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Alimento | null>(null);
  const [gramas, setGramas] = useState("100");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return alimentos.slice(0, 30);
    return alimentos.filter((a) => a.nome.toLowerCase().includes(t)).slice(0, 30);
  }, [q, alimentos]);

  const submit = () => {
    const g = parseFloat(gramas);
    if (!picked || !Number.isFinite(g) || g <= 0) {
      toast.error("Escolha um alimento e informe os gramas.");
      return;
    }
    onAdd(picked.id, g);
    setPicked(null);
    setGramas("100");
    setQ("");
    setAdding(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {MEAL_LABELS[refeicao]}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setAdding((s) => !s)} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Adicionar
        </Button>
      </div>

      {itens.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">Nenhum item.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {itens.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{it.alimento.nome}</div>
                <div className="text-[10px] text-muted-foreground">
                  {CATEGORIA_LABELS[it.alimento.categoria] ?? it.alimento.categoria} · {it.gramas} g
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(it.id)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <div className="mt-3 space-y-2 rounded-lg border border-dashed border-border p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar alimento…"
              className="pl-8 h-9"
            />
          </div>
          <div className="max-h-40 overflow-y-auto rounded-md border border-border/60">
            {filtered.length === 0 ? (
              <div className="p-2 text-xs text-muted-foreground">Nenhum alimento.</div>
            ) : (
              <ul className="divide-y divide-border/40 text-sm">
                {filtered.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setPicked(a)}
                      className={`flex w-full items-center justify-between px-2 py-1.5 text-left ${
                        picked?.id === a.id ? "bg-primary/10 text-primary" : "hover:bg-secondary/40"
                      }`}
                    >
                      <span className="truncate">{a.nome}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {CATEGORIA_LABELS[a.categoria] ?? a.categoria}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="decimal"
              value={gramas}
              onChange={(e) => setGramas(e.target.value)}
              placeholder="gramas"
              className="h-9"
            />
            <Button size="sm" onClick={submit}>
              Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
