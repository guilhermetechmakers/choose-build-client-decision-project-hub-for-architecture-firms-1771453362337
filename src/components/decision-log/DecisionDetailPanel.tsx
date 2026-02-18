import { useState } from 'react'
import { FileText, DollarSign, ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ApprovalControls } from '@/components/decision-log/ApprovalControls'
import { VersionHistory } from '@/components/decision-log/VersionHistory'
import { AuditLog } from '@/components/decision-log/AuditLog'
import { RelatedItemsSidebar } from '@/components/decision-log/RelatedItemsSidebar'
import { cn } from '@/lib/utils'
import type { Decision, DecisionOption, DecisionVersion, AuditEntry, RelatedItem } from '@/types'

export interface DecisionDetailPanelProps {
  decision: Decision
  versions?: DecisionVersion[]
  auditLog?: AuditEntry[]
  relatedItems?: RelatedItem[]
  projectId: string
  onApprovalSubmit?: (action: 'approve' | 'request_change' | 'ask_question', comment?: string) => Promise<void>
  requiresEsign?: boolean
  isLoading?: boolean
  className?: string
}

const statusVariant: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  changes_requested: 'destructive',
}

export function DecisionDetailPanel({
  decision,
  versions = [],
  auditLog = [],
  relatedItems = [],
  projectId,
  onApprovalSubmit,
  requiresEsign = false,
  isLoading,
  className,
}: DecisionDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('options')
  const options = decision.options ?? []

  if (isLoading) {
    return (
      <div className={cn('space-y-6 animate-fade-in', className)}>
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold">{decision.title}</h2>
        <Badge variant={statusVariant[decision.status] ?? 'secondary'}>
          {decision.status.replace('_', ' ')}
        </Badge>
      </div>
      {decision.description && (
        <p className="text-muted-foreground">{decision.description}</p>
      )}

      {/* Gallery of option images / PDFs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="options">Gallery</TabsTrigger>
              <TabsTrigger value="costs">Cost deltas</TabsTrigger>
              <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
            </TabsList>
            <TabsContent value="options" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {options.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No options added</p>
                  </div>
                ) : (
                  options.map((opt: DecisionOption) => (
                    <div
                      key={opt.id}
                      className="overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-card-hover"
                    >
                      <div className="aspect-video bg-muted/50 flex items-center justify-center">
                        {opt.imageUrl ? (
                          <img
                            src={opt.imageUrl}
                            alt={opt.label}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium">{opt.label}</p>
                        {opt.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{opt.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="costs" className="mt-0">
              <div className="space-y-2">
                {options.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No options to show cost for.</p>
                ) : (
                  options.map((opt: DecisionOption) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between rounded-md border border-border px-4 py-2"
                    >
                      <span>{opt.label}</span>
                      <span className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-4 w-4" />
                        {opt.costDelta != null ? `+${opt.costDelta.toLocaleString()}` : '—'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="recommendation" className="mt-0">
              {decision.recommendedOptionId ? (
                <p className="text-sm">
                  Recommended option:{' '}
                  <strong>
                    {options.find((o: DecisionOption) => o.id === decision.recommendedOptionId)?.label ??
                      decision.recommendedOptionId}
                  </strong>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No recommendation set.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comment thread placeholder - could be a separate component wired to Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Comment thread links to contextual Messages. No comments yet.
          </div>
        </CardContent>
      </Card>

      <ApprovalControls
        status={decision.status}
        onApprove={onApprovalSubmit ? () => onApprovalSubmit('approve') : undefined}
        onRequestChange={onApprovalSubmit ? (c) => onApprovalSubmit('request_change', c) : undefined}
        onAskQuestion={onApprovalSubmit ? (c) => onApprovalSubmit('ask_question', c) : undefined}
        requiresEsign={requiresEsign}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <VersionHistory versions={versions} projectId={projectId} decisionId={decision.id} />
          <AuditLog entries={auditLog} />
        </div>
        <RelatedItemsSidebar items={relatedItems} />
      </div>
    </div>
  )
}
