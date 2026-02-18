import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SSOButtons } from '@/components/login-signup/SSOButtons'
import { useSignUp } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export function Signup() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const inviteToken = searchParams.get('invite') ?? searchParams.get('token') ?? ''
  const signUp = useSignUp()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: searchParams.get('name') ?? '',
      email: searchParams.get('email') ?? '',
    },
  })

  useEffect(() => {
    const name = searchParams.get('name')
    const email = searchParams.get('email') ?? searchParams.get('company')
    if (name) setValue('name', name)
    if (email) setValue('email', email)
  }, [searchParams, setValue])

  const onSubmit = (data: FormValues) => {
    signUp.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        invite_token: inviteToken || undefined,
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

  return (
    <Card className="border-border shadow-card animate-fade-in-up">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              autoComplete="name"
              className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@firm.com"
              autoComplete="email"
              className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="accent"
            className="w-full"
            isLoading={signUp.isPending}
            disabled={signUp.isPending}
          >
            Sign up
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
        </div>
        <SSOButtons isLoading={signUp.isPending} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
          {' · '}
          <Link to="/login-signup" className="text-primary font-medium hover:underline">
            Login & signup
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
