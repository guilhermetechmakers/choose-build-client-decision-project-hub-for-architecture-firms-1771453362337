/**
 * Left navigation: Projects, Decisions, Messages, Files, Templates, Reports, Settings.
 * Collapsible sidebar nav with persistent state; used in dashboard layout (desktop + mobile drawer).
 */
import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Receipt,
  Settings,
  Users,
  ClipboardList,
  MessageSquare,
  FileStack,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const mainNavItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/decision-log', label: 'Decisions', icon: ClipboardList },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/files', label: 'Files', icon: FileStack },
  { to: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export const secondaryNavItems = [
  { to: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { to: '/dashboard/orders', label: 'Orders', icon: Receipt },
  { to: '/dashboard/users', label: 'Users', icon: Users },
]

export interface LeftNavigationProps {
  collapsed?: boolean
  className?: string
  /** When true, use compact layout (e.g. mobile drawer) */
  compact?: boolean
}

export function LeftNavigation({ collapsed = false, className, compact = false }: LeftNavigationProps) {
  return (
    <nav className={cn('flex flex-1 flex-col overflow-y-auto p-2 space-y-1', className)} aria-label="Main navigation">
      {!collapsed && (
        <div className="px-2 py-2">
          <Button variant="accent" size="sm" className="w-full gap-2 transition-transform duration-200 hover:scale-[1.02]" asChild>
            <Link to="/dashboard/projects/new">
              <Plus className="h-4 w-4" />
              New project
            </Link>
          </Button>
        </div>
      )}
      {mainNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              collapsed && !compact && 'justify-center px-2'
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" aria-hidden />
          {(!collapsed || compact) && <span>{item.label}</span>}
        </NavLink>
      ))}
      <div className="pt-4 border-t border-border">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                collapsed && !compact && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden />
            {(!collapsed || compact) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
