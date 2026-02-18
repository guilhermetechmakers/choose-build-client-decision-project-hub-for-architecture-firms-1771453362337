import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function VerifyEmail() {
  return (
    <Card className="border-border shadow-card animate-fade-in-up">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email. Click the link to confirm your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or request a new link below.
        </div>
        <Button variant="outline" className="w-full" disabled>
          Resend verification email
        </Button>
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>After verifying, you can sign in and access your dashboard.</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
