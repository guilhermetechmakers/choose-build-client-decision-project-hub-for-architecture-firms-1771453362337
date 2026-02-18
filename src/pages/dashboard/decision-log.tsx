import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, ArrowLeft, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DecisionList, type DecisionListFilters, type SortField, type SortOrder } from '@/components/decision-log/DecisionList'
import { DecisionDetailPanel } from '@/components/decision-log/DecisionDetailPanel'
import {
  listDecisions,
  getDecisionDetail,
  submitApproval,
  type ListDecisionsParams,
} from '@/api/decision-log'
import type { Decision } from '@/types'
import { useState } from 'react'

/** Mock data when API is not available */
const MOCK_DECISIONS: Decision[] = [
  {
    id: '1',
    projectId: '',
    title: 'Exterior cladding option',
    description: 'Choose between timber, composite, or metal cladding.',
    status: 'pending',
    costDelta: 12000,
    recommendedOptionId: 'opt-1',
    options: [
      { id: 'opt-1', label: 'Timber', description: 'Natural finish', costDelta: 0, isRecommended: true },
      { id: 'opt-2', label: 'Composite', description: 'Low maintenance', costDelta: 8000 },
      { id: 'opt-3', label: 'Metal', description: 'Modern look', costDelta: 12000 },
    ],
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    thumbnailUrl: undefined,
  },
  {
    id: '2',
    projectId: '',
    title: 'Kitchen fixture package',
    description: 'Standard vs premium fixtures.',
    status: 'approved',
    costDelta: 0,
    options: [
      { id: 'opt-a', label: 'Standard', costDelta: 0, isRecommended: true },
      { id: 'opt-b', label: 'Premium', costDelta: 4500 },
    ],
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    thumbnailUrl: undefined,
  },
  {
    id: '3',
    projectId: '',
    title: 'Roof membrane system',
    description: 'Single-ply vs built-up roofing.',
    status: 'changes_requested',
    costDelta: 3500,
    options: [
      { id: 'opt-x', label: 'Single-ply', costDelta: 0 },
      { id: 'opt-y', label: 'Built-up', costDelta: 3500, isRecommended: true },
    ],
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    thumbnailUrl: undefined,
  },
]

export function DecisionLog() {
  const { projectId, decisionId } = useParams<{ projectId: string; decisionId?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [filters, setFilters] = useState<DecisionListFilters>({})
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const listParams: ListDecisionsParams = {
    projectId: projectId ?? '',
    ...filters,
    sortBy,
    sortOrder,
    page: 1,
    pageSize: 50,
  }

  const listQuery = useQuery({
    queryKey: ['decisions', projectId, listParams],
    queryFn: () => listDecisions(listParams),
    enabled: Boolean(projectId),
  })

  const detailQuery = useQuery({
    queryKey: ['decision-detail', projectId, decisionId],
    queryFn: () => getDecisionDetail(projectId!, decisionId!),
    enabled: Boolean(projectId && decisionId),
  })

  const approvalMutation = useMutation({
    mutationFn: ({
      action,
      comment,
      versionId,
    }: { action: 'approve' | 'request_change' | 'ask_question'; comment?: string; versionId: string }) =>
      submitApproval(projectId!, decisionId!, { action, comment, versionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decision-detail', projectId, decisionId] })
      queryClient.invalidateQueries({ queryKey: ['decisions', projectId] })
      toast.success('Approval submitted.')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to submit approval.')
    },
  })

  const decisions = listQuery.data?.items ?? (listQuery.isError ? MOCK_DECISIONS.map((d) => ({ ...d, projectId: projectId ?? '' })) : [])
  const total = listQuery.data?.total ?? decisions.length
  const isLoadingList = listQuery.isLoading
  const detail = detailQuery.data
  const isLoadingDetail = decisionId != null && detailQuery.isLoading

  const handleApproval = async (
    action: 'approve' | 'request_change' | 'ask_question',
    comment?: string
  ) => {
    const versionId = detail?.versions?.[0]?.id ?? detail?.decision?.id ?? ''
    await approvalMutation.mutateAsync({ action, comment, versionId })
  }

  if (!projectId) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Decision Log</h1>
        <p className="text-muted-foreground">Select a project to view its decision log.</p>
        <Button asChild>
          <Link to="/dashboard/projects">Go to projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {decisionId ? (
            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/projects/${projectId}/decisions`)} aria-label="Back to list">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}
          <div>
            <h1 className="text-2xl font-bold">Decision Log</h1>
            <p className="text-muted-foreground">
              Review and manage decision cards. All versions are auditable.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!decisionId && (
            <>
              <Button
                variant={view === 'cards' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('cards')}
                aria-label="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('table')}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="accent" asChild>
                <Link to={`/dashboard/projects/${projectId}/decisions/new`} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create decision
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {decisionId ? (
        <DecisionDetailPanel
          decision={detail?.decision ?? { id: decisionId, projectId, title: '…', status: 'pending', options: [] }}
          versions={detail?.versions}
          auditLog={detail?.auditLog}
          relatedItems={detail?.relatedItems}
          projectId={projectId}
          onApprovalSubmit={handleApproval}
          requiresEsign={false}
          isLoading={isLoadingDetail}
        />
      ) : (
        <DecisionList
          decisions={decisions}
          projectId={projectId}
          isLoading={isLoadingList}
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field, order) => {
            setSortBy(field)
            setSortOrder(order)
          }}
          total={total}
          view={view}
          getDecisionLink={(d) => `/dashboard/projects/${projectId}/decisions/${d.id}`}
        />
      )}
    </div>
  )
}
