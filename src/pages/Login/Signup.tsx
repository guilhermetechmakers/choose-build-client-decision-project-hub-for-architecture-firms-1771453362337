import { Link, useNavigate } from 'react-router-dom'
import { AuthHeader } from '@/components/login-signup/AuthHeader'
import { AuthFooter } from '@/components/login-signup/AuthFooter'
import { LoginForm } from '@/components/login-signup/LoginForm'
import { SSOButtons } from '@/components/login-signup/SSOButtons'
import { SignupCTA } from '@/components/login-signup/SignupCTA'
import { ClientInviteFlowLink } from '@/components/login-signup/ClientInviteFlowLink'
import type { LoginFormValues } from '@/components/login-signup/LoginForm'
import type { FirmSignupFormValues } from '@/components/login-signup/SignupCTA'
import { useSignIn, useFirmSignup } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function LoginSignupPage() {
  const navigate = useNavigate()
  const signIn = useSignIn()
  const firmSignup = useFirmSignup()

  const handleLoginSubmit = (data: LoginFormValues) => {
    signIn.mutate(
      {
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      },
      {
        onSuccess: (res) => {
          if (res?.session?.user?.id) {
            navigate('/dashboard', { replace: true })
          }
        },
      }
    )
  }

  const handleFirmSignupSubmit = (data: FirmSignupFormValues) => {
    firmSignup.mutate(
      {
        company_name: data.companyName,
        admin_email: data.adminEmail,
        admin_name: data.adminName,
      },
      {
        onSuccess: () => {
          navigate(
            `/signup?company=${encodeURIComponent(data.companyName)}&email=${encodeURIComponent(data.adminEmail)}&name=${encodeURIComponent(data.adminName)}`,
            { replace: true }
          )
        },
      }
    )
  }

  const handleInviteTokenSubmit = (token: string) => {
    navigate(`/signup?invite=${encodeURIComponent(token)}`, { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader />
      <main
        className={cn(
          'flex-1 flex flex-col items-center justify-center p-4 md:p-6',
          'animate-fade-in'
        )}
      >
        <div className="w-full max-w-content mx-auto grid gap-8 md:grid-cols-2 lg:max-w-5xl lg:gap-12">
          {/* Left: Login + SSO + Invite */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <section
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover"
              aria-labelledby="login-heading"
            >
              <h2 id="login-heading" className="text-xl font-semibold mb-1">
                Sign in
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your credentials or use SSO.
              </p>
              <LoginForm onSubmit={handleLoginSubmit} isLoading={signIn.isPending} />
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-2 text-xs text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <SSOButtons isLoading={signIn.isPending} />
            </section>
            <section
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              aria-label="Client invite"
            >
              <ClientInviteFlowLink onTokenSubmit={handleInviteTokenSubmit} />
            </section>
          </div>
          {/* Right: Firm sign-up CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <SignupCTA onSubmit={handleFirmSignupSubmit} isLoading={firmSignup.isPending} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <AuthFooter />
    </div>
  )
}
