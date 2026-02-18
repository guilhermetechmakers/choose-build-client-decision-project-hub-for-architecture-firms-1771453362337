import { Link } from 'react-router-dom'

export function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-content-wide items-center px-4 md:px-6">
          <Link to="/" className="font-semibold text-primary">
            Choose & Build
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 prose prose-neutral dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p>
          By using Choose & Build you agree to these terms. The service is provided as-is. You are
          responsible for your use of the platform and the content you publish.
        </p>
        <p className="pt-8">
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
