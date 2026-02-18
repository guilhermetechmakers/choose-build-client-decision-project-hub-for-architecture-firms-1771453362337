import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityEvent } from '@/api/dashboard'

interface ActivityFeedProps {
  events: ActivityEvent[]
  isLoading?: boolean
}

export function ActivityFeed({ events, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-40 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between gap-2">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
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
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent approvals, uploads, comments</CardDescription>
        </div>
        <Button variant="ghost" size="sm">View all</Button>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {events.map((event, i) => (
              <li key={`${event.projectId}-${event.action}-${i}`} className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{event.action}</p>
                  <p className="text-muted-foreground">{event.project}</p>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">{event.time}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
