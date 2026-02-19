import { useState, useCallback, useEffect } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProjectTemplate, TemplateMilestoneStub, TemplateDecisionStub } from '@/types'
import {
  createEmptyMilestoneStub,
  createEmptyDecisionStub,
} from '@/services/crud-operations-versioningService'

export interface TemplateEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ProjectTemplate | null
  initialMilestones?: TemplateMilestoneStub[]
  initialDecisionStubs?: TemplateDecisionStub[]
  onSave: (payload: {
    title: string
    description?: string
    milestones: TemplateMilestoneStub[]
    decision_stubs: TemplateDecisionStub[]
  }) => Promise<void>
  isLoading?: boolean
}

export function TemplateEditor({
  open,
  onOpenChange,
  template,
  initialMilestones = [],
  initialDecisionStubs = [],
  onSave,
  isLoading,
}: TemplateEditorProps) {
  const [title, setTitle] = useState(template?.title ?? '')
  const [description, setDescription] = useState(template?.description ?? '')
  const [milestones, setMilestones] = useState<TemplateMilestoneStub[]>(() =>
    initialMilestones.length > 0
      ? [...initialMilestones]
      : [createEmptyMilestoneStub(0)]
  )
  const [decisionStubs, setDecisionStubs] = useState<TemplateDecisionStub[]>(() =>
    initialDecisionStubs.length > 0
      ? [...initialDecisionStubs]
      : [createEmptyDecisionStub(0)]
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && initialMilestones.length > 0) setMilestones(initialMilestones.map((m, i) => ({ ...m, order_index: i })))
    if (open && initialDecisionStubs.length > 0) setDecisionStubs(initialDecisionStubs.map((d, i) => ({ ...d, order_index: i })))
  }, [open, initialMilestones, initialDecisionStubs])

  const resetForm = useCallback(() => {
    setTitle(template?.title ?? '')
    setDescription(template?.description ?? '')
    setMilestones(
      initialMilestones.length > 0
        ? [...initialMilestones]
        : [createEmptyMilestoneStub(0)]
    )
    setDecisionStubs(
      initialDecisionStubs.length > 0
        ? [...initialDecisionStubs]
        : [createEmptyDecisionStub(0)]
    )
    setError(null)
  }, [template, initialMilestones, initialDecisionStubs])

  const addMilestone = () => {
    setMilestones((prev) => [...prev, createEmptyMilestoneStub(prev.length)])
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: keyof TemplateMilestoneStub, value: string | number) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  const addDecisionStub = () => {
    setDecisionStubs((prev) => [...prev, createEmptyDecisionStub(prev.length)])
  }

  const removeDecisionStub = (index: number) => {
    setDecisionStubs((prev) => prev.filter((_, i) => i !== index))
  }

  const updateDecisionStub = (index: number, field: keyof TemplateDecisionStub, value: string | number) => {
    setDecisionStubs((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    )
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError(null)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        milestones: milestones.map((m, i) => ({ ...m, order_index: i })),
        decision_stubs: decisionStubs.map((d, i) => ({ ...d, order_index: i })),
      })
      handleOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" showClose={true}>
        <DialogHeader>
          <DialogTitle>{template ? 'Edit template' : 'New template'}</DialogTitle>
          <DialogDescription>
            Compose milestones and decision stubs. These will be cloned when you apply the template to a project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-title">Title</Label>
            <Input
              id="template-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Residential remodel"
              className={error && !title.trim() ? 'border-destructive' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-desc">Description (optional)</Label>
            <Input
              id="template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Milestones</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {milestones.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-md border border-border p-2"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                  <Input
                    value={m.name}
                    onChange={(e) => updateMilestone(i, 'name', e.target.value)}
                    placeholder="Milestone name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeMilestone(i)}
                    aria-label="Remove milestone"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Decision stubs</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addDecisionStub}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {decisionStubs.map((d, i) => (
                <div
                  key={d.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-2"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                    <Input
                      value={d.title}
                      onChange={(e) => updateDecisionStub(i, 'title', e.target.value)}
                      placeholder="Decision title"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeDecisionStub(i)}
                      aria-label="Remove decision stub"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={d.description ?? ''}
                    onChange={(e) => updateDecisionStub(i, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    className="ml-6 text-sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} isLoading={isLoading} disabled={!title.trim()}>
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
