import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectTemplate } from '@/types'
import type { TemplateListFilters, TemplateSortField, TemplateSortOrder } from '@/services/crud-operations-versioningService'

export interface TemplateListTableProps {
  items: ProjectTemplate[]
  total: number
  page: number
  pageSize: number
  isLoading?: boolean
  filters: TemplateListFilters
  onFiltersChange: (f: TemplateListFilters) => void
  sortBy: TemplateSortField
  sortOrder: TemplateSortOrder
  onSort: (field: TemplateSortField, order: TemplateSortOrder) => void
  onPageChange?: (page: number) => void
  onEdit: (t: ProjectTemplate) => void
  onApply: (t: ProjectTemplate) => void
  onDelete: (t: ProjectTemplate) => void
}

const typeLabel: Record<string, string> = {
  project: 'Project',
  decision_set: 'Decision set',
}

const statusVariant: Record<string, 'secondary' | 'default' | 'outline'> = {
  draft: 'outline',
  active: 'default',
  archived: 'secondary',
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export function TemplateListTable({
  items,
  total,
  page,
  pageSize,
  isLoading,
  filters,
  onFiltersChange,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onEdit,
  onApply,
  onDelete,
}: TemplateListTableProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput.trim() || undefined })
  }

  const SortHeader = ({
    field,
    label,
  }: {
    field: TemplateSortField
    label: string
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1"
      onClick={() =>
        onSort(field, sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc')
      }
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

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Skeleton className="h-12 w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-none" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
              aria-label="Search templates"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{total} template{total !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <SortHeader field="title" label="Title" />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader field="usage_count" label="Usage" />
              </TableHead>
              <TableHead>
                <SortHeader field="updated_at" label="Updated" />
              </TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <LayoutTemplate className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2 font-medium">No templates yet</p>
                  <p className="text-sm">
                    Create a template from an existing project or from scratch. Version and reuse.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((t) => (
                <TableRow
                  key={t.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <Link
                      to={`/dashboard/templates/${t.id}`}
                      className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    >
                      {t.title}
                    </Link>
                    {t.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-xs mt-0.5">
                        {t.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{typeLabel[t.type] ?? t.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[t.status] ?? 'outline'}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.usage_count ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(t.updated_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onApply(t)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Apply to project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(t)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(t)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
