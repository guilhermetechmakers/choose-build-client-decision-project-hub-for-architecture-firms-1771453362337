import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FileCheck,
  MessageSquare,
  FileStack,
  Calendar,
  Plus,
  List,
  GanttChart,
  Filter,
  Flag,
  CalendarClock,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTimeline, useCreateMilestone, useRescheduleMilestone } from '@/hooks/useTimeline'
import { useSession } from '@/hooks/useAuth'
import type { ProjectPhase, ProjectMilestone } from '@/types'
import type { TimelineFilter } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const projectNav = [
  { to: 'decisions', label: 'Decision Log', icon: FileCheck },
  { to: 'messages', label: 'Messages', icon: MessageSquare },
  { to: 'files', label: 'Files & Drawings', icon: FileStack },
  { to: 'meetings', label: 'Meetings', icon: Calendar },
]

const PHASE_ORDER = ['kickoff', 'concept', 'schematic', 'dd', 'permitting', 'ca', 'handover']

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusVariant(status: string): 'secondary' | 'default' | 'destructive' | 'outline' {
  if (status === 'overdue') return 'destructive'
  if (status === 'completed') return 'secondary'
  if (status === 'in_progress') return 'default'
  return 'outline'
}

export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>()
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list')
  const [filter, setFilter] = useState<TimelineFilter>('all')
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false)
  const [newMilestonePhase, setNewMilestonePhase] = useState('dd')
  const [newMilestoneName, setNewMilestoneName] = useState('')
  const [newMilestoneDue, setNewMilestoneDue] = useState('')
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [rescheduleDue, setRescheduleDue] = useState('')

  const { data: session } = useSession()
  const canReschedule = Boolean(session)
  const { data: timeline, isLoading } = useTimeline(projectId)
  const createMilestone = useCreateMilestone(projectId ?? '')
  const rescheduleMutation = useRescheduleMilestone(projectId ?? '')

  const phases = timeline?.phases ?? []
  const milestones = timeline?.milestones ?? []
  const decisionCheckpoints = timeline?.decisionCheckpoints ?? []
  const projectName = timeline?.projectName ?? 'Project'

  const filteredMilestones = useMemo(() => {
    if (filter === 'all') return milestones
    const today = new Date().toISOString().slice(0, 10)
    if (filter === 'overdue') {
      return milestones.filter((m) => m.status === 'overdue' || (m.dueDate < today && m.status !== 'completed'))
    }
    if (filter === 'actionable') {
      return milestones.filter((m) => m.status === 'upcoming' || m.status === 'in_progress')
    }
    if (filter === 'approvals_needed') {
      return milestones.filter((m) => m.decisionId && m.status !== 'completed')
    }
    return milestones
  }, [milestones, filter])

  const handleAddMilestone = () => {
    if (!projectId || !newMilestoneName.trim() || !newMilestoneDue) {
      toast.error('Name and due date are required')
      return
    }
    createMilestone.mutate(
      {
        phaseId: newMilestonePhase,
        name: newMilestoneName.trim(),
        dueDate: newMilestoneDue,
      },
      {
        onSuccess: () => {
          setAddMilestoneOpen(false)
          setNewMilestoneName('')
          setNewMilestoneDue('')
          toast.success('Milestone added')
        },
        onError: () => toast.error('Failed to add milestone'),
      }
    )
  }

  const handleReschedule = () => {
    if (!projectId || !rescheduleId || !rescheduleDue) return
    rescheduleMutation.mutate(
      { milestoneId: rescheduleId, dueDate: rescheduleDue },
      {
        onSuccess: () => {
          setRescheduleId(null)
          setRescheduleDue('')
          toast.success('Due date updated')
        },
        onError: () => toast.error('Failed to update'),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project timeline</h1>
          <p className="text-muted-foreground">{projectName} · Phases, milestones and decision checkpoints.</p>
        </div>
      </div>

      {/* Project quick links */}
      <div className="flex flex-wrap gap-2">
        {projectNav.map((item) => (
          <Link
            key={item.to}
            to={`/dashboard/projects/${projectId}/${item.to}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/30 hover:scale-[1.02]"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Phase bars with percent complete and milestone markers */}
      <Card className="transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Phases</CardTitle>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap overflow-x-auto pb-2">
              {phases.length ? (
                phases.map((phase) => {
                  const phaseMilestones = milestones.filter((m) => m.phaseId === phase.phaseId)
                  return (
                    <div
                      key={phase.phaseId}
                      className={cn(
                        'flex shrink-0 flex-col items-center min-w-[80px] md:min-w-[100px]',
                        phase.phaseId === 'dd' && 'ring-2 ring-primary rounded-lg p-1'
                      )}
                    >
                      <div className="relative w-full rounded-t-md bg-muted h-2 md:h-3 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${phase.percentComplete}%` }}
                        />
                        {phaseMilestones.length > 0 && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-foreground/40 rounded"
                            style={{ left: `${Math.min(phase.percentComplete, 90)}%` }}
                            title={`${phaseMilestones.length} milestone(s)`}
                          />
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1 text-center">{phase.label}</span>
                      <span className="text-[10px] text-muted-foreground">{phase.percentComplete}%</span>
                    </div>
                  )
                })
              ) : (
                PHASE_ORDER.map((id) => (
                  <div key={id} className="flex shrink-0 flex-col items-center min-w-[80px] md:min-w-[100px]">
                    <div className="w-full rounded-t-md bg-muted h-2 md:h-3" />
                    <span className="text-xs font-medium mt-1">{id}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </CardHeader>
      </Card>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-border p-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={cn(
              'inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('gantt')}
            className={cn(
              'inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'gantt' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <GanttChart className="h-4 w-4" />
            Gantt
          </button>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
          {(['all', 'actionable', 'overdue', 'approvals_needed'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'actionable' ? 'Actionable' : f === 'overdue' ? 'Overdue' : 'Approvals'}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" variant="accent" className="gap-2" onClick={() => setAddMilestoneOpen(true)}>
            <Plus className="h-4 w-4" />
            Add milestone
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to={`/dashboard/projects/${projectId}/decisions/new`}>Publish decision</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to={`/dashboard/projects/${projectId}/meetings`}>Schedule meeting</Link>
          </Button>
        </div>
      </div>

      {/* Milestones: list or Gantt-lite */}
      <Card className="transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
          <CardContent className="pt-0">
            {filteredMilestones.length === 0 ? (
              <div className="rounded-md border border-dashed border-border py-8 text-center text-muted-foreground">
                <Flag className="mx-auto h-8 w-8 opacity-50" />
                <p className="mt-2">No milestones match the current filter.</p>
                <Button variant="accent" size="sm" className="mt-2" onClick={() => setAddMilestoneOpen(true)}>
                  Add milestone
                </Button>
              </div>
            ) : viewMode === 'list' ? (
              <ul className="space-y-2">
                {filteredMilestones.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    onReschedule={() => {
                      setRescheduleId(m.id)
                      setRescheduleDue(m.dueDate)
                    }}
                    projectId={projectId ?? ''}
                    canReschedule={canReschedule}
                  />
                ))}
              </ul>
            ) : (
              <GanttLite
                milestones={filteredMilestones}
                phases={phases}
                projectId={projectId ?? ''}
                onReschedule={(id, due) => {
                  setRescheduleId(id)
                  setRescheduleDue(due)
                }}
                canReschedule={canReschedule}
                onRescheduleByDrag={(id, due) => {
                  rescheduleMutation.mutate(
                    { milestoneId: id, dueDate: due },
                    {
                      onSuccess: () => toast.success('Due date updated'),
                      onError: () => toast.error('Failed to update'),
                    }
                  )
                }}
              />
            )}
          </CardContent>
        </CardHeader>
      </Card>

      {/* Decision checkpoints */}
      <Card className="transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Decision checkpoints</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Decisions linked to phases. Open the Decision Log to publish or review.
            </p>
            {decisionCheckpoints.length === 0 ? (
              <div className="rounded-md border border-border p-4 text-center text-muted-foreground">
                <FileCheck className="mx-auto h-8 w-8 mb-2" />
                <p>No decision checkpoints on the timeline yet.</p>
                <Link
                  to={`/dashboard/projects/${projectId}/decisions/new`}
                  className="text-primary font-medium hover:underline mt-2 inline-block"
                >
                  Create first decision
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {decisionCheckpoints.map((cp) => (
                  <li key={cp.id}>
                    <Link
                      to={`/dashboard/projects/${projectId}/decisions/${cp.decisionId}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium text-sm">{cp.decisionTitle || 'Decision'}</span>
                      <Badge variant="outline">{cp.phaseId}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </CardHeader>
      </Card>

      {/* Add milestone dialog */}
      <Dialog open={addMilestoneOpen} onOpenChange={setAddMilestoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add milestone</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phase">Phase</Label>
              <select
                id="phase"
                value={newMilestonePhase}
                onChange={(e) => setNewMilestonePhase(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {PHASE_ORDER.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
                placeholder="Milestone name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="date"
                value={newMilestoneDue}
                onChange={(e) => setNewMilestoneDue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMilestoneOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMilestone} disabled={createMilestone.isPending}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={!!rescheduleId} onOpenChange={(open) => !open && setRescheduleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reschedule-due">New due date</Label>
              <Input
                id="reschedule-due"
                type="date"
                value={rescheduleDue}
                onChange={(e) => setRescheduleDue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleId(null)}>Cancel</Button>
            <Button onClick={handleReschedule} disabled={rescheduleMutation.isPending}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MilestoneCard({
  milestone,
  onReschedule,
  projectId,
  canReschedule,
}: {
  milestone: ProjectMilestone
  onReschedule: () => void
  projectId: string
  canReschedule: boolean
}) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 transition-shadow hover:shadow-card">
      <div className="min-w-0">
        <p className="font-medium truncate">{milestone.name}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" />
          {formatDate(milestone.dueDate)}
          {milestone.assigneeName && (
            <>
              <User className="h-3.5 w-3.5" />
              {milestone.assigneeName}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={getStatusVariant(milestone.status)}>{milestone.status.replace('_', ' ')}</Badge>
        {canReschedule && (
          <Button variant="ghost" size="sm" onClick={onReschedule}>
            Reschedule
          </Button>
        )}
        {milestone.decisionId && (
          <Link
            to={`/dashboard/projects/${projectId}/decisions/${milestone.decisionId}`}
            className="text-primary text-sm hover:underline"
          >
            View decision
          </Link>
        )}
      </div>
    </li>
  )
}

function GanttLite({
  milestones,
  phases: _phases,
  projectId: _projectId,
  onReschedule,
  canReschedule,
  onRescheduleByDrag,
}: {
  milestones: ProjectMilestone[]
  phases: ProjectPhase[]
  projectId: string
  onReschedule: (id: string, due: string) => void
  canReschedule?: boolean
  onRescheduleByDrag?: (milestoneId: string, newDueDate: string) => void
}) {
  const minDate = milestones.length
    ? milestones.reduce((a, m) => (m.dueDate < a ? m.dueDate : a), milestones[0].dueDate)
    : new Date().toISOString().slice(0, 10)
  const maxDate = milestones.length
    ? milestones.reduce((a, m) => (m.dueDate > a ? m.dueDate : a), milestones[0].dueDate)
    : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  const start = new Date(minDate).getTime()
  const end = new Date(maxDate).getTime()
  const range = end - start || 1

  function dateFromOffset(offsetPercent: number): string {
    const t = start + (offsetPercent / 100) * range
    return new Date(Math.round(t)).toISOString().slice(0, 10)
  }

  function handleBarDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!canReschedule || !onRescheduleByDrag) return
    const milestoneId = e.dataTransfer.getData('text/plain')
    if (!milestoneId) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newDue = dateFromOffset(pct)
    onRescheduleByDrag(milestoneId, newDue)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 font-medium">Milestone</th>
            <th className="text-left py-2 font-medium">Phase</th>
            <th className="text-left py-2 font-medium">Due</th>
            <th className="py-2 font-medium">Timeline</th>
            {canReschedule && <th className="py-2 font-medium w-24">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {milestones.map((m) => {
            const pos = ((new Date(m.dueDate).getTime() - start) / range) * 100
            return (
              <tr key={m.id} className="border-t border-border">
                <td className="py-2 font-medium">{m.name}</td>
                <td className="py-2 text-muted-foreground">{m.phaseId}</td>
                <td className="py-2">{formatDate(m.dueDate)}</td>
                <td className="py-2">
                  <div
                    className="relative h-6 rounded bg-muted"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleBarDrop}
                  >
                    <div
                      draggable={canReschedule && !!onRescheduleByDrag}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', m.id)
                        e.dataTransfer.effectAllowed = 'move'
                      }}
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 w-2 h-4 rounded bg-primary',
                        canReschedule && onRescheduleByDrag && 'cursor-grab active:cursor-grabbing'
                      )}
                      style={{ left: `${Math.max(0, Math.min(pos, 98))}%` }}
                      title={canReschedule ? 'Drag to reschedule' : formatDate(m.dueDate)}
                    />
                  </div>
                </td>
                {canReschedule && (
                  <td className="py-2">
                    <Button variant="ghost" size="sm" onClick={() => onReschedule(m.id, m.dueDate)}>
                      Reschedule
                    </Button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
