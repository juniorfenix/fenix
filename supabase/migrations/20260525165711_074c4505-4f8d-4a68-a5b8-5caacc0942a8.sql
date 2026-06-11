ALTER TABLE public.dietas
  ADD COLUMN categoria TEXT NOT NULL DEFAULT 'reeducacao';

CREATE INDEX idx_dietas_categoria ON public.dietas(categoria, genero, ordem);