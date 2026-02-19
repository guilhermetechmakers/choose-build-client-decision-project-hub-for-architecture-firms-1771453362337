import { Link } from 'react-router-dom'
import { FileCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PendingApprovalCard } from '@/api/dashboard'
import { cn } from '@/lib/utils'

interface PendingApprovalsWidgetProps {
  items: PendingApprovalCard[]
  isLoading?: boolean
}

export function PendingApprovalsWidget({ items, isLoading }: PendingApprovalsWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCheck className="h-4 w-4 text-primary" />
          Pending approvals
        </CardTitle>
        <CardDescription>Decision cards awaiting client sign-off</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            <FileCheck className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No pending approvals</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/dashboard/projects/${item.projectId}/decisions/${item.id}`}
                  className={cn(
                    'block rounded-lg border border-border p-3 transition-colors duration-200',
                    'hover:bg-muted/50 hover:border-primary/30'
                  )}
                >
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.projectName}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
