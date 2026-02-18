import { Link } from 'react-router-dom'
import { Users as UsersIcon, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminUsers() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-content-wide space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Invite users, manage roles, and bulk actions.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <Button variant="accent" className="gap-2">
              <Plus className="h-4 w-4" />
              Invite user
            </Button>
          </CardHeader>
          <CardContent>
            <Input placeholder="Search users..." className="max-w-sm mb-4" />
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <UsersIcon className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">No users yet</p>
              <p className="text-sm text-muted-foreground">Invite form, user table, role definitions, bulk actions.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
