import { History, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AuditEntry } from '@/types'

export interface AuditLogProps {
  entries: AuditEntry[]
  className?: string
}

export function AuditLog({ entries, className }: AuditLogProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-5 w-5" />
          Audit log
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Who changed what and when.
        </p>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No audit entries yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {sorted.map((entry) => (
              <li
                key={entry.id}
                className="flex gap-3 rounded-md border border-border px-3 py-2 text-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{entry.userName}</p>
                  <p className="text-muted-foreground">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
