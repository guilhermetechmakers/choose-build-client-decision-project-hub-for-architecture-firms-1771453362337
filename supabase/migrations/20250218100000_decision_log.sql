-- Decision Log & Approval Workflow: decision_log table and RLS (Supabase)

CREATE TABLE IF NOT EXISTS decision_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE decision_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_log_read_own" ON decision_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "decision_log_insert_own" ON decision_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "decision_log_update_own" ON decision_log
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "decision_log_delete_own" ON decision_log
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_decision_log_user_id ON decision_log(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_log_status ON decision_log(status);
CREATE INDEX IF NOT EXISTS idx_decision_log_updated_at ON decision_log(updated_at);

COMMENT ON TABLE decision_log IS 'Decision Log & Approval Workflow: user-scoped decision records';
