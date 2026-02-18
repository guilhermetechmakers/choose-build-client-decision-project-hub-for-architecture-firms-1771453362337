import { Link } from 'react-router-dom'
import { FolderKanban, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const mockProjects = [
  { id: '1', name: 'Riverside Residence', status: 'active', phase: 'DD', progress: 65, pendingApprovals: 2 },
  { id: '2', name: 'Commerce Tower', status: 'active', phase: 'CA', progress: 90, pendingApprovals: 0 },
  { id: '3', name: 'Park View Loft', status: 'active', phase: 'Schematic', progress: 35, pendingApprovals: 1 },
]

export function ProjectsList() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and open your project timelines.</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/dashboard/projects/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All projects</CardTitle>
          <CardDescription>Click a project to open the board, decisions, and files.</CardDescription>
          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/projects/${project.id}`}
                className={cn(
                  'group rounded-lg border border-border p-4 transition-all duration-200',
                  'hover:shadow-card-hover hover:border-primary/30'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  {project.pendingApprovals > 0 && (
                    <Badge variant="warning" className="shrink-0">{project.pendingApprovals}</Badge>
                  )}
                </div>
                <h3 className="mt-3 font-semibold group-hover:text-primary">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.phase} · {project.progress}%</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
