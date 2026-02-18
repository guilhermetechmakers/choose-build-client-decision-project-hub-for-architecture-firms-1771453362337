-- Login/Signup feature: table for user-scoped records (Supabase)
-- Table name uses quoted identifier to allow slash in name per spec; alternatively use login_signup.

CREATE TABLE IF NOT EXISTS login_signup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE login_signup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "login_signup_read_own" ON login_signup
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "login_signup_insert_own" ON login_signup
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "login_signup_update_own" ON login_signup
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "login_signup_delete_own" ON login_signup
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_login_signup_user_id ON login_signup(user_id);

COMMENT ON TABLE login_signup IS 'User-scoped login/signup feature data (spec: login_/_signup)';
