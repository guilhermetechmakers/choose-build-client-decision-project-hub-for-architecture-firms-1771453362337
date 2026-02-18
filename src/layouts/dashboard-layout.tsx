import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Receipt,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_COLLAPSED_KEY = 'choose-build-sidebar-collapsed'

const mainNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/decision-log', label: 'Decision Log', icon: ClipboardList },
  { to: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
]

const secondaryNav = [
  { to: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { to: '/dashboard/orders', label: 'Orders', icon: Receipt },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardLayout() {
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
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {!collapsed && (
            <div className="px-2 py-2">
              <Button variant="accent" size="sm" className="w-full gap-2" asChild>
                <Link to="/dashboard/projects/new">
                  <Plus className="h-4 w-4" />
                  New project
                </Link>
              </Button>
            </div>
          )}
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-border">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <Users className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Users</span>}
          </NavLink>
        </nav>
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
            <nav className="p-4 space-y-1">
              <Button variant="accent" size="sm" className="w-full gap-2 mb-4" asChild>
                <Link to="/dashboard/projects/new">
                  <Plus className="h-4 w-4" />
                  New project
                </Link>
              </Button>
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
              {secondaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )
                }
              >
                <Users className="h-5 w-5 shrink-0" />
                Users
              </NavLink>
            </nav>
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 pt-14 md:pt-6 max-w-content-wide w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
