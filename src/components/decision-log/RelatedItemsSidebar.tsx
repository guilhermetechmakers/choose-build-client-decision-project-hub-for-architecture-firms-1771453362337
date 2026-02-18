import { Link } from 'react-router-dom'
import { FileImage, CheckSquare, StickyNote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RelatedItem } from '@/types'

export interface RelatedItemsSidebarProps {
  items: RelatedItem[]
  className?: string
}

const iconByType = {
  drawing: FileImage,
  task: CheckSquare,
  meeting_note: StickyNote,
}

export function RelatedItemsSidebar({ items, className }: RelatedItemsSidebarProps) {
  if (items.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-base">Related items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Linked drawings, tasks, meeting notes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            No related items linked.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">Related items</CardTitle>
        <p className="text-sm text-muted-foreground">
          Linked drawings, tasks, meeting notes.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = iconByType[item.type] ?? FileImage
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm transition-colors',
                    'hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
