-- Admin schema additions

-- Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Function to check if current user is admin (SECURITY DEFINER bypasses RLS for the check itself)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- ── Admin RLS policies ─────────────────────────────────────────────────────

-- profiles: admin can read all
DROP POLICY IF EXISTS "admins_read_all_profiles" ON profiles;
CREATE POLICY "admins_read_all_profiles" ON profiles
  FOR SELECT USING (is_admin() OR id = auth.uid());

-- profiles: admin can update any
DROP POLICY IF EXISTS "admins_update_any_profile" ON profiles;
CREATE POLICY "admins_update_any_profile" ON profiles
  FOR UPDATE USING (is_admin() OR id = auth.uid());

-- profiles: admin can delete any
DROP POLICY IF EXISTS "admins_delete_any_profile" ON profiles;
CREATE POLICY "admins_delete_any_profile" ON profiles
  FOR DELETE USING (is_admin());

-- business_cards: admin can read all
DROP POLICY IF EXISTS "admins_read_all_cards" ON business_cards;
CREATE POLICY "admins_read_all_cards" ON business_cards
  FOR SELECT USING (is_admin() OR user_id = auth.uid());

-- business_cards: admin can delete any
DROP POLICY IF EXISTS "admins_delete_any_card" ON business_cards;
CREATE POLICY "admins_delete_any_card" ON business_cards
  FOR DELETE USING (is_admin() OR user_id = auth.uid());

-- contacts: admin can read all
DROP POLICY IF EXISTS "admins_read_all_contacts" ON contacts;
CREATE POLICY "admins_read_all_contacts" ON contacts
  FOR SELECT USING (is_admin() OR user_id = auth.uid());

-- contacts: admin can delete any
DROP POLICY IF EXISTS "admins_delete_any_contact" ON contacts;
CREATE POLICY "admins_delete_any_contact" ON contacts
  FOR DELETE USING (is_admin() OR user_id = auth.uid());

-- interactions: admin can read all
DROP POLICY IF EXISTS "admins_read_all_interactions" ON interactions;
CREATE POLICY "admins_read_all_interactions" ON interactions
  FOR SELECT USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM contacts WHERE contacts.id = interactions.contact_id AND contacts.user_id = auth.uid())
  );

-- Set the admin flag for buddhpriya93@gmail.com
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'buddhpriya93@gmail.com';
