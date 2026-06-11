CREATE TABLE public.diario_alimentar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  refeicao TEXT NOT NULL,
  nome TEXT NOT NULL,
  calorias INTEGER NOT NULL DEFAULT 0,
  proteinas INTEGER NOT NULL DEFAULT 0,
  carboidratos INTEGER NOT NULL DEFAULT 0,
  gorduras INTEGER NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diario_alimentar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own diario_alimentar select"
ON public.diario_alimentar FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own diario_alimentar insert"
ON public.diario_alimentar FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own diario_alimentar update"
ON public.diario_alimentar FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "own diario_alimentar delete"
ON public.diario_alimentar FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_diario_alimentar_user_data ON public.diario_alimentar(user_id, data DESC);

CREATE TRIGGER set_diario_alimentar_updated_at
BEFORE UPDATE ON public.diario_alimentar
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();