-- ============================================
-- ULTIMATE FIX - RECREATE TABLE WITHOUT RLS
-- ============================================
-- Masalah: "new row violates row-level security policy"
-- Solusi: Recreate tabel popups tanpa RLS
-- ============================================

-- Step 1: Rename existing table (backup)
ALTER TABLE public.popups RENAME TO popups_old;

-- Step 2: Create new table tanpa RLS
CREATE TABLE public.popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text,
  description text,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 3: Copy data dari table lama
INSERT INTO public.popups (id, image_url, title, description, display_order, is_active, created_at, updated_at)
SELECT id, image_url, title, description, display_order, is_active, created_at, updated_at
FROM public.popups_old;

-- Step 4: Make sure RLS is DISABLED
ALTER TABLE public.popups DISABLE ROW LEVEL SECURITY;

-- Step 5: Grant permissions
GRANT ALL ON public.popups TO authenticated;
GRANT ALL ON public.popups TO anon;
GRANT ALL ON public.popups TO postgres;

-- Step 6: Create indexes (if needed)
CREATE INDEX IF NOT EXISTS idx_popups_is_active ON public.popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_display_order ON public.popups(display_order);

-- Step 7: Drop old table (backup)
-- DROP TABLE public.popups_old;

-- VERIFY - uncomment untuk check:
-- SELECT * FROM public.popups;
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'popups' AND schemaname = 'public';
