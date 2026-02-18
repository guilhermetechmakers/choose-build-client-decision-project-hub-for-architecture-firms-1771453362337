import { useState } from 'react'
import { Check, MessageSquare, Edit3, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface ApprovalControlsProps {
  status: string
  onApprove?: () => void | Promise<void>
  onRequestChange?: (comment: string) => void | Promise<void>
  onAskQuestion?: (comment: string) => void | Promise<void>
  onEsign?: () => void | Promise<void>
  requiresEsign?: boolean
  className?: string
}

export function ApprovalControls({
  status,
  onApprove,
  onRequestChange,
  onAskQuestion,
  onEsign,
  requiresEsign = false,
  className,
}: ApprovalControlsProps) {
  const [dialogOpen, setDialogOpen] = useState<'change' | 'question' | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isPending = status === 'pending'
  const isApproved = status === 'approved'
  const isRejected = status === 'changes_requested'

  const handleRequestChange = async () => {
    if (!onRequestChange) return
    setIsSubmitting(true)
    try {
      await onRequestChange(comment)
      setComment('')
      setDialogOpen(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!onAskQuestion) return
    setIsSubmitting(true)
    try {
      await onAskQuestion(comment)
      setComment('')
      setDialogOpen(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isPending) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Status: <strong className="text-foreground">{status.replace('_', ' ')}</strong>.
            {isApproved && ' No further action needed.'}
            {isRejected && ' Awaiting updates from the team.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-base">Approval</CardTitle>
          <p className="text-sm text-muted-foreground">
            Approve this decision, request changes, or ask a question.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            className="gap-2 transition-transform hover:scale-[1.02]"
            onClick={() => onApprove?.()}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setDialogOpen('change')}
          >
            <Edit3 className="h-4 w-4" />
            Request Change
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setDialogOpen('question')}
          >
            <MessageSquare className="h-4 w-4" />
            Ask Question
          </Button>
          {requiresEsign && (
            <Button
              variant="accent"
              size="sm"
              className="gap-2"
              onClick={() => onEsign?.()}
            >
              <PenLine className="h-4 w-4" />
              E-sign
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen === 'change'} onOpenChange={(o) => !o && setDialogOpen(null)}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Request change</DialogTitle>
            <DialogDescription>Describe what should be changed. The team will be notified.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="change-comment">Comment</Label>
            <Input
              id="change-comment"
              placeholder="e.g. Please revise option B cost..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button onClick={handleRequestChange} disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === 'question'} onOpenChange={(o) => !o && setDialogOpen(null)}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Ask a question</DialogTitle>
            <DialogDescription>Your question will be linked to this decision and the team can reply.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="question-comment">Question</Label>
            <Input
              id="question-comment"
              placeholder="e.g. What is the lead time for option A?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button onClick={handleAskQuestion} disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Ask question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
