import { useParams } from 'react-router-dom'
import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Messages() {
  useParams<{ projectId: string }>()

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Contextual threads tied to decisions, files, and tasks.</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Conversations linked to this project.</p>
          </CardContent>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-medium">No threads yet</p>
          <p className="text-sm text-muted-foreground">Start a conversation from a decision or file, or create a new thread.</p>
          <div className="mt-4 flex gap-2">
            <Input placeholder="New message..." className="max-w-sm" />
            <Button variant="accent" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
