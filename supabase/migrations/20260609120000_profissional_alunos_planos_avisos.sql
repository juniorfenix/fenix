-- Area do profissional: alunos, planos detalhados e avisos de progresso.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email IS DISTINCT FROM u.email);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles (display_name);

CREATE TABLE IF NOT EXISTS public.perfis (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  papel text NOT NULL DEFAULT 'aluno',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.perfis
  ADD COLUMN IF NOT EXISTS nome text,
  ADD COLUMN IF NOT EXISTS papel text NOT NULL DEFAULT 'aluno',
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.perfis DROP CONSTRAINT IF EXISTS perfis_papel_check;
ALTER TABLE public.perfis
  ADD CONSTRAINT perfis_papel_check
  CHECK (papel IN ('aluno', 'instrutor', 'nutricionista', 'admin'));

INSERT INTO public.perfis (id, nome, papel)
SELECT id, display_name, 'aluno'
FROM public.profiles
ON CONFLICT (id) DO UPDATE
SET nome = COALESCE(public.perfis.nome, EXCLUDED.nome);

DROP TRIGGER IF EXISTS perfis_updated_at ON public.perfis;
CREATE TRIGGER perfis_updated_at
BEFORE UPDATE ON public.perfis
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name text;
BEGIN
  display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, display_name)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name);

  INSERT INTO public.perfis (id, nome, papel)
  VALUES (NEW.id, display_name, 'aluno')
  ON CONFLICT (id) DO UPDATE
  SET nome = COALESCE(public.perfis.nome, EXCLUDED.nome);

  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.instrutores_alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_instrutores_alunos_unique
  ON public.instrutores_alunos (instrutor_id, aluno_id);
CREATE INDEX IF NOT EXISTS idx_instrutores_alunos_instrutor
  ON public.instrutores_alunos (instrutor_id);
CREATE INDEX IF NOT EXISTS idx_instrutores_alunos_aluno
  ON public.instrutores_alunos (aluno_id);

CREATE TABLE IF NOT EXISTS public.planos_treino (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  nome text NOT NULL,
  nivel text NOT NULL DEFAULT 'iniciante',
  dias_semana text[],
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planos_treino_exercicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id uuid NOT NULL REFERENCES public.planos_treino(id) ON DELETE CASCADE,
  exercicio_id integer NOT NULL REFERENCES public.exercicios(id) ON DELETE RESTRICT,
  dia_semana integer NOT NULL,
  series integer NOT NULL DEFAULT 3,
  repeticoes text NOT NULL DEFAULT '10-12',
  descanso_seg integer NOT NULL DEFAULT 60,
  ordem integer NOT NULL DEFAULT 0,
  observacoes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planos_alimentares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  meta_kcal integer,
  meta_proteinas_g integer,
  meta_carboidratos_g integer,
  meta_gorduras_g integer,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plano_alimentar_refeicoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id uuid NOT NULL REFERENCES public.planos_alimentares(id) ON DELETE CASCADE,
  refeicao text NOT NULL,
  horario text,
  descricao text NOT NULL,
  kcal integer,
  proteina_g numeric,
  ordem integer NOT NULL DEFAULT 0,
  observacoes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plano_treino_conclusoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id uuid NOT NULL REFERENCES public.planos_treino(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  dia_semana integer NOT NULL,
  data date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plano_alimentar_adesao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id uuid NOT NULL REFERENCES public.planos_alimentares(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notificacoes_instrutor (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  aluno_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  plano_id uuid,
  titulo text NOT NULL,
  corpo text,
  data_ref date,
  lida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planos_treino_instrutor_aluno
  ON public.planos_treino (instrutor_id, aluno_id);
CREATE INDEX IF NOT EXISTS idx_planos_alimentares_instrutor_aluno
  ON public.planos_alimentares (instrutor_id, aluno_id);
CREATE INDEX IF NOT EXISTS idx_plano_alimentar_refeicoes_plano
  ON public.plano_alimentar_refeicoes (plano_id, ordem);
CREATE INDEX IF NOT EXISTS idx_conclusoes_aluno_data
  ON public.plano_treino_conclusoes (aluno_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_adesao_aluno_data
  ON public.plano_alimentar_adesao (aluno_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_notificacoes_instrutor
  ON public.notificacoes_instrutor (instrutor_id, lida, created_at DESC);

DROP TRIGGER IF EXISTS planos_treino_updated_at ON public.planos_treino;
CREATE TRIGGER planos_treino_updated_at
BEFORE UPDATE ON public.planos_treino
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS planos_alimentares_updated_at ON public.planos_alimentares;
CREATE TRIGGER planos_alimentares_updated_at
BEFORE UPDATE ON public.planos_alimentares
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.is_admin_or_profissional(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfis
    WHERE id = _user_id
      AND papel IN ('instrutor', 'nutricionista', 'admin')
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_usuario(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfis
    WHERE id = _user_id
      AND papel = 'admin'
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.profissional_gerencia_aluno(_profissional_id uuid, _aluno_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _profissional_id = _aluno_id
    OR EXISTS (
      SELECT 1
      FROM public.perfis
      WHERE id = _profissional_id
        AND papel = 'admin'
    )
    OR EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _profissional_id
        AND role::text = 'admin'
    )
    OR EXISTS (
      SELECT 1
      FROM public.instrutores_alunos ia
      WHERE ia.instrutor_id = _profissional_id
        AND ia.aluno_id = _aluno_id
    )
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instrutores_alunos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planos_treino TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planos_treino_exercicios TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planos_alimentares TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plano_alimentar_refeicoes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plano_treino_conclusoes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plano_alimentar_adesao TO authenticated;
GRANT SELECT, UPDATE ON public.notificacoes_instrutor TO authenticated;
GRANT ALL ON public.perfis TO service_role;
GRANT ALL ON public.instrutores_alunos TO service_role;
GRANT ALL ON public.planos_treino TO service_role;
GRANT ALL ON public.planos_treino_exercicios TO service_role;
GRANT ALL ON public.planos_alimentares TO service_role;
GRANT ALL ON public.plano_alimentar_refeicoes TO service_role;
GRANT ALL ON public.plano_treino_conclusoes TO service_role;
GRANT ALL ON public.plano_alimentar_adesao TO service_role;
GRANT ALL ON public.notificacoes_instrutor TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_profissional(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_usuario(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.profissional_gerencia_aluno(uuid, uuid) TO authenticated;

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instrutores_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_treino_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_alimentares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_alimentar_refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_treino_conclusoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_alimentar_adesao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes_instrutor ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perfis select own managed students" ON public.perfis;
CREATE POLICY "perfis select own managed students"
ON public.perfis FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR public.profissional_gerencia_aluno(auth.uid(), id)
  OR (public.is_admin_or_profissional(auth.uid()) AND papel = 'aluno')
);

DROP POLICY IF EXISTS "perfis update own" ON public.perfis;
CREATE POLICY "perfis update own"
ON public.perfis FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles professional search students" ON public.profiles;
CREATE POLICY "profiles professional search students"
ON public.profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR public.profissional_gerencia_aluno(auth.uid(), id)
  OR (
    public.is_admin_or_profissional(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.perfis pf
      WHERE pf.id = profiles.id AND pf.papel = 'aluno'
    )
  )
);

DROP POLICY IF EXISTS "instrutores select own links" ON public.instrutores_alunos;
CREATE POLICY "instrutores select own links"
ON public.instrutores_alunos FOR SELECT TO authenticated
USING (
  instrutor_id = auth.uid()
  OR aluno_id = auth.uid()
  OR public.is_admin_usuario(auth.uid())
);

DROP POLICY IF EXISTS "instrutores insert own links" ON public.instrutores_alunos;
CREATE POLICY "instrutores insert own links"
ON public.instrutores_alunos FOR INSERT TO authenticated
WITH CHECK (
  instrutor_id = auth.uid()
  AND public.is_admin_or_profissional(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = aluno_id AND p.papel = 'aluno'
  )
);

DROP POLICY IF EXISTS "instrutores delete own links" ON public.instrutores_alunos;
CREATE POLICY "instrutores delete own links"
ON public.instrutores_alunos FOR DELETE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "planos treino select managed" ON public.planos_treino;
CREATE POLICY "planos treino select managed"
ON public.planos_treino FOR SELECT TO authenticated
USING (
  aluno_id = auth.uid()
  OR instrutor_id = auth.uid()
  OR public.profissional_gerencia_aluno(auth.uid(), aluno_id)
);

DROP POLICY IF EXISTS "planos treino insert managed" ON public.planos_treino;
CREATE POLICY "planos treino insert managed"
ON public.planos_treino FOR INSERT TO authenticated
WITH CHECK (
  instrutor_id = auth.uid()
  AND public.profissional_gerencia_aluno(auth.uid(), aluno_id)
);

DROP POLICY IF EXISTS "planos treino update own" ON public.planos_treino;
CREATE POLICY "planos treino update own"
ON public.planos_treino FOR UPDATE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()))
WITH CHECK (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "planos treino delete own" ON public.planos_treino;
CREATE POLICY "planos treino delete own"
ON public.planos_treino FOR DELETE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "planos treino exercicios select managed" ON public.planos_treino_exercicios;
CREATE POLICY "planos treino exercicios select managed"
ON public.planos_treino_exercicios FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planos_treino p
    WHERE p.id = plano_id
      AND (p.aluno_id = auth.uid() OR p.instrutor_id = auth.uid() OR public.profissional_gerencia_aluno(auth.uid(), p.aluno_id))
  )
);

DROP POLICY IF EXISTS "planos treino exercicios insert own" ON public.planos_treino_exercicios;
CREATE POLICY "planos treino exercicios insert own"
ON public.planos_treino_exercicios FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.planos_treino p
    WHERE p.id = plano_id AND p.instrutor_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "planos treino exercicios delete own" ON public.planos_treino_exercicios;
CREATE POLICY "planos treino exercicios delete own"
ON public.planos_treino_exercicios FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planos_treino p
    WHERE p.id = plano_id AND (p.instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()))
  )
);

DROP POLICY IF EXISTS "planos alimentares select managed" ON public.planos_alimentares;
CREATE POLICY "planos alimentares select managed"
ON public.planos_alimentares FOR SELECT TO authenticated
USING (
  aluno_id = auth.uid()
  OR instrutor_id = auth.uid()
  OR public.profissional_gerencia_aluno(auth.uid(), aluno_id)
);

DROP POLICY IF EXISTS "planos alimentares insert managed" ON public.planos_alimentares;
CREATE POLICY "planos alimentares insert managed"
ON public.planos_alimentares FOR INSERT TO authenticated
WITH CHECK (
  instrutor_id = auth.uid()
  AND public.profissional_gerencia_aluno(auth.uid(), aluno_id)
);

DROP POLICY IF EXISTS "planos alimentares update own" ON public.planos_alimentares;
CREATE POLICY "planos alimentares update own"
ON public.planos_alimentares FOR UPDATE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()))
WITH CHECK (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "planos alimentares delete own" ON public.planos_alimentares;
CREATE POLICY "planos alimentares delete own"
ON public.planos_alimentares FOR DELETE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "plano refeicoes select managed" ON public.plano_alimentar_refeicoes;
CREATE POLICY "plano refeicoes select managed"
ON public.plano_alimentar_refeicoes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planos_alimentares p
    WHERE p.id = plano_id
      AND (p.aluno_id = auth.uid() OR p.instrutor_id = auth.uid() OR public.profissional_gerencia_aluno(auth.uid(), p.aluno_id))
  )
);

DROP POLICY IF EXISTS "plano refeicoes insert own" ON public.plano_alimentar_refeicoes;
CREATE POLICY "plano refeicoes insert own"
ON public.plano_alimentar_refeicoes FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.planos_alimentares p
    WHERE p.id = plano_id AND p.instrutor_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "plano refeicoes delete own" ON public.plano_alimentar_refeicoes;
CREATE POLICY "plano refeicoes delete own"
ON public.plano_alimentar_refeicoes FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planos_alimentares p
    WHERE p.id = plano_id AND (p.instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()))
  )
);

DROP POLICY IF EXISTS "conclusoes treino select managed" ON public.plano_treino_conclusoes;
CREATE POLICY "conclusoes treino select managed"
ON public.plano_treino_conclusoes FOR SELECT TO authenticated
USING (
  aluno_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.planos_treino p
    WHERE p.id = plano_id
      AND (p.instrutor_id = auth.uid() OR public.profissional_gerencia_aluno(auth.uid(), p.aluno_id))
  )
);

DROP POLICY IF EXISTS "conclusoes treino insert own" ON public.plano_treino_conclusoes;
CREATE POLICY "conclusoes treino insert own"
ON public.plano_treino_conclusoes FOR INSERT TO authenticated
WITH CHECK (
  aluno_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.planos_treino p
    WHERE p.id = plano_id AND p.aluno_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "conclusoes treino delete own" ON public.plano_treino_conclusoes;
CREATE POLICY "conclusoes treino delete own"
ON public.plano_treino_conclusoes FOR DELETE TO authenticated
USING (aluno_id = auth.uid());

DROP POLICY IF EXISTS "adesao alimentar select managed" ON public.plano_alimentar_adesao;
CREATE POLICY "adesao alimentar select managed"
ON public.plano_alimentar_adesao FOR SELECT TO authenticated
USING (
  aluno_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.planos_alimentares p
    WHERE p.id = plano_id
      AND (p.instrutor_id = auth.uid() OR public.profissional_gerencia_aluno(auth.uid(), p.aluno_id))
  )
);

DROP POLICY IF EXISTS "adesao alimentar insert own" ON public.plano_alimentar_adesao;
CREATE POLICY "adesao alimentar insert own"
ON public.plano_alimentar_adesao FOR INSERT TO authenticated
WITH CHECK (
  aluno_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.planos_alimentares p
    WHERE p.id = plano_id AND p.aluno_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "adesao alimentar delete own" ON public.plano_alimentar_adesao;
CREATE POLICY "adesao alimentar delete own"
ON public.plano_alimentar_adesao FOR DELETE TO authenticated
USING (aluno_id = auth.uid());

DROP POLICY IF EXISTS "notificacoes select own" ON public.notificacoes_instrutor;
CREATE POLICY "notificacoes select own"
ON public.notificacoes_instrutor FOR SELECT TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

DROP POLICY IF EXISTS "notificacoes update own" ON public.notificacoes_instrutor;
CREATE POLICY "notificacoes update own"
ON public.notificacoes_instrutor FOR UPDATE TO authenticated
USING (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()))
WITH CHECK (instrutor_id = auth.uid() OR public.is_admin_usuario(auth.uid()));

CREATE OR REPLACE FUNCTION public.notificar_treino_concluido()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plano record;
  aluno_nome text;
BEGIN
  SELECT id, instrutor_id, nome
  INTO plano
  FROM public.planos_treino
  WHERE id = NEW.plano_id;

  IF plano.instrutor_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(pe.nome, pr.display_name, 'Aluno')
  INTO aluno_nome
  FROM public.perfis pe
  LEFT JOIN public.profiles pr ON pr.id = pe.id
  WHERE pe.id = NEW.aluno_id;

  INSERT INTO public.notificacoes_instrutor (
    instrutor_id, aluno_id, tipo, plano_id, titulo, corpo, data_ref
  )
  VALUES (
    plano.instrutor_id,
    NEW.aluno_id,
    'treino_concluido',
    NEW.plano_id,
    'Treino concluido',
    aluno_nome || ' concluiu um treino do plano ' || plano.nome || '.',
    NEW.data
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notificar_dieta_seguida()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plano record;
  aluno_nome text;
BEGIN
  SELECT id, instrutor_id, nome
  INTO plano
  FROM public.planos_alimentares
  WHERE id = NEW.plano_id;

  IF plano.instrutor_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(pe.nome, pr.display_name, 'Aluno')
  INTO aluno_nome
  FROM public.perfis pe
  LEFT JOIN public.profiles pr ON pr.id = pe.id
  WHERE pe.id = NEW.aluno_id;

  INSERT INTO public.notificacoes_instrutor (
    instrutor_id, aluno_id, tipo, plano_id, titulo, corpo, data_ref
  )
  VALUES (
    plano.instrutor_id,
    NEW.aluno_id,
    'dieta_seguida',
    NEW.plano_id,
    'Dieta seguida',
    aluno_nome || ' marcou a dieta ' || plano.nome || ' como seguida.',
    NEW.data
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notificar_treino_concluido ON public.plano_treino_conclusoes;
CREATE TRIGGER trg_notificar_treino_concluido
AFTER INSERT ON public.plano_treino_conclusoes
FOR EACH ROW EXECUTE FUNCTION public.notificar_treino_concluido();

DROP TRIGGER IF EXISTS trg_notificar_dieta_seguida ON public.plano_alimentar_adesao;
CREATE TRIGGER trg_notificar_dieta_seguida
AFTER INSERT ON public.plano_alimentar_adesao
FOR EACH ROW EXECUTE FUNCTION public.notificar_dieta_seguida();
