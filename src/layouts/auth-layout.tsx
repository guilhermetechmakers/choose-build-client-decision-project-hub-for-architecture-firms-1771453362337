import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-content-wide items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            Choose & Build
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>
      <main
        className={cn(
          'flex-1 flex items-center justify-center p-4 md:p-6',
          'animate-fade-in'
        )}
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        {' · '}
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        {' · '}
        <Link to="/help" className="hover:text-foreground">Help</Link>
      </footer>
    </div>
  )
}
