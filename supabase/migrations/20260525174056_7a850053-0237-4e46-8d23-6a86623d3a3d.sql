CREATE TABLE public.cardapios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  objetivo text NOT NULL CHECK (objetivo IN ('perda','ganho')),
  genero text NOT NULL CHECK (genero IN ('homem','mulher')),
  refeicao text NOT NULL,
  horario text,
  opcao_numero smallint NOT NULL,
  opcao_nome text NOT NULL,
  calorias integer NOT NULL DEFAULT 0,
  proteinas integer NOT NULL DEFAULT 0,
  descricao text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cardapios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cardapios publicly readable"
ON public.cardapios FOR SELECT
USING (true);

CREATE INDEX idx_cardapios_lookup ON public.cardapios (objetivo, genero, ordem, opcao_numero);

CREATE TRIGGER set_cardapios_updated_at
BEFORE UPDATE ON public.cardapios
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();