import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface ClientInviteFlowLinkProps {
  onTokenSubmit?: (token: string) => void
  className?: string
}

export function ClientInviteFlowLink({ onTokenSubmit, className }: ClientInviteFlowLinkProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const inviteTokenFromUrl = searchParams.get('invite') ?? searchParams.get('token') ?? ''
  const [token, setToken] = useState(inviteTokenFromUrl)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = token.trim()
    if (value && onTokenSubmit) {
      onTokenSubmit(value)
    } else if (value) {
      navigate(`/signup?invite=${encodeURIComponent(value)}`)
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm font-medium text-foreground">Have an invite?</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Label htmlFor="invite-token" className="sr-only">
          Invite token or link
        </Label>
        <Input
          id="invite-token"
          type="text"
          placeholder="Paste invite token or link"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
          className="transition-colors duration-200"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="secondary" size="sm">
            Use invite
          </Button>
          <Link
            to="/signup"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Or sign up with email
          </Link>
        </div>
      </form>
    </div>
  )
}
