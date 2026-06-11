
DROP TABLE IF EXISTS public.treinos CASCADE;

CREATE TABLE public.treinos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nivel TEXT NOT NULL,
  genero TEXT NOT NULL,
  local TEXT NOT NULL,
  dia_semana SMALLINT NOT NULL,
  exercicio TEXT NOT NULL,
  series_repeticoes TEXT NOT NULL,
  observacoes TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.treinos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "treinos publicly readable"
  ON public.treinos FOR SELECT
  USING (true);

CREATE INDEX idx_treinos_filter ON public.treinos (nivel, genero, local, dia_semana, ordem);

CREATE TRIGGER set_treinos_updated_at
  BEFORE UPDATE ON public.treinos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
