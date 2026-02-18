-- Dashboard (user-scoped) and Project Board Timeline: phases, milestones, decision checkpoints.
-- Projects table for timeline ownership; RLS by created_by.

CREATE TABLE IF NOT EXISTS dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dashboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dashboard_read_own" ON dashboard
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "dashboard_insert_own" ON dashboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dashboard_update_own" ON dashboard
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dashboard_delete_own" ON dashboard
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_dashboard_user_id ON dashboard(user_id);

-- Projects (for timeline); optional - app may use existing project source.
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_own" ON projects
  FOR SELECT USING (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "projects_insert_auth" ON projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Project phases: one row per phase per project (kickoff, concept, schematic, dd, permitting, ca, handover).
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  percent_complete INT NOT NULL DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, phase_id)
);

ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_phases_select_project" ON project_phases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_phases.project_id AND (p.created_by = auth.uid() OR p.created_by IS NULL))
  );

CREATE POLICY "project_phases_insert_project" ON project_phases
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_phases.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "project_phases_update_project" ON project_phases
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_phases.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "project_phases_delete_project" ON project_phases
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_phases.project_id AND p.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON project_phases(project_id);

-- Project milestones: name, due date, assignee, status, optional decision link.
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id TEXT NOT NULL,
  name TEXT NOT NULL,
  due_date DATE NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'overdue')),
  decision_id UUID,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_milestones_select_project" ON project_milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_milestones.project_id AND (p.created_by = auth.uid() OR p.created_by IS NULL))
  );

CREATE POLICY "project_milestones_insert_project" ON project_milestones
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_milestones.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "project_milestones_update_project" ON project_milestones
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_milestones.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "project_milestones_delete_project" ON project_milestones
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_milestones.project_id AND p.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_due_date ON project_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);

-- Decision checkpoints: link decisions to a phase on the timeline.
CREATE TABLE IF NOT EXISTS decision_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  decision_id UUID NOT NULL,
  phase_id TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, decision_id)
);

ALTER TABLE decision_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_checkpoints_select_project" ON decision_checkpoints
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = decision_checkpoints.project_id AND (p.created_by = auth.uid() OR p.created_by IS NULL))
  );

CREATE POLICY "decision_checkpoints_insert_project" ON decision_checkpoints
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = decision_checkpoints.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "decision_checkpoints_update_project" ON decision_checkpoints
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = decision_checkpoints.project_id AND p.created_by = auth.uid())
  );

CREATE POLICY "decision_checkpoints_delete_project" ON decision_checkpoints
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = decision_checkpoints.project_id AND p.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_decision_checkpoints_project_id ON decision_checkpoints(project_id);

COMMENT ON TABLE dashboard IS 'User-scoped dashboard data (Project Board overview)';
COMMENT ON TABLE project_phases IS 'Per-project phase progress (timeline bars)';
COMMENT ON TABLE project_milestones IS 'Milestones with optional decision link';
COMMENT ON TABLE decision_checkpoints IS 'Decision links embedded in project phases';
