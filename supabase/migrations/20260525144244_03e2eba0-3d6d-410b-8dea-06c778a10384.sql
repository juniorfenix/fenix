
-- =========================================
-- guias_mentais (conteúdo público)
-- =========================================
CREATE TABLE public.guias_mentais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  conteudo TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guias_mentais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guias publicly readable"
  ON public.guias_mentais FOR SELECT
  USING (true);

CREATE TRIGGER set_updated_at_guias_mentais
  BEFORE UPDATE ON public.guias_mentais
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- diario_registro (respostas do usuário)
-- =========================================
CREATE TABLE public.diario_registro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  humor TEXT,
  registrado_em DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diario_registro_user_date
  ON public.diario_registro (user_id, registrado_em DESC);

ALTER TABLE public.diario_registro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own diario select" ON public.diario_registro
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own diario insert" ON public.diario_registro
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own diario update" ON public.diario_registro
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own diario delete" ON public.diario_registro
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_diario_registro
  BEFORE UPDATE ON public.diario_registro
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- rotina_semanal (hábitos por dia da semana)
-- =========================================
CREATE TABLE public.rotina_semanal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  titulo TEXT NOT NULL,
  descricao TEXT,
  horario TIME,
  concluido BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rotina_semanal_user_day
  ON public.rotina_semanal (user_id, dia_semana, ordem);

ALTER TABLE public.rotina_semanal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own rotina select" ON public.rotina_semanal
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own rotina insert" ON public.rotina_semanal
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own rotina update" ON public.rotina_semanal
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own rotina delete" ON public.rotina_semanal
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_rotina_semanal
  BEFORE UPDATE ON public.rotina_semanal
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
