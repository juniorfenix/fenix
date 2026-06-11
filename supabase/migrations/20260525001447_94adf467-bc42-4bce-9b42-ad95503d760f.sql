
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  current_weight NUMERIC,
  goal_weight NUMERIC,
  height NUMERIC,
  age INTEGER,
  gender TEXT,
  activity_level TEXT,
  daily_calorie_goal INTEGER,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- weight logs
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, logged_date)
);
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own weight select" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own weight insert" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own weight update" ON public.weight_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own weight delete" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- meal logs
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own meal select" ON public.meal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own meal insert" ON public.meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own meal update" ON public.meal_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own meal delete" ON public.meal_logs FOR DELETE USING (auth.uid() = user_id);

-- badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own badge select" ON public.badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own badge insert" ON public.badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own badge delete" ON public.badges FOR DELETE USING (auth.uid() = user_id);

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
