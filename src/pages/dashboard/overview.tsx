import { FileCheck, FolderKanban, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardOverview } from '@/hooks/useDashboard'
import { ProjectsListWidget } from '@/components/dashboard/ProjectsListWidget'
import { PendingApprovalsWidget } from '@/components/dashboard/PendingApprovalsWidget'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { UpcomingMeetingsAndTasks } from '@/components/dashboard/UpcomingMeetingsAndTasks'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/ui/button'

const chartData = [
  { name: 'Mon', approvals: 4 },
  { name: 'Tue', approvals: 3 },
  { name: 'Wed', approvals: 6 },
  { name: 'Thu', approvals: 2 },
  { name: 'Fri', approvals: 5 },
  { name: 'Sat', approvals: 1 },
  { name: 'Sun', approvals: 2 },
]

export function DashboardOverview() {
  const { data, isLoading, isError, refetch } = useDashboardOverview()
  const projects = data?.projects ?? []
  const pendingApprovals = data?.pendingApprovals ?? []
  const activity = data?.activity ?? []
  const upcomingMeetings = data?.upcomingMeetings ?? []

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Project and workload overview.</p>
        </div>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
            <p className="text-center text-muted-foreground">Something went wrong loading the dashboard.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Project and workload overview: active projects, pending approvals, upcoming meetings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending approvals
            </CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Awaiting client sign-off
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all phases</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisions this week</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">From Decision Log</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow duration-200 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Approval trend</CardTitle>
              <CardDescription>Approvals completed per day</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="fillApprovals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="approvals"
                    stroke="rgb(var(--primary))"
                    fill="url(#fillApprovals)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <ActivityFeed events={activity} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PendingApprovalsWidget items={pendingApprovals} isLoading={isLoading} />
        <UpcomingMeetingsAndTasks meetings={upcomingMeetings} isLoading={isLoading} />
      </div>

      <ProjectsListWidget projects={projects} isLoading={isLoading} />
    </div>
  )
}
