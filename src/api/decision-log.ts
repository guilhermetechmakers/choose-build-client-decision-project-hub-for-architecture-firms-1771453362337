import { api } from '@/lib/api'
import type {
  Decision,
  DecisionVersion,
  AuditEntry,
  ApprovalRecord,
  RelatedItem,
} from '@/types'

export interface ListDecisionsParams {
  projectId: string
  status?: string
  phase?: string
  assignee?: string
  costImpact?: 'any' | 'none' | 'positive'
  sortBy?: 'date' | 'status' | 'cost' | 'title' | 'phase'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface ListDecisionsResponse {
  items: Decision[]
  total: number
  page: number
  pageSize: number
}

export function listDecisions(
  params: ListDecisionsParams
): Promise<ListDecisionsResponse> {
  const { projectId, ...rest } = params
  const search = new URLSearchParams()
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v))
  })
  const q = search.toString()
  return api.get<ListDecisionsResponse>(
    `/projects/${projectId}/decisions${q ? `?${q}` : ''}`
  )
}

export function getDecision(
  projectId: string,
  decisionId: string
): Promise<Decision> {
  return api.get<Decision>(`/projects/${projectId}/decisions/${decisionId}`)
}

export interface DecisionDetailResponse {
  decision: Decision
  versions: DecisionVersion[]
  auditLog: AuditEntry[]
  relatedItems: RelatedItem[]
}

export function getDecisionDetail(
  projectId: string,
  decisionId: string
): Promise<DecisionDetailResponse> {
  return api.get<DecisionDetailResponse>(
    `/projects/${projectId}/decisions/${decisionId}/detail`
  )
}

export interface SubmitApprovalPayload {
  action: 'approve' | 'request_change' | 'ask_question'
  comment?: string
  versionId: string
}

export function submitApproval(
  projectId: string,
  decisionId: string,
  payload: SubmitApprovalPayload
): Promise<{ success: boolean; approval: ApprovalRecord }> {
  return api.post<{ success: boolean; approval: ApprovalRecord }>(
    `/projects/${projectId}/decisions/${decisionId}/approve`,
    payload
  )
}

export function downloadVersion(
  projectId: string,
  decisionId: string,
  versionId: string
): Promise<{ url: string }> {
  return api.get<{ url: string }>(
    `/projects/${projectId}/decisions/${decisionId}/versions/${versionId}/download`
  )
}
