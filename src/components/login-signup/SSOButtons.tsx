import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export interface SSOButtonsProps {
  onGoogle?: () => void
  onMicrosoft?: () => void
  onSAML?: () => void
  isLoading?: boolean
  className?: string
}

export function SSOButtons({
  onGoogle,
  onMicrosoft,
  onSAML,
  isLoading = false,
  className,
}: SSOButtonsProps) {
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null)
  const supabase = getSupabase()

  const handleGoogle = async () => {
    if (onGoogle) {
      onGoogle()
      return
    }
    if (supabase) {
      setSsoLoading('google')
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      setSsoLoading(null)
    } else {
      window.location.href = '/api/auth/google'
    }
  }

  const handleMicrosoft = async () => {
    if (onMicrosoft) {
      onMicrosoft()
      return
    }
    if (supabase) {
      setSsoLoading('microsoft')
      await supabase.auth.signInWithOAuth({ provider: 'azure' })
      setSsoLoading(null)
    } else {
      window.location.href = '/api/auth/microsoft'
    }
  }

  const handleSAML = () => {
    if (onSAML) onSAML()
    else window.location.href = '/api/auth/saml'
  }

  const busy = isLoading || ssoLoading !== null

  return (
    <div className={cn('space-y-2', className)} role="group" aria-label="Sign in with SSO">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-card"
          onClick={() => void handleGoogle()}
          disabled={busy}
          isLoading={ssoLoading === 'google'}
          aria-label="Sign in with Google"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-card"
          onClick={() => void handleMicrosoft()}
          disabled={busy}
          isLoading={ssoLoading === 'microsoft'}
          aria-label="Sign in with Microsoft"
        >
          Microsoft
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-card"
          onClick={handleSAML}
          disabled={busy}
          aria-label="Sign in with SAML (enterprise)"
        >
          SAML
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        SAML for enterprise SSO
      </p>
    </div>
  )
}
