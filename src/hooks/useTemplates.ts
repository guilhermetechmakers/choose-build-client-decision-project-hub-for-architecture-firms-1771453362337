import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTemplateList,
  fetchTemplate,
  createTemplate,
  updateTemplate,
  removeTemplate,
  fetchTemplateVersions,
  applyTemplateToProject,
  type TemplateListFilters,
  type TemplateSortField,
  type TemplateSortOrder,
} from '@/services/crud-operations-versioningService'
import type { CreateTemplatePayload, UpdateTemplatePayload } from '@/api/templates'
import type { ApplyTemplatePayload } from '@/api/templates'

export const templatesListKey = (
  filters: TemplateListFilters,
  sortBy: TemplateSortField,
  sortOrder: TemplateSortOrder,
  page: number,
  pageSize: number
) => ['templates', 'list', filters, sortBy, sortOrder, page, pageSize] as const

export const templateDetailKey = (id: string | undefined) => ['templates', 'detail', id] as const
export const templateVersionsKey = (id: string | undefined) => ['templates', 'versions', id] as const

export function useTemplatesList(
  filters: TemplateListFilters = {},
  sortBy: TemplateSortField = 'updated_at',
  sortOrder: TemplateSortOrder = 'desc',
  page = 1,
  pageSize = 20
) {
  return useQuery({
    queryKey: templatesListKey(filters, sortBy, sortOrder, page, pageSize),
    queryFn: () => fetchTemplateList(filters, sortBy, sortOrder, page, pageSize),
  })
}

export function useTemplate(templateId: string | undefined) {
  return useQuery({
    queryKey: templateDetailKey(templateId),
    queryFn: () => fetchTemplate(templateId!),
    enabled: Boolean(templateId),
  })
}

export function useTemplateVersions(templateId: string | undefined) {
  return useQuery({
    queryKey: templateVersionsKey(templateId),
    queryFn: () => fetchTemplateVersions(templateId!),
    enabled: Boolean(templateId),
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => createTemplate(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export function useUpdateTemplate(templateId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateTemplatePayload) => updateTemplate(templateId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
      qc.invalidateQueries({ queryKey: templateDetailKey(templateId) })
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (templateId: string) => removeTemplate(templateId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export function useApplyTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ApplyTemplatePayload) => applyTemplateToProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}
