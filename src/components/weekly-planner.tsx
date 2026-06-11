import { useEffect, useMemo, useState, useRef } from "react";
import {
  CalendarDays,
  Save,
  Lightbulb,
  AlertTriangle,
  Droplet,
  Beef,
  Target,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ProtocoloPlateau } from "@/components/method-hub";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// ---------------- Tipos ----------------

type Habits = {
  plano: boolean;
  treino: boolean;
  agua: boolean;
  sono: boolean;
  diario: boolean;
};

type DayState = {
  treino: string;
  refeicoes: string;
  agua: number;
  humor: number;
  habitos: Habits;
};

type WeekPlan = {
  intencao: string;
  dias: DayState[];
  funcionou: string;
  melhorar: string;
  sensacao: string;
};

const DIAS_CURTO = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DIAS_LONGO = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const HUMOR_EMOJI = ["😞", "🙁", "😐", "🙂", "🤩"];

const DICAS_DIA: { titulo: string; texto: string }[] = [
  {
    titulo: "Meal Prep da semana",
    texto:
      "Reserve 60 min hoje para deixar 4–5 marmitas prontas. Proteína + carbo + vegetais. A semana inteira fica leve quando a segunda começa organizada.",
  },
  {
    titulo: "Suplementação consciente",
    texto:
      "O melhor suplemento é a consistência. Antes de comprar qualquer pote, garanta proteína suficiente na comida (1.6–2g/kg) e creatina 3–5g/dia.",
  },
  {
    titulo: "Varie 1 estímulo no treino",
    texto:
      "Troque a ordem de 2 exercícios ou aumente a carga em 5%. O corpo só responde quando você dá um motivo novo para se adaptar.",
  },
  {
    titulo: "Hidratação antes do café",
    texto:
      "Beba 500 ml de água ao acordar, antes do café. Você acorda desidratado e isso confunde fome com sede o dia inteiro.",
  },
  {
    titulo: "Cardápio antes do restaurante",
    texto:
      "Vai sair? Abra o cardápio em casa e escolha agora. Decisão na fome = decisão ruim. Proteína grelhada + 1 carbo + salada quase sempre resolve.",
  },
  {
    titulo: "Estratégia de festa",
    texto:
      "Coma uma refeição com proteína 1h antes. Na festa: regra do prato único, álcool alternado com água, destilado puro melhor que drink doce.",
  },
  {
    titulo: "Domingo é sono e revisão",
    texto:
      "Desligue telas 1h antes de dormir. 8h de sono é o suplemento mais barato. Aproveite e revise o que funcionou na semana — sem julgamento.",
  },
];

const HABITOS_DEF: { key: keyof Habits; label: string; short: string }[] = [
  { key: "plano", label: "Segui o plano alimentar", short: "Plano" },
  { key: "treino", label: "Treinei", short: "Treino" },
  { key: "agua", label: "Bebi 2L+ de água", short: "Água" },
  { key: "sono", label: "Dormi 7h+", short: "Sono" },
  { key: "diario", label: "Registrei o diário", short: "Diário" },
];

// ---------------- Helpers ----------------

function emptyHabits(): Habits {
  return { plano: false, treino: false, agua: false, sono: false, diario: false };
}
function emptyDay(): DayState {
  return { treino: "", refeicoes: "", agua: 0, humor: 3, habitos: emptyHabits() };
}
function emptyPlan(): WeekPlan {
  return {
    intencao: "",
    dias: Array.from({ length: 7 }, emptyDay),
    funcionou: "",
    melhorar: "",
    sensacao: "",
  };
}

function weekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((d.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    );
  return `${d.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

// Normaliza planos antigos salvos no localStorage
function mergePlan(raw: unknown): WeekPlan {
  const base = emptyPlan();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<WeekPlan>;
  const dias = Array.from({ length: 7 }, (_, i) => {
    const src = (r.dias?.[i] ?? {}) as Partial<DayState>;
    return {
      ...emptyDay(),
      ...src,
      habitos: { ...emptyHabits(), ...(src.habitos ?? {}) },
    };
  });
  return {
    intencao: r.intencao ?? "",
    funcionou: r.funcionou ?? "",
    melhorar: r.melhorar ?? "",
    sensacao: r.sensacao ?? "",
    dias,
  };
}

// ---------------- Props ----------------

export type WeeklyPlannerProps = {
  currentWeight?: number | null;
  goalWeight?: number | null;
};

export function WeeklyPlanner({ currentWeight, goalWeight }: WeeklyPlannerProps = {}) {
  const { user } = useAuth();
  const semanaIso = useMemo(() => weekKey(), []);
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<WeekPlan>(emptyPlan);
  const [tipDay, setTipDay] = useState<number | null>(null);
  const [plateauOpen, setPlateauOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const loadedRef = useRef(false);

  const loadPlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("planner_semanal")
        .select("dados")
        .eq("user_id", user.id)
        .eq("semana_iso", semanaIso)
        .maybeSingle();

      if (error) throw error;

      if (data?.dados) {
        setPlan(mergePlan(data.dados));
      } else {
        // Migra dados do localStorage para o banco se existir
        try {
          const lsKey = `fenix:planner:${semanaIso}`;
          const raw = localStorage.getItem(lsKey);
          if (raw) {
            const parsed = mergePlan(JSON.parse(raw));
            setPlan(parsed);
            await supabase
              .from("planner_semanal")
              .upsert(
                { user_id: user.id, semana_iso: semanaIso, dados: parsed },
                { onConflict: "user_id,semana_iso" },
              );
            localStorage.removeItem(lsKey);
          } else {
            setPlan(emptyPlan());
          }
        } catch {
          setPlan(emptyPlan());
        }
      }
    } catch {
      // Fallback silencioso para localStorage se offline
      try {
        const raw = localStorage.getItem(`fenix:planner:${semanaIso}`);
        if (raw) setPlan(mergePlan(JSON.parse(raw)));
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  };

  // Carrega na montagem inicial
  useEffect(() => {
    if (!user || loadedRef.current) return;
    loadedRef.current = true;
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Recarrega quando o dialog abre
  useEffect(() => {
    if (open && user) loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setDay = (i: number, patch: Partial<DayState>) => {
    setPlan((p) => {
      const dias = p.dias.slice();
      dias[i] = { ...dias[i], ...patch };
      return { ...p, dias };
    });
  };
  const toggleHabit = (i: number, h: keyof Habits) => {
    setPlan((p) => {
      const dias = p.dias.slice();
      dias[i] = { ...dias[i], habitos: { ...dias[i].habitos, [h]: !dias[i].habitos[h] } };
      return { ...p, dias };
    });
  };

  const save = async () => {
    if (!user) {
      toast.error("Faça login para salvar o planner.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("planner_semanal")
        .upsert(
          { user_id: user.id, semana_iso: semanaIso, dados: plan },
          { onConflict: "user_id,semana_iso" },
        );
      if (error) throw error;
      toast.success("Planner salvo");
      setOpen(false);
    } catch {
      toast.error("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // Metas derivadas do perfil
  const peso = typeof currentWeight === "number" && currentWeight > 0 ? currentWeight : null;
  const proteinaMeta = peso ? Math.round(peso * 1.8) : null; // g
  const aguaMetaL = peso ? Math.max(2, Math.round((peso * 35) / 100) / 10) : 2.5; // L
  const objetivo =
    peso == null || goalWeight == null
      ? null
      : goalWeight < peso
        ? "Déficit"
        : goalWeight > peso
          ? "Ganho"
          : "Manutenção";

  const preenchidos = plan.dias.filter(
    (d) => d.treino || d.refeicoes || d.agua > 0 || Object.values(d.habitos).some(Boolean),
  ).length;

  const totalHabitos = plan.dias.reduce(
    (s, d) => s + Object.values(d.habitos).filter(Boolean).length,
    0,
  );
  const maxHabitos = 7 * HABITOS_DEF.length;

  return (
    <section id="planner-semanal" className="mt-4 glass rounded-2xl p-5 scroll-mt-24">
      <div className="flex items-center gap-2 mb-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Planner Semanal</h3>
      </div>
      <p className="text-sm text-foreground/80">
        {plan.intencao ? (
          <>
            Intenção: <span className="font-medium">{plan.intencao}</span>
          </>
        ) : (
          "Planeje, execute e marque. 2 minutos por dia."
        )}
      </p>
      <div className="mt-1 text-xs text-muted-foreground">
        {preenchidos}/7 dias • {totalHabitos}/{maxHabitos} hábitos
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="mt-3 h-10 bg-gradient-ember text-primary-foreground">
            <CalendarDays className="h-4 w-4 mr-1" /> Abrir planner
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Planner Semanal</DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!loading && (
            <>
              {/* Resumo metas + emergência */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetaChip
                  icon={<Target className="h-3.5 w-3.5" />}
                  label="Objetivo"
                  value={objetivo ?? "—"}
                />
                <MetaChip
                  icon={<Beef className="h-3.5 w-3.5" />}
                  label="Proteína/dia"
                  value={proteinaMeta ? `${proteinaMeta}g` : "—"}
                />
                <MetaChip
                  icon={<Droplet className="h-3.5 w-3.5" />}
                  label="Água/dia"
                  value={`${aguaMetaL}L`}
                />
                <button
                  onClick={() => setPlateauOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/15"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Estagnado?
                </button>
              </div>

              {/* Intenção */}
              <div className="mt-4">
                <label
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                  htmlFor="intencao"
                >
                  Intenção da semana
                </label>
                <Input
                  id="intencao"
                  value={plan.intencao}
                  onChange={(e) => setPlan((p) => ({ ...p, intencao: e.target.value }))}
                  placeholder="Ex: treinar 4x e dormir 8h"
                  className="mt-1.5"
                />
              </div>

              {/* Abas */}
              <Tabs defaultValue="semana" className="mt-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="semana" className="text-xs">
                    Semana
                  </TabsTrigger>
                  <TabsTrigger value="habitos" className="text-xs">
                    Hábitos
                  </TabsTrigger>
                  <TabsTrigger value="reflexao" className="text-xs">
                    Reflexão
                  </TabsTrigger>
                </TabsList>

                {/* SEMANA */}
                <TabsContent value="semana" className="mt-3 space-y-3">
                  {DIAS_CURTO.map((nome, i) => {
                    const d = plan.dias[i];
                    return (
                      <div key={nome} className="rounded-xl border border-border bg-card/50 p-3">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-sm font-semibold">{nome}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {HUMOR_EMOJI.map((e, idx) => (
                                <button
                                  key={idx}
                                  aria-label={`humor ${idx + 1}`}
                                  onClick={() => setDay(i, { humor: idx + 1 })}
                                  className={`text-base transition ${
                                    d.humor === idx + 1
                                      ? "scale-125"
                                      : "opacity-40 hover:opacity-80"
                                  }`}
                                >
                                  {e}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setTipDay(i)}
                              className="flex items-center gap-1 rounded-md border border-accent/40 px-2 py-1 text-[11px] text-accent hover:bg-accent/10"
                              aria-label={`Dica de ${DIAS_LONGO[i]}`}
                            >
                              <Lightbulb className="h-3 w-3" /> Dica
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input
                            value={d.treino}
                            onChange={(e) => setDay(i, { treino: e.target.value })}
                            placeholder="Treino"
                            aria-label={`treino ${nome}`}
                          />
                          <Input
                            value={d.refeicoes}
                            onChange={(e) => setDay(i, { refeicoes: e.target.value })}
                            placeholder="Refeições foco"
                            aria-label={`refeições ${nome}`}
                          />
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Água</span>
                            <span>{d.agua} copos</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={12}
                            value={d.agua}
                            onChange={(e) => setDay(i, { agua: Number(e.target.value) })}
                            className="w-full accent-primary"
                            aria-label={`água ${nome}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                {/* HÁBITOS */}
                <TabsContent value="habitos" className="mt-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="text-left font-normal pb-2 pr-2">Hábito</th>
                          {DIAS_CURTO.map((d) => (
                            <th key={d} className="font-normal pb-2 px-1 text-center">
                              {d}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {HABITOS_DEF.map((h) => (
                          <tr key={h.key} className="border-t border-border">
                            <td className="py-2 pr-2 text-foreground/85">{h.label}</td>
                            {plan.dias.map((d, i) => (
                              <td key={i} className="py-2 px-1 text-center">
                                <Checkbox
                                  checked={d.habitos[h.key]}
                                  onCheckedChange={() => toggleHabit(i, h.key)}
                                  aria-label={`${h.label} ${DIAS_CURTO[i]}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Marque ao final do dia. Pequenas marcações constroem identidade.
                  </p>
                </TabsContent>

                {/* REFLEXÃO */}
                <TabsContent value="reflexao" className="mt-3 space-y-3">
                  <div>
                    <label
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                      htmlFor="funcionou"
                    >
                      O que funcionou?
                    </label>
                    <Textarea
                      id="funcionou"
                      value={plan.funcionou}
                      onChange={(e) => setPlan((p) => ({ ...p, funcionou: e.target.value }))}
                      rows={2}
                      className="mt-1.5"
                      placeholder="Hábitos, decisões, treinos que renderam."
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                      htmlFor="melhorar"
                    >
                      O que posso melhorar?
                    </label>
                    <Textarea
                      id="melhorar"
                      value={plan.melhorar}
                      onChange={(e) => setPlan((p) => ({ ...p, melhorar: e.target.value }))}
                      rows={2}
                      className="mt-1.5"
                      placeholder="Um ajuste prático para a próxima semana."
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                      htmlFor="sensacao"
                    >
                      Como me senti em relação ao meu corpo?
                    </label>
                    <Textarea
                      id="sensacao"
                      value={plan.sensacao}
                      onChange={(e) => setPlan((p) => ({ ...p, sensacao: e.target.value }))}
                      rows={2}
                      className="mt-1.5"
                      placeholder="Energia, postura, roupas, espelho — sem julgamento."
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={save}
                disabled={saving}
                className="mt-4 h-12 w-full bg-gradient-ember text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" /> Salvar planner
                  </>
                )}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dica do dia */}
      <Dialog open={tipDay !== null} onOpenChange={(v) => !v && setTipDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              {tipDay !== null ? `${DIAS_LONGO[tipDay]} — ${DICAS_DIA[tipDay].titulo}` : ""}
            </DialogTitle>
          </DialogHeader>
          {tipDay !== null && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {DICAS_DIA[tipDay].texto}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Protocolo Plateau */}
      <Dialog open={plateauOpen} onOpenChange={setPlateauOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <ProtocoloPlateau />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function MetaChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
