import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DecisionCardPreview } from '@/components/decision-log/DecisionCardPreview'
import type { Decision } from '@/types'

export type SortField = 'date' | 'status' | 'cost' | 'title' | 'phase'
export type SortOrder = 'asc' | 'desc'

export interface DecisionListFilters {
  status?: string
  phase?: string
  assignee?: string
  costImpact?: 'any' | 'none' | 'positive'
  search?: string
}

export interface DecisionListProps {
  decisions: Decision[]
  projectId: string
  isLoading?: boolean
  filters: DecisionListFilters
  onFiltersChange: (f: DecisionListFilters) => void
  sortBy: SortField
  sortOrder: SortOrder
  onSort: (field: SortField, order: SortOrder) => void
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  /** For table: link base path e.g. /dashboard/projects/1/decisions */
  getDecisionLink?: (d: Decision) => string
  /** View: 'table' | 'cards' */
  view?: 'table' | 'cards'
}

function formatLastActivity(updatedAt?: string): string {
  if (!updatedAt) return '—'
  const d = new Date(updatedAt)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 60) return `${diffM}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString()
}

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  changes_requested: 'Rejected',
}

export function DecisionList({
  decisions,
  projectId,
  isLoading,
  filters,
  onFiltersChange,
  sortBy,
  sortOrder,
  onSort,
  view = 'cards',
  getDecisionLink,
}: DecisionListProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const navigate = useNavigate()

  const sorted = useMemo(() => {
    const list = [...decisions]
    list.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case 'title':
          cmp = (a.title ?? '').localeCompare(b.title ?? '')
          break
        case 'status':
          cmp = (a.status ?? '').localeCompare(b.status ?? '')
          break
        case 'cost':
          cmp = (a.costDelta ?? 0) - (b.costDelta ?? 0)
          break
        case 'date':
        default:
          cmp = new Date(a.publishedAt ?? a.id).getTime() - new Date(b.publishedAt ?? b.id).getTime()
          break
      }
      return sortOrder === 'desc' ? -cmp : cmp
    })
    return list
  }, [decisions, sortBy, sortOrder])

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined })
  }

  const SortHeader = ({
    field,
    label,
  }: {
    field: SortField
    label: string
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1"
      onClick={() => onSort(field, sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc')}
    >
      {label}
      {sortBy === field ? (
        sortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </Button>
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === 'table') {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder="Search decisions..."
                className="pl-9"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <SortHeader field="title" label="Title" />
                  </TableHead>
                  <TableHead>
                    <SortHeader field="status" label="Status" />
                  </TableHead>
                  <TableHead>
                    <SortHeader field="cost" label="Cost impact" />
                  </TableHead>
                  <TableHead>
                    <SortHeader field="date" label="Date" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No decisions found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((d) => (
                    <TableRow
                      key={d.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => {
                        const href = getDecisionLink?.(d) ?? `/dashboard/projects/${projectId}/decisions/${d.id}`
                        navigate(href)
                      }}
                    >
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell>{statusLabel[d.status] ?? d.status}</TableCell>
                      <TableCell>
                        {d.costDelta != null && d.costDelta > 0
                          ? `+${d.costDelta.toLocaleString()}`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLastActivity(d.publishedAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decisions</CardTitle>
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Search decisions..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No decisions found.</p>
              <p className="mt-1 text-sm text-muted-foreground">Create a decision to see it here.</p>
            </div>
          ) : (
            sorted.map((d) => (
              <DecisionCardPreview
                key={d.id}
                decision={d}
                projectId={projectId}
                lastActivity={formatLastActivity(d.publishedAt)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
