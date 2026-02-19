-- Templates Library (CRUD & Versioning): project_templates, template_versions, RLS

CREATE TABLE IF NOT EXISTS project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  type TEXT DEFAULT 'project' CHECK (type IN ('project', 'decision_set')),
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_templates_read_own" ON project_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "project_templates_insert_own" ON project_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_templates_update_own" ON project_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "project_templates_delete_own" ON project_templates
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_project_templates_user_id ON project_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_status ON project_templates(status);
CREATE INDEX IF NOT EXISTS idx_project_templates_updated_at ON project_templates(updated_at);
CREATE INDEX IF NOT EXISTS idx_project_templates_usage_count ON project_templates(usage_count);

-- Immutable template versions (snapshots)
CREATE TABLE IF NOT EXISTS template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  milestones JSONB DEFAULT '[]',
  decision_stubs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (template_id, version)
);

ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "template_versions_read_via_template" ON template_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_templates p
      WHERE p.id = template_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "template_versions_insert_via_template" ON template_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_templates p
      WHERE p.id = template_id AND p.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON template_versions(template_id);

COMMENT ON TABLE project_templates IS 'Templates Library: project and decision set templates with versioning';
COMMENT ON TABLE template_versions IS 'Immutable version snapshots for project_templates';
