DROP POLICY IF EXISTS "Public read doctors storage" ON storage.objects;
DROP POLICY IF EXISTS "Public read content storage" ON storage.objects;
DROP POLICY IF EXISTS "Public read doctors" ON storage.objects;
DROP POLICY IF EXISTS "Public read content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload doctors" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete doctors" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete content" ON storage.objects;

SELECT 'Storage RLS policies dropped!' as status;
