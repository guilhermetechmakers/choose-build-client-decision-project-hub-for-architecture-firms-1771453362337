import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Button variant="accent" className="mt-6" asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
