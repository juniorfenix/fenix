CREATE TABLE IF NOT EXISTS public.preferencias_alimentares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  essenciais text[] NOT NULL DEFAULT '{}',
  detestados text[] NOT NULL DEFAULT '{}',
  estilo_refeicao text,
  restricoes text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.preferencias_alimentares TO authenticated;
GRANT ALL ON public.preferencias_alimentares TO service_role;

ALTER TABLE public.preferencias_alimentares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own preferencias select"
  ON public.preferencias_alimentares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "own preferencias insert"
  ON public.preferencias_alimentares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own preferencias update"
  ON public.preferencias_alimentares FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "own preferencias delete"
  ON public.preferencias_alimentares FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "admin read all preferencias"
  ON public.preferencias_alimentares FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER preferencias_alimentares_set_updated_at
  BEFORE UPDATE ON public.preferencias_alimentares
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();