ALTER TABLE doctors ADD COLUMN status VARCHAR(10) DEFAULT 'hadir' CHECK (status IN ('hadir', 'cuti'));
