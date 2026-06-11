ALTER TABLE public.treinos
  ADD COLUMN IF NOT EXISTS url_midia text,
  ADD COLUMN IF NOT EXISTS instrucao text,
  ADD COLUMN IF NOT EXISTS dica_seguranca text;