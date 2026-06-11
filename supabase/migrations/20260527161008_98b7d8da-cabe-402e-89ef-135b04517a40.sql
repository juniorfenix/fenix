ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS alimento_favorito text,
  ADD COLUMN IF NOT EXISTS alimentos_evitar text[],
  ADD COLUMN IF NOT EXISTS tem_restricao boolean,
  ADD COLUMN IF NOT EXISTS restricao_descricao text,
  ADD COLUMN IF NOT EXISTS objetivo_fenix text;