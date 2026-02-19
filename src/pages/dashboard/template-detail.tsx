import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
import { TemplateVersioning } from '@/components/templates-library/TemplateVersioning'
import { ApplyTemplateWizard } from '@/components/templates-library/ApplyTemplateWizard'
import { useTemplate, useTemplateVersions, useDeleteTemplate, useApplyTemplate } from '@/hooks/useTemplates'

export function TemplateDetail() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const [applyWizardOpen, setApplyWizardOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data, isLoading, error } = useTemplate(templateId)
  const { data: versionsData } = useTemplateVersions(templateId)
  const deleteMutation = useDeleteTemplate()
  const applyMutation = useApplyTemplate()

  const template = data?.template
  const currentVersion = data?.currentVersion
  const versions = versionsData ?? []

  const handleApplyConfirm = async (projectName: string) => {
    if (!templateId) throw new Error('No template')
    const result = await applyMutation.mutateAsync({ templateId, projectName })
    toast.success('Template applied. Opening project.')
    return result
  }

  const handleDeleteConfirm = async () => {
    if (!templateId) return
    await deleteMutation.mutateAsync(templateId)
    toast.success('Template deleted.')
    setDeleteOpen(false)
    navigate('/dashboard/templates')
  }

  if (error || (!isLoading && !template)) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to templates
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Template not found or you don’t have access.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/dashboard/templates">Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading || !template) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48 md:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Back to templates">
            <Link to="/dashboard/templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{template.title}</h1>
            {template.description && (
              <p className="text-muted-foreground">{template.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setApplyWizardOpen(true)}>
            <Copy className="h-4 w-4 mr-2" />
            Apply to project
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/templates/${templateId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              {currentVersion?.milestones?.length ? (
                <ul className="space-y-2" role="list">
                  {currentVersion.milestones.map((m, i) => (
                    <li key={m.id} className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                      <span className="text-muted-foreground text-sm w-6">{i + 1}.</span>
                      <span>{m.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No milestones in this version.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision stubs</CardTitle>
            </CardHeader>
            <CardContent>
              {currentVersion?.decision_stubs?.length ? (
                <ul className="space-y-2" role="list">
                  {currentVersion.decision_stubs.map((d, i) => (
                    <li key={d.id} className="rounded-md border border-border px-3 py-2">
                      <span className="text-muted-foreground text-sm mr-2">{i + 1}.</span>
                      <span className="font-medium">{d.title}</span>
                      {d.description && (
                        <p className="text-sm text-muted-foreground mt-1 ml-6">{d.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No decision stubs in this version.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <TemplateVersioning
            versions={versions}
            isLoading={false}
            currentVersionId={currentVersion?.id}
          />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{template.usage_count ?? 0}</p>
              <p className="text-sm text-muted-foreground">projects created from this template</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ApplyTemplateWizard
        open={applyWizardOpen}
        onOpenChange={setApplyWizardOpen}
        template={template}
        onConfirm={handleApplyConfirm}
        isLoading={applyMutation.isPending}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{template.title}&quot;. This action cannot be undone.
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
