# REDESIGN.md

> Documento de diagnóstico e planejamento. Nenhum código visual foi alterado nesta etapa — apenas leitura, análise e organização.

## 1. Objetivo do redesign

Levar todas as telas do Fênix ao mesmo nível de acabamento visual que já existe nas melhores partes do app hoje (Landing, Dashboard do Aluno, Onboarding), usando o Design System definido em `src/styles.css` (paleta OKLCH âmbar/ember, tipografia Cormorant Garamond + Inter, utilitário `glass`, gradiente `bg-gradient-ember`, sombra `shadow-ember`, radius 0.75rem) como única referência. O objetivo não é reinventar a identidade visual — ela já existe e funciona bem — mas **eliminar as áreas onde o app diverge dela**, padronizar componentes repetidos que hoje têm 3–6 implementações ligeiramente diferentes, e dar tratamento visual adequado às áreas administrativas e de instrutor, que hoje parecem pertencer a um produto diferente.

## 2. Resumo executivo

O Fênix tem uma identidade visual forte e bem executada nas telas voltadas ao **aluno** (Landing, Auth, Onboarding, Dashboard, Treinos, Alimentação, Método, Perfil, Guias). Essas telas usam consistentemente `glass`, `bg-gradient-ember`, `shadow-ember`, `font-display` para títulos e uma linguagem de "eyebrow labels" (`text-[10px] uppercase tracking-widest`) que funciona bem como assinatura visual.

O problema está em três frentes:

1. **O painel Admin (`/app/admin`, `/app/admin/$userId`) e componentes administrativos (`ProtocoloEditor`, `AlertasTrocas`, `CardapioPrescrito`) usam os componentes shadcn "de fábrica" (`Card`, `Table`) sem nenhuma customização de marca** — sem `glass`, sem gradiente, sem `shadow-ember`. Parecem uma ferramenta interna genérica colada num app premium.
2. **Padrões repetidos sem componentização**: existem pelo menos 6 implementações distintas do mesmo "chip de métrica" (`Stat`, `MacroChip` ×2, `MetaChip`, `Info`, `Meta`), 3 tratamentos diferentes de card (`glass rounded-2xl`, `rounded-2xl border border-border/60 bg-card/50`, `Card` shadcn puro), estados vazios sem padrão único (emoji vs. ícone vs. texto puro) e loading states sem padrão único (`Skeleton` vs. `Loader2` vs. `animate-pulse` vs. texto).
3. **Cores fora da paleta do Design System**: `rose-500`/`emerald-500`/`sky-500`/`amber-500` aparecem em pontos específicos (toggle de objetivo, hidratação, alertas de troca, sucesso da foto de refeição) quebrando a promessa de uma paleta única âmbar/dourada.

Nenhuma tela está "quebrada" funcionalmente — o trabalho é de **unificação e polimento**, não de reconstrução.

## 3. Design System usado como referência

Fonte: `src/styles.css`, `src/components/ui/*`.

- **Cores** (OKLCH, tema escuro fixo — `color-scheme: dark` no `<html>`): `--background` (0.16), `--card` (0.20), `--primary`/`--ember` (0.72 0.18 47 — laranja âmbar), `--accent`/`--ember-glow` (0.78 0.14 75 — dourado quente), `--destructive` (vermelho), `--muted`, `--border`, `--secondary`. Não há paleta de cores "extra" documentada — qualquer cor fora deste conjunto (rose, emerald, sky, amber puro do Tailwind) é, por definição, fora do Design System.
- **Tipografia**: `--font-display: "Cormorant Garamond"` aplicada automaticamente a `h1, h2, h3` via `@layer base` (`src/styles.css:119`); `--font-sans: "Inter"` para o resto. Não há tokens formais de escala tipográfica — tamanhos são valores arbitrários do Tailwind (`text-3xl`, `text-sm`) ou colchetes (`text-[10px]`, `text-[15px]`, `text-[17px]`).
- **Espaçamento**: sem tokens próprios; usa a escala padrão do Tailwind. Convenção implícita nas telas do aluno: `max-w-md px-5 pt-8 pb-8` como wrapper de página.
- **Radius**: `--radius: 0.75rem` (`rounded-lg` = base). Na prática, quase todo card "on-brand" usa `rounded-2xl` (maior que o token base), enquanto os componentes shadcn puros (`Card`) usam `rounded-xl` — dois radius concorrendo.
- **Cards**: dois padrões vivos — `.glass` (fundo translúcido + blur + borda sutil, `src/styles.css:131`) usado nas telas de aluno/instrutor; `Card` do shadcn (`src/components/ui/card.tsx`) usado sem adaptação nas telas de admin.
- **Botões**: `src/components/ui/button.tsx` — variantes genéricas shadcn (`default`, `outline`, `secondary`, `ghost`, `link`). **Não existe uma variante "ember"** — todo botão de destaque reaplica manualmente `className="bg-gradient-ember text-primary-foreground shadow-ember"` por cima do variant `default`.
- **Inputs**: `src/components/ui/input.tsx`, `select.tsx`, `textarea.tsx` — shadcn padrão, sem customização visual própria da marca.
- **Navegação**: `SideNav` (desktop, `lg:flex`) e `BottomNav` (mobile) em `src/routes/app.tsx` — ambos on-brand, com `glass` no `BottomNav`.
- **Modais**: `src/components/ui/dialog.tsx` (shadcn/Radix) — base neutra; o conteúdo interno é que varia (o `WelcomeModal` é o único que usa um "hero" com `bg-gradient-ember` dentro do dialog).
- **Estados vazios/carregamento/erro**: sem componente compartilhado — ver seções 7 e 10.

## 4. Mapeamento de telas existentes

| Tela                                                       | Rota/Arquivo                                                               | Perfil                        | Estado atual                                                                                                              | Precisa de redesign?               | Prioridade           |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------- |
| Landing                                                    | `/` — `src/routes/index.tsx`                                               | Público                       | On-brand, coeso                                                                                                           | Polimento apenas                   | Baixa                |
| Login/Cadastro/Recuperação                                 | `/auth` — `src/routes/auth.tsx`                                            | Público                       | On-brand, coeso                                                                                                           | Polimento apenas                   | Baixa                |
| Onboarding (bifurcado aluno/profissional)                  | `/onboarding` — `src/routes/onboarding.tsx`                                | Aluno/Profissional            | On-brand mas com componentes próprios (`BigChoice`, `BigField`) não reaproveitados do design system                       | Sim                                | Média                |
| Dashboard do Aluno                                         | `/app/` (`DashboardAluno`) — `src/routes/app.index.tsx`                    | Aluno                         | Rico, on-brand, melhor tela do app                                                                                        | Referência — não mexer na essência | Baixa                |
| Dashboard do Profissional                                  | `/app/` (`DashboardProfissional`) — `src/routes/app.index.tsx`             | Instrutor/Nutricionista       | On-brand, mas raso perto do dashboard do aluno                                                                            | Sim                                | Média                |
| Treinos (genérico + prescrito)                             | `/app/treinos` — `src/routes/app.treinos.tsx`                              | Aluno                         | On-brand                                                                                                                  | Revisão leve                       | Baixa                |
| Alimentação                                                | `/app/alimentacao` — `src/routes/app.alimentacao.tsx`                      | Aluno                         | On-brand na maior parte, mas com cores fora do DS (rose/emerald/sky) e um widget off-brand embutido (`CardapioPrescrito`) | Sim                                | Alta                 |
| Método (Centro de Conhecimento)                            | `/app/method` — `src/routes/app.method.tsx`                                | Aluno                         | On-brand, bem cuidada                                                                                                     | Polimento apenas                   | Baixa                |
| Perfil do Aluno                                            | `/app/profile` (`ProfileAluno`) — `src/routes/app.profile.tsx`             | Aluno                         | On-brand                                                                                                                  | Revisão leve                       | Baixa                |
| Perfil do Profissional                                     | `/app/profile` (`ProfileProfissional`) — `src/routes/app.profile.tsx`      | Instrutor/Nutricionista       | On-brand, mas visivelmente mais vazio                                                                                     | Sim                                | Média                |
| Guia Mental (detalhe)                                      | `/app/guias/$chave` — `src/routes/app.guias.$chave.tsx`                    | Aluno                         | On-brand, boa tipografia editorial                                                                                        | Não                                | Baixa                |
| Meu Plano (stub)                                           | `/app/meu-plano` — `src/routes/app.meu-plano.tsx`                          | Aluno                         | Redirect puro; 400+ linhas de componentes duplicados nunca renderizados                                                   | Remover (não é redesign)           | Alta (risco técnico) |
| Painel do Admin (lista)                                    | `/app/admin` — `src/routes/app.admin.tsx`                                  | Admin                         | Off-brand (shadcn puro)                                                                                                   | Sim                                | Alta                 |
| Detalhe do Aluno (Admin)                                   | `/app/admin/$userId` — `src/routes/app.admin.$userId.tsx`                  | Admin                         | Off-brand, denso, sem hierarquia visual                                                                                   | Sim                                | Alta                 |
| Meus Alunos (Instrutor)                                    | `/app/instrutor` — `src/routes/app.instrutor.tsx`                          | Instrutor/Nutricionista/Admin | On-brand (`glass`)                                                                                                        | Polimento                          | Média                |
| Detalhe do Aluno (Instrutor — abas Treino/Dieta/Progresso) | `/app/instrutor/$alunoId` — `src/routes/app.instrutor.$alunoId.tsx`        | Instrutor/Nutricionista       | Quase on-brand, mas cards usam `bg-card/50` em vez de `glass`; labels de formulário não padronizados                      | Sim                                | Alta                 |
| Banco de Exercícios                                        | `/app/instrutor/exercicios` — `src/routes/app.instrutor.exercicios.tsx`    | Instrutor/Nutricionista/Admin | On-brand                                                                                                                  | Polimento                          | Média                |
| Cardápio Prescrito (widget)                                | `src/components/cardapio-prescrito.tsx`                                    | Aluno                         | Off-brand (`Card` shadcn) dentro de tela on-brand                                                                         | Sim                                | Alta                 |
| Protocolo Editor + Alertas de Troca                        | `src/components/protocolo-editor.tsx`, `src/components/alertas-trocas.tsx` | Admin                         | Off-brand, mas consistente entre si                                                                                       | Sim                                | Média                |
| Weekly Planner (modal)                                     | `src/components/weekly-planner.tsx`                                        | Aluno                         | On-brand; labels cruas, `MetaChip` duplicado                                                                              | Sim                                | Média                |
| Welcome Modal                                              | `src/components/welcome-modal.tsx`                                         | Aluno                         | On-brand, melhor exemplo de modal "hero"                                                                                  | Referência para outros modais      | Baixa                |
| Registrar Foto de Refeição                                 | `src/components/registrar-foto-refeicao.tsx`                               | Aluno                         | On-brand; cor `emerald` ad-hoc no estado de sucesso                                                                       | Ajuste pequeno                     | Baixa                |
| Estados vazios (transversal)                               | Múltiplos arquivos                                                         | Todos                         | Sem componente único                                                                                                      | Sim                                | Média                |
| Estados de carregamento (transversal)                      | Múltiplos arquivos                                                         | Todos                         | Sem componente único                                                                                                      | Sim                                | Média                |

## 5. Telas prioritárias para redesign

### 5.1 Painel do Admin — `/app/admin` (`src/routes/app.admin.tsx`)

- **Problema atual**: usa `Card`/`CardHeader`/`CardTitle`/`Table` do shadcn sem nenhuma adaptação — sem `glass`, sem `bg-gradient-ember`, sem `shadow-ember`. Header é `<h1 className="text-2xl font-bold">` com ícone `Shield` solto, padrão visual de admin genérico (`container max-w-6xl px-4 py-6`) que não aparece em nenhuma outra tela do app.
- **Ajustes necessários**: alinhar o header ao padrão das demais telas (ícone em badge `bg-gradient-ember shadow-ember`, eyebrow label + `h1`), trocar `Card`/`Table` por um tratamento consistente com `glass` (ou uma variante de tabela "on-brand" a ser definida), botão de exportar CSV com `bg-gradient-ember`.
- **Componentes envolvidos**: `Card`, `Table`, `Button`, `Input`, `AlertasTrocas`.
- **Prioridade**: Alta.
- **Risco técnico**: baixo — é uma tela isolada (rota própria, sem reuso externo), segura para redesenhar sem quebrar outras áreas.

### 5.2 Detalhe do Aluno (Admin) — `/app/admin/$userId` (`src/routes/app.admin.$userId.tsx`)

- **Problema atual**: mesma base off-brand do item 5.1, mas ainda mais densa — 6 `Card`s empilhados, cada um com `CardContent` em grid de `Info` (label + valor cru). Não há hierarquia visual entre "dados críticos" (peso, meta) e "dados históricos" (diário, hidratação). Usa `(profile as any)` em vários pontos — não é um problema visual, mas indica que o tipo de `profile` não cobre os campos do questionário de onboarding (sinal de dívida técnica próxima da área a redesenhar).
- **Ajustes necessários**: agrupar em seções com hierarquia clara (resumo → quiz → protocolo → histórico), usar os mesmos "stat chips" que o resto do app usa, aplicar `glass`/gradiente nos blocos de destaque.
- **Componentes envolvidos**: `Card`, `ProtocoloEditor`, `AlertasTrocas`, `Info` (local).
- **Prioridade**: Alta.
- **Risco técnico**: baixo, isolada; mexer no tipo de `profile`/campos `as any` é risco técnico separado (não visual) que vale mencionar ao time de dados antes de tocar no layout.

### 5.3 Alimentação — `/app/alimentacao` (`src/routes/app.alimentacao.tsx`)

- **Problema atual**: a tela é majoritariamente on-brand (`glass`, `bg-gradient-ember`), mas o **toggle de objetivo** (Perda/Reeducação/Ganho) usa gradientes `rose-500→red-700` e `emerald-500→green-700` que não existem na paleta; a seção de **hidratação** usa `sky-500`/`sky-300` para os controles de copos; e o widget `CardapioPrescrito` (renderizado logo abaixo do plano prescrito, que É `glass`) usa `Card` shadcn puro — dentro da mesma tela, lado a lado, dois sistemas de card diferentes.
- **Ajustes necessários**: mapear os 3 estados do objetivo e a hidratação para tokens do Design System (ex.: usar `--primary`/`--accent`/`--destructive` com opacidades diferentes em vez de cores Tailwind soltas); migrar `CardapioPrescrito` para `glass`.
- **Componentes envolvidos**: toggle de objetivo (inline em `AlimentacaoAluno`), seção de hidratação (inline), `CardapioPrescrito`, `PlanoAlimentarCard`.
- **Prioridade**: Alta.
- **Risco técnico**: médio — a lógica de negócio (mutations, cache do React Query) está entrelaçada com o JSX de estilo nesse arquivo (656 linhas); separar estilo de lógica exige cuidado para não introduzir regressão nas mutations otimistas.

### 5.4 Detalhe do Aluno (Instrutor) — `/app/instrutor/$alunoId` (`src/routes/app.instrutor.$alunoId.tsx`)

- **Problema atual**: os cards de plano de treino/dieta usam `rounded-2xl border border-border/60 bg-card/50` — visualmente parecido com `glass`, mas sem o blur e sem a borda translúcida característicos, criando uma variação sutil que quebra a consistência ao navegar entre `/app/instrutor` (que usa `glass`) e esta tela. Labels de formulário são `<label className="text-xs text-muted-foreground mb-1 block">` cru em vez do componente `<Label>` já existente em `src/components/ui/label.tsx`.
- **Ajustes necessários**: padronizar os cards para `glass`; trocar todos os `<label>` crus por `<Label>`.
- **Componentes envolvidos**: `PlanoTreinoCard`, `PlanoAlimentarCard`, `ProgressoTreinoCard`, `ProgressoAlimentarCard`, `CriarPlanoTreino`, `CriarPlanoAlimentar`.
- **Prioridade**: Alta (tela de trabalho diário do instrutor/nutricionista).
- **Risco técnico**: baixo — troca de classes CSS e de tag de label, sem tocar em lógica de mutation.

### 5.5 Meu Plano (stub morto) — `/app/meu-plano` (`src/routes/app.meu-plano.tsx`)

- **Problema atual**: o componente `MeuPlanoPage` faz apenas um `navigate({ to: "/app/treinos", replace: true })` e retorna `null` — mas o arquivo mantém ~400 linhas de `ConcluirTreinoBtn`, `PlanoTreinoView`, `MacroChip`, `PlanoAlimentarView` **idênticas ou quase idênticas** às de `app.treinos.tsx` e `app.alimentacao.tsx`, nunca chamadas.
- **Ajustes necessários**: não é redesign — é remoção de código morto antes de iniciar qualquer padronização visual, para não gastar esforço sincronizando 3 cópias do mesmo componente durante o redesign.
- **Componentes envolvidos**: arquivo inteiro.
- **Prioridade**: Alta (risco técnico, não estético).
- **Risco técnico**: baixo remover (é código inatingível), mas **alto se não remover antes do redesign** — qualquer ajuste de card feito em `app.treinos.tsx` precisaria (erroneamente) ser replicado aqui também se alguém não perceber que é código morto.

## 6. Componentes que precisam ser padronizados

| Componente                           | Onde aparece                                                                                                                                                                                                                                                 | Problema atual                                                                                                                     | Ajuste recomendado                                                                                                                                                           | Prioridade |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| "Stat chip" (label + valor em caixa) | `Stat` em `app.profile.tsx:581`, `MacroChip` em `app.alimentacao.tsx:301` e (outra implementação) em `app.instrutor.$alunoId.tsx:626`, `MetaChip` em `weekly-planner.tsx:603`, `Info` em `app.admin.$userId.tsx:295`, `Meta` em `cardapio-prescrito.tsx:202` | 6 implementações locais quase idênticas (label pequeno + valor em negrito, às vezes com borda `primary/20`)                        | Extrair um único `MetricChip`/`StatChip` em `src/components/ui/`                                                                                                             | Alta       |
| Cartão de conteúdo ("card")          | `glass rounded-2xl` (dominante) vs. `rounded-2xl border border-border/60 bg-card/50` (`app.instrutor.$alunoId.tsx`) vs. `Card` shadcn puro (admin, `protocolo-editor`, `alertas-trocas`, `cardapio-prescrito`)                                               | 3 sistemas de card coexistindo, com radius (`rounded-2xl` vs `rounded-xl`) e fundo (blur vs. sólido vs. bordas simples) diferentes | Escolher `glass` como card padrão de toda a área autenticada; reservar `Card` do shadcn só se uma variante "densa" for intencionalmente criada para telas de dados tabulares | Alta       |
| Botão de destaque (CTA)              | Repetido manualmente como `className="bg-gradient-ember text-primary-foreground shadow-ember"` em dezenas de arquivos                                                                                                                                        | Não existe `variant="ember"` no componente `Button` — cada tela reconstrói a mesma combinação de classes                           | Adicionar variante `ember` a `buttonVariants` em `src/components/ui/button.tsx`                                                                                              | Alta       |
| Label de formulário                  | `<Label>` (shadcn) em `app.profile.tsx`, `minha-alimentacao.tsx` vs. `<label className="text-xs text-muted-foreground...">` cru em `weekly-planner.tsx`, `app.instrutor.$alunoId.tsx`, `app.instrutor.exercicios.tsx` (`Field` local)                        | Dois padrões de rótulo convivendo                                                                                                  | Padronizar em `<Label>` em todos os formulários                                                                                                                              | Média      |
| Estado vazio                         | Emoji + texto (`app.treinos.tsx`, `app.alimentacao.tsx`), ícone Lucide em círculo (`cardapio-prescrito.tsx`), texto puro sem ícone (`app.admin.tsx`, `app.instrutor.tsx`)                                                                                    | Sem componente único, 3 estilos diferentes de "nada aqui ainda"                                                                    | Criar `EmptyState` reutilizável (ícone + título + descrição + CTA opcional)                                                                                                  | Média      |
| Estado de carregamento               | `Skeleton` (dashboard, treinos), `Loader2` girando centralizado (admin, instrutor), `animate-pulse` em `div` cru (vários pontos), texto "Carregando…" sem qualquer indicador visual (gates de admin)                                                         | 4 padrões diferentes para o mesmo conceito                                                                                         | Padronizar em `Skeleton` para conteúdo de página e `Loader2` só para ações dentro de botão/diálogo                                                                           | Média      |
| Media de exercício                   | `ExercicioMedia` (`src/components/exercicio-media.tsx`)                                                                                                                                                                                                      | Já é um bom componente compartilhado, reusado em 5+ lugares                                                                        | Nenhum — usar como modelo de reuso bem-sucedido                                                                                                                              | —          |
| Modal "hero" (header com gradiente)  | Só em `WelcomeModal`                                                                                                                                                                                                                                         | Padrão visualmente rico existe, mas não foi generalizado                                                                           | Extrair um `HeroDialogHeader` reutilizável para outros momentos de celebração (ex.: badge desbloqueado, meta atingida)                                                       | Baixa      |

## 7. Problemas de layout encontrados

### Espaçamento

- Convenção forte e consistente nas telas do aluno: `mx-auto max-w-md px-5 pt-8 pb-8`. As telas de admin usam `container max-w-6xl px-4 py-6` — convenção diferente, sem ligação com o restante do app.
- Padding interno de card diverge: `glass` costuma usar `p-5`; `CardContent` do shadcn usa `p-6` por padrão (às vezes sobrescrito para `p-0`) — resulta em densidades visuais diferentes entre telas vizinhas.

### Hierarquia visual

- Nas telas do aluno, o padrão "eyebrow label + `h1`" (`text-xs uppercase tracking-widest` seguido de `text-2xl`/`text-3xl`) cria hierarquia clara. Nas telas de admin, o header é só um `h1` com ícone ao lado — um nível de hierarquia a menos.
- `/app/admin/$userId` empilha 6 `Card`s de mesmo peso visual (sem seção "principal" vs. "secundária") — usuário precisa ler tudo para achar o que importa.

### Cards

- Ver seção 6 — três sistemas de card coexistindo é o problema mais visível do app.

### Navegação

- `AppShell` (`src/routes/app.tsx`) já resolve bem a navegação principal (SideNav desktop / BottomNav mobile) e é consistente.
- Páginas profundas (`/app/admin/$userId`, `/app/instrutor/$alunoId`, `/app/instrutor/exercicios`) usam apenas um botão "← Voltar" (`Button variant="ghost"`) sem breadcrumb — aceitável, mas cada uma implementa o botão de volta de forma levemente diferente (ícone antes vs. link envolvendo botão vs. só ícone sem texto em `exercicios`).

### Formulários

- Onboarding usa seus próprios controles (`BigChoice`, `BigField` com `border-2` e alturas maiores) que não existem em nenhum outro lugar do app — coerente para um wizard, mas fora do inventário de componentes reutilizáveis.
- Diálogos de criação/edição no instrutor (`CriarPlanoTreino`, `CriarPlanoAlimentar`, `PlanoTreinoCard`) usam `<label>` cru + `Input`/`Select`/`Textarea` padrão; outros formulários (`ProfileAluno`, `MinhaAlimentacao`) usam `<Label>`.

### Modais

- Base (`Dialog` do Radix/shadcn) é consistente. O conteúdo interno varia de "rico" (`WelcomeModal`, com hero gradiente) a "utilitário puro" (diálogos de criação no instrutor, só título + inputs).

### Listas

- Padrão de lista com `divide-y divide-border/40` é usado consistentemente em várias telas (instrutor, admin, guias) — um dos pontos mais uniformes do app.

### Responsividade

- Apenas o **Dashboard do Aluno** tem tratamento explícito de desktop (`lg:grid-cols-3 lg:max-w-6xl`, `src/routes/app.index.tsx:484`), aproveitando o espaço ao lado do `SideNav`.
- Todas as demais telas autenticadas (Treinos, Alimentação, Método, Perfil, Guia, Instrutor) ficam limitadas a `max-w-md`/`max-w-2xl`/`max-w-3xl` centralizados — em telas desktop largas (com `SideNav` de 256px ocupado), sobra bastante espaço vazio lateral sem uso.
- As telas de admin usam `max-w-5xl`/`max-w-6xl`, mais largas, mas ainda como coluna única — não aproveitam grid de duas colunas.

## 8. Problemas de tipografia encontrados

### Títulos

- `h1`/`h2`/`h3` herdam `font-display` (Cormorant Garamond) globalmente (`src/styles.css:119`) — isso já garante consistência de fonte em **todas** as telas, inclusive admin (mesmo sem estilização de card, o texto "Painel do Admin" já usa a fonte serifada certa).
- Tamanho de `h1` varia bastante sem tabela de escala formal: `text-3xl` (Dashboard, Perfil), `text-2xl` (Treinos, Alimentação, Exercícios, Admin), `text-4xl` (Método, Guia). Não há regra clara de quando usar cada tamanho.

### Subtítulos

- O padrão "eyebrow" (`text-[10px]`/`text-[11px] uppercase tracking-widest text-muted-foreground`) é usado dezenas de vezes e funciona bem como assinatura visual — mas os valores em pixel (`text-[10px]`, `text-[11px]`) são arbitrários, não tokens.

### Textos de corpo

- Tamanhos de corpo também usam valores arbitrários frequentes: `text-[13.5px]`, `text-[15px]`, `text-[17px]` (em `app.method.tsx` e `app.guias.$chave.tsx`), fora da escala padrão do Tailwind (`text-sm`, `text-base`). Não é necessariamente "errado", mas indica ausência de tokens de tipografia — cada tela escolhe o pixel que "parece certo".

### Labels

- Ver seção 6 — mistura de `<Label>` e `<label>` cru.

### Botões

- Tipografia dos botões é consistente (`text-sm font-medium`, herdado do `buttonVariants` base) — sem problema aqui.

### Textos auxiliares

- `text-muted-foreground` é usado de forma consistente para texto secundário em todo o app — ponto forte.

## 9. Inconsistências de cores

| Arquivo/Tela                                                          | Cor atual                                                     | Cor recomendada do Design System                                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/routes/app.alimentacao.tsx` (toggle "Perda")                     | `from-rose-500 to-red-700`, `shadow-[...rgba(244,63,94,...)]` | `--destructive` ou variação de `--primary` com opacidade reduzida                                                |
| `src/routes/app.alimentacao.tsx` (toggle "Reeducação")                | `from-emerald-500 to-green-700`                               | `--accent` (dourado) com tratamento visual distinto (ex.: apenas borda, sem preenchimento sólido)                |
| `src/routes/app.alimentacao.tsx` (seção de hidratação)                | `sky-500`, `sky-300`, `sky-600`                               | Um token novo "hidratação" derivado de `--accent`, ou reaproveitar `--primary` com uma opacidade/ícone distintos |
| `src/components/alertas-trocas.tsx` (badge "Fora da margem")          | `bg-amber-500/15 text-amber-400`                              | `--destructive` ou `--accent` conforme severidade                                                                |
| `src/components/registrar-foto-refeicao.tsx` (badge "Análise pronta") | `bg-emerald-600/90`                                           | `--primary`/`--accent` com ícone de check, mantendo a paleta âmbar                                               |

Fora esses pontos, o resto do app usa exclusivamente as variáveis do tema (`text-primary`, `text-accent`, `text-destructive`, `text-muted-foreground`, `bg-gradient-ember`) — a violação de paleta está concentrada nesses 5 pontos, o que torna a correção barata.

## 10. Oportunidades de reutilização de componentes

- **`MetricChip`/`StatChip`** — substituir `Stat`, `MacroChip` (×2), `MetaChip`, `Info`, `Meta` (seção 6).
- **`EmptyState`** — substituir os ~10 estados vazios espalhados (emoji, ícone, texto puro).
- **`ember` variant no `Button`** — eliminar a repetição de `bg-gradient-ember text-primary-foreground shadow-ember` em dezenas de arquivos.
- **`GlassCard`** (ou formalizar `.glass` como componente, não só classe utilitária) — para garantir que toda tela nova use o mesmo card por padrão, em vez de importar `Card` do shadcn "por hábito".
- **`HeroDialogHeader`** — generalizar o padrão do `WelcomeModal` para outros modais de celebração/onboarding contextual.
- **`PageHeader`** (ícone em badge + eyebrow + `h1`) — o padrão já se repete quase idêntico em Treinos, Alimentação, Exercícios, Instrutor; formalizar evita pequenas divergências (algumas telas têm `mb-5`, outras `mb-6`, outras `mb-2`).
- **`ExercicioMedia`** — já é reuso correto; usar como referência de "como fazer".
- **Lista com `divide-y`** — já é reuso correto (instrutor, admin, guias); manter o padrão.

## 11. Riscos técnicos

- **Duplicação de código em `app.meu-plano.tsx`**: ~400 linhas de componentes (`PlanoTreinoView`, `ConcluirTreinoBtn`, `MacroChip`, `PlanoAlimentarView`) idênticas às de `app.treinos.tsx`/`app.alimentacao.tsx`, porém mortas (a rota só redireciona). Se não for removido antes do redesign, qualquer ajuste visual feito nos originais pode ser replicado por engano aqui, ou o arquivo morto pode ser deixado desatualizado e confundir o próximo desenvolvedor.
- **Lógica e estilo entrelaçados**: arquivos como `app.alimentacao.tsx` (656 linhas) e `minha-alimentacao.tsx` (674 linhas) misturam mutations do React Query (com atualização otimista) com blocos grandes de JSX estilizado. Separar visual de lógica exige cuidado para não regredir o comportamento otimista (undo de refeição, meta de hidratação, etc.).
- **Ausência de tokens formais de tipografia/espaçamento**: como não há uma escala nomeada (só valores Tailwind e arbitrários), qualquer padronização visual exigirá decidir a escala _antes_ de tocar em cada tela — caso contrário, o redesign corre o risco de trocar um conjunto de valores arbitrários por outro.
- **Dois componentes com o mesmo nome em arquivos diferentes**: `PlanoTreinoView`, `ConcluirTreinoBtn`, `MacroChip` existem (quase) duplicados em `app.treinos.tsx` e `app.meu-plano.tsx`; `PlanoAlimentarCard` existe em `app.alimentacao.tsx` e `app.instrutor.$alunoId.tsx` com propósitos diferentes (visão do aluno vs. edição do instrutor) — atenção ao renomear/extrair para não confundir os dois contextos.
- **Campos de perfil acessados via `as any`** em `app.admin.$userId.tsx` (`(profile as any)?.objetivo_fenix`, `.alimento_favorito`, etc.) — não é risco visual, mas indica que o tipo `Profile` em `src/lib/queries.ts` está incompleto; vale reportar ao time antes de redesenhar essa tela para não herdar o `any`.
- **Risco de quebrar o fluxo do aluno**: Dashboard, Treinos e Alimentação são as telas de uso diário — qualquer redesign nelas deve ser testado com atenção redobrada em mobile (breakpoint principal do app) antes de mexer no desktop.
- **Risco de quebrar o fluxo do profissional**: `/app/instrutor/$alunoId` tem 3 abas com mutations de criação/remoção (planos, exercícios, refeições) — trocar cards/labels é seguro, mas qualquer refatoração de componente precisa preservar as `queryKey`s de invalidação do React Query intactas.

## 12. Ordem recomendada de implementação

1. Remover o código morto de `app.meu-plano.tsx` (mantendo só o redirect) — libera terreno antes de padronizar componentes que ele duplica.
2. Definir e documentar tokens visuais que faltam: escala tipográfica nomeada, variante `ember` no `Button`, decisão formal de "glass é o card padrão".
3. Extrair `MetricChip`/`StatChip` e substituir as 6 implementações locais.
4. Extrair `EmptyState` e substituir os estados vazios divergentes.
5. Padronizar `<Label>` em todos os formulários (remover `<label>` cru).
6. Padronizar cards: migrar `app.instrutor.$alunoId.tsx` de `bg-card/50` para `glass`; migrar `cardapio-prescrito.tsx`, `protocolo-editor.tsx`, `alertas-trocas.tsx` de `Card` shadcn para `glass`.
7. Corrigir as 5 inconsistências de cor (seção 9), mapeando cada uma para tokens do Design System.
8. Redesenhar `/app/admin` e `/app/admin/$userId` com o novo `PageHeader`, cards `glass` e `MetricChip`.
9. Redesenhar `/app/alimentacao` (toggle de objetivo e hidratação) usando as cores corrigidas do passo 7.
10. Dar paridade visual ao Dashboard e Perfil do Profissional em relação às versões do aluno.
11. Avaliar tratamento de desktop (`lg:`) para Treinos, Alimentação, Método, Perfil e telas de instrutor, hoje limitadas a coluna única mesmo em telas largas.
12. Revisão final de responsividade (mobile pequeno → desktop) em todas as telas tocadas.

## 13. Critérios de aceite para iniciar o redesign

- [x] Todas as 17 rotas do app foram mapeadas e classificadas por perfil (aluno/profissional/admin/público).
- [x] Os 3 sistemas de card concorrentes foram identificados com exemplos de arquivo/linha.
- [x] As 6 implementações duplicadas de "stat chip" foram localizadas.
- [x] As 5 inconsistências de cor fora do Design System foram localizadas com arquivo e cor recomendada.
- [x] A prioridade de redesign por tela foi definida (Alta/Média/Baixa) na tabela da seção 4.
- [x] Os riscos técnicos (código morto, lógica/estilo entrelaçados, tipos incompletos) foram documentados.
- [x] Uma ordem segura de implementação foi proposta na seção 12.
- [x] Nenhuma alteração visual foi aplicada nesta etapa — apenas leitura e documentação.
