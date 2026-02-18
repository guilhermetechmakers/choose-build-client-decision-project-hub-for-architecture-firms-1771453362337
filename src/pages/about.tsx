import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-content-wide items-center px-4 md:px-6">
          <Link to="/" className="font-semibold text-primary">
            Choose & Build
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12 md:px-6 text-center animate-fade-in">
        <h1 className="text-3xl font-bold">About Choose & Build</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          A centralized project management and client-decision platform for architecture firms.
          From kickoff to handover, we help you record every client choice and deliverable for
          auditability and smoother delivery.
        </p>
        <p className="mt-6">
          <Link to="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </p>
      </main>
    </div>
  )
}
