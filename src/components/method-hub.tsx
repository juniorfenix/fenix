import { useEffect, useMemo, useState } from "react";
import {
  ChefHat,
  Compass,
  ClipboardCheck,
  TrendingDown,
  Clock,
  Check,
  ArrowLeft,
  Search,
  Utensils,
  Pizza,
  PartyPopper,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ---------------- Conteúdo ----------------

const MEAL_PREP_STEPS: { range: string; title: string; desc: string }[] = [
  {
    range: "0-5 min",
    title: "Lista e mise en place",
    desc: "Separe panelas, tábuas, recipientes. Tenha a lista da semana à vista.",
  },
  {
    range: "5-15 min",
    title: "Proteína no fogo",
    desc: "Frango, ovos cozidos ou carne moída — o que demora mais vai primeiro.",
  },
  {
    range: "15-25 min",
    title: "Carboidrato base",
    desc: "Arroz integral, batata-doce ou mandioquinha — porções para 4–5 refeições.",
  },
  {
    range: "25-35 min",
    title: "Vegetais e folhas",
    desc: "Refogue legumes, higienize e seque as folhas. Tudo em pote com papel toalha.",
  },
  {
    range: "35-45 min",
    title: "Snacks e lanches",
    desc: "Ovos cozidos, iogurte porcionado, castanhas em saquinhos individuais.",
  },
  {
    range: "45-55 min",
    title: "Montagem dos potes",
    desc: "Divida em marmitas equilibradas: 1 proteína + 1 carbo + 2 vegetais.",
  },
  {
    range: "55-60 min",
    title: "Limpeza e etiqueta",
    desc: "Lave tudo, etiquete com data. Geladeira até 4 dias, freezer até 30.",
  },
];

const FORA_DE_CASA = {
  Restaurantes: {
    icon: Utensils,
    items: [
      "Olhe o cardápio antes de chegar — decisão em casa, com calma.",
      "Proteína grelhada + salada + 1 carbo. Nunca 2 carbos.",
      "Molhos à parte — você controla a quantidade.",
      "Sobremesa? Compartilhe ou troque por café puro.",
    ],
  },
  "Fast Food": {
    icon: Pizza,
    items: [
      "Sanduíche simples > combo. Refrigerante zero ou água.",
      "Frango grelhado > frito. Salada como acompanhamento.",
      "Sem maionese e sem queijo extra reduz 200–300 kcal fácil.",
      "Se for pizza: 2 fatias finas + salada > 4 fatias grossas.",
    ],
  },
  Festas: {
    icon: PartyPopper,
    items: [
      "Coma proteína 1h antes — chega sem fome desesperada.",
      "Regra do prato único: monte 1 vez, sem repetir.",
      "Álcool: alterne com água. Destilado puro > drink doce.",
      "Fique longe da mesa de petiscos. Circule, dance, converse.",
    ],
  },
  Viagens: {
    icon: Plane,
    items: [
      "Mochila com whey em sachê, castanhas, frutas secas, jerky.",
      "Hotel: café com ovos + fruta + 1 carbo integral. Pule o pão doce.",
      "Hidrate em dobro — avião e ar-condicionado desidratam.",
      "Caminhe 20 min ao chegar para regular o relógio biológico.",
    ],
  },
} as const;

type RecipeCategory = "Café" | "Almoço" | "Jantar" | "Lanche";

type Recipe = {
  id: string;
  nome: string;
  categoria: RecipeCategory;
  tempo: number; // min
  kcal: number;
  ingredientes: string[];
  passos: string[];
};

const RECEITAS: Recipe[] = [
  // Café
  {
    id: "r1",
    nome: "Omelete de espinafre",
    categoria: "Café",
    tempo: 8,
    kcal: 280,
    ingredientes: ["2 ovos", "1 xíc espinafre", "1 col chá azeite", "sal e pimenta"],
    passos: [
      "Bata os ovos com sal.",
      "Aqueça azeite, refogue espinafre 1 min.",
      "Despeje os ovos, cozinhe 2 min de cada lado.",
    ],
  },
  {
    id: "r2",
    nome: "Panqueca de banana e aveia",
    categoria: "Café",
    tempo: 10,
    kcal: 320,
    ingredientes: ["1 banana", "2 ovos", "3 col aveia", "canela"],
    passos: [
      "Amasse a banana com os ovos.",
      "Adicione aveia e canela.",
      "Frite em frigideira antiaderente 2 min cada lado.",
    ],
  },
  {
    id: "r3",
    nome: "Tapioca proteica de frango",
    categoria: "Café",
    tempo: 12,
    kcal: 350,
    ingredientes: ["3 col tapioca", "60g frango desfiado", "queijo branco"],
    passos: [
      "Espalhe tapioca em frigideira quente.",
      "Vire quando soltar.",
      "Recheie com frango e queijo, dobre.",
    ],
  },
  {
    id: "r4",
    nome: "Iogurte com granola caseira",
    categoria: "Café",
    tempo: 5,
    kcal: 290,
    ingredientes: ["200g iogurte natural", "3 col granola", "1 col mel", "frutas vermelhas"],
    passos: [
      "Coloque iogurte numa tigela.",
      "Adicione granola e mel.",
      "Finalize com frutas vermelhas.",
    ],
  },
  {
    id: "r5",
    nome: "Smoothie verde proteico",
    categoria: "Café",
    tempo: 5,
    kcal: 260,
    ingredientes: ["1 scoop whey", "1 banana", "1 punhado espinafre", "200ml leite vegetal"],
    passos: ["Bata tudo no liquidificador 60s.", "Sirva imediatamente."],
  },
  // Almoço
  {
    id: "r6",
    nome: "Frango grelhado com batata-doce",
    categoria: "Almoço",
    tempo: 25,
    kcal: 480,
    ingredientes: ["150g peito frango", "150g batata-doce", "salada verde", "azeite"],
    passos: [
      "Cozinhe batata-doce 15 min.",
      "Grelhe o frango 6 min cada lado.",
      "Monte com salada e fio de azeite.",
    ],
  },
  {
    id: "r7",
    nome: "Salmão ao forno com arroz integral",
    categoria: "Almoço",
    tempo: 30,
    kcal: 520,
    ingredientes: ["150g salmão", "100g arroz integral", "brócolis", "limão"],
    passos: [
      "Tempere o salmão com limão e sal.",
      "Asse 15 min a 200°C.",
      "Sirva com arroz e brócolis no vapor.",
    ],
  },
  {
    id: "r8",
    nome: "Carne moída com abobrinha",
    categoria: "Almoço",
    tempo: 20,
    kcal: 440,
    ingredientes: ["120g patinho moído", "1 abobrinha", "tomate", "cebola"],
    passos: [
      "Refogue cebola e tomate.",
      "Adicione carne, cozinhe 8 min.",
      "Junte abobrinha em cubos por 5 min.",
    ],
  },
  {
    id: "r9",
    nome: "Tilápia com purê de couve-flor",
    categoria: "Almoço",
    tempo: 25,
    kcal: 380,
    ingredientes: ["150g tilápia", "1/2 couve-flor", "alho", "azeite"],
    passos: [
      "Cozinhe couve-flor, amasse com azeite e alho.",
      "Grelhe tilápia 4 min cada lado.",
      "Sirva sobre o purê.",
    ],
  },
  {
    id: "r10",
    nome: "Wrap de frango e abacate",
    categoria: "Almoço",
    tempo: 15,
    kcal: 460,
    ingredientes: ["1 tortilla integral", "100g frango desfiado", "1/2 abacate", "rúcula"],
    passos: [
      "Amasse o abacate com sal e limão.",
      "Espalhe na tortilla.",
      "Adicione frango e rúcula, enrole.",
    ],
  },
  {
    id: "r11",
    nome: "Bowl de quinoa e grão-de-bico",
    categoria: "Almoço",
    tempo: 25,
    kcal: 510,
    ingredientes: ["80g quinoa", "100g grão-de-bico", "pepino", "tomate", "tahine"],
    passos: [
      "Cozinhe quinoa 15 min.",
      "Misture com grão-de-bico e vegetais.",
      "Finalize com tahine.",
    ],
  },
  // Jantar
  {
    id: "r12",
    nome: "Sopa de legumes com frango",
    categoria: "Jantar",
    tempo: 30,
    kcal: 320,
    ingredientes: ["100g frango", "cenoura", "abobrinha", "chuchu", "caldo natural"],
    passos: [
      "Refogue legumes.",
      "Adicione frango e caldo, cozinhe 20 min.",
      "Tempere e sirva quente.",
    ],
  },
  {
    id: "r13",
    nome: "Ovos mexidos com tomate cereja",
    categoria: "Jantar",
    tempo: 8,
    kcal: 280,
    ingredientes: ["3 ovos", "punhado tomate cereja", "manteiga ghee", "cebolinha"],
    passos: [
      "Doure tomates na ghee.",
      "Adicione ovos batidos, mexa em fogo baixo.",
      "Finalize com cebolinha.",
    ],
  },
  {
    id: "r14",
    nome: "Salada quente de atum",
    categoria: "Jantar",
    tempo: 10,
    kcal: 340,
    ingredientes: ["1 lata atum em água", "mix de folhas", "ovo cozido", "azeite"],
    passos: ["Escorra o atum.", "Misture com folhas e ovo picado.", "Tempere com azeite e limão."],
  },
  {
    id: "r15",
    nome: "Berinjela recheada com carne",
    categoria: "Jantar",
    tempo: 35,
    kcal: 410,
    ingredientes: ["1 berinjela", "100g carne moída", "queijo branco", "tomate"],
    passos: [
      "Corte berinjela ao meio, retire polpa.",
      "Refogue carne com tomate e polpa.",
      "Recheie, cubra com queijo, asse 15 min.",
    ],
  },
  // Lanches
  {
    id: "r16",
    nome: "Mix energético",
    categoria: "Lanche",
    tempo: 2,
    kcal: 200,
    ingredientes: ["10 amêndoas", "5 castanhas", "1 col passas"],
    passos: ["Misture tudo num saquinho.", "Carregue para o trabalho ou treino."],
  },
  {
    id: "r17",
    nome: "Pasta de amendoim com banana",
    categoria: "Lanche",
    tempo: 3,
    kcal: 240,
    ingredientes: ["1 banana", "1 col pasta amendoim integral", "canela"],
    passos: ["Corte a banana em rodelas.", "Espalhe pasta de amendoim.", "Polvilhe canela."],
  },
  {
    id: "r18",
    nome: "Iogurte com cacau e mel",
    categoria: "Lanche",
    tempo: 3,
    kcal: 190,
    ingredientes: ["170g iogurte grego", "1 col cacau 100%", "1 col mel"],
    passos: ["Misture tudo numa tigela.", "Geladeira por 5 min, sirva."],
  },
  {
    id: "r19",
    nome: "Ovos cozidos com pimenta",
    categoria: "Lanche",
    tempo: 12,
    kcal: 160,
    ingredientes: ["2 ovos", "sal", "pimenta-do-reino"],
    passos: ["Cozinhe ovos 8 min.", "Resfrie em água gelada.", "Descasque, tempere e sirva."],
  },
  {
    id: "r20",
    nome: "Cookie proteico de aveia",
    categoria: "Lanche",
    tempo: 15,
    kcal: 220,
    ingredientes: ["1 scoop whey", "3 col aveia", "1 banana", "cacau"],
    passos: ["Amasse tudo numa tigela.", "Forme bolinhas e achate.", "Asse 12 min a 180°C."],
  },
  {
    id: "r21",
    nome: "Queijo branco com tomate seco",
    categoria: "Lanche",
    tempo: 2,
    kcal: 180,
    ingredientes: ["80g queijo branco", "4 tomates secos", "orégano"],
    passos: ["Corte o queijo em cubos.", "Cubra com tomate seco e orégano."],
  },
];

const PLATEAU_OPCOES = [
  {
    id: "calorias",
    pergunta:
      "Você está cumprindo as calorias da meta há pelo menos 3 semanas seguidas sem sair do peso?",
    estrategia: "Ajuste Calórico",
    resumo:
      "Seu metabolismo se adaptou. Reduza 100–150 kcal/dia (não mais que isso) e mantenha por 2 semanas. Priorize cortar carboidrato refinado, não proteína.",
  },
  {
    id: "treino",
    pergunta:
      "Você faz a mesma rotina de treino há mais de 6 semanas sem trocar exercícios ou intensidade?",
    estrategia: "Variação de Treino",
    resumo:
      "O corpo virou expert no que você faz. Troque 50% dos exercícios, aumente carga em 5% ou adicione 1 sessão de HIIT 2x/semana por 3 semanas.",
  },
  {
    id: "sodio",
    pergunta:
      "Você se sente inchado, peso oscila muito de um dia pro outro e está com pouco sódio/carboidrato?",
    estrategia: "Ciclo Sódio/Carbo",
    resumo:
      "Retenção mascarando a perda real. Aumente sódio para 3–4g/dia por 5 dias e faça 1 dia de carbo refeed (+50% carbos). Pesa de novo no 7º dia.",
  },
  {
    id: "recarga",
    pergunta:
      "Você está em déficit há mais de 10 semanas seguidas, cansado, com sono ruim e treino caindo?",
    estrategia: "Semana de Recarga",
    resumo:
      "Hormônios pedindo pausa. 7–10 dias comendo na manutenção (não acima). Você não engorda, e o corpo volta a responder ao déficit depois.",
  },
] as const;

// ---------------- Hub Cards ----------------

type HubKey = "mealprep" | "fora" | "cozinha" | "plateau";

const HUB_CARDS: { key: HubKey; icon: LucideIcon; title: string; subtitle: string }[] = [
  { key: "mealprep", icon: ClipboardCheck, title: "Meal Prep", subtitle: "Checklist 0–60 min" },
  { key: "fora", icon: Compass, title: "Fora de Casa", subtitle: "Restaurante, festa, viagem" },
  { key: "cozinha", icon: ChefHat, title: "Cozinha Fênix", subtitle: "21 receitas práticas" },
  {
    key: "plateau",
    icon: TrendingDown,
    title: "Protocolo Plateau",
    subtitle: "Diagnóstico em 4 passos",
  },
];

export function MethodHub() {
  const [open, setOpen] = useState<HubKey | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {HUB_CARDS.map((c) => (
          <button
            key={c.key}
            onClick={() => setOpen(c.key)}
            className="group glass rounded-2xl p-4 text-left transition hover:border-primary/40 hover:bg-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ember shadow-ember">
              <c.icon className="h-5 w-5 text-primary-foreground" strokeWidth={1.75} />
            </div>
            <div className="mt-3 text-[15px] font-semibold tracking-tight">{c.title}</div>
            <div className="text-[12.5px] text-foreground/60 mt-0.5 leading-snug">{c.subtitle}</div>
          </button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {open === "mealprep" && <MealPrepChecklist />}
          {open === "fora" && <ForaDeCasa />}
          {open === "cozinha" && <CozinhaFenix />}
          {open === "plateau" && <ProtocoloPlateau />}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------- Meal Prep ----------------

const MP_KEY = "fenix:mealprep";

function MealPrepChecklist() {
  const [done, setDone] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(MP_KEY);
      return new Set<number>(raw ? (JSON.parse(raw) as number[]) : []);
    } catch {
      return new Set<number>();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MP_KEY, JSON.stringify([...done]));
    } catch {
      /* ignore */
    }
  }, [done]);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const pct = Math.round((done.size / MEAL_PREP_STEPS.length) * 100);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <ClipboardCheck className="h-5 w-5 text-primary" /> Meal Prep — 60 minutos
        </DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {done.size} de {MEAL_PREP_STEPS.length} concluídos
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-ember transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {MEAL_PREP_STEPS.map((s, i) => {
          const checked = done.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                aria-pressed={checked}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  checked
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.range}
                    </div>
                    <div
                      className={`text-[15px] font-medium ${checked ? "line-through text-muted-foreground" : ""}`}
                    >
                      {s.title}
                    </div>
                    <div className="text-[13px] text-foreground/65 mt-1 leading-relaxed">
                      {s.desc}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {done.size > 0 && (
        <button
          onClick={() => setDone(new Set())}
          className="mt-3 text-xs text-muted-foreground hover:text-foreground underline"
        >
          Reiniciar checklist
        </button>
      )}
    </>
  );
}

// ---------------- Fora de Casa ----------------

function ForaDeCasa() {
  const keys = Object.keys(FORA_DE_CASA) as (keyof typeof FORA_DE_CASA)[];
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <Compass className="h-5 w-5 text-primary" /> Guia Fora de Casa
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue={keys[0]} className="mt-3">
        <TabsList className="grid grid-cols-4 w-full">
          {keys.map((k) => {
            const Icon = FORA_DE_CASA[k].icon;
            return (
              <TabsTrigger key={k} value={k} className="text-xs gap-1.5">
                <Icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{k}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {keys.map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <ul className="space-y-3">
              {FORA_DE_CASA[k].items.map((it, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-[1.65]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-accent/40 text-[11px] font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-foreground/90">{it}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

// ---------------- Cozinha Fênix ----------------

const CATEGORIAS: ("Todas" | RecipeCategory)[] = ["Todas", "Café", "Almoço", "Jantar", "Lanche"];

function CozinhaFenix() {
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todas");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Recipe | null>(null);

  const filtered = useMemo(() => {
    const norm = q.toLowerCase().trim();
    return RECEITAS.filter((r) => {
      const matchCat = cat === "Todas" || r.categoria === cat;
      const matchQ =
        !norm ||
        r.nome.toLowerCase().includes(norm) ||
        r.ingredientes.some((i) => i.toLowerCase().includes(norm));
      return matchCat && matchQ;
    });
  }, [cat, q]);

  if (selected) {
    return (
      <>
        <DialogHeader>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground self-start"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </button>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {selected.nome}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {selected.tempo} min
          </span>
          <span>•</span>
          <span>{selected.kcal} kcal</span>
          <span>•</span>
          <span>{selected.categoria}</span>
        </div>
        <div className="mt-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Ingredientes
          </h4>
          <ul className="space-y-2">
            {selected.ingredientes.map((i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-[1.6]">
                <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-foreground/85">{i}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Modo de preparo
          </h4>
          <ol className="space-y-3">
            {selected.passos.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-[1.65]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gradient-ember text-xs font-semibold text-primary-foreground shadow-ember">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <ChefHat className="h-5 w-5 text-primary" /> Cozinha Fênix
        </DialogTitle>
      </DialogHeader>
      <div className="mt-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar receita ou ingrediente..."
          className="pl-9 h-10"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma receita encontrada.
          </p>
        ) : (
          filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="rounded-xl border border-border bg-card/50 p-3 text-left transition hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[15px] font-medium truncate">{r.nome}</div>
                  <div className="text-[12.5px] text-foreground/60 mt-1">
                    {r.categoria} • {r.kcal} kcal
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[12.5px] text-foreground/60 shrink-0">
                  <Clock className="h-3.5 w-3.5" /> {r.tempo}min
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}

// ---------------- Protocolo Plateau ----------------

export function ProtocoloPlateau() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  if (step >= PLATEAU_OPCOES.length) {
    const recomendadas = PLATEAU_OPCOES.filter((o) => answers[o.id]);
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
            <TrendingDown className="h-5 w-5 text-primary" /> Diagnóstico
          </DialogTitle>
        </DialogHeader>
        {recomendadas.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-card/50 p-4 text-sm">
            Nenhum gatilho clássico identificado. Antes de mexer no plano, audite 7 dias com tudo
            registrado (refeições, líquidos, treino e sono). 80% dos "plateaus" são erro de leitura,
            não adaptação real.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Estratégia recomendada
            </div>
            {recomendadas.map((o) => (
              <div key={o.id} className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-display text-lg tracking-tight">{o.estrategia}</span>
                </div>
                <p className="mt-2 text-[15px] text-foreground/85 leading-[1.65]">{o.resumo}</p>
              </div>
            ))}
          </div>
        )}
        <Button onClick={reset} variant="outline" className="mt-4 w-full">
          Refazer diagnóstico
        </Button>
      </>
    );
  }

  const atual = PLATEAU_OPCOES[step];
  const respond = (val: boolean) => {
    setAnswers((p) => ({ ...p, [atual.id]: val }));
    setStep((s) => s + 1);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
          <TrendingDown className="h-5 w-5 text-primary" /> Protocolo Plateau
        </DialogTitle>
      </DialogHeader>
      <div className="mt-2 text-xs text-muted-foreground">
        Pergunta {step + 1} de {PLATEAU_OPCOES.length}
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-ember transition-all"
          style={{ width: `${((step + 1) / PLATEAU_OPCOES.length) * 100}%` }}
        />
      </div>
      <p className="mt-5 font-display text-xl leading-snug tracking-tight text-foreground/95">
        {atual.pergunta}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12" onClick={() => respond(false)}>
          Não
        </Button>
        <Button
          className="h-12 bg-gradient-ember text-primary-foreground"
          onClick={() => respond(true)}
        >
          Sim
        </Button>
      </div>
    </>
  );
}
