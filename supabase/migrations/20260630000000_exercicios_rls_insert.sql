-- Allow instructors, nutritionists, and admins to insert new exercises.
-- Existing SELECT and UPDATE policies are untouched.

CREATE POLICY "instrutores podem inserir exercicios"
ON public.exercicios FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfis
    WHERE id = auth.uid()
      AND papel IN ('instrutor', 'nutricionista', 'admin')
  )
);
