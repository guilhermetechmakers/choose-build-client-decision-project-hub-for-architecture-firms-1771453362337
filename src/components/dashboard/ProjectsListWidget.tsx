import { Link } from 'react-router-dom'
import { FolderKanban, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardProject } from '@/api/dashboard'
import { cn } from '@/lib/utils'

interface ProjectsListWidgetProps {
  projects: DashboardProject[]
  isLoading?: boolean
}

export function ProjectsListWidget({ projects, isLoading }: ProjectsListWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Active projects with progress and phase</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/projects">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            <FolderKanban className="mx-auto h-10 w-10 opacity-50" />
            <p className="mt-2">No projects yet</p>
            <Button variant="accent" size="sm" className="mt-2" asChild>
              <Link to="/dashboard/projects/new">Create project</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/projects/${project.id}`}
                className={cn(
                  'flex items-center justify-between rounded-lg border border-border p-4',
                  'transition-colors duration-200 hover:bg-muted/50 hover:border-primary/30'
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{project.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{project.phase} phase</span>
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {project.pendingApprovals > 0 && (
                    <Badge variant="secondary" className="bg-warning/15 text-warning">
                      {project.pendingApprovals} pending
                    </Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
