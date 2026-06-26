-- Fase 5: Foto → IA → Banco
-- Tabelas: refeicoes e itens_refeicao

-- ─── Trigger function para updated_at ────────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Tabela: refeicoes ────────────────────────────────────────────────────────
create table if not exists refeicoes (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null references auth.users(id) on delete cascade,
  data                    date        not null,
  tipo                    text        not null,
  foto_url                text,
  processado_por_ia       boolean     not null default false,
  confirmado_pelo_usuario boolean     not null default false,
  calorias_total          numeric     not null default 0,
  proteinas_total         numeric     not null default 0,
  carboidratos_total      numeric     not null default 0,
  gorduras_total          numeric     not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint refeicoes_tipo_check
    check (tipo in ('cafe_da_manha', 'almoco', 'jantar', 'lanche'))
);

-- Índices para refeicoes
create index if not exists idx_refeicoes_user_id  on refeicoes (user_id);
create index if not exists idx_refeicoes_data      on refeicoes (data);
create index if not exists idx_refeicoes_user_data on refeicoes (user_id, data);

-- Trigger updated_at
create trigger trg_refeicoes_updated_at
  before update on refeicoes
  for each row execute function update_updated_at_column();

-- ─── Tabela: itens_refeicao ──────────────────────────────────────────────────
create table if not exists itens_refeicao (
  id                uuid        primary key default gen_random_uuid(),
  refeicao_id       uuid        not null references refeicoes(id) on delete cascade,
  nome_alimento     text        not null,
  quantidade_gramas numeric,
  calorias          numeric,
  proteinas         numeric,
  carboidratos      numeric,
  gorduras          numeric,
  confianca_ia      float,
  created_at        timestamptz not null default now()
);

-- Índices para itens_refeicao
create index if not exists idx_itens_refeicao_refeicao_id on itens_refeicao (refeicao_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table refeicoes      enable row level security;
alter table itens_refeicao enable row level security;

-- ─── Policies: refeicoes ─────────────────────────────────────────────────────
create policy "refeicoes: select proprio"
  on refeicoes for select
  using (auth.uid() = user_id);

create policy "refeicoes: insert proprio"
  on refeicoes for insert
  with check (auth.uid() = user_id);

create policy "refeicoes: update proprio"
  on refeicoes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "refeicoes: delete proprio"
  on refeicoes for delete
  using (auth.uid() = user_id);

-- ─── Policies: itens_refeicao ─────────────────────────────────────────────────
-- Acesso via join com refeicoes: garante que o user_id da refeicao pai
-- pertence ao usuario autenticado.
create policy "itens_refeicao: select proprio"
  on itens_refeicao for select
  using (
    exists (
      select 1 from refeicoes r
      where r.id = itens_refeicao.refeicao_id
        and r.user_id = auth.uid()
    )
  );

create policy "itens_refeicao: insert proprio"
  on itens_refeicao for insert
  with check (
    exists (
      select 1 from refeicoes r
      where r.id = itens_refeicao.refeicao_id
        and r.user_id = auth.uid()
    )
  );

create policy "itens_refeicao: update proprio"
  on itens_refeicao for update
  using (
    exists (
      select 1 from refeicoes r
      where r.id = itens_refeicao.refeicao_id
        and r.user_id = auth.uid()
    )
  );

create policy "itens_refeicao: delete proprio"
  on itens_refeicao for delete
  using (
    exists (
      select 1 from refeicoes r
      where r.id = itens_refeicao.refeicao_id
        and r.user_id = auth.uid()
    )
  );
