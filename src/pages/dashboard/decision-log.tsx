import { useParams, Link } from 'react-router-dom'
import { FileCheck, Plus, Search, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const mockDecisions = [
  { id: '1', title: 'Exterior cladding option', status: 'pending', costDelta: 12000, updatedAt: '2 hours ago' },
  { id: '2', title: 'Kitchen fixture package', status: 'approved', costDelta: 0, updatedAt: '1 day ago' },
  { id: '3', title: 'Roof membrane system', status: 'changes_requested', costDelta: 3500, updatedAt: '3 days ago' },
]

const statusVariant = {
  draft: 'secondary' as const,
  pending: 'warning' as const,
  approved: 'success' as const,
  changes_requested: 'destructive' as const,
}

export function DecisionLog() {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Decision Log</h1>
          <p className="text-muted-foreground">Review and manage decision cards. All versions are auditable.</p>
        </div>
        <Button variant="accent" asChild>
          <Link to={`/dashboard/projects/${projectId}/decisions/new`} className="gap-2">
            <Plus className="h-4 w-4" />
            Create decision
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decisions</CardTitle>
          <CardContent className="pt-0">
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search decisions..." className="pl-9" />
            </div>
            <div className="space-y-2">
              {mockDecisions.map((d) => (
                <Link
                  key={d.id}
                  to="#"
                  className={cn(
                    'flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50'
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{d.title}</p>
                    <p className="text-sm text-muted-foreground">Updated {d.updatedAt}</p>
                  </div>
                  {d.costDelta !== undefined && d.costDelta > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      +{d.costDelta.toLocaleString()}
                    </div>
                  )}
                  <Badge variant={statusVariant[d.status as keyof typeof statusVariant]}>{d.status.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
