import { useEffect, useState } from "react";
import { Heart, Sparkles, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { todayISO } from "@/lib/calories";
import { toast } from "sonner";

type MoodKey = "muito_baixo" | "baixo" | "neutro" | "bom" | "otimo";

const MOODS: { key: MoodKey; emoji: string; label: string }[] = [
  { key: "muito_baixo", emoji: "😞", label: "Muito desanimado" },
  { key: "baixo", emoji: "🙁", label: "Desanimado" },
  { key: "neutro", emoji: "😐", label: "Neutro" },
  { key: "bom", emoji: "🙂", label: "Animado" },
  { key: "otimo", emoji: "🤩", label: "Muito animado" },
];

// Frases curtas no tom Fênix — uma para cada humor.
const FRASES: Record<MoodKey, string[]> = {
  muito_baixo: [
    "Dias difíceis fazem parte do processo. Hoje, sua vitória é apenas não desistir.",
    "A Fênix renasce do silêncio. Faça o mínimo combinado — só isso já te coloca à frente de ontem.",
    "Você não precisa estar bem para fazer o certo. Um copo de água, uma respiração, um passo.",
  ],
  baixo: [
    "Energia baixa não é desculpa, é informação. Ajuste o ritmo, mas mantenha a direção.",
    "Constância > intensidade. Hoje, entregue 60% com excelência.",
    "Tropeçar não é cair. Levante a cabeça e dê o próximo passo do plano.",
  ],
  neutro: [
    "Neutro é solo fértil. Plante uma ação simples e vê o que floresce.",
    "Sem drama, sem desculpa — execute. O resultado vem da repetição, não da motivação.",
    "Dia médio é onde o método trabalha por você. Confia no sistema.",
  ],
  bom: [
    "Energia boa? Use para empilhar hábitos: treino + água + sono.",
    "Aproveite o dia bom para deixar a próxima versão de você mais fácil.",
    "Você está em ritmo. Não acelere — sustente.",
  ],
  otimo: [
    "Pico de energia é para construir, não para gastar. Ataque o que estava adiando.",
    "Use o dia ótimo para registrar tudo: humor alto + dado bom = roteiro replicável.",
    "Fênix em chamas. Lembre: amanhã, o método continua — mesmo se a chama baixar.",
  ],
};

function frasePara(mood: MoodKey): string {
  const arr = FRASES[mood];
  return arr[Math.floor(Math.random() * arr.length)];
}

const PERGUNTA = "Como você está hoje?";

export function HumorCheckIn() {
  const { user } = useAuth();
  const userId = user?.id;

  const [loaded, setLoaded] = useState(false);
  const [savedMood, setSavedMood] = useState<MoodKey | null>(null);
  const [frase, setFrase] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Verifica se já registrou o humor hoje.
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("diario_registro")
        .select("humor,resposta")
        .eq("user_id", userId)
        .eq("registrado_em", todayISO())
        .eq("pergunta", PERGUNTA)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!alive) return;
      if (data?.humor) {
        setSavedMood(data.humor as MoodKey);
        setFrase(data.resposta ?? null);
      }
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const pick = async (mood: MoodKey) => {
    if (!userId || saving) return;
    if (savedMood && !editing) return;
    setSaving(true);
    const novaFrase = frasePara(mood);
    const prevMood = savedMood;
    const prevFrase = frase;
    // Optimistic UI
    setSavedMood(mood);
    setFrase(novaFrase);
    setEditing(false);
    try {
      const { error } = await supabase.from("diario_registro").insert({
        user_id: userId,
        pergunta: PERGUNTA,
        humor: mood,
        resposta: novaFrase,
        registrado_em: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success(prevMood ? "Humor atualizado" : "Humor registrado");
    } catch {
      setSavedMood(prevMood);
      setFrase(prevFrase);
      toast.error("Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return <div className="mt-4 glass rounded-2xl p-5 h-[112px] animate-pulse opacity-60" />;
  }

  const locked = !!savedMood && !editing;

  return (
    <section className="mt-4 glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-4 w-4 text-primary" />
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Como você está hoje?
        </h3>
        {locked ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition"
          >
            <Check className="h-3 w-3" /> registrado · alterar
          </button>
        ) : savedMood && editing ? (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
          >
            cancelar
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-1.5">
        {MOODS.map((m) => {
          const active = savedMood === m.key;
          const dim = locked && !active;
          return (
            <button
              key={m.key}
              type="button"
              aria-label={m.label}
              aria-pressed={active}
              disabled={locked || saving}
              onClick={() => pick(m.key)}
              className={`flex-1 grid place-items-center rounded-xl py-2.5 text-2xl transition ${
                active
                  ? "bg-gradient-ember shadow-ember scale-110"
                  : dim
                    ? "opacity-30"
                    : "bg-card/40 hover:bg-card hover:scale-110 active:scale-95"
              } ${locked ? "" : "cursor-pointer"}`}
            >
              <span>{m.emoji}</span>
            </button>
          );
        })}
      </div>

      {frase && (
        <div className="mt-4 flex gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <p className="text-sm leading-relaxed text-foreground/90">{frase}</p>
        </div>
      )}
    </section>
  );
}
