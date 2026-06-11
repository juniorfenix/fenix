# ROADMAP — App de Fitness (Cliente)

## Diagnóstico completo do Supabase

| Item | Estado |
|------|--------|
| Projeto | `sqcnmqvtbpyryiqhlaja` — região `sa-east-1` (São Paulo) |
| Banco | PostgreSQL 17 |
| Tabelas (public) | **22 tabelas** com RLS ativo em todas ✅ |
| Migrations | **10 aplicadas** (fase1 → fase4g) ✅ |
| RLS policies | **30+ políticas ativas** ✅ |
| Funções / Triggers (public) | **Nenhum** |
| Usuários cadastrados | **3** (email/password) |
| Storage buckets | 1 — `exercicios-gifs` (público) |
| Arquivos no Storage | **15 arquivos** (GIFs, MP4s, imagens) |
| Segurança | Leaked Password Protection desativada ⚠️ |

---

## Mapeamento completo do schema AUTH

O Supabase Auth possui **23 tabelas** gerenciadas automaticamente. Nenhuma deve ser modificada manualmente — toda interação é feita via `supabase.auth.*` no cliente ou via SQL usando `auth.uid()` em policies.

### Tabelas com dados

| Tabela | Linhas | Finalidade |
|--------|--------|-----------|
| `auth.users` | **1** | Usuário cadastrado (email/password) |
| `auth.identities` | **1** | Identidade vinculada ao usuário |
| Demais tabelas | 0 | Infraestrutura disponível mas não usada |

### Tabelas de autenticação padrão (todas com 0 linhas)

| Tabela | Colunas | RLS | Finalidade |
|--------|---------|-----|-----------|
| `auth.sessions` | 15 | ✅ | Sessões ativas dos usuários |
| `auth.refresh_tokens` | 9 | ✅ | Renovação de tokens JWT |
| `auth.audit_log_entries` | 5 | ✅ | Histórico de ações de auth |
| `auth.one_time_tokens` | 7 | ✅ | Tokens de confirmação de email/recuperação de senha |
| `auth.flow_state` | 17 | ✅ | Estado de fluxos OAuth/SSO |
| `auth.instances` | 5 | ✅ | Gerenciamento multi-site (uso interno) |
| `auth.schema_migrations` | 1 | ✅ | Versionamento do schema auth |

### Tabelas de MFA (Multi-Factor Authentication)

| Tabela | Colunas | RLS | Estado |
|--------|---------|-----|--------|
| `auth.mfa_factors` | 13 | ✅ | **Não configurado** — suporta TOTP, WebAuthn, SMS |
| `auth.mfa_challenges` | 7 | ✅ | **Não configurado** |
| `auth.mfa_amr_claims` | 5 | ✅ | **Não configurado** |

> **Observação:** MFA está disponível mas desabilitado. Para apps de saúde recomenda-se ativar TOTP.

### Tabelas de SSO / SAML (login corporativo)

| Tabela | RLS | Estado |
|--------|-----|--------|
| `auth.sso_providers` | ✅ | Não configurado |
| `auth.sso_domains` | ✅ | Não configurado |
| `auth.saml_providers` | ✅ | Não configurado |
| `auth.saml_relay_states` | ✅ | Não configurado |

> Não relevante para o projeto atual (app consumer).

### Tabelas de OAuth / Provedores externos

| Tabela | Colunas | RLS | Estado |
|--------|---------|-----|--------|
| `auth.oauth_clients` | 13 | ❌ | Não configurado |
| `auth.oauth_authorizations` | 17 | ❌ | Não configurado |
| `auth.oauth_consents` | 6 | ❌ | Não configurado |
| `auth.oauth_client_states` | 4 | ❌ | Não configurado |
| `auth.custom_oauth_providers` | 24 | ❌ | Não configurado |

> **Observação:** RLS desabilitado nas tabelas OAuth — isso é padrão do Supabase (gerenciado internamente). Não requer ação.
>
> **Oportunidade:** Configurar login social (Google, Apple) via `custom_oauth_providers` para melhorar conversão no cadastro.

### Tabelas de WebAuthn / Passkeys

| Tabela | Colunas | RLS | Estado |
|--------|---------|-----|--------|
| `auth.webauthn_credentials` | 14 | ❌ | Não configurado |
| `auth.webauthn_challenges` | 6 | ❌ | Não configurado |

> WebAuthn permite login sem senha (biometria / chave de segurança). Opcional para o app.

### Campos relevantes de `auth.users` (35 colunas)

Colunas úteis para integrar com a tabela `perfis`:

| Campo | Tipo | Uso |
|-------|------|-----|
| `id` | uuid | Chave primária — usar como FK em todas as tabelas do app |
| `email` | varchar | Email do usuário |
| `phone` | text | Telefone (se configurado) |
| `raw_user_meta_data` | jsonb | Metadados customizados (nome, avatar, etc.) |
| `raw_app_meta_data` | jsonb | Metadados do app (papel, permissões) |
| `confirmed_at` | timestamptz | Quando o email foi confirmado |
| `last_sign_in_at` | timestamptz | Último login |
| `is_anonymous` | boolean | Se é usuário anônimo |
| `banned_until` | timestamptz | Banimento temporário |

> **Padrão recomendado:** criar tabela `perfis` em `public` com `id uuid REFERENCES auth.users(id)` e um trigger `ON INSERT ON auth.users` para popular automaticamente.

---

## Inventário do Storage — bucket `exercicios-gifs`

Bucket criado em 27/05/2026. **Acesso público** (sem autenticação para leitura). Sem limite de tamanho ou restrição de tipo de arquivo.

### GIFs (4 arquivos)

| Arquivo | Tamanho |
|---------|---------|
| `31991301-corrida-estacionaria-360.gif` | 217 KB |
| `exercicio-ponte-elevacao-pelvica.gif` | 299 KB |
| `47271301-abdominal-supra.gif` | 176 KB |
| `remada com elastico.gif` | 350 KB |

### Vídeos MP4 (7 arquivos)

| Arquivo | Tamanho |
|---------|---------|
| `adominal crunch.mp4` | 411 KB |
| `agachamento.mp4` | 406 KB |
| `agachamento sumo.mp4` | 375 KB |
| `afunfo alternado.mp4` | 514 KB |
| `flexao com joelho.mp4` | 400 KB |
| `prancha.mp4` | 676 KB |
| `step em cadeira.mp4` | 948 KB |

### Imagens estáticas (3 arquivos)

| Arquivo | Formato | Tamanho |
|---------|---------|---------|
| `panturrilha em pe.jpg` | JPG | 33 KB |
| `glute bribge.png` | PNG | 116 KB |
| `polichinelos.png` | PNG | 77 KB |

### Problemas identificados no Storage

- **Nomes com espaços** — má prática, causa erros de URL (`adominal crunch.mp4`, etc.)
- **Typo no nome** — `adominal` (deveria ser `abdominal`), `afunfo` (deveria ser `avanço`/`afundo`), `glute bribge` (deveria ser `glute bridge`)
- **Formatos mistos** — GIF, MP4, JPG e PNG sem padrão definido
- **Sem limit de tamanho** — qualquer arquivo pode ser enviado, inclusive arquivos gigantes
- **Sem restrição de MIME type** — deveria aceitar apenas `image/gif`, `video/mp4`, `image/jpeg`, `image/png`
- **Tabela `exercicios` não referencia os arquivos** — nenhuma coluna `gif_url`, `video_url` ou `nome` existe na tabela

---

## Problemas críticos identificados

1. **RLS sem policies** — tabela `exercicios` tem RLS ativo mas sem políticas: **nenhum usuário consegue ler ou escrever**.
2. **Schema incompleto** — tabela `exercicios` tem só `id` e `created_at`; faltam todas as colunas de conteúdo.
3. **Storage desconectado do banco** — existem 15 arquivos de mídia no bucket mas nenhuma linha na tabela `exercicios` que os referencie.
4. **Nomes de arquivo com problemas** — espaços e typos nos nomes dificultam o uso.
5. **Leaked Password Protection desativada** — habilitar em: Dashboard → Auth → Providers → Email → Password Security.

---

## Funcionalidades a implementar

### 1. Completar tabela `exercicios` e conectar ao Storage

A tabela existe mas está vazia de conteúdo. Precisa receber as colunas e ser populada com os 15 arquivos já existentes no bucket.

**Schema alvo:**

```sql
exercicios (
  id          bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  created_at  timestamptz DEFAULT now(),
  nome        text NOT NULL,
  descricao   text,
  grupo_muscular text,  -- 'abdomen', 'pernas', 'costas', 'peito', 'ombros', 'braco'
  nivel       text,     -- 'iniciante', 'intermediario', 'avancado'
  equipamento text,     -- 'sem_equipamento', 'elastico', 'cadeira', 'academia'
  gif_url     text,     -- URL pública do GIF/MP4 no bucket exercicios-gifs
  video_url   text,     -- URL do MP4 (pode ser o mesmo campo ou separado)
  tipo_midia  text      -- 'gif' | 'video' | 'imagem'
)
```

**O que fazer:**
- Aplicar migration com as novas colunas
- Renomear arquivos no Storage (remover espaços, corrigir typos)
- Popular a tabela com os 15 exercícios já existentes
- Adicionar restrição de MIME type e limite de 5 MB no bucket
- Criar policy de RLS: leitura pública para exercícios (são dados globais, não por usuário)

---

### 2. Isolamento de dados por usuário (RLS)

Cada usuário deve ver **somente seus próprios dados**.

**Modelo de usuário:**

```sql
perfis (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  nome        text,
  papel       text DEFAULT 'aluno',  -- 'aluno' | 'instrutor' | 'admin'
  created_at  timestamptz DEFAULT now()
)
```

**Regra geral para todas as tabelas de dados do usuário:**
```sql
-- Leitura: só os próprios dados
CREATE POLICY "usuario_ve_proprios_dados"
ON tabela FOR SELECT
USING (auth.uid() = user_id);

-- Escrita: só nos próprios dados
CREATE POLICY "usuario_escreve_proprios_dados"
ON tabela FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Tabelas que precisam de RLS:**
`perfis`, `planos_alimentares`, `planos_treino`, `refeicoes`, `itens_refeicao`, `fotos_refeicoes`, `progresso_peso`

---

### 3. Papel de Instrutor / Profissional

O instrutor cria e atribui dietas e treinos para seus alunos.

**Modelo:**

```
perfis
  └── papel: 'aluno' | 'instrutor' | 'admin'

instrutores_alunos
  ├── instrutor_id  (FK → perfis)
  └── aluno_id      (FK → perfis)

planos_alimentares
  ├── id, instrutor_id, aluno_id
  ├── nome, descricao
  └── created_at

planos_treino
  ├── id, instrutor_id, aluno_id
  ├── nome, nivel, dias_semana
  └── created_at

planos_treino_exercicios
  ├── plano_id     (FK → planos_treino)
  ├── exercicio_id (FK → exercicios)
  ├── series, repeticoes, descanso_seg
  └── ordem
```

**RLS para instrutores:**
- Instrutor lê e escreve onde `instrutor_id = auth.uid()`
- Aluno lê onde `aluno_id = auth.uid()`

---

### 4. GIFs/Vídeos de exercícios no app

O app exibe a mídia de demonstração ao visualizar o treino. Infraestrutura já existe no Storage.

**O que falta:**
- Conectar tabela `exercicios` ao bucket (popular `gif_url` / `video_url`)
- Componente `<ExercicioCard>` com lazy load
- Para GIFs: `<img>` com loading="lazy"
- Para MP4s: `<video autoplay loop muted playsInline>`
- Fallback para imagem estática se GIF/MP4 não carregar

**URL pública dos arquivos:**
```
https://sqcnmqvtbpyryiqhlaja.supabase.co/storage/v1/object/public/exercicios-gifs/<nome-do-arquivo>
```

---

### 5. Foto → IA → Banco (registro de refeição por imagem)

O usuário tira foto da refeição; a IA identifica os alimentos e popula o diário alimentar.

**Fluxo:**

```
Usuário tira foto
       ↓
Upload para bucket privado `fotos_refeicoes` (user_id no path)
       ↓
Edge Function `processar-foto-refeicao` chamada com foto_url + user_id
       ↓
API de visão (Claude Sonnet Vision ou GPT-4o Vision)
  → retorna: lista de alimentos + calorias + macros + confiança
       ↓
Inserção em `refeicoes` e `itens_refeicao`
       ↓
App exibe resultado para o usuário confirmar/editar
```

**Tabelas:**

```sql
refeicoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  data date NOT NULL,
  tipo text,  -- 'cafe_da_manha' | 'almoco' | 'jantar' | 'lanche'
  foto_url text,
  processado_por_ia boolean DEFAULT false,
  calorias_total numeric,
  created_at timestamptz DEFAULT now()
)

itens_refeicao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refeicao_id uuid REFERENCES refeicoes(id) ON DELETE CASCADE,
  nome_alimento text NOT NULL,
  quantidade_gramas numeric,
  calorias numeric,
  proteinas numeric,
  carboidratos numeric,
  gorduras numeric,
  confianca_ia float  -- 0.0 a 1.0
)
```

---

## Fases de entrega

### Fase 1 — Base e segurança ✦ URGENTE (1–2 semanas)
- [x] Migration: adicionar colunas em `exercicios` (nome, grupo_muscular, nivel, gif_url, video_url) — **executado em 09/06/2026** (migration `fase1_schema_base`)
- [x] Popular tabela `exercicios` com os 15 arquivos do bucket — **15 linhas inseridas**
- [x] Criar tabela `perfis` com campo `papel` (aluno/instrutor/admin) + FK para `auth.users` — **executado em 09/06/2026**
- [x] Criar policy RLS de leitura pública para `exercicios` (`exercicios_leitura_autenticados`) — **executado em 09/06/2026** (migration `fase1_rls_policies`)
- [x] Criar policies RLS em `perfis` (select/update próprio + insert via trigger) — **executado em 09/06/2026**
- [x] Criar policy de escrita de `exercicios` apenas para admin (`exercicios_escrita_admin`) — **executado em 09/06/2026**
- [ ] Renomear arquivos no Storage (remover espaços, corrigir typos)
- [ ] Adicionar MIME type restriction e limite 5 MB no bucket `exercicios-gifs`
- [ ] Habilitar Leaked Password Protection no Auth

### Fase 2 — Instrutor e planos (2–3 semanas) ✅ CONCLUÍDA em 09/06/2026
- [x] Tabelas `instrutores_alunos`, `planos_alimentares`, `planos_treino`, `planos_treino_exercicios` — **migration aplicada em `sqcnmqvtbpyryiqhlaja`**
- [x] RLS em todas as tabelas novas — **policies instrutor/aluno**
- [x] Painel do instrutor (`/app/instrutor`) — lista alunos, adiciona/remove, navega para gerenciamento
- [x] Painel por aluno (`/app/instrutor/$alunoId`) — cria planos de treino e alimentares, adiciona exercícios por dia
- [x] Tela do aluno (`/app/meu-plano`) — visualiza planos atribuídos com GIFs/vídeos dos exercícios
- [x] Navegação dinâmica em `app.tsx` — instrutor vê aba "Alunos", aluno vê aba "Meu Plano"
- [x] Types TypeScript atualizados em `types.ts` e `queries.ts`
- [x] Rotas registradas em `routeTree.gen.ts`
- [x] Migration `fase0_tabelas_originais_app` — criadas tabelas originais no projeto `sqcnmqvtbpyryiqhlaja`: `profiles`, `weight_logs`, `diario_alimentar`, `diario_registro`, `badges`, `guias_mentais`, `treinos`, `dietas`, `dietas_dicas` com RLS — **executado em 09/06/2026**
- [x] Trigger `criar_perfil_usuario` atualizado para criar `perfis` + `profiles` simultaneamente — **executado em 09/06/2026**
- [x] Contas de teste criadas: `professor@fenix.teste` (instrutor) e `aluno@fenix.teste` (aluno), vinculados em `instrutores_alunos` — **executado em 09/06/2026**

### Fase 3 — Persistência completa de dados ✅ CONCLUÍDA em 09/06/2026

**Objetivo:** migrar o app de telas estáticas para dados reais persistidos no Supabase.

#### Novas tabelas criadas (migrations `fase3_*` e `fase4a` → `fase4g`)

| Tabela | Finalidade |
|--------|-----------|
| `hidratacao_diaria` | Registro diário de copos de água por usuário |
| `metas_usuario` | Objetivo ativo do usuário (perda/ganho/reeducacao) |
| `alimentos_padrao` | Catálogo de alimentos com macros (~40 itens BR) |
| `planner_semanal` | Planejador semanal de refeições (migrado de localStorage) |
| `user_roles` | Controle de acesso (role `admin`) |
| `preferencias_alimentares` | Preferências coletadas no onboarding |
| `substituicoes_log` | Log de trocas inteligentes de alimentos |
| `protocolos_prescritos` | Protocolo nutricional prescrito pelo admin |
| `protocolo_itens` | Itens do protocolo com FK para `alimentos_padrao` |
| `cardapios` | Cardápios sugeridos por objetivo e gênero |

#### Colunas adicionadas em tabelas existentes

| Tabela | Colunas adicionadas |
|--------|-------------------|
| `profiles` | `alimento_favorito`, `alimentos_evitar`, `tem_restricao`, `restricao_descricao`, `objetivo_fenix` |
| `diario_alimentar` | `proteinas`, `carboidratos`, `gorduras`, `observacoes` |
| `diario_registro` | `humor`, `resposta` |
| `alimentos_padrao` | `porcao_g` renomeado para `porcao_referencia_g` |

#### Dados iniciais populados

- [x] `alimentos_padrao` — ~40 alimentos brasileiros com macros
- [x] `guias_mentais` — 5 guias mentais com conteúdo completo
- [x] `treinos` — exercícios Iniciante I (ambos os gêneros, academia e casa)

#### Código atualizado

- [x] `src/integrations/supabase/types.ts` — regenerado com todas as 22 tabelas
- [x] `src/components/weekly-planner.tsx` — migrado de `localStorage` para `planner_semanal`
- [x] `src/routes/app.index.tsx` — `registrado_em` adicionado nos inserts de `diario_registro`
- [x] `src/components/humor-checkin.tsx` — idem
- [x] `src/lib/queries.ts` — null-coalescing para campos nullable
- [x] `src/routes/app.admin.$userId.tsx` — null-coalescing no export CSV
- [x] **Zero erros TypeScript** — `npx tsc --noEmit` passa limpo

### Fase 4 — Mídia no app ✅ PARCIALMENTE CONCLUÍDA em 09/06/2026
- [x] Componente `<ExercicioMedia>` com suporte a GIF, MP4 e imagem estática — `src/components/exercicio-media.tsx`
- [x] Lazy load via `<LazyMount>` + fallback com ícone quando sem mídia
- [x] Integrado em `/app/treinos` — cards e modal de detalhe
- [x] Coluna `url_midia` na tabela `treinos` — suporta URL de imagem ou MP4 (autoplay loop muted)
- [ ] Popular `url_midia` nos 29 exercícios da tabela `treinos` — **upload manual via Supabase Storage bucket `exercicios-gifs`** *(pendente)*
- [ ] Integração com `planos_treino_exercicios` — exibir mídia no Meu Plano do aluno

### Fase 5 — Foto → IA → Banco (2–3 semanas)
- [ ] Bucket privado `fotos_refeicoes` com RLS por `user_id`
- [ ] Edge Function `processar-foto-refeicao`
- [ ] Integração com API de visão
- [ ] Tabelas `refeicoes` e `itens_refeicao` com RLS
- [ ] UI: câmera → preview → confirmação do resultado da IA → salvar
- [ ] Histórico de refeições por dia com totais calóricos

---

## Próximos passos imediatos

1. **Renomear arquivos no Storage** — remover espaços e corrigir typos nos 15 arquivos *(pendente)*
2. ~~Aplicar Fase 1 migration~~ — ✅ concluído em 09/06/2026
3. ~~Popular `exercicios`~~ — ✅ 15 linhas inseridas em 09/06/2026
4. **Habilitar Leaked Password Protection** — configuração no painel do Supabase Auth *(pendente)*
5. ~~Confirmar modelo de papéis~~ — ✅ implementado com `perfis.papel` (`aluno`/`instrutor`/`admin`)
6. ~~Iniciar Fase 2~~ — ✅ concluído em 09/06/2026
7. ~~Migrar tabelas originais para `sqcnmqvtbpyryiqhlaja`~~ — ✅ concluído em 09/06/2026 (migration `fase0_tabelas_originais_app`)
8. ~~Persistir todos os dados no banco~~ — ✅ Fase 3 concluída em 09/06/2026 (22 tabelas, 0 erros TS)
9. **Testar fluxo completo de onboarding** — cadastro → quiz → `preferencias_alimentares` + `profiles` populados *(pendente)*
10. **Popular `cardapios`** — adicionar cardápios sugeridos para perda/ganho/reeducacao × homem/mulher *(pendente)*
11. **Cadastrar primeiro admin em `user_roles`** — `INSERT INTO user_roles (user_id, role) VALUES ('<uuid>', 'admin')` *(pendente)*
12. ~~Iniciar Fase 4~~ — ✅ `<ExercicioMedia>` implementado com lazy-load e fallback em 09/06/2026
13. **Popular `url_midia` na tabela `treinos`** — 29 exercícios aguardando mídia; fazer upload manual no bucket `exercicios-gifs` e atualizar a coluna via SQL *(pendente)*
    - Upload no painel Supabase Storage → `exercicios-gifs`
    - URL pública: `https://sqcnmqvtbpyryiqhlaja.supabase.co/storage/v1/object/public/exercicios-gifs/<arquivo>`
    - Atualizar: `UPDATE treinos SET url_midia = '<url>' WHERE exercicio = '<nome>';`
14. **Integrar mídia em Meu Plano** — exibir `url_midia` nos cards de `planos_treino_exercicios` *(próximo)*
