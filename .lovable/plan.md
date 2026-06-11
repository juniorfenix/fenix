## Escopo

Vou expandir a aba **Método** com 4 cards de ação (Meal Prep, Fora de Casa, Cozinha Fênix, Plateau) e adicionar um **Planner Semanal** persistido na aba **Início**. A busca atual já filtra os guias — vou estendê-la para incluir o novo guia de Plateau.

## 1. Aba Método (`src/routes/app.method.tsx`)

**Hub de Execução** — 4 cards no topo (abaixo do header, acima da busca):
- 🍱 **Checklist de Meal Prep** → abre `Dialog` com checklist interativo (0–60 min) com estado local persistido em `localStorage` (`fenix:mealprep`).
- ✈️ **Guia Fora de Casa** → abre `Dialog` com tabs: Restaurantes, Fast Food, Festas, Viagens.
- 👨‍🍳 **Cozinha Fênix** → abre `Dialog` com lista filtrável das 21 receitas (categoria + busca + tempo). Clique numa receita → modo preparo passo a passo.
- 📉 **Protocolo de Plateau** → abre `Dialog` com formulário de diagnóstico (3 perguntas) que recomenda 1 das 4 estratégias Fênix (Recarga, Variação, Sódio/Carbo, Ajuste Calórico).

**Busca inteligente** — adicionar `plateau` ao índice e ao acordeão (5ª seção).

**Cards** estilo glass + ícone gradient ember, grid 2x2 mobile, 4 col desktop.

Conteúdo (receitas, checklist meal prep, fora de casa, plateau) vive em const arrays no próprio arquivo seguindo o padrão atual.

## 2. Aba Início (`src/routes/app.index.tsx`)

**Card Planner Semanal** inserido entre "Guias mentais" e "Evolução do peso":
- Botão "Abrir planner" → abre `Dialog` (sheet em mobile) com:
  - Campo: Intenção da semana
  - Grid 7 dias × campos: Treino, Refeições, Água (slider 0-8), Humor (1-5 emoji)
  - Reflexão final: "O que funcionou" / "O que melhorar"
- Persistido em `localStorage` por chave da semana ISO (`fenix:planner:YYYY-WW`). Sem backend para não criar migração.

## 3. Performance

- Conteúdo estático (sem queries novas).
- Dialogs já são lazy via Radix.
- Receitas em array — render filtrado com `useMemo`.

## Arquivos editados

- `src/routes/app.method.tsx` — hub de cards + nova seção plateau no acordeão
- `src/routes/app.index.tsx` — card Planner Semanal
- (possível) novos componentes: `src/components/method-hub.tsx`, `src/components/weekly-planner.tsx` para manter os arquivos de rota legíveis

## Fora de escopo

- Persistência server-side do planner (fica em localStorage; pode virar tabela depois se o usuário pedir).
- Edição/criação de novas receitas pelo usuário.