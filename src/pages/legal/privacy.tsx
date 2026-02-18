import { Link } from 'react-router-dom'

export function Privacy() {
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
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p>
          This privacy policy describes how Choose & Build collects, uses, and protects your information.
          We use your data to provide the service, improve the product, and comply with legal obligations.
        </p>
        <h2>Data we collect</h2>
        <p>Account information, project and decision data, usage metrics, and communications.</p>
        <h2>How we use it</h2>
        <p>To operate the platform, support you, and improve our services.</p>
        <h2>Contact</h2>
        <p>
          For privacy requests or questions, contact us via the <Link to="/help">Help</Link> page.
        </p>
        <p className="pt-8">
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </main>
    </div>
  )
}
