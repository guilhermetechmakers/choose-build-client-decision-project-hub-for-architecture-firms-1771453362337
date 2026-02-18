import { Link } from 'react-router-dom'
import { Users, LayoutTemplate, CreditCard, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const adminLinks = [
  { to: '/admin/users', label: 'User Management', icon: Users, desc: 'Invite users and assign roles' },
  { to: '/admin/templates', label: 'Templates', icon: LayoutTemplate, desc: 'Firm-wide templates' },
  { to: '/dashboard/billing', label: 'Billing', icon: CreditCard, desc: 'Plan and invoices' },
  { to: '/admin/security', label: 'Security & audit', icon: Shield, desc: 'Audit logs and security settings' },
]

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-content-wide space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Firm-level controls: users, templates, billing, security.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {adminLinks.map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className="transition-all duration-200 hover:shadow-card-hover hover:border-primary/30">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage & metrics</CardTitle>
            <CardDescription>Adoption KPIs and usage metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Usage dashboard placeholder.</p>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
