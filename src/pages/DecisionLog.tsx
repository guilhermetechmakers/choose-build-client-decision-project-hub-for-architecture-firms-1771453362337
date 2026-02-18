import { Link, useLocation } from 'react-router-dom'
import { FileCheck, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DecisionLog as DecisionLogContent } from '@/pages/dashboard/decision-log'

/**
 * Main Decision Log page. Renders project-scoped Decision Log when path includes a project,
 * otherwise shows landing with CTA to select a project (per spec: route /decision-log).
 */
export default function DecisionLogPage() {
  const location = useLocation()
  const pathname = location.pathname
  const isProjectScoped =
    pathname.includes('/projects/') && pathname.includes('/decisions')

  if (isProjectScoped) {
    return <DecisionLogContent />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Decision Log
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage decision cards. Select a project to view its decisions.
        </p>
      </div>
      <Card className="border-border shadow-card overflow-hidden transition-shadow duration-200 hover:shadow-card-hover">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileCheck className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Select a project</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Decision cards are organized by project. Open a project to view its decision log, options, cost impacts, and approval status.
          </p>
          <Button variant="primary" size="default" className="mt-6 gap-2" asChild>
            <Link to="/dashboard/projects">
              <FolderKanban className="h-5 w-5" />
              Go to projects
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
