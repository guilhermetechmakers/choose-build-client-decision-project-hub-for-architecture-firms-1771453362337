import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const firmSignupSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  adminEmail: z.string().email('Enter a valid admin email'),
  adminName: z.string().min(1, 'Admin name is required'),
})

export type FirmSignupFormValues = z.infer<typeof firmSignupSchema>

export interface SignupCTAProps {
  onSubmit?: (data: FirmSignupFormValues) => void | Promise<void>
  isLoading?: boolean
  className?: string
}

export function SignupCTA({ onSubmit, isLoading = false, className }: SignupCTAProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirmSignupFormValues>({
    resolver: zodResolver(firmSignupSchema),
  })

  const navigate = useNavigate()
  const handleFormSubmit = (data: FirmSignupFormValues) => {
    if (onSubmit) {
      void onSubmit(data)
      return
    }
    const params = new URLSearchParams({
      company: data.companyName,
      email: data.adminEmail,
      name: data.adminName,
    })
    navigate(`/signup?${params.toString()}`)
  }

  return (
    <Card
      className={cn(
        'border-border shadow-card transition-all duration-200 hover:shadow-card-hover animate-fade-in-up',
        className
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Create a firm account</CardTitle>
        <CardDescription>
          Sign up with your company name and admin contact to start your free trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="signup-company">Company name</Label>
            <Input
              id="signup-company"
              placeholder="Acme Architecture"
              autoComplete="organization"
              aria-invalid={Boolean(errors.companyName)}
              className={cn(
                errors.companyName && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('companyName')}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive" role="alert">
                {errors.companyName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-admin-name">Admin name</Label>
            <Input
              id="signup-admin-name"
              placeholder="Jane Smith"
              autoComplete="name"
              aria-invalid={Boolean(errors.adminName)}
              className={cn(
                errors.adminName && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('adminName')}
            />
            {errors.adminName && (
              <p className="text-sm text-destructive" role="alert">
                {errors.adminName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-admin-email">Admin email</Label>
            <Input
              id="signup-admin-email"
              type="email"
              placeholder="admin@firm.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.adminEmail)}
              className={cn(
                errors.adminEmail && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('adminEmail')}
            />
            {errors.adminEmail && (
              <p className="text-sm text-destructive" role="alert">
                {errors.adminEmail.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="accent"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Start firm sign-up
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
