import { useParams, Link } from 'react-router-dom'
import { FileCheck, MessageSquare, FileStack, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const phases = [
  { id: 'kickoff', label: 'Kickoff', progress: 100 },
  { id: 'concept', label: 'Concept', progress: 100 },
  { id: 'schematic', label: 'Schematic', progress: 100 },
  { id: 'dd', label: 'DD', progress: 80 },
  { id: 'permitting', label: 'Permitting', progress: 0 },
  { id: 'ca', label: 'CA', progress: 0 },
  { id: 'handover', label: 'Handover', progress: 0 },
]

const projectNav = [
  { to: 'decisions', label: 'Decision Log', icon: FileCheck },
  { to: 'messages', label: 'Messages', icon: MessageSquare },
  { to: 'files', label: 'Files & Drawings', icon: FileStack },
  { to: 'meetings', label: 'Meetings', icon: Calendar },
]

export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Project timeline</h1>
        <p className="text-muted-foreground">Riverside Residence · Single source of truth for phases and decision checkpoints.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phases</CardTitle>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap overflow-x-auto pb-2">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  className={cn(
                    'flex shrink-0 flex-col items-center min-w-[80px] md:min-w-[100px]',
                    phase.id === 'dd' && 'ring-2 ring-primary rounded-lg p-1'
                  )}
                >
                  <div className="w-full rounded-t-md bg-muted h-2 md:h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium mt-1 text-center">{phase.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap gap-2">
        {projectNav.map((item) => (
          <Link
            key={item.to}
            to={`/dashboard/projects/${projectId}/${item.to}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/30"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision checkpoints</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Milestones linked to decisions. Click through to the Decision Log to publish or review.
            </p>
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
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
