import { Users as UsersIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function Users() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Invite team members and manage roles.</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          Invite user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardContent className="pt-0">
            <Input placeholder="Search users..." className="max-w-sm mb-4" />
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <UsersIcon className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">No users yet</p>
              <p className="text-sm text-muted-foreground">Invite users and assign project roles (owner, PM, architect, client, contractor).</p>
              <Button variant="outline" className="mt-4">Invite user</Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
