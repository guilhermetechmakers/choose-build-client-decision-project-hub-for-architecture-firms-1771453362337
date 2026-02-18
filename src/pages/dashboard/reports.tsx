import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const reportData = [
  { name: 'Pending approvals', value: 3 },
  { name: 'Approved this week', value: 8 },
  { name: 'Avg. turnaround (days)', value: 2.4 },
  { name: 'Decisions published', value: 12 },
]

const trendData = [
  { month: 'Jan', approvals: 18 },
  { month: 'Feb', approvals: 22 },
  { month: 'Mar', approvals: 19 },
  { month: 'Apr', approvals: 25 },
]

export function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Project health, approval SLAs, and exportable reports.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportData.map((item) => (
          <Card key={item.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{typeof item.value === 'number' && item.value % 1 !== 0 ? item.value.toFixed(1) : item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval trend</CardTitle>
          <CardContent className="pt-0">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="approvals" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
