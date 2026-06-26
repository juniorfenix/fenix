import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { perfilQuery } from "@/lib/queries";
import {
  Utensils,
  ShoppingCart,
  Pill,
  Moon,
  Plane,
  PartyPopper,
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  BookOpen,
  Search,
  Quote,
  ListChecks,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { MethodHub } from "@/components/method-hub";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/method")({
  component: Method,
});

// ---------- Conteúdo ----------

const RESTAURANTE_ROWS: { local: string; icon: LucideIcon; dicas: string[] }[] = [
  {
    local: "Restaurantes",
    icon: Utensils,
    dicas: [
      "Escolha proteína grelhada + salada + 1 porção de carbo (não 2).",
      "Peça molhos à parte e use metade.",
      "Beba água antes do prato — evita confundir fome com sede.",
      "Sobremesa? Compartilhe ou troque por café puro.",
    ],
  },
  {
    local: "Viagens",
    icon: Plane,
    dicas: [
      "Leve snacks proteicos (whey em sachê, castanhas, jerky).",
      "No hotel, café da manhã: ovos + fruta + 1 carbo integral.",
      "Hidrate-se em dobro (avião desidrata).",
      "Caminhe 20 min ao chegar para regular o relógio biológico.",
    ],
  },
  {
    local: "Festas e eventos",
    icon: PartyPopper,
    dicas: [
      "Coma uma refeição proteica 1h antes — evita atacar petiscos.",
      "Regra do prato único: monte 1 vez, sem repetir.",
      "Álcool: alterne com água. Prefira destilados puros a drinks doces.",
      "Dance, circule, converse — não fique parado perto da mesa.",
    ],
  },
  {
    local: "Trabalho",
    icon: Briefcase,
    dicas: [
      "Marmita ou opção saudável mapeada antes da fome bater.",
      "Tenha sempre fruta + castanha na gaveta.",
      "Levante a cada 90 min, mesmo que por 2 minutos.",
      "Café sim, mas até as 14h — protege o sono.",
    ],
  },
];

const EVENTOS_FASES = [
  {
    fase: "Antes",
    cor: "text-accent",
    itens: [
      "Faça uma refeição com proteína + fibra 60-90 min antes.",
      "Beba 500ml de água — chega saciado, não faminto.",
      "Defina mentalmente: o que vou comer e o que vou evitar.",
    ],
  },
  {
    fase: "Durante",
    cor: "text-primary",
    itens: [
      "Comece pela salada/proteína. Carboidrato e doce por último.",
      "Mastigue devagar, pouse o talher entre garfadas.",
      "Pare ao se sentir 80% satisfeito — não 100%.",
    ],
  },
  {
    fase: "Depois",
    cor: "text-accent",
    itens: [
      "Caminhe 10-15 min se possível — ajuda na digestão.",
      "Hidrate-se bem antes de dormir.",
      "Sem culpa: volte ao plano na próxima refeição, não no dia seguinte.",
    ],
  },
];

const COMPRAS_REGRAS = [
  {
    titulo: "Compre pelo perímetro",
    desc: "Comida de verdade fica nas bordas do mercado: hortifruti, açougue, ovos, laticínios. O miolo é território dos ultraprocessados.",
  },
  {
    titulo: "Nunca vá com fome",
    desc: "Fome no mercado = carrinho cheio de besteira. Coma algo proteico antes de sair de casa.",
  },
  {
    titulo: "Lista fechada, decisão tomada",
    desc: "Vá com lista escrita. Não compre nada fora dela. Decisão de compra é melhor em casa, com calma.",
  },
];

const CHECKLIST_CAIXA = [
  "Tem mais alimento fresco do que pacote?",
  "Algum item tem mais de 5 ingredientes no rótulo?",
  "Algum produto tem açúcar nas 3 primeiras posições?",
  "Comprei vegetais para pelo menos 5 dias?",
  "Tem proteína suficiente para todas as refeições da semana?",
];

const TROCAS = [
  { de: "Refrigerante", para: "Água com gás + limão" },
  { de: "Biscoito recheado", para: "Castanhas + 1 fruta" },
  { de: "Pão branco", para: "Pão integral 100% ou tapioca" },
  { de: "Suco de caixinha", para: "Fruta inteira" },
  { de: "Iogurte adoçado", para: "Iogurte natural + mel" },
  { de: "Margarina", para: "Manteiga ou azeite extravirgem" },
  { de: "Cereal matinal açucarado", para: "Aveia em flocos" },
  { de: "Embutidos (presunto, salsicha)", para: "Ovo, frango desfiado, atum" },
];

const SUPLEMENTOS_OK = [
  {
    nome: "Whey Protein",
    motivo: "Praticidade para atingir a meta proteica diária. 1-2 doses se a comida não bastar.",
  },
  {
    nome: "Creatina",
    motivo: "3-5g/dia. Mais força, mais energia, mais músculo. O mais estudado da história.",
  },
  {
    nome: "Vitamina D3",
    motivo:
      "Maioria da população é deficiente. Faz exame e dose conforme orientação (geralmente 2.000-4.000 UI).",
  },
  {
    nome: "Ômega 3 (EPA/DHA)",
    motivo: "Anti-inflamatório, saúde cardiovascular e cerebral. 1-2g de EPA+DHA por dia.",
  },
  {
    nome: "Cafeína",
    motivo: "Pré-treino natural. 3-6mg/kg antes do treino. Café puro já resolve.",
  },
];

const SUPLEMENTOS_NAO = [
  "BCAA — desnecessário se você consome proteína suficiente.",
  "Termogênico 'queimador de gordura' — efeito mínimo, marketing máximo.",
  "Glutamina — sem efeito comprovado para quem não é atleta de elite.",
  "Pré-treinos all-in-one — caros, com doses subterapêuticas de cada coisa.",
  "Detox / colágeno em pó com vitamina X — promessas vazias, custo alto.",
];

const GUIA_COMPRA_SUP = [
  "Leia o rótulo de trás pra frente — quanto MENOS ingredientes, melhor.",
  "Desconfie de 'blends proprietários' que escondem doses.",
  "Compre cada ativo separado: 1 pote de creatina pura > pré-treino com 15 coisas.",
  "Marca certificada (selo de laboratório independente) vale o preço extra.",
  "Fuja de promessas milagrosas: 'queima 10kg', 'ganho instantâneo'.",
];

const HORMONIOS = [
  { nome: "Grelina", desc: "Hormônio da fome. Dorme mal → sobe → você come mais no dia seguinte." },
  {
    nome: "Leptina",
    desc: "Hormônio da saciedade. Dorme mal → cai → você nunca se sente satisfeito.",
  },
  {
    nome: "Cortisol",
    desc: "Hormônio do estresse. Sono ruim → cronicamente alto → acumula gordura abdominal.",
  },
];

const ROTINA_NOITE = [
  "2h antes: pare de comer. Digestão atrapalha o sono profundo.",
  "1h30 antes: desligue telas brilhantes ou use filtro de luz quente.",
  "1h antes: luzes baixas em casa — sinal para o cérebro liberar melatonina.",
  "30 min antes: chá morno (camomila, melissa), leitura, banho quente.",
  "Quarto: escuro, silencioso e frio (18-20°C é o ideal).",
  "Mesmo horário todo dia — inclusive fim de semana. Consistência > duração.",
];

const PLATEAU_ESTRATEGIAS = [
  {
    nome: "Semana de Recarga",
    desc: "7–10 dias na manutenção (não acima). Hormônios resetam e o corpo volta a responder ao déficit.",
  },
  {
    nome: "Variação de Treino",
    desc: "Troque 50% dos exercícios, suba carga em 5% ou inclua HIIT 2x/semana por 3 semanas.",
  },
  {
    nome: "Ciclo Sódio/Carbo",
    desc: "Suba sódio para 3–4g/dia por 5 dias e faça 1 dia de refeed de carbo (+50%). Pesa de novo no 7º dia.",
  },
  {
    nome: "Ajuste Calórico",
    desc: "Reduza 100–150 kcal/dia (não mais). Mantenha por 2 semanas. Corte de carbo refinado, nunca proteína.",
  },
];

// ---------- Busca ----------

type SectionKey = "praticidade" | "compras" | "suplementos" | "sono" | "plateau";

// Sinônimos / termos extras que não aparecem literalmente no conteúdo
const EXTRA_KEYWORDS: Record<SectionKey, string> = {
  praticidade: "comer fora bar churrasco aniversário social escritório",
  compras: "supermercado feira mercado lista 80/20 oitenta vinte",
  suplementos: "suplementação suplemento d3 omega cafeina pre-treino colageno",
  sono: "dormir descanso recuperação melatonina insônia noite",
  plateau: "platô estagnação travou parou não emagreço recarga refeed",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildIndex(): Record<SectionKey, string> {
  return {
    praticidade: normalize(
      [
        EXTRA_KEYWORDS.praticidade,
        ...RESTAURANTE_ROWS.flatMap((r) => [r.local, ...r.dicas]),
        ...EVENTOS_FASES.flatMap((f) => [f.fase, ...f.itens]),
      ].join(" "),
    ),
    compras: normalize(
      [
        EXTRA_KEYWORDS.compras,
        ...COMPRAS_REGRAS.flatMap((r) => [r.titulo, r.desc]),
        ...CHECKLIST_CAIXA,
        ...TROCAS.flatMap((t) => [t.de, t.para]),
      ].join(" "),
    ),
    suplementos: normalize(
      [
        EXTRA_KEYWORDS.suplementos,
        ...SUPLEMENTOS_OK.flatMap((s) => [s.nome, s.motivo]),
        ...SUPLEMENTOS_NAO,
        ...GUIA_COMPRA_SUP,
      ].join(" "),
    ),
    sono: normalize(
      [EXTRA_KEYWORDS.sono, ...HORMONIOS.flatMap((h) => [h.nome, h.desc]), ...ROTINA_NOITE].join(
        " ",
      ),
    ),
    plateau: normalize(
      [EXTRA_KEYWORDS.plateau, ...PLATEAU_ESTRATEGIAS.flatMap((e) => [e.nome, e.desc])].join(" "),
    ),
  };
}

const INDEX = buildIndex();

function matchSections(query: string): { tokens: string[]; matched: Set<SectionKey> } {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return {
      tokens: [],
      matched: new Set<SectionKey>(["praticidade", "compras", "suplementos", "sono", "plateau"]),
    };
  }
  const matched = new Set<SectionKey>();
  (Object.keys(INDEX) as SectionKey[]).forEach((k) => {
    if (tokens.every((t) => INDEX[k].includes(t))) matched.add(k);
  });
  return { tokens, matched };
}

// ---------- Highlight ----------

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts: { text: string; match: boolean }[] = [];
  const normalized = normalize(text);
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized)) !== null) {
    if (m.index > lastEnd) parts.push({ text: text.slice(lastEnd, m.index), match: false });
    parts.push({ text: text.slice(m.index, m.index + m[0].length), match: true });
    lastEnd = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (lastEnd < text.length) parts.push({ text: text.slice(lastEnd), match: false });
  return (
    <>
      {parts.map((p, i) =>
        p.match ? (
          <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

// ---------- UI helpers ----------

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-ember shadow-ember">
        <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 text-left">
        <div className="font-display text-xl leading-tight tracking-tight">{title}</div>
        <div className="text-[13.5px] text-foreground/60 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

/** Each Bullet renders an <li> — must be wrapped in a <ul>. */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[15px] leading-[1.65] text-foreground/85">
      <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </li>
  );
}

function ChecklistCard({
  title,
  items,
  variant = "check",
  tokens,
}: {
  title: string;
  items: string[];
  variant?: "check" | "ritual";
  tokens: string[];
}) {
  const isRitual = variant === "ritual";
  return (
    <div
      className={`relative rounded-2xl border-2 p-5 ${
        isRitual ? "border-primary/30 bg-primary/5" : "border-accent/30 bg-accent/5"
      }`}
    >
      <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-background px-3 py-1 border border-border">
        <ListChecks className={`h-3.5 w-3.5 ${isRitual ? "text-primary" : "text-accent"}`} />
        <span className="text-[10px] uppercase tracking-widest font-semibold">Checklist</span>
      </div>
      <h3 className="font-display text-lg leading-snug mt-1 mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it} className="flex gap-3 text-[15px] leading-[1.6]">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[11px] font-semibold ${
                isRitual ? "border-primary/40 text-primary" : "border-accent/40 text-accent"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-foreground/90">
              <Highlight text={it} tokens={tokens} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Page ----------

function Method() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const { data: perfil, isSuccess: perfilReady } = useQuery({
    ...perfilQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  const { tokens, matched } = useMemo(() => matchSections(query), [query]);

  const value = useMemo(() => {
    if (tokens.length === 0) return openSections;
    return Array.from(new Set([...openSections, ...Array.from(matched)]));
  }, [openSections, matched, tokens.length]);

  useEffect(() => {
    if (!perfilReady) return;
    const papel = perfil?.papel;
    if (papel === "instrutor" || papel === "nutricionista" || papel === "admin") {
      navigate({ to: "/app/instrutor" });
    }
  }, [perfilReady, perfil?.papel, navigate]);

  if (
    perfilReady &&
    (perfil?.papel === "instrutor" ||
      perfil?.papel === "nutricionista" ||
      perfil?.papel === "admin")
  ) {
    return null;
  }

  const sectionsOrder: SectionKey[] = ["praticidade", "compras", "suplementos", "sono", "plateau"];
  const visibleOrder = sectionsOrder.filter((k) => matched.has(k));

  return (
    <main className="mx-auto max-w-2xl px-5 pt-10 pb-12">
      <header>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Método Fênix
        </div>
        <h1 className="font-display text-4xl mt-1.5 tracking-tight">Centro de Conhecimento</h1>
        <p className="mt-3 text-[15px] leading-[1.65] text-foreground/70 max-w-prose">
          Seu consultor de elite no bolso. Guias práticos para viver o método em qualquer situação.
        </p>
      </header>

      {/* Hub de Execução */}
      <div className="mt-6">
        <MethodHub />
      </div>

      {/* Busca */}
      <div className="mt-6 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dúvida: viagem, creatina, sono, rótulo…"
          aria-label="Buscar nos guias do Método Fênix"
          className="pl-11 h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md"
          >
            limpar
          </button>
        )}
      </div>

      {visibleOrder.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum resultado para <span className="text-foreground font-medium">"{query}"</span>.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Tente: viagem, festa, creatina, whey, rótulo, supermercado, sono, cortisol.
          </p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={value}
          onValueChange={setOpenSections}
          className="mt-6 space-y-3"
        >
          {visibleOrder.map((key) => (
            <SectionAccordion key={key} sectionKey={key} tokens={tokens} />
          ))}
        </Accordion>
      )}

      {/* Card de autoridade */}
      <div className="mt-10 relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-ember p-6 shadow-ember">
        <Quote
          className="absolute -top-2 -left-2 h-20 w-20 text-primary-foreground/10"
          strokeWidth={1}
          aria-hidden
        />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-primary-foreground/80">
            Princípio Fênix
          </div>
          <p className="mt-3 font-display text-xl leading-snug text-primary-foreground">
            O melhor suplemento é a consistência.
          </p>
          <p className="mt-2 text-sm text-primary-foreground/90 leading-relaxed">
            Treinar 3x por semana, dormir 8h e comer proteína suficiente vale mais do que qualquer
            produto.
          </p>
        </div>
      </div>
    </main>
  );
}

// ---------- Section bodies ----------

function SectionAccordion({ sectionKey, tokens }: { sectionKey: SectionKey; tokens: string[] }) {
  if (sectionKey === "praticidade") {
    return (
      <AccordionItem
        value="praticidade"
        className="glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20"
      >
        <AccordionTrigger className="hover:no-underline py-5">
          <SectionTitle
            icon={Utensils}
            title="Guia de Praticidade"
            subtitle="Como comer fora de casa"
          />
        </AccordionTrigger>
        <AccordionContent className="pb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs uppercase tracking-wider w-[140px]">
                    Situação
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Como agir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RESTAURANTE_ROWS.map((row) => (
                  <TableRow key={row.local} className="border-border/40 align-top">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <row.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
                        <span className="font-medium text-sm">
                          <Highlight text={row.local} tokens={tokens} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <ul className="space-y-1.5">
                        {row.dicas.map((d) => (
                          <Bullet key={d}>
                            <Highlight text={d} tokens={tokens} />
                          </Bullet>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Eventos sociais — Antes, Durante e Depois
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {EVENTOS_FASES.map((f) => (
                <div key={f.fase} className="rounded-xl border border-border/60 p-4">
                  <div className={`text-[13px] font-semibold uppercase tracking-widest ${f.cor}`}>
                    {f.fase}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {f.itens.map((it) => (
                      <Bullet key={it}>
                        <Highlight text={it} tokens={tokens} />
                      </Bullet>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (sectionKey === "compras") {
    return (
      <AccordionItem
        value="compras"
        className="glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20"
      >
        <AccordionTrigger className="hover:no-underline py-5">
          <SectionTitle
            icon={ShoppingCart}
            title="Guia de Compras Inteligente"
            subtitle="Supermercado sem armadilhas"
          />
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          <div>
            <h3 className="font-display text-lg mb-2 tracking-tight">Regra dos 80/20</h3>
            <p className="text-[15px] leading-[1.7] text-foreground/75">
              80% do seu carrinho deve ser{" "}
              <span className="text-foreground">comida de verdade</span> (proteínas, vegetais,
              frutas, gorduras boas, carboidratos integrais). Os outros 20% ficam para escolhas
              livres, sem culpa. Essa é a proporção que sustenta resultado a longo prazo.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg mb-3 tracking-tight">3 Regras de Ouro</h3>
            <div className="space-y-3">
              {COMPRAS_REGRAS.map((r, i) => (
                <div key={r.titulo} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-ember text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-[15px] font-medium">
                      <Highlight text={r.titulo} tokens={tokens} />
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.7] text-foreground/75">
                    <Highlight text={r.desc} tokens={tokens} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <ChecklistCard
              title="Checklist Rápido no Caixa"
              items={CHECKLIST_CAIXA}
              variant="check"
              tokens={tokens}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="h-4 w-4 text-accent" />
              <h3 className="font-display text-lg tracking-tight">Trocas Inteligentes</h3>
            </div>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-xs uppercase tracking-wider">Troque</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TROCAS.map((t) => (
                    <TableRow key={t.de} className="border-border/40">
                      <TableCell className="text-sm text-muted-foreground line-through">
                        <Highlight text={t.de} tokens={tokens} />
                      </TableCell>
                      <TableCell className="text-[15px] font-medium">
                        <Highlight text={t.para} tokens={tokens} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (sectionKey === "suplementos") {
    return (
      <AccordionItem
        value="suplementos"
        className="glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20"
      >
        <AccordionTrigger className="hover:no-underline py-5">
          <SectionTitle
            icon={Pill}
            title="Guia de Suplementação"
            subtitle="O que funciona, o que é marketing"
          />
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <h3 className="font-display text-lg tracking-tight">5 que funcionam</h3>
            </div>
            <div className="space-y-2">
              {SUPLEMENTOS_OK.map((s) => (
                <div key={s.nome} className="rounded-xl border border-border/60 p-4">
                  <div className="text-[15px] font-medium">
                    <Highlight text={s.nome} tokens={tokens} />
                  </div>
                  <p className="mt-1 text-[15px] leading-[1.7] text-foreground/75">
                    <Highlight text={s.motivo} tokens={tokens} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-4 w-4 text-destructive" />
              <h3 className="font-display text-lg tracking-tight">5 que não valem a pena</h3>
            </div>
            <ul className="space-y-2">
              {SUPLEMENTOS_NAO.map((s) => (
                <li key={s} className="flex gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <Highlight text={s} tokens={tokens} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-accent" />
              <h3 className="font-display text-lg tracking-tight">
                Guia de Compra — como ler rótulos
              </h3>
            </div>
            <ul className="space-y-2">
              {GUIA_COMPRA_SUP.map((g) => (
                <Bullet key={g}>
                  <Highlight text={g} tokens={tokens} />
                </Bullet>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (sectionKey === "sono") {
    return (
      <AccordionItem
        value="sono"
        className="glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20"
      >
        <AccordionTrigger className="hover:no-underline py-5">
          <SectionTitle
            icon={Moon}
            title="Sono e Recuperação"
            subtitle="O pilar esquecido do emagrecimento"
          />
        </AccordionTrigger>
        <AccordionContent className="pb-6 space-y-6">
          <p className="text-[15px] leading-[1.7] text-foreground/75">
            Você pode treinar perfeito e comer impecável — se dormir mal, seu corpo trabalha contra
            você. O sono regula 3 hormônios que decidem se você vai queimar ou estocar gordura.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {HORMONIOS.map((h) => (
              <div key={h.nome} className="rounded-xl border border-border/60 p-4">
                <div className="font-display text-base text-accent tracking-tight">
                  <Highlight text={h.nome} tokens={tokens} />
                </div>
                <p className="mt-2 text-[15px] leading-[1.7] text-foreground/75">
                  <Highlight text={h.desc} tokens={tokens} />
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <ChecklistCard
              title="Rotina Noturna Fênix — 2h antes de dormir"
              items={ROTINA_NOITE}
              variant="ritual"
              tokens={tokens}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  // plateau
  return (
    <AccordionItem
      value="plateau"
      className="glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20"
    >
      <AccordionTrigger className="hover:no-underline py-5">
        <SectionTitle
          icon={TrendingDown}
          title="Quebra de Plateau"
          subtitle="As 4 estratégias Fênix"
        />
      </AccordionTrigger>
      <AccordionContent className="pb-6 space-y-4">
        <p className="text-[15px] leading-[1.7] text-foreground/75">
          Toda quebra de plateau começa com diagnóstico — não com mudança aleatória. Use o Protocolo
          de Plateau no Hub de Execução para identificar qual estratégia se aplica ao seu caso.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATEAU_ESTRATEGIAS.map((e, i) => (
            <div key={e.nome} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-ember text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="font-display text-base tracking-tight">
                  <Highlight text={e.nome} tokens={tokens} />
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.7] text-foreground/75">
                <Highlight text={e.desc} tokens={tokens} />
              </p>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
