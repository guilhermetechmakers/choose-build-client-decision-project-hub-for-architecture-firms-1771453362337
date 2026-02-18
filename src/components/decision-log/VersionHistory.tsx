import { Clock, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DecisionVersion } from '@/types'

export interface VersionHistoryProps {
  versions: DecisionVersion[]
  projectId: string
  decisionId: string
  onDownload?: (versionId: string) => void | Promise<void>
  className?: string
}

export function VersionHistory({
  versions,
  projectId: _projectId,
  decisionId: _decisionId,
  onDownload,
  className,
}: VersionHistoryProps) {
  const sorted = [...versions].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const handleDownload = (v: DecisionVersion) => {
    if (v.downloadUrl) {
      window.open(v.downloadUrl, '_blank')
      return
    }
    onDownload?.(v.id)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5" />
          Version history
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Timestamped snapshots. Download a specific version if needed.
        </p>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No published versions yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">v{v.version}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(v.publishedAt).toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleDownload(v)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
