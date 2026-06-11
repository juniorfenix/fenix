ALTER TABLE public.alimentos_padrao
  ALTER COLUMN calorias TYPE numeric(8,2) USING calorias::numeric,
  ALTER COLUMN proteinas TYPE numeric(6,2) USING proteinas::numeric,
  ALTER COLUMN carboidratos TYPE numeric(6,2) USING carboidratos::numeric,
  ALTER COLUMN gorduras TYPE numeric(6,2) USING gorduras::numeric;

CREATE INDEX IF NOT EXISTS idx_alimentos_padrao_nome ON public.alimentos_padrao (lower(nome));