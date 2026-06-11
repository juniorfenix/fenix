CREATE TABLE public.dietas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  genero TEXT NOT NULL,
  fase TEXT NOT NULL,
  refeicao TEXT NOT NULL,
  horario TEXT NOT NULL,
  opcao SMALLINT NOT NULL,
  descricao TEXT NOT NULL,
  kcal INTEGER NOT NULL,
  proteina_g INTEGER NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dietas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dietas publicly readable"
ON public.dietas FOR SELECT
USING (true);

CREATE TRIGGER set_dietas_updated_at
BEFORE UPDATE ON public.dietas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_dietas_filtro ON public.dietas(genero, fase, ordem);

CREATE TABLE public.dietas_dicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  genero TEXT NOT NULL,
  fase TEXT NOT NULL,
  dica TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dietas_dicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dietas_dicas publicly readable"
ON public.dietas_dicas FOR SELECT
USING (true);