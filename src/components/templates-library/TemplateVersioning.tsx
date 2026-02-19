import { History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TemplateVersion } from '@/types'

export interface TemplateVersioningProps {
  versions: TemplateVersion[]
  isLoading?: boolean
  currentVersionId?: string
  onSelectVersion?: (v: TemplateVersion) => void
  className?: string
}

function formatVersionDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

export function TemplateVersioning({
  versions,
  isLoading,
  currentVersionId,
  onSelectVersion,
  className,
}: TemplateVersioningProps) {
  if (isLoading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Version history
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (versions.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Version history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No versions yet. Save the template to create version 1.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Version history
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2" role="list">
          {versions.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onSelectVersion?.(v)}
                className={cn(
                  'w-full text-left rounded-md border border-border px-3 py-2 text-sm transition-all duration-200',
                  currentVersionId === v.id
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'hover:bg-muted/50 hover:shadow-sm'
                )}
              >
                <span className="font-medium">v{v.version}</span>
                <span className="text-muted-foreground ml-2">
                  {formatVersionDate(v.created_at)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
