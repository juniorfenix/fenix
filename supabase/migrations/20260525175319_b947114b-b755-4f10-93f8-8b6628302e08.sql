ALTER TABLE public.cardapios
  ADD COLUMN IF NOT EXISTS carboidratos integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gorduras integer NOT NULL DEFAULT 0;

CREATE TABLE public.hidratacao_diaria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  data date NOT NULL DEFAULT CURRENT_DATE,
  copos smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, data)
);

ALTER TABLE public.hidratacao_diaria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own hidratacao select" ON public.hidratacao_diaria FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own hidratacao insert" ON public.hidratacao_diaria FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own hidratacao update" ON public.hidratacao_diaria FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own hidratacao delete" ON public.hidratacao_diaria FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_hidratacao_updated_at
BEFORE UPDATE ON public.hidratacao_diaria
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();