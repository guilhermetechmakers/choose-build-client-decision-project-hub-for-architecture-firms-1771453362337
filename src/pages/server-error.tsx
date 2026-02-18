import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ServerError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We’re sorry. Please try again or contact support if the problem persists.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button variant="accent" asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/help">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
