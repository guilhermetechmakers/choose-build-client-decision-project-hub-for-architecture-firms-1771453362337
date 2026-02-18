import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MessagesOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Project conversations and threads.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Select a project
          </CardTitle>
          <CardDescription>Open a project to view and send messages.</CardDescription>
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
