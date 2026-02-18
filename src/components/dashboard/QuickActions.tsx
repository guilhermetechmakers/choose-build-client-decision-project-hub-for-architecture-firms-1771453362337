import { Link } from 'react-router-dom'
import { FileCheck, Calendar, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function QuickActions() {
  const actions = [
    {
      label: 'Publish decision',
      description: 'Share a decision for client sign-off',
      icon: FileCheck,
      to: '/dashboard/decision-log',
      variant: 'accent' as const,
    },
    {
      label: 'Create meeting',
      description: 'Schedule and send invites',
      icon: Calendar,
      to: '/dashboard/projects',
      variant: 'outline' as const,
    },
    {
      label: 'Invite client',
      description: 'Add client to a project',
      icon: UserPlus,
      to: '/dashboard/users',
      variant: 'outline' as const,
    },
  ]

  return (
    <Card className="transition-shadow duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Publish decision, create meeting, invite client</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.to}
            variant={action.variant}
            size="sm"
            className="gap-2 transition-transform duration-200 hover:scale-[1.02]"
            asChild
          >
            <Link to={action.to}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
