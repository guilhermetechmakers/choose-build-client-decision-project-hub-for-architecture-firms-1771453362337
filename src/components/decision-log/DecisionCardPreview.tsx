import { Link } from 'react-router-dom'
import { FileCheck, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Decision } from '@/types'

export interface DecisionCardPreviewProps {
  decision: Decision
  projectId: string
  lastActivity?: string
  /** Override link (e.g. when used outside project context) */
  to?: string
  className?: string
}

const statusVariant: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  changes_requested: 'destructive',
}

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  changes_requested: 'Rejected',
}

export function DecisionCardPreview({
  decision,
  projectId,
  lastActivity,
  to,
  className,
}: DecisionCardPreviewProps) {
  const variant = statusVariant[decision.status] ?? 'secondary'
  const label = statusLabel[decision.status] ?? decision.status
  const costDelta = decision.costDelta ?? 0
  const href = to ?? `/dashboard/projects/${projectId}/decisions/${decision.id}`

  return (
    <Link
      to={href}
      className={cn('block transition-all duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg', className)}
    >
      <Card className="h-full overflow-hidden border-border transition-shadow duration-200 hover:shadow-card-hover hover:border-primary/30">
        <div className="flex flex-col sm:flex-row">
          <div className="flex h-32 w-full shrink-0 items-center justify-center bg-muted/50 sm:h-auto sm:w-36">
            {decision.thumbnailUrl ? (
              <img
                src={decision.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <FileCheck className="h-10 w-10 text-muted-foreground" aria-hidden />
            )}
          </div>
          <CardContent className="flex flex-1 flex-col justify-center gap-2 p-4">
            <h3 className="font-semibold leading-tight line-clamp-2">{decision.title}</h3>
            {decision.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{decision.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={variant}>{label}</Badge>
              {costDelta > 0 && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" aria-hidden />
                  +{costDelta.toLocaleString()}
                </span>
              )}
              {lastActivity && (
                <span className="text-xs text-muted-foreground">Updated {lastActivity}</span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
