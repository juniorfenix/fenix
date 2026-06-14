import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as MethodHub } from "./method-hub-BwVpMY7N.mjs";
import { R as Root2, I as Item, H as Header, T as Trigger2, C as Content2 } from "../_libs/radix-ui__react-accordion.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import { I as Input } from "./input-CqozOQNs.mjs";
import { f as Search, V as Quote, U as Utensils, Y as Plane, _ as PartyPopper, $ as Briefcase, a0 as ShoppingCart, a1 as ArrowRightLeft, a2 as Pill, Q as CircleCheck, a3 as CircleX, i as BookOpen, a4 as Moon, T as TrendingDown, I as ChevronDown, a5 as ListChecks } from "../_libs/lucide-react.mjs";
import "./dialog-DUBMlo7Z.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./tabs-D_u1EXWn.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger2,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = Content2.displayName;
const RESTAURANTE_ROWS = [{
  local: "Restaurantes",
  icon: Utensils,
  dicas: ["Escolha proteína grelhada + salada + 1 porção de carbo (não 2).", "Peça molhos à parte e use metade.", "Beba água antes do prato — evita confundir fome com sede.", "Sobremesa? Compartilhe ou troque por café puro."]
}, {
  local: "Viagens",
  icon: Plane,
  dicas: ["Leve snacks proteicos (whey em sachê, castanhas, jerky).", "No hotel, café da manhã: ovos + fruta + 1 carbo integral.", "Hidrate-se em dobro (avião desidrata).", "Caminhe 20 min ao chegar para regular o relógio biológico."]
}, {
  local: "Festas e eventos",
  icon: PartyPopper,
  dicas: ["Coma uma refeição proteica 1h antes — evita atacar petiscos.", "Regra do prato único: monte 1 vez, sem repetir.", "Álcool: alterne com água. Prefira destilados puros a drinks doces.", "Dance, circule, converse — não fique parado perto da mesa."]
}, {
  local: "Trabalho",
  icon: Briefcase,
  dicas: ["Marmita ou opção saudável mapeada antes da fome bater.", "Tenha sempre fruta + castanha na gaveta.", "Levante a cada 90 min, mesmo que por 2 minutos.", "Café sim, mas até as 14h — protege o sono."]
}];
const EVENTOS_FASES = [{
  fase: "Antes",
  cor: "text-accent",
  itens: ["Faça uma refeição com proteína + fibra 60-90 min antes.", "Beba 500ml de água — chega saciado, não faminto.", "Defina mentalmente: o que vou comer e o que vou evitar."]
}, {
  fase: "Durante",
  cor: "text-primary",
  itens: ["Comece pela salada/proteína. Carboidrato e doce por último.", "Mastigue devagar, pouse o talher entre garfadas.", "Pare ao se sentir 80% satisfeito — não 100%."]
}, {
  fase: "Depois",
  cor: "text-accent",
  itens: ["Caminhe 10-15 min se possível — ajuda na digestão.", "Hidrate-se bem antes de dormir.", "Sem culpa: volte ao plano na próxima refeição, não no dia seguinte."]
}];
const COMPRAS_REGRAS = [{
  titulo: "Compre pelo perímetro",
  desc: "Comida de verdade fica nas bordas do mercado: hortifruti, açougue, ovos, laticínios. O miolo é território dos ultraprocessados."
}, {
  titulo: "Nunca vá com fome",
  desc: "Fome no mercado = carrinho cheio de besteira. Coma algo proteico antes de sair de casa."
}, {
  titulo: "Lista fechada, decisão tomada",
  desc: "Vá com lista escrita. Não compre nada fora dela. Decisão de compra é melhor em casa, com calma."
}];
const CHECKLIST_CAIXA = ["Tem mais alimento fresco do que pacote?", "Algum item tem mais de 5 ingredientes no rótulo?", "Algum produto tem açúcar nas 3 primeiras posições?", "Comprei vegetais para pelo menos 5 dias?", "Tem proteína suficiente para todas as refeições da semana?"];
const TROCAS = [{
  de: "Refrigerante",
  para: "Água com gás + limão"
}, {
  de: "Biscoito recheado",
  para: "Castanhas + 1 fruta"
}, {
  de: "Pão branco",
  para: "Pão integral 100% ou tapioca"
}, {
  de: "Suco de caixinha",
  para: "Fruta inteira"
}, {
  de: "Iogurte adoçado",
  para: "Iogurte natural + mel"
}, {
  de: "Margarina",
  para: "Manteiga ou azeite extravirgem"
}, {
  de: "Cereal matinal açucarado",
  para: "Aveia em flocos"
}, {
  de: "Embutidos (presunto, salsicha)",
  para: "Ovo, frango desfiado, atum"
}];
const SUPLEMENTOS_OK = [{
  nome: "Whey Protein",
  motivo: "Praticidade para atingir a meta proteica diária. 1-2 doses se a comida não bastar."
}, {
  nome: "Creatina",
  motivo: "3-5g/dia. Mais força, mais energia, mais músculo. O mais estudado da história."
}, {
  nome: "Vitamina D3",
  motivo: "Maioria da população é deficiente. Faz exame e dose conforme orientação (geralmente 2.000-4.000 UI)."
}, {
  nome: "Ômega 3 (EPA/DHA)",
  motivo: "Anti-inflamatório, saúde cardiovascular e cerebral. 1-2g de EPA+DHA por dia."
}, {
  nome: "Cafeína",
  motivo: "Pré-treino natural. 3-6mg/kg antes do treino. Café puro já resolve."
}];
const SUPLEMENTOS_NAO = ["BCAA — desnecessário se você consome proteína suficiente.", "Termogênico 'queimador de gordura' — efeito mínimo, marketing máximo.", "Glutamina — sem efeito comprovado para quem não é atleta de elite.", "Pré-treinos all-in-one — caros, com doses subterapêuticas de cada coisa.", "Detox / colágeno em pó com vitamina X — promessas vazias, custo alto."];
const GUIA_COMPRA_SUP = ["Leia o rótulo de trás pra frente — quanto MENOS ingredientes, melhor.", "Desconfie de 'blends proprietários' que escondem doses.", "Compre cada ativo separado: 1 pote de creatina pura > pré-treino com 15 coisas.", "Marca certificada (selo de laboratório independente) vale o preço extra.", "Fuja de promessas milagrosas: 'queima 10kg', 'ganho instantâneo'."];
const HORMONIOS = [{
  nome: "Grelina",
  desc: "Hormônio da fome. Dorme mal → sobe → você come mais no dia seguinte."
}, {
  nome: "Leptina",
  desc: "Hormônio da saciedade. Dorme mal → cai → você nunca se sente satisfeito."
}, {
  nome: "Cortisol",
  desc: "Hormônio do estresse. Sono ruim → cronicamente alto → acumula gordura abdominal."
}];
const ROTINA_NOITE = ["2h antes: pare de comer. Digestão atrapalha o sono profundo.", "1h30 antes: desligue telas brilhantes ou use filtro de luz quente.", "1h antes: luzes baixas em casa — sinal para o cérebro liberar melatonina.", "30 min antes: chá morno (camomila, melissa), leitura, banho quente.", "Quarto: escuro, silencioso e frio (18-20°C é o ideal).", "Mesmo horário todo dia — inclusive fim de semana. Consistência > duração."];
const PLATEAU_ESTRATEGIAS = [{
  nome: "Semana de Recarga",
  desc: "7–10 dias na manutenção (não acima). Hormônios resetam e o corpo volta a responder ao déficit."
}, {
  nome: "Variação de Treino",
  desc: "Troque 50% dos exercícios, suba carga em 5% ou inclua HIIT 2x/semana por 3 semanas."
}, {
  nome: "Ciclo Sódio/Carbo",
  desc: "Suba sódio para 3–4g/dia por 5 dias e faça 1 dia de refeed de carbo (+50%). Pesa de novo no 7º dia."
}, {
  nome: "Ajuste Calórico",
  desc: "Reduza 100–150 kcal/dia (não mais). Mantenha por 2 semanas. Corte de carbo refinado, nunca proteína."
}];
const EXTRA_KEYWORDS = {
  praticidade: "comer fora bar churrasco aniversário social escritório",
  compras: "supermercado feira mercado lista 80/20 oitenta vinte",
  suplementos: "suplementação suplemento d3 omega cafeina pre-treino colageno",
  sono: "dormir descanso recuperação melatonina insônia noite",
  plateau: "platô estagnação travou parou não emagreço recarga refeed"
};
function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function buildIndex() {
  return {
    praticidade: normalize([EXTRA_KEYWORDS.praticidade, ...RESTAURANTE_ROWS.flatMap((r) => [r.local, ...r.dicas]), ...EVENTOS_FASES.flatMap((f) => [f.fase, ...f.itens])].join(" ")),
    compras: normalize([EXTRA_KEYWORDS.compras, ...COMPRAS_REGRAS.flatMap((r) => [r.titulo, r.desc]), ...CHECKLIST_CAIXA, ...TROCAS.flatMap((t) => [t.de, t.para])].join(" ")),
    suplementos: normalize([EXTRA_KEYWORDS.suplementos, ...SUPLEMENTOS_OK.flatMap((s) => [s.nome, s.motivo]), ...SUPLEMENTOS_NAO, ...GUIA_COMPRA_SUP].join(" ")),
    sono: normalize([EXTRA_KEYWORDS.sono, ...HORMONIOS.flatMap((h) => [h.nome, h.desc]), ...ROTINA_NOITE].join(" ")),
    plateau: normalize([EXTRA_KEYWORDS.plateau, ...PLATEAU_ESTRATEGIAS.flatMap((e) => [e.nome, e.desc])].join(" "))
  };
}
const INDEX = buildIndex();
function matchSections(query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return {
      tokens: [],
      matched: /* @__PURE__ */ new Set(["praticidade", "compras", "suplementos", "sono", "plateau"])
    };
  }
  const matched = /* @__PURE__ */ new Set();
  Object.keys(INDEX).forEach((k) => {
    if (tokens.every((t) => INDEX[k].includes(t))) matched.add(k);
  });
  return {
    tokens,
    matched
  };
}
function Highlight({
  text,
  tokens
}) {
  if (tokens.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: text });
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = [];
  const normalized = normalize(text);
  let lastEnd = 0;
  let m;
  while ((m = re.exec(normalized)) !== null) {
    if (m.index > lastEnd) parts.push({
      text: text.slice(lastEnd, m.index),
      match: false
    });
    parts.push({
      text: text.slice(m.index, m.index + m[0].length),
      match: true
    });
    lastEnd = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (lastEnd < text.length) parts.push({
    text: text.slice(lastEnd),
    match: false
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map((p, i) => p.match ? /* @__PURE__ */ jsxRuntimeExports.jsx("mark", { className: "bg-accent/30 text-foreground rounded px-0.5", children: p.text }, i) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.text }, i)) });
}
function SectionTitle({
  icon: Icon,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-ember shadow-ember", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground", strokeWidth: 1.75 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl leading-tight tracking-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13.5px] text-foreground/60 mt-1", children: subtitle })
    ] })
  ] });
}
function Bullet({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2.5 text-[15px] leading-[1.65] text-foreground/85", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children })
  ] });
}
function ChecklistCard({
  title,
  items,
  variant = "check",
  tokens
}) {
  const isRitual = variant === "ritual";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border-2 p-5 ${isRitual ? "border-primary/30 bg-primary/5" : "border-accent/30 bg-accent/5"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-background px-3 py-1 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: `h-3.5 w-3.5 ${isRitual ? "text-primary" : "text-accent"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-semibold", children: "Checklist" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg leading-snug mt-1 mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-[15px] leading-[1.6]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[11px] font-semibold ${isRitual ? "border-primary/40 text-primary" : "border-accent/40 text-accent"}`, children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: it, tokens }) })
    ] }, it)) })
  ] });
}
function Method() {
  const [query, setQuery] = reactExports.useState("");
  const [openSections, setOpenSections] = reactExports.useState([]);
  const {
    tokens,
    matched
  } = reactExports.useMemo(() => matchSections(query), [query]);
  const value = reactExports.useMemo(() => {
    if (tokens.length === 0) return openSections;
    return Array.from(/* @__PURE__ */ new Set([...openSections, ...Array.from(matched)]));
  }, [openSections, matched, tokens.length]);
  const sectionsOrder = ["praticidade", "compras", "suplementos", "sono", "plateau"];
  const visibleOrder = sectionsOrder.filter((k) => matched.has(k));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-2xl px-5 pt-10 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Método Fênix" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mt-1.5 tracking-tight", children: "Centro de Conhecimento" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] leading-[1.65] text-foreground/70 max-w-prose", children: "Seu consultor de elite no bolso. Guias práticos para viver o método em qualquer situação." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MethodHub, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Buscar dúvida: viagem, creatina, sono, rótulo…", "aria-label": "Buscar nos guias do Método Fênix", className: "pl-11 h-12 rounded-xl bg-card border-border/60 focus-visible:ring-primary/40" }),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuery(""), "aria-label": "Limpar busca", className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md", children: "limpar" })
    ] }),
    visibleOrder.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-2xl border border-dashed border-border/60 p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Nenhum resultado para ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
          '"',
          query,
          '"'
        ] }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Tente: viagem, festa, creatina, whey, rótulo, supermercado, sono, cortisol." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion, { type: "multiple", value, onValueChange: setOpenSections, className: "mt-6 space-y-3", children: visibleOrder.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(SectionAccordion, { sectionKey: key, tokens }, key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-ember p-6 shadow-ember", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "absolute -top-2 -left-2 h-20 w-20 text-primary-foreground/10", strokeWidth: 1, "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest font-semibold text-primary-foreground/80", children: "Princípio Fênix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-display text-xl leading-snug text-primary-foreground", children: "O melhor suplemento é a consistência." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-primary-foreground/90 leading-relaxed", children: "Treinar 3x por semana, dormir 8h e comer proteína suficiente vale mais do que qualquer produto." })
      ] })
    ] })
  ] });
}
function SectionAccordion({
  sectionKey,
  tokens
}) {
  if (sectionKey === "praticidade") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "praticidade", className: "glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Utensils, title: "Guia de Praticidade", subtitle: "Como comer fora de casa" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider w-[140px]", children: "Situação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider", children: "Como agir" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: RESTAURANTE_ROWS.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/40 align-top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(row.icon, { className: "h-4 w-4 text-accent", strokeWidth: 1.75 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: row.local, tokens }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: row.dicas.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bullet, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: d, tokens }) }, d)) }) })
          ] }, row.local)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Eventos sociais — Antes, Durante e Depois" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: EVENTOS_FASES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[13px] font-semibold uppercase tracking-widest ${f.cor}`, children: f.fase }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: f.itens.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bullet, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: it, tokens }) }, it)) })
          ] }, f.fase)) })
        ] })
      ] })
    ] });
  }
  if (sectionKey === "compras") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "compras", className: "glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: ShoppingCart, title: "Guia de Compras Inteligente", subtitle: "Supermercado sem armadilhas" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "pb-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg mb-2 tracking-tight", children: "Regra dos 80/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[15px] leading-[1.7] text-foreground/75", children: [
            "80% do seu carrinho deve ser ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "comida de verdade" }),
            " (proteínas, vegetais, frutas, gorduras boas, carboidratos integrais). Os outros 20% ficam para escolhas livres, sem culpa. Essa é a proporção que sustenta resultado a longo prazo."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg mb-3 tracking-tight", children: "3 Regras de Ouro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: COMPRAS_REGRAS.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 place-items-center rounded-full bg-gradient-ember text-xs font-semibold text-primary-foreground", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15px] font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: r.titulo, tokens }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[15px] leading-[1.7] text-foreground/75", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: r.desc, tokens }) })
          ] }, r.titulo)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChecklistCard, { title: "Checklist Rápido no Caixa", items: CHECKLIST_CAIXA, variant: "check", tokens }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-4 w-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg tracking-tight", children: "Trocas Inteligentes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider", children: "Troque" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs uppercase tracking-wider", children: "Por" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: TROCAS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground line-through", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: t.de, tokens }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-[15px] font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: t.para, tokens }) })
            ] }, t.de)) })
          ] }) })
        ] })
      ] })
    ] });
  }
  if (sectionKey === "suplementos") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "suplementos", className: "glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Pill, title: "Guia de Suplementação", subtitle: "O que funciona, o que é marketing" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "pb-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg tracking-tight", children: "5 que funcionam" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SUPLEMENTOS_OK.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[15px] font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: s.nome, tokens }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[15px] leading-[1.7] text-foreground/75", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: s.motivo, tokens }) })
          ] }, s.nome)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg tracking-tight", children: "5 que não valem a pena" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: SUPLEMENTOS_NAO.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: s, tokens }) })
          ] }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg tracking-tight", children: "Guia de Compra — como ler rótulos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: GUIA_COMPRA_SUP.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bullet, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: g, tokens }) }, g)) })
        ] })
      ] })
    ] });
  }
  if (sectionKey === "sono") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "sono", className: "glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Moon, title: "Sono e Recuperação", subtitle: "O pilar esquecido do emagrecimento" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "pb-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] leading-[1.7] text-foreground/75", children: "Você pode treinar perfeito e comer impecável — se dormir mal, seu corpo trabalha contra você. O sono regula 3 hormônios que decidem se você vai queimar ou estocar gordura." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: HORMONIOS.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base text-accent tracking-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: h.nome, tokens }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[15px] leading-[1.7] text-foreground/75", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: h.desc, tokens }) })
        ] }, h.nome)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChecklistCard, { title: "Rotina Noturna Fênix — 2h antes de dormir", items: ROTINA_NOITE, variant: "ritual", tokens }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "plateau", className: "glass rounded-2xl border-0 px-5 data-[state=open]:border data-[state=open]:border-primary/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: TrendingDown, title: "Quebra de Plateau", subtitle: "As 4 estratégias Fênix" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] leading-[1.7] text-foreground/75", children: "Toda quebra de plateau começa com diagnóstico — não com mudança aleatória. Use o Protocolo de Plateau no Hub de Execução para identificar qual estratégia se aplica ao seu caso." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: PLATEAU_ESTRATEGIAS.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 place-items-center rounded-full bg-gradient-ember text-xs font-semibold text-primary-foreground", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base tracking-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: e.nome, tokens }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[15px] leading-[1.7] text-foreground/75", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Highlight, { text: e.desc, tokens }) })
      ] }, e.nome)) })
    ] })
  ] });
}
export {
  Method as component
};
