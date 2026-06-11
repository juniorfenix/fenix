CREATE TABLE public.alimentos_padrao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT,
  calorias INTEGER NOT NULL DEFAULT 0,
  proteinas INTEGER NOT NULL DEFAULT 0,
  carboidratos INTEGER NOT NULL DEFAULT 0,
  gorduras INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alimentos_padrao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alimentos_padrao publicly readable"
ON public.alimentos_padrao FOR SELECT USING (true);

CREATE TRIGGER set_alimentos_padrao_updated_at
BEFORE UPDATE ON public.alimentos_padrao
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_alimentos_padrao_ordem ON public.alimentos_padrao(ativo, ordem);