-- 1) Role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2) user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 3) has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- 4) Admin read policies (additive — existing own-data policies remain)
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
CREATE POLICY "admin read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all weight_logs" ON public.weight_logs;
CREATE POLICY "admin read all weight_logs" ON public.weight_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all diario_registro" ON public.diario_registro;
CREATE POLICY "admin read all diario_registro" ON public.diario_registro
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all diario_alimentar" ON public.diario_alimentar;
CREATE POLICY "admin read all diario_alimentar" ON public.diario_alimentar
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all metas_usuario" ON public.metas_usuario;
CREATE POLICY "admin read all metas_usuario" ON public.metas_usuario
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all hidratacao" ON public.hidratacao_diaria;
CREATE POLICY "admin read all hidratacao" ON public.hidratacao_diaria
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin read all badges" ON public.badges;
CREATE POLICY "admin read all badges" ON public.badges
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5) Seed admin role for the given email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email = 'junior1213141516@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;