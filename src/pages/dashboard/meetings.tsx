import { useParams } from 'react-router-dom'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Meetings() {
  useParams<{ projectId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings & Agendas</h1>
          <p className="text-muted-foreground">Schedule meetings and capture agendas, minutes, and action items.</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          New meeting
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming meetings</CardTitle>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <Calendar className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">No meetings scheduled</p>
              <p className="text-sm text-muted-foreground">Create an agenda and link to decisions or drawings. Export minutes when done.</p>
              <Button variant="outline" className="mt-4">Schedule meeting</Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
