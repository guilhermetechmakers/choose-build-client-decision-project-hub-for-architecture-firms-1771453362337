import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TemplateEditor } from '@/components/templates-library/TemplateEditor'
import { useTemplate, useUpdateTemplate } from '@/hooks/useTemplates'

export function TemplateEdit() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const [editorOpen, setEditorOpen] = useState(true)

  const { data, isLoading, error } = useTemplate(templateId)
  const updateMutation = useUpdateTemplate(templateId ?? '')

  const template = data?.template
  const currentVersion = data?.currentVersion
  const initialMilestones = currentVersion?.milestones ?? []
  const initialDecisionStubs = currentVersion?.decision_stubs ?? []

  useEffect(() => {
    if (!editorOpen) {
      navigate(`/dashboard/templates/${templateId}`)
    }
  }, [editorOpen, navigate, templateId])

  const handleSave = async (payload: {
    title: string
    description?: string
    milestones: { id: string; name: string; phase_id?: string; order_index: number }[]
    decision_stubs: { id: string; title: string; description?: string; order_index: number }[]
  }) => {
    await updateMutation.mutateAsync(payload)
    setEditorOpen(false)
  }

  if (error || (!isLoading && !template)) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/templates">Back to templates</Link>
        </Button>
        <p className="text-muted-foreground">Template not found.</p>
      </div>
    )
  }

  if (isLoading || !template) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/dashboard/templates/${templateId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to template
        </Link>
      </Button>
      <TemplateEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={template}
        initialMilestones={initialMilestones}
        initialDecisionStubs={initialDecisionStubs}
        onSave={handleSave}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}
