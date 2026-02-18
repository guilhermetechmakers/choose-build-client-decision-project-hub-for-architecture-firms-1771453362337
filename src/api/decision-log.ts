import { api } from '@/lib/api'
import { getSupabase } from '@/lib/supabase'
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

async function listDecisionsViaEdge(params: ListDecisionsParams): Promise<ListDecisionsResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ListDecisionsResponse>('decision-log', {
    body: {
      action: 'list',
      projectId: params.projectId,
      status: params.status,
      phase: params.phase,
      assignee: params.assignee,
      costImpact: params.costImpact,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      page: params.page,
      pageSize: params.pageSize,
    },
  })
  if (error) throw error
  if (!data) return { items: [], total: 0, page: params.page ?? 1, pageSize: params.pageSize ?? 50 }
  return data
}

export function listDecisions(
  params: ListDecisionsParams
): Promise<ListDecisionsResponse> {
  const supabase = getSupabase()
  if (supabase) return listDecisionsViaEdge(params)
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

async function getDecisionDetailViaEdge(
  projectId: string,
  decisionId: string
): Promise<DecisionDetailResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<DecisionDetailResponse>('decision-log', {
    body: { action: 'detail', projectId, decisionId },
  })
  if (error) throw error
  if (!data) throw new Error('No detail returned')
  return data
}

export function getDecisionDetail(
  projectId: string,
  decisionId: string
): Promise<DecisionDetailResponse> {
  if (getSupabase()) return getDecisionDetailViaEdge(projectId, decisionId)
  return api.get<DecisionDetailResponse>(
    `/projects/${projectId}/decisions/${decisionId}/detail`
  )
}

export interface SubmitApprovalPayload {
  action: 'approve' | 'request_change' | 'ask_question'
  comment?: string
  versionId: string
}

async function submitApprovalViaEdge(
  projectId: string,
  decisionId: string,
  payload: SubmitApprovalPayload
): Promise<{ success: boolean; approval: ApprovalRecord }> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<{ success: boolean; approval: ApprovalRecord }>('decision-log', {
    body: {
      action: 'approve',
      projectId,
      decisionId,
      versionId: payload.versionId,
      approvalAction: payload.action,
      comment: payload.comment,
    },
  })
  if (error) throw error
  if (!data) throw new Error('No approval response')
  return data
}

export function submitApproval(
  projectId: string,
  decisionId: string,
  payload: SubmitApprovalPayload
): Promise<{ success: boolean; approval: ApprovalRecord }> {
  if (getSupabase()) return submitApprovalViaEdge(projectId, decisionId, payload)
  return api.post<{ success: boolean; approval: ApprovalRecord }>(
    `/projects/${projectId}/decisions/${decisionId}/approve`,
    payload
  )
}

async function downloadVersionViaEdge(
  projectId: string,
  decisionId: string,
  versionId: string
): Promise<{ url: string }> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<{ url: string }>('decision-log', {
    body: { action: 'download', projectId, decisionId, versionId },
  })
  if (error) throw error
  if (!data) return { url: '' }
  return data
}

export function downloadVersion(
  projectId: string,
  decisionId: string,
  versionId: string
): Promise<{ url: string }> {
  if (getSupabase()) return downloadVersionViaEdge(projectId, decisionId, versionId)
  return api.get<{ url: string }>(
    `/projects/${projectId}/decisions/${decisionId}/versions/${versionId}/download`
  )
}
