DROP POLICY IF EXISTS "Admin insert hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Admin insert all hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Public read hero_banners" ON hero_banners;
CREATE POLICY "Public read hero_banners" ON hero_banners FOR SELECT USING (true);
CREATE POLICY "Allow all insert hero_banners" ON hero_banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update hero_banners" ON hero_banners FOR UPDATE USING (true);
CREATE POLICY "Allow all delete hero_banners" ON hero_banners FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert doctors" ON doctors;
DROP POLICY IF EXISTS "Admin insert all doctors" ON doctors;
CREATE POLICY "Allow all insert doctors" ON doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update doctors" ON doctors FOR UPDATE USING (true);
CREATE POLICY "Allow all delete doctors" ON doctors FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert schedules" ON schedules;
DROP POLICY IF EXISTS "Admin insert all schedules" ON schedules;
CREATE POLICY "Allow all insert schedules" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update schedules" ON schedules FOR UPDATE USING (true);
CREATE POLICY "Allow all delete schedules" ON schedules FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert mading_content" ON mading_content;
DROP POLICY IF EXISTS "Admin insert all mading_content" ON mading_content;
CREATE POLICY "Allow all insert mading_content" ON mading_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update mading_content" ON mading_content FOR UPDATE USING (true);
CREATE POLICY "Allow all delete mading_content" ON mading_content FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert popups" ON popups;
DROP POLICY IF EXISTS "Admin insert all popups" ON popups;
CREATE POLICY "Allow all insert popups" ON popups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update popups" ON popups FOR UPDATE USING (true);
CREATE POLICY "Allow all delete popups" ON popups FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert room_types" ON room_types;
DROP POLICY IF EXISTS "Admin insert all room_types" ON room_types;
CREATE POLICY "Allow all insert room_types" ON room_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update room_types" ON room_types FOR UPDATE USING (true);
CREATE POLICY "Allow all delete room_types" ON room_types FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert room_facilities" ON room_facilities;
DROP POLICY IF EXISTS "Admin insert all room_facilities" ON room_facilities;
CREATE POLICY "Allow all insert room_facilities" ON room_facilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update room_facilities" ON room_facilities FOR UPDATE USING (true);
CREATE POLICY "Allow all delete room_facilities" ON room_facilities FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert room_images" ON room_images;
DROP POLICY IF EXISTS "Admin insert all room_images" ON room_images;
CREATE POLICY "Allow all insert room_images" ON room_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update room_images" ON room_images FOR UPDATE USING (true);
CREATE POLICY "Allow all delete room_images" ON room_images FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert mcu_packages" ON mcu_packages;
DROP POLICY IF EXISTS "Admin insert all mcu_packages" ON mcu_packages;
CREATE POLICY "Allow all insert mcu_packages" ON mcu_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update mcu_packages" ON mcu_packages FOR UPDATE USING (true);
CREATE POLICY "Allow all delete mcu_packages" ON mcu_packages FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admin insert careers_config" ON careers_config;
DROP POLICY IF EXISTS "Admin insert all careers_config" ON careers_config;
CREATE POLICY "Allow all insert careers_config" ON careers_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update careers_config" ON careers_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin update careers_registrations" ON careers_registrations;
DROP POLICY IF EXISTS "Admin update all careers_registrations" ON careers_registrations;
CREATE POLICY "Allow all update careers_registrations" ON careers_registrations FOR UPDATE USING (true);
CREATE POLICY "Allow all delete careers_registrations" ON careers_registrations FOR DELETE USING (true);

SELECT 'RLS Policies updated successfully!' as status;
