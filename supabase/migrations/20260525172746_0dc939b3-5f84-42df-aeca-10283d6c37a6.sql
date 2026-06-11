CREATE TABLE public.metas_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  objetivo_ativo text NOT NULL DEFAULT 'perda' CHECK (objetivo_ativo IN ('perda','ganho')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.metas_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own metas select" ON public.metas_usuario FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own metas insert" ON public.metas_usuario FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own metas update" ON public.metas_usuario FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own metas delete" ON public.metas_usuario FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER metas_usuario_set_updated_at
BEFORE UPDATE ON public.metas_usuario
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();