import { Link } from 'react-router-dom'
import { Search, Bell, Plus, User, FileCheck, Calendar, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function DashboardTopbar() {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4 md:px-6',
        'transition-shadow duration-200'
      )}
    >
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            placeholder="Search projects, decisions…"
            className="h-9 pl-9 bg-muted/50 focus-visible:ring-2"
            aria-label="Search"
          />
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full transition-transform hover:scale-105"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="accent"
              size="icon"
              className="h-9 w-9 rounded-full shadow transition-transform hover:scale-105"
              aria-label="Quick create"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link to="/dashboard/projects/new" className="flex cursor-pointer items-center gap-2">
                <FileCheck className="h-4 w-4" />
                New project
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/decision-log" className="flex cursor-pointer items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Publish decision
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/projects" className="flex cursor-pointer items-center gap-2">
                <Calendar className="h-4 w-4" />
                Create meeting
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/users" className="flex cursor-pointer items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite client
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border border-border transition-transform hover:scale-105"
          aria-label="User menu"
          asChild
        >
          <Link to="/dashboard/settings">
            <User className="h-5 w-5 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
