export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: string
  firmId?: string
}

export interface Project {
  id: string
  name: string
  status: 'active' | 'on_hold' | 'completed'
  phase: string
  progress: number
  pendingApprovals: number
  updatedAt: string
}

export interface Decision {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'draft' | 'pending' | 'approved' | 'changes_requested'
  phase?: string
  assignee?: string
  costDelta?: number
  recommendedOptionId?: string
  options: DecisionOption[]
  publishedAt?: string
  approvedAt?: string
  thumbnailUrl?: string
}

export interface DecisionOption {
  id: string
  label: string
  description?: string
  imageUrl?: string
  costDelta?: number
  isRecommended?: boolean
}

export interface AuditEntry {
  id: string
  action: string
  userId: string
  userName: string
  timestamp: string
  metadata?: Record<string, unknown>
}

/** decision_log table (DB); list view and CRUD */
export interface DecisionLogRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Published snapshot; immutable */
export interface DecisionVersion {
  id: string
  decisionId: string
  version: number
  publishedAt: string
  options: DecisionOption[]
  costDeltas: Record<string, number>
  recommendedOptionId?: string
  downloadUrl?: string
}

/** Approval action: Approve | Request Change | Ask Question | E-sign */
export interface ApprovalRecord {
  id: string
  decisionId: string
  versionId: string
  userId: string
  userName: string
  action: 'approved' | 'request_change' | 'ask_question' | 'e_signed'
  comment?: string
  signedAt?: string
  createdAt: string
}

/** Related item link (drawing, task, meeting) */
export interface RelatedItem {
  id: string
  type: 'drawing' | 'task' | 'meeting_note'
  title: string
  href: string
}

// --- Dashboard & Timeline ---

export interface Dashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Standard project phases (kickoff → handover) */
export const PROJECT_PHASE_IDS = [
  'kickoff',
  'concept',
  'schematic',
  'dd',
  'permitting',
  'ca',
  'handover',
] as const

export type ProjectPhaseId = (typeof PROJECT_PHASE_IDS)[number]

export interface ProjectPhase {
  id: string
  projectId: string
  phaseId: ProjectPhaseId
  label: string
  orderIndex: number
  percentComplete: number
  startDate?: string
  endDate?: string
  updatedAt: string
}

export interface ProjectMilestone {
  id: string
  projectId: string
  phaseId: string
  name: string
  dueDate: string
  assigneeId?: string
  assigneeName?: string
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue'
  decisionId?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface DecisionCheckpoint {
  id: string
  projectId: string
  decisionId: string
  decisionTitle: string
  phaseId: string
  status: string
  orderIndex: number
}

export interface ProjectTimeline {
  projectId: string
  projectName: string
  phases: ProjectPhase[]
  milestones: ProjectMilestone[]
  decisionCheckpoints: DecisionCheckpoint[]
}

export type TimelineViewMode = 'list' | 'gantt'

export type TimelineFilter = 'all' | 'actionable' | 'overdue' | 'approvals_needed'
