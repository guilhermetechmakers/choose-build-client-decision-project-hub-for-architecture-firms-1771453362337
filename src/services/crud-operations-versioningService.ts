/**
 * Templates Library / CRUD Operations & Versioning – business logic.
 * Pagination, sorting, validation, and conflict resolution helpers.
 */

import type {
  ProjectTemplate,
  TemplateVersion,
  TemplateMilestoneStub,
  TemplateDecisionStub,
} from '@/types'
import * as templatesApi from '@/api/templates'
import type {
  ListTemplatesParams,
  ListTemplatesResponse,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  ApplyTemplatePayload,
} from '@/api/templates'

const DEFAULT_PAGE_SIZE = 20

export interface TemplateListFilters {
  search?: string
  type?: 'project' | 'decision_set'
  status?: 'draft' | 'active' | 'archived'
}

export type TemplateSortField = 'title' | 'updated_at' | 'usage_count'
export type TemplateSortOrder = 'asc' | 'desc'

/** Fetch paginated template list with filters and usage stats (included in items). */
export async function fetchTemplateList(
  filters: TemplateListFilters = {},
  sortBy: TemplateSortField = 'updated_at',
  sortOrder: TemplateSortOrder = 'desc',
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<ListTemplatesResponse> {
  const params: ListTemplatesParams = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }
  return templatesApi.listTemplates(params)
}

/** Fetch single template with current version. */
export async function fetchTemplate(templateId: string): Promise<{
  template: ProjectTemplate
  currentVersion?: TemplateVersion
}> {
  return templatesApi.getTemplate(templateId)
}

/** Create a new template (milestones and decision stubs optional). */
export async function createTemplate(
  payload: CreateTemplatePayload
): Promise<ProjectTemplate> {
  if (!payload.title?.trim()) {
    throw new Error('Title is required')
  }
  return templatesApi.createTemplate({
    ...payload,
    title: payload.title.trim(),
    type: payload.type ?? 'project',
    milestones: payload.milestones ?? [],
    decision_stubs: payload.decision_stubs ?? [],
  })
}

/** Update template with optional version snapshot (optimistic locking via version number in production). */
export async function updateTemplate(
  templateId: string,
  payload: UpdateTemplatePayload
): Promise<ProjectTemplate> {
  if (!templateId) throw new Error('templateId is required')
  return templatesApi.updateTemplate(templateId, payload)
}

/** Soft-delete or hard-delete template (Edge Function handles retention). */
export async function removeTemplate(templateId: string): Promise<void> {
  if (!templateId) throw new Error('templateId is required')
  return templatesApi.deleteTemplate(templateId)
}

/** List versions for versioning UI. */
export async function fetchTemplateVersions(
  templateId: string
): Promise<TemplateVersion[]> {
  const { versions } = await templatesApi.listTemplateVersions(templateId)
  return versions ?? []
}

/** Apply template to a new or existing project (clones milestones and decision stubs). */
export async function applyTemplateToProject(
  payload: ApplyTemplatePayload
): Promise<{ projectId: string; applied: boolean }> {
  if (!payload.templateId || !payload.projectName?.trim()) {
    throw new Error('Template and project name are required')
  }
  return templatesApi.applyTemplate(payload)
}

/** Build empty milestone stub for editor. */
export function createEmptyMilestoneStub(orderIndex: number): TemplateMilestoneStub {
  return {
    id: crypto.randomUUID(),
    name: '',
    order_index: orderIndex,
  }
}

/** Build empty decision stub for editor. */
export function createEmptyDecisionStub(orderIndex: number): TemplateDecisionStub {
  return {
    id: crypto.randomUUID(),
    title: '',
    order_index: orderIndex,
  }
}

/** Validate milestone stub (name required). */
export function validateMilestoneStub(m: TemplateMilestoneStub): boolean {
  return Boolean(m.name?.trim())
}

/** Validate decision stub (title required). */
export function validateDecisionStub(d: TemplateDecisionStub): boolean {
  return Boolean(d.title?.trim())
}
