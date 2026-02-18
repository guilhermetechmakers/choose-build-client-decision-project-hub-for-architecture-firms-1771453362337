import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { UpcomingMeeting } from '@/api/dashboard'
import { cn } from '@/lib/utils'

interface UpcomingMeetingsAndTasksProps {
  meetings: UpcomingMeeting[]
  isLoading?: boolean
}

function formatMeetingDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === now.toDateString()) return 'Today ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function UpcomingMeetingsAndTasks({ meetings, isLoading }: UpcomingMeetingsAndTasksProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-32 mt-1" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming meetings
        </CardTitle>
        <CardDescription>Calendar snippet</CardDescription>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            <Calendar className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No upcoming meetings</p>
            <Link to="/dashboard/projects" className="text-primary font-medium hover:underline mt-1 inline-block">
              Schedule one
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {meetings.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/dashboard/projects/${m.projectId}/meetings`}
                  className={cn(
                    'flex items-center justify-between rounded-lg border border-border p-3',
                    'transition-colors duration-200 hover:bg-muted/50'
                  )}
                >
                  <span className="font-medium text-sm">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{formatMeetingDate(m.start)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
