/**
 * Templates Library – main feature component.
 * Template list with filters and usage stats, template editor, versioning, Apply Template wizard.
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { TemplateListTable } from '@/components/templates-library/TemplateListTable'
import { TemplateEditor } from '@/components/templates-library/TemplateEditor'
import { ApplyTemplateWizard } from '@/components/templates-library/ApplyTemplateWizard'
import {
  useTemplatesList,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useApplyTemplate,
  useTemplate,
} from '@/hooks/useTemplates'
import type { ProjectTemplate } from '@/types'
import type { TemplateListFilters, TemplateSortField, TemplateSortOrder } from '@/services/crud-operations-versioningService'

const DEFAULT_PAGE_SIZE = 20

export function TemplatesLibrary() {
  const [filters, setFilters] = useState<TemplateListFilters>({})
  const [sortBy, setSortBy] = useState<TemplateSortField>('updated_at')
  const [sortOrder, setSortOrder] = useState<TemplateSortOrder>('desc')
  const [page, setPage] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTemplate, setEditorTemplate] = useState<ProjectTemplate | null>(null)
  const [applyWizardOpen, setApplyWizardOpen] = useState(false)
  const [applyTemplate, setApplyTemplate] = useState<ProjectTemplate | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProjectTemplate | null>(null)

  const listQuery = useTemplatesList(filters, sortBy, sortOrder, page, DEFAULT_PAGE_SIZE)
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate(editorTemplate?.id ?? '')
  const deleteMutation = useDeleteTemplate()
  const applyMutation = useApplyTemplate()
  const detailQuery = useTemplate(editorTemplate?.id ?? undefined)

  const handleCreateNew = () => {
    setEditorTemplate(null)
    setEditorOpen(true)
  }

  const handleEdit = (t: ProjectTemplate) => {
    setEditorTemplate(t)
    setEditorOpen(true)
  }

  const handleEditorSave = async (payload: {
    title: string
    description?: string
    milestones: { id: string; name: string; phase_id?: string; order_index: number }[]
    decision_stubs: { id: string; title: string; description?: string; order_index: number }[]
  }) => {
    if (editorTemplate) {
      await updateMutation.mutateAsync(payload)
      toast.success('Template updated.')
    } else {
      await createMutation.mutateAsync({
        ...payload,
        type: 'project',
      })
      toast.success('Template created.')
    }
  }

  const handleApply = (t: ProjectTemplate) => {
    setApplyTemplate(t)
    setApplyWizardOpen(true)
  }

  const handleApplyConfirm = async (projectName: string) => {
    if (!applyTemplate) throw new Error('No template selected')
    const result = await applyMutation.mutateAsync({
      templateId: applyTemplate.id,
      projectName,
    })
    toast.success('Template applied. Opening project.')
    return result
  }

  const handleDeleteClick = (t: ProjectTemplate) => {
    setDeleteTarget(t)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('Template deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete template.')
    }
  }

  const currentVersion = detailQuery.data?.currentVersion
  const initialMilestones = currentVersion?.milestones ?? []
  const initialDecisionStubs = currentVersion?.decision_stubs ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates Library</h1>
          <p className="text-muted-foreground">
            Create, edit, version and apply project and decision templates. Apply to new projects to speed setup.
          </p>
        </div>
        <Button
          variant="accent"
          className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
          onClick={handleCreateNew}
        >
          <Plus className="h-4 w-4" />
          New template
        </Button>
      </div>

      <TemplateListTable
        items={listQuery.data?.items ?? []}
        total={listQuery.data?.total ?? 0}
        page={listQuery.data?.page ?? 1}
        pageSize={listQuery.data?.pageSize ?? DEFAULT_PAGE_SIZE}
        isLoading={listQuery.isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(field, order) => {
          setSortBy(field)
          setSortOrder(order)
          setPage(1)
        }}
        onPageChange={setPage}
        onEdit={handleEdit}
        onApply={handleApply}
        onDelete={handleDeleteClick}
      />

      <TemplateEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={editorTemplate}
        initialMilestones={initialMilestones}
        initialDecisionStubs={initialDecisionStubs}
        onSave={handleEditorSave}
        isLoading={editorTemplate ? updateMutation.isPending : createMutation.isPending}
      />

      <ApplyTemplateWizard
        open={applyWizardOpen}
        onOpenChange={setApplyWizardOpen}
        template={applyTemplate}
        onConfirm={handleApplyConfirm}
        isLoading={applyMutation.isPending}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{deleteTarget?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
