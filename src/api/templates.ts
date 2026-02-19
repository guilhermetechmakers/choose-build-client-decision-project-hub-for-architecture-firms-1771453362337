import { getSupabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type {
  ProjectTemplate,
  TemplateVersion,
  TemplateMilestoneStub,
  TemplateDecisionStub,
} from '@/types'

export interface ListTemplatesParams {
  search?: string
  type?: 'project' | 'decision_set'
  status?: 'draft' | 'active' | 'archived'
  sortBy?: 'title' | 'updated_at' | 'usage_count'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface ListTemplatesResponse {
  items: ProjectTemplate[]
  total: number
  page: number
  pageSize: number
}

async function listTemplatesViaEdge(params: ListTemplatesParams): Promise<ListTemplatesResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ListTemplatesResponse>(
    'templates-library',
    {
      body: {
        action: 'list',
        ...params,
      },
    }
  )
  if (error) throw error
  if (!data) return { items: [], total: 0, page: params.page ?? 1, pageSize: params.pageSize ?? 20 }
  return data
}

export function listTemplates(params: ListTemplatesParams): Promise<ListTemplatesResponse> {
  const supabase = getSupabase()
  if (supabase) return listTemplatesViaEdge(params)
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v))
  })
  const q = search.toString()
  return api.get<ListTemplatesResponse>(`/templates${q ? `?${q}` : ''}`)
}

export interface GetTemplateResponse {
  template: ProjectTemplate
  currentVersion?: TemplateVersion
}

async function getTemplateViaEdge(templateId: string): Promise<GetTemplateResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<GetTemplateResponse>(
    'templates-library',
    { body: { action: 'get', templateId } }
  )
  if (error) throw error
  if (!data) throw new Error('Template not found')
  return data
}

export function getTemplate(templateId: string): Promise<GetTemplateResponse> {
  if (getSupabase()) return getTemplateViaEdge(templateId)
  return api.get<GetTemplateResponse>(`/templates/${templateId}`)
}

export interface CreateTemplatePayload {
  title: string
  description?: string
  type: 'project' | 'decision_set'
  milestones?: TemplateMilestoneStub[]
  decision_stubs?: TemplateDecisionStub[]
}

async function createTemplateViaEdge(payload: CreateTemplatePayload): Promise<ProjectTemplate> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ProjectTemplate>(
    'templates-library',
    { body: { action: 'create', ...payload } }
  )
  if (error) throw error
  if (!data) throw new Error('Create failed')
  return data
}

export function createTemplate(payload: CreateTemplatePayload): Promise<ProjectTemplate> {
  if (getSupabase()) return createTemplateViaEdge(payload)
  return api.post<ProjectTemplate>('/templates', payload)
}

export interface UpdateTemplatePayload {
  title?: string
  description?: string
  status?: 'draft' | 'active' | 'archived'
  milestones?: TemplateMilestoneStub[]
  decision_stubs?: TemplateDecisionStub[]
}

async function updateTemplateViaEdge(
  templateId: string,
  payload: UpdateTemplatePayload
): Promise<ProjectTemplate> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ProjectTemplate>(
    'templates-library',
    { body: { action: 'update', templateId, ...payload } }
  )
  if (error) throw error
  if (!data) throw new Error('Update failed')
  return data
}

export function updateTemplate(
  templateId: string,
  payload: UpdateTemplatePayload
): Promise<ProjectTemplate> {
  if (getSupabase()) return updateTemplateViaEdge(templateId, payload)
  return api.patch<ProjectTemplate>(`/templates/${templateId}`, payload)
}

async function deleteTemplateViaEdge(templateId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.functions.invoke('templates-library', {
    body: { action: 'delete', templateId },
  })
  if (error) throw error
}

export function deleteTemplate(templateId: string): Promise<void> {
  if (getSupabase()) return deleteTemplateViaEdge(templateId)
  return api.delete(`/templates/${templateId}`)
}

export interface ListTemplateVersionsResponse {
  versions: TemplateVersion[]
}

async function listTemplateVersionsViaEdge(
  templateId: string
): Promise<ListTemplateVersionsResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ListTemplateVersionsResponse>(
    'templates-library',
    { body: { action: 'listVersions', templateId } }
  )
  if (error) throw error
  if (!data) return { versions: [] }
  return data
}

export function listTemplateVersions(
  templateId: string
): Promise<ListTemplateVersionsResponse> {
  if (getSupabase()) return listTemplateVersionsViaEdge(templateId)
  return api.get<ListTemplateVersionsResponse>(`/templates/${templateId}/versions`)
}

export interface ApplyTemplatePayload {
  templateId: string
  projectName: string
  projectId?: string
}

export interface ApplyTemplateResponse {
  projectId: string
  applied: boolean
}

async function applyTemplateViaEdge(
  payload: ApplyTemplatePayload
): Promise<ApplyTemplateResponse> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.functions.invoke<ApplyTemplateResponse>(
    'templates-library',
    { body: { action: 'apply', ...payload } }
  )
  if (error) throw error
  if (!data) throw new Error('Apply template failed')
  return data
}

export function applyTemplate(payload: ApplyTemplatePayload): Promise<ApplyTemplateResponse> {
  if (getSupabase()) return applyTemplateViaEdge(payload)
  return api.post<ApplyTemplateResponse>('/templates/apply', payload)
}
