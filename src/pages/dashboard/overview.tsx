import { Link } from 'react-router-dom'
import { FileCheck, FolderKanban, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'

const mockProjects = [
  { id: '1', name: 'Riverside Residence', status: 'active' as const, pendingApprovals: 2, phase: 'DD' },
  { id: '2', name: 'Commerce Tower', status: 'active' as const, pendingApprovals: 0, phase: 'CA' },
  { id: '3', name: 'Park View Loft', status: 'active' as const, pendingApprovals: 1, phase: 'Schematic' },
]

const mockActivity = [
  { action: 'Approval received', project: 'Riverside Residence', time: '2 hours ago' },
  { action: 'Decision published', project: 'Park View Loft', time: '5 hours ago' },
  { action: 'New comment', project: 'Commerce Tower', time: '1 day ago' },
]

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
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your projects and pending approvals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending approvals
            </CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Same as last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Across all phases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisions this week</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">8 approved, 4 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Button variant="ghost" size="sm">View all</Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockActivity.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-muted-foreground">{item.project}</p>
                  </div>
                  <span className="text-muted-foreground shrink-0">{item.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Active projects and pending approvals</CardDescription>
          </div>
          <Button variant="accent" asChild>
            <Link to="/dashboard/projects">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/projects/${project.id}`}
                className={cn(
                  'flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.phase} phase</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {project.pendingApprovals > 0 && (
                    <Badge variant="warning">{project.pendingApprovals} pending</Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
