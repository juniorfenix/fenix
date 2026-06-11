ALTER TABLE public.cardapios DROP CONSTRAINT cardapios_objetivo_check;
ALTER TABLE public.cardapios ADD CONSTRAINT cardapios_objetivo_check
  CHECK (objetivo IN ('perda','ganho','reeducacao'));