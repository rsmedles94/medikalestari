CREATE POLICY "allow_anon_upload_content" ON storage.objects
FOR INSERT TO authenticated, anon WITH CHECK (bucket_id = 'content');

CREATE POLICY "allow_anon_upload_doctors" ON storage.objects
FOR INSERT TO authenticated, anon WITH CHECK (bucket_id = 'doctors');

CREATE POLICY "allow_anon_read_content" ON storage.objects
FOR SELECT TO authenticated, anon USING (bucket_id = 'content');

CREATE POLICY "allow_anon_read_doctors" ON storage.objects
FOR SELECT TO authenticated, anon USING (bucket_id = 'doctors');

CREATE POLICY "allow_anon_delete_content" ON storage.objects
FOR DELETE TO authenticated, anon USING (bucket_id = 'content');

CREATE POLICY "allow_anon_delete_doctors" ON storage.objects
FOR DELETE TO authenticated, anon USING (bucket_id = 'doctors');

SELECT 'Storage policies created for anonymous access!' as status;
