import { Link } from 'react-router-dom'
import { FileStack } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function FilesOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Files</h1>
        <p className="text-muted-foreground">Drawings and project files.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5" />
            Select a project
          </CardTitle>
          <CardDescription>Open a project to view files and drawings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="accent" asChild>
            <Link to="/dashboard/projects">View projects</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
