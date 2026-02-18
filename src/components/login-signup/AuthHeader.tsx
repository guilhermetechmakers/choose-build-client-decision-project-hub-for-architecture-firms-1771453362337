import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10 animate-fade-in">
      <div className="mx-auto flex h-14 max-w-content-wide items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 font-semibold text-primary transition-all duration-200',
            'hover:opacity-90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md'
          )}
          aria-label="Choose & Build – home"
        >
          <Building2 className="h-6 w-6 shrink-0" aria-hidden />
          <span>Choose & Build</span>
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
        >
          Back to home
        </Link>
      </div>
    </header>
  )
}
