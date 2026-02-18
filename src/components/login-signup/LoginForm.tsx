import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void | Promise<void>
  isLoading?: boolean
  className?: string
}

export function LoginForm({ onSubmit, isLoading = false, className }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@firm.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={cn(
            'transition-colors duration-200',
            errors.email && 'border-destructive focus-visible:ring-destructive'
          )}
          {...register('email')}
        />
        {errors.email && (
          <p id="login-email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className={cn(
            'transition-colors duration-200',
            errors.password && 'border-destructive focus-visible:ring-destructive'
          )}
          {...register('password')}
        />
        {errors.password && (
          <p id="login-password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Checkbox
                id="remember-me"
                checked={field.value ?? false}
                onCheckedChange={(checked: boolean | 'indeterminate') => field.onChange(checked === true)}
                aria-describedby="remember-label"
              />
              <span id="remember-label">Remember me</span>
            </label>
          )}
        />
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        variant="accent"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign in
      </Button>
    </form>
  )
}
