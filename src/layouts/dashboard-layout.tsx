import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardTopbar } from '@/components/dashboard/Topbar'
import { LeftNavigation } from '@/components/dashboard/LeftNavigation'
import { useSession } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const SIDEBAR_COLLAPSED_KEY = 'choose-build-sidebar-collapsed'

export function DashboardLayout() {
  const { data: session, isLoading: sessionLoading } = useSession()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Skeleton className="h-screen w-56 shrink-0 rounded-none" />
        <div className="flex-1 flex flex-col p-6 gap-4">
          <Skeleton className="h-14 w-full max-w-content-wide" />
          <Skeleton className="flex-1 w-full max-w-content-wide" />
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login-/-signup" replace />
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-56'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          {!collapsed && (
            <Link to="/dashboard" className="font-semibold text-primary">
              Choose & Build
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex shrink-0"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <LeftNavigation collapsed={collapsed} />
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/dashboard" className="font-semibold text-primary">
          Choose & Build
        </Link>
        <div className="w-10" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card md:hidden animate-slide-in-right">
            <div className="flex h-14 items-center justify-end border-b border-border px-4">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <LeftNavigation compact className="p-4" />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar />
        <main className="flex-1 p-4 md:p-6 pt-4 max-w-content-wide w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
