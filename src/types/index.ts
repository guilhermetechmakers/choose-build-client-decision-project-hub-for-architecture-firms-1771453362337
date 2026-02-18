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
