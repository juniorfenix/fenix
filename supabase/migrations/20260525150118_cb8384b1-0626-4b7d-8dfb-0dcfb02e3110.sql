CREATE TABLE public.treinos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_exercicio TEXT NOT NULL,
  series INTEGER NOT NULL DEFAULT 0,
  repeticoes INTEGER NOT NULL DEFAULT 0,
  fase TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.treinos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own treino select" ON public.treinos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own treino insert" ON public.treinos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own treino update" ON public.treinos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own treino delete" ON public.treinos FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_treinos_user_fase_ordem ON public.treinos (user_id, fase, ordem);

CREATE TRIGGER set_treinos_updated_at
BEFORE UPDATE ON public.treinos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();