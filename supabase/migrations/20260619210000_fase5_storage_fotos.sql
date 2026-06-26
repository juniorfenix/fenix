-- Fase 5: Storage privado para fotos de refeições
-- Bucket: fotos_refeicoes (privado)
-- Path:   {user_id}/{yyyy-mm-dd}/{uuid}.jpg

-- ─── Bucket ──────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fotos_refeicoes',
  'fotos_refeicoes',
  false,
  10485760,  -- 10 MB: suficiente para fotos mobile em alta qualidade
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ─── Policies em storage.objects ─────────────────────────────────────────────
-- O primeiro segmento do path (storage.foldername(name))[1] é o user_id.
-- Isso garante que cada usuário só acessa a própria pasta.
--
-- Nota: Edge Functions que rodam com a service_role key bypassam RLS
-- automaticamente — não precisam de policy separada para leitura.

-- SELECT
create policy "fotos_refeicoes: select proprio"
  on storage.objects for select
  using (
    bucket_id = 'fotos_refeicoes'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT
create policy "fotos_refeicoes: insert proprio"
  on storage.objects for insert
  with check (
    bucket_id = 'fotos_refeicoes'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE (necessário para substituir foto)
create policy "fotos_refeicoes: update proprio"
  on storage.objects for update
  using (
    bucket_id = 'fotos_refeicoes'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE
create policy "fotos_refeicoes: delete proprio"
  on storage.objects for delete
  using (
    bucket_id = 'fotos_refeicoes'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
