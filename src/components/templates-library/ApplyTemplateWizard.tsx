import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { ProjectTemplate } from '@/types'

export interface ApplyTemplateWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ProjectTemplate | null
  onConfirm: (projectName: string) => Promise<{ projectId: string }>
  isLoading?: boolean
}

const steps = ['Choose template', 'Name project', 'Apply'] as const

export function ApplyTemplateWizard({
  open,
  onOpenChange,
  template,
  onConfirm,
  isLoading,
}: ApplyTemplateWizardProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setStep(0)
    setProjectName('')
    setError(null)
    onOpenChange(false)
  }

  const handleNext = () => {
    if (step === 0 && template) setStep(1)
    else if (step === 1) setStep(2)
  }

  const handleBack = () => {
    if (step === 1) setStep(0)
    else if (step === 2) setStep(1)
  }

  const handleApply = async () => {
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }
    setError(null)
    try {
      const { projectId } = await onConfirm(projectName.trim())
      handleClose()
      navigate(`/dashboard/projects/${projectId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to apply template')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showClose={true}>
        <DialogHeader>
          <DialogTitle>Apply template to project</DialogTitle>
          <DialogDescription>
            Clone this template into a new project. You can adjust phases and decisions after.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm">
            {steps.map((label, i) => (
              <span key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium',
                    i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn(i <= step ? 'text-foreground' : 'text-muted-foreground')}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>

          {step === 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              {template ? (
                <p className="font-medium">{template.title}</p>
              ) : (
                <p className="text-muted-foreground">Select a template first.</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value)
                  setError(null)
                }}
                placeholder="e.g. Kitchen Remodel - Smith"
                className={error ? 'border-destructive' : ''}
                aria-invalid={!!error}
                aria-describedby={error ? 'project-name-error' : undefined}
              />
              {error && (
                <p id="project-name-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <p className="text-sm text-muted-foreground">
              Ready to create project &quot;{projectName || '—'}&quot; from template &quot;{template?.title ?? '—'}&quot;.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {step < 2 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={step === 0 && !template}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleApply}
              isLoading={isLoading}
              disabled={!projectName.trim()}
            >
              Apply template
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
