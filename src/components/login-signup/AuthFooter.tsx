import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AuthFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'border-t border-border py-6 text-center text-sm text-muted-foreground animate-fade-in',
        className
      )}
      role="contentinfo"
    >
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Legal and support">
        <Link
          to="/terms"
          className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
        >
          Terms
        </Link>
        <Link
          to="/privacy"
          className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
        >
          Privacy
        </Link>
        <Link
          to="/help"
          className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-1"
        >
          Help
        </Link>
      </nav>
    </footer>
  )
}
