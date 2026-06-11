-- 1. Estende a base de alimentos com categoria e porção de referência
ALTER TABLE public.alimentos_padrao
  ADD COLUMN IF NOT EXISTS categoria text NOT NULL DEFAULT 'outros',
  ADD COLUMN IF NOT EXISTS porcao_referencia_g numeric NOT NULL DEFAULT 100;

ALTER TABLE public.alimentos_padrao
  DROP CONSTRAINT IF EXISTS alimentos_padrao_categoria_check;
ALTER TABLE public.alimentos_padrao
  ADD CONSTRAINT alimentos_padrao_categoria_check
  CHECK (categoria IN ('proteina','carboidrato','gordura','vegetal','fruta','laticinio','bebida','outros'));

CREATE INDEX IF NOT EXISTS idx_alimentos_padrao_categoria
  ON public.alimentos_padrao(categoria) WHERE ativo;

-- 2. Protocolo prescrito (um por aluno)
CREATE TABLE public.protocolos_prescritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  meta_kcal integer NOT NULL DEFAULT 0,
  meta_proteinas numeric NOT NULL DEFAULT 0,
  meta_carboidratos numeric NOT NULL DEFAULT 0,
  meta_gorduras numeric NOT NULL DEFAULT 0,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.protocolos_prescritos TO authenticated;
GRANT ALL ON public.protocolos_prescritos TO service_role;

ALTER TABLE public.protocolos_prescritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aluno read own protocolo"
  ON public.protocolos_prescritos FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin manage protocolos"
  ON public.protocolos_prescritos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_protocolos_updated_at
  BEFORE UPDATE ON public.protocolos_prescritos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Itens prescritos por refeição
CREATE TABLE public.protocolo_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo_id uuid NOT NULL REFERENCES public.protocolos_prescritos(id) ON DELETE CASCADE,
  refeicao text NOT NULL CHECK (refeicao IN ('cafe','lanche_manha','almoco','lanche_tarde','jantar','ceia')),
  alimento_id uuid NOT NULL REFERENCES public.alimentos_padrao(id) ON DELETE RESTRICT,
  gramas numeric NOT NULL CHECK (gramas > 0),
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_protocolo_itens_protocolo ON public.protocolo_itens(protocolo_id);
CREATE INDEX idx_protocolo_itens_refeicao ON public.protocolo_itens(protocolo_id, refeicao, ordem);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.protocolo_itens TO authenticated;
GRANT ALL ON public.protocolo_itens TO service_role;

ALTER TABLE public.protocolo_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aluno read own protocolo_itens"
  ON public.protocolo_itens FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.protocolos_prescritos p
    WHERE p.id = protocolo_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "admin manage protocolo_itens"
  ON public.protocolo_itens FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Log de substituições
CREATE TABLE public.substituicoes_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  protocolo_item_id uuid REFERENCES public.protocolo_itens(id) ON DELETE SET NULL,
  refeicao text NOT NULL,
  alimento_original_id uuid REFERENCES public.alimentos_padrao(id) ON DELETE SET NULL,
  alimento_original_nome text NOT NULL,
  gramas_original numeric NOT NULL,
  alimento_substituto_id uuid REFERENCES public.alimentos_padrao(id) ON DELETE SET NULL,
  alimento_substituto_nome text NOT NULL,
  gramas_substituto numeric NOT NULL,
  delta_proteinas_pct numeric,
  delta_carboidratos_pct numeric,
  delta_gorduras_pct numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subst_log_user ON public.substituicoes_log(user_id, created_at DESC);
CREATE INDEX idx_subst_log_created ON public.substituicoes_log(created_at DESC);

GRANT SELECT, INSERT ON public.substituicoes_log TO authenticated;
GRANT ALL ON public.substituicoes_log TO service_role;

ALTER TABLE public.substituicoes_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aluno insert own subst"
  ON public.substituicoes_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "aluno read own subst"
  ON public.substituicoes_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin read all subst"
  ON public.substituicoes_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));