# Continuação do redesign Fênix — briefing para o próximo agente

Você está continuando um redesign visual já em andamento no projeto Fênix
(`/home/hemersoncoelho/Documentos/Fenix App`, TanStack Start + Tailwind v4 +
shadcn/ui + Supabase). Não assuma nenhum contexto de conversas anteriores —
tudo que você precisa está neste documento e nos dois arquivos de
referência abaixo.

## Leia primeiro

1. `REDESIGN.md` (raiz do projeto) — diagnóstico completo do app antes do
   redesign: todas as telas mapeadas, componentes duplicados, cores fora
   do padrão, riscos técnicos. É o mapa do que precisa mudar.
2. `Fenix Design System (standalone).html` (raiz do projeto) — o novo
   Design System de referência visual. É um bundle pesado (~1.5MB, gerado
   por ferramenta), então não tente `Read` o arquivo inteiro — os tokens
   já foram extraídos e estão todos listados abaixo.

## O que já foi feito (Prompts 1-4 — não repita, não reverta)

**Prompt 1 — `src/styles.css`**: o tema inteiro foi trocado de escuro
âmbar (OKLCH) para claro/clean estilo iOS. Tokens principais:

- `--background: #F7F8FA` (página), `--card: #FFFFFF` (cards brancos por
  cima — padrão "grouped list")
- `--primary: #0A84FF`, `--primary-hover: #006EDC`, `--primary-press: #0A6FD1`,
  `--primary-soft: #EAF4FF`
- `--foreground: #111827`, `--muted-foreground: #6B7280`, `--border: #E5E7EB`
- `--destructive: #FF3B30`, `--success: #34C759` / `--success-soft: #E8F9EC`,
  `--warning: #F5C542` / `--warning-soft: #FDF6E3`
- `--accent: #006EDC` — **decisão importante**: este token foi
  deliberadamente reservado para uso _decorativo_ (ícones/texto em
  destaque, ex. `text-accent`). Para hover sutil de botões/menus use
  `--primary-soft`, não `bg-accent`/`hover:bg-accent` — essa troca já foi
  feita nos componentes base (ver Prompt 2).
- Radius: `--radius-button: 12px`, `--radius-card: 16px`,
  `--radius-input: 12px`, `--radius-chip/avatar/pill: 999px`,
  `--radius-modal: 22px`.
- Sombras: `--shadow-xs/sm/md/modal/nav` (todas neutras, sem glow colorido).
- Tipografia: uma única família sans (Inter/SF Pro) em toda a hierarquia —
  `--font-display` aponta para a mesma pilha do `--font-sans` (não existe
  mais fonte serifada de display).
- Os utilitários `.glass`, `.bg-gradient-ember`, `.shadow-ember`,
  `.text-gradient-ember` **continuam existindo com os mesmos nomes** (para
  não quebrar dezenas de arquivos de uma vez), mas foram redefinidos:
  `.glass` agora é um card sólido branco com borda + sombra suave (sem
  blur/vidro); `.bg-gradient-ember` é cor sólida `--primary` (sem
  gradiente — o novo DS não usa gradientes); `.shadow-ember` é
  `--shadow-md`.

**Prompt 2 — `src/components/ui/*`**: componentes base reconstruídos:

- `button.tsx`: nova variante `variant="ember"` (CTA de destaque,
  `shadow-md`) além de `default` atualizado; radius `--radius-button`;
  `outline`/`ghost` usam `hover:bg-[var(--primary-soft)] hover:text-primary`
  em vez de `hover:bg-accent`.
- `card.tsx`: `rounded-[var(--radius-card)]` + `shadow-[var(--shadow-sm)]`.
- `badge.tsx`: radius virou pill; adicionadas variantes `success`/`warning`
  (fundo suave + texto colorido, ex.: `text-[#8A5A00]` para warning por
  contraste — `--warning` puro tem contraste ruim como texto).
- `input.tsx`/`textarea.tsx`/`select.tsx`: radius `--radius-input`,
  sombra `--shadow-xs`; foco padronizado (borda azul + ring).
- `skeleton.tsx`: `bg-muted` (neutro) em vez de `bg-primary/10`.
- `dialog.tsx`: overlay usa `--overlay` (claro) em vez de `bg-black/80`;
  conteúdo usa `bg-card`, `rounded-[var(--radius-modal)]`,
  `shadow-[var(--shadow-modal)]`.
- `label.tsx` não precisou de alteração.

**Prompt 3 — componentes novos, criados mas AINDA NÃO usados em
nenhuma tela** (é isso que os próximos prompts vão fazer):

- `src/components/ui/metric-chip.tsx` — `MetricChip` (label + valor,
  props `unit`, `icon`, `progress`, `tone`). Substituirá as
  implementações duplicadas: `Stat` (app.profile.tsx), `MacroChip`
  (app.alimentacao.tsx e app.instrutor.$alunoId.tsx — duas cópias
  diferentes), `MetaChip` (weekly-planner.tsx), `Info`
  (app.admin.$userId.tsx), `Meta` (cardapio-prescrito.tsx).
- `src/components/ui/empty-state.tsx` — `EmptyState` (ícone em círculo
  azul-claro + título + descrição + CTA opcional via `variant="ember"`).
- `src/components/page-header.tsx` — `PageHeader` (badge de ícone azul +
  eyebrow + `h1`, com slots `leading` e `action`).

**Prompt 4 — telas de referência já migradas**:
`src/routes/index.tsx` (Landing), `src/routes/auth.tsx`,
`src/routes/onboarding.tsx` (só os 2 botões de CTA — `BigChoice`/`BigField`
ficaram como estão, já herdam a paleta azul via classes semânticas),
`src/routes/app.index.tsx` **apenas a função `DashboardAluno`** (a
`DashboardProfissional` no mesmo arquivo ainda está com classes antigas —
fica para o Prompt 6), e `src/components/weight-chart.tsx` (cores
`oklch(...)` hardcoded no recharts trocadas para hex do novo tema).

Build (`bun run build`) validado sem erros depois de cada prompt.

## Regras que valem para todos os prompts abaixo

- **Não altere lógica** — queries do React Query, mutations, validação
  zod, `queryKey`s de invalidação. É troca de classes/componentes visuais,
  nada de comportamento.
- Ao trocar `className="bg-gradient-ember ... shadow-ember"` em um
  `<Button>`, use `variant="ember"` e remova essas classes do
  `className` (mantendo o resto: tamanho, disabled states, etc.).
- Ao encontrar cores hardcoded que não são classes Tailwind nem tokens
  (literais `oklch(...)`, hex de laranja/âmbar, ou cores Tailwind soltas
  tipo `rose-500`/`emerald-500`/`sky-500`/`amber-500` — ver REDESIGN.md
  seção 9), troque pelos tokens novos: `--primary` para o que era âmbar,
  `--success`/`--warning`/`--destructive` para os semânticos.
- Depois de cada prompt, rode `bun run build` (usa timeout generoso,
  ~3 min — o build às vezes demora mais que o normal na primeira vez)
  para confirmar que não há erro de sintaxe/import antes de seguir para
  o próximo.
- Siga a ordem abaixo — cada prompt assume que o anterior já foi aplicado.
- Este projeto tem um hook de "fact-forcing" que bloqueia a primeira
  chamada de Bash/Edit/Write para um caminho novo, pedindo para você
  apresentar fatos (quem importa o arquivo, o que muda, etc.) antes de
  tentar de novo — isso é normal, não é um bug; apresente os fatos em
  texto e repita a mesma chamada.

## Prompt 5 — Demais telas do Aluno

```
Aplique o Design System já migrado (Prompts 1-4) a:
src/routes/app.treinos.tsx, src/routes/app.alimentacao.tsx,
src/routes/app.method.tsx, src/routes/app.profile.tsx (ProfileAluno),
src/routes/app.guias.$chave.tsx.

Use os componentes criados no Prompt 3 onde fizer sentido: PageHeader
para os cabeçalhos (ícone + eyebrow + h1) de Treinos/Alimentação;
MetricChip para os chips de macro (troque MacroChip local em
app.alimentacao.tsx); EmptyState para os estados vazios (treino não
prescrito, plano alimentar não prescrito).

Em app.alimentacao.tsx, resolva as inconsistências de cor do
REDESIGN.md seção 9:
- Toggle de objetivo: troque os gradientes rose-500/red-700 ("Perda")
  e emerald-500/green-700 ("Reeducação") por tokens do sistema —
  --destructive para "Perda", --success para "Reeducação",
  --primary (via variant="ember") para "Ganho".
- Seção de hidratação: troque sky-500/sky-300/sky-600 por --primary
  (ou uma variação de --primary-soft/--primary-hover) — não introduza
  uma cor nova fora da paleta.
Migre também o widget CardapioPrescrito (src/components/
cardapio-prescrito.tsx) do Card puro do shadcn para o mesmo tratamento
visual das outras seções da tela (já que ele aparece dentro desta
mesma página, ao lado de cards já migrados).

Teste em mobile e depois em desktop.
```

## Prompt 6 — Telas do Profissional (Instrutor/Nutricionista)

```
Aplique o Design System a: src/routes/app.index.tsx
(função DashboardProfissional — a DashboardAluno já foi migrada),
src/routes/app.profile.tsx (ProfileProfissional),
src/routes/app.instrutor.tsx, src/routes/app.instrutor.$alunoId.tsx e
src/routes/app.instrutor.exercicios.tsx.

Em app.instrutor.$alunoId.tsx: troque os cards
"rounded-2xl border border-border/60 bg-card/50" pelo componente Card
(src/components/ui/card.tsx); troque todos os <label> crus pelo
componente <Label> (src/components/ui/label.tsx) nos formulários de
CriarPlanoTreino, CriarPlanoAlimentar, PlanoTreinoCard,
PlanoAlimentarCard; use MetricChip para o MacroChip local desse arquivo.

Em app.instrutor.exercicios.tsx: o componente local Field (label cru +
children) pode virar apenas <Label> + children, ou continuar como
wrapper fino — decisão sua, mas o texto do rótulo deve usar <Label>
por baixo.

Garanta paridade visual com as telas equivalentes do aluno: use
PageHeader nos cabeçalhos, mesmos MetricChips, mesmo Card. Hoje o
dashboard e perfil do profissional são visualmente mais "vazios" que
os do aluno — não precisa adicionar funcionalidade nova, só nivelar o
acabamento visual (espaçamento, hierarquia, cards).
```

## Prompt 7 — Área Admin (reconstrução completa)

```
Reconstrua no novo Design System: src/routes/app.admin.tsx,
src/routes/app.admin.$userId.tsx, src/components/protocolo-editor.tsx,
src/components/alertas-trocas.tsx. Hoje essas telas usam Card/Table do
shadcn sem nenhuma customização (REDESIGN.md seção 5.1, 5.2 e 9).

Use PageHeader no topo de app.admin.tsx ("Painel do Admin") e
app.admin.$userId.tsx. Use MetricChip para os dados numéricos (troque
o componente local Info em app.admin.$userId.tsx). Use EmptyState para
listas vazias.

Em app.admin.$userId.tsx: agrupe o conteúdo em seções com hierarquia
clara (resumo do aluno → respostas do quiz de onboarding → protocolo
prescrito → histórico de peso/diário/alimentar) em vez de 6 Cards do
mesmo peso visual empilhados.

Troque o badge amber-500 de "Fora da margem" em alertas-trocas.tsx pela
variante warning do Badge (src/components/ui/badge.tsx, criada no
Prompt 2). Troque o badge emerald-600 de sucesso em
src/components/registrar-foto-refeicao.tsx pela variante success do
Badge, ou por --success direto se precisar de um badge sólido (não
soft) sobre a foto.

Cuidado: app.admin.$userId.tsx acessa vários campos de profile via
"(profile as any)" (objetivo_fenix, alimento_favorito, etc.) — isso é
dívida técnica de tipos, não visual; não tente "corrigir" o tipo nesta
etapa, só preserve o comportamento exatamente como está.
```

## Prompt 8 — Passe final (estados globais + responsividade + QA)

```
Passe final de consistência em todo o app já migrado (Prompts 1-7):

1. Garanta que todo loading state usa Skeleton (conteúdo de página) ou
   Loader2 girando só dentro de botão/diálogo — troque animate-pulse
   solto em divs cruas e textos "Carregando…"/"Verificando acesso…"
   sem indicador visual (ex.: os gates de admin em app.admin.tsx e
   app.admin.$userId.tsx) por um Skeleton ou spinner central.
2. Garanta que todo estado vazio usa o componente EmptyState criado no
   Prompt 3 — troque os que restaram (emoji + texto em
   app.treinos.tsx/app.alimentacao.tsx, texto puro em app.instrutor.tsx).
3. Avalie breakpoints lg: para Treinos, Alimentação, Método, Perfil e
   telas de Instrutor — hoje só o Dashboard do Aluno tem tratamento de
   desktop (lg:grid-cols-3 lg:max-w-6xl), o resto fica em coluna única
   mesmo em telas largas (REDESIGN.md seção 7 "Responsividade"). Não é
   obrigatório redesenhar layout de desktop do zero — pelo menos avalie
   se max-w-md/max-w-2xl deveria virar algo como max-w-3xl lg:max-w-5xl
   com um pouco mais de respiro, já que o SideNav ocupa 256px à esquerda.
4. Confirme que não sobrou nenhum bg-gradient-ember, shadow-ember,
   glass, ou cor Tailwind solta fora da paleta (rose/emerald/sky/amber
   cru) no código: rode
   grep -rn "rose-\|emerald-\|sky-\|amber-" src --include=*.tsx
   e revise cada ocorrência restante.
5. Rode bun run build uma última vez e, se possível, bun run dev para
   navegar pelo fluxo completo de aluno, profissional e admin em mobile
   e desktop antes de considerar o redesign concluído.
```

## Se algo não bater com o que este documento descreve

Se ao abrir um dos arquivos você encontrar algo diferente do que este
briefing descreve (por exemplo, um componente que este documento diz
que "ainda não foi migrado" mas já está com classes novas), confie no
que você vê no código, não neste documento — ele é um snapshot do
estado em que o trabalho foi pausado, pode ter havido edições manuais
depois.
