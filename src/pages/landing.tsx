import { Link } from 'react-router-dom'
import { ArrowRight, Check, FileCheck, MessageSquare, Calendar, BarChart3, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-content-wide items-center justify-between px-4 md:px-6">
          <Link to="/" className="font-semibold text-primary">
            Choose & Build
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help
            </Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link to="/login-signup" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in or sign up
            </Link>
            <Button variant="accent" asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--primary)/0.15),transparent)]" />
          <div className="relative mx-auto max-w-content-wide px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                One source of truth for{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  client decisions
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Run projects from kickoff to handover. Publish decision cards, capture approvals,
                and keep every choice auditable—so scope creep and &quot;I never approved that&quot; disappear.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button variant="accent" size="lg" className="gap-2" asChild>
                  <Link to="/signup">
                    Start free trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/help">See how it works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento-style */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-content-wide px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">
              Built for architecture firms
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Decision-first workflows, contextual messaging, and legal-grade audit trails.
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover md:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Decision Log & approval</h3>
                <p className="mt-2 text-muted-foreground">
                  Publish comparison cards with options, cost deltas, and recommendations. Clients
                  approve or request changes in one place—every version timestamped for audit.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Contextual messaging</h3>
                <p className="mt-2 text-muted-foreground">
                  Threads tied to decisions, files, and tasks. No more scattered email chains.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Timeline & phases</h3>
                <p className="mt-2 text-muted-foreground">
                  Phases and decision checkpoints as the single source of truth for project state.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover md:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Reports & handover</h3>
                <p className="mt-2 text-muted-foreground">
                  Pending approvals, turnaround metrics, and exportable handover packages with
                  versions and audit metadata.
                </p>
              </div>
              <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Audit-ready</h3>
                <p className="mt-2 text-muted-foreground">
                  Immutable versions, timestamped approvals, and optional e-sign for legal clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-content-wide px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              From kickoff to handover in one platform.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: 1, title: 'Create & publish decisions', desc: 'Add options, visuals, cost impact, and recommendations. Set audience and publish.' },
                { step: 2, title: 'Clients decide in one place', desc: 'Clients review, approve, or request changes. Optional e-sign. All timestamped.' },
                { step: 3, title: 'Audit trail & handover', desc: 'Every version and approval is recorded. Export handover packages when you\'re done.' },
              ].map((item) => (
                <div key={item.step} className="text-center animate-fade-in-up" style={{ animationDelay: `${item.step * 100}ms` }}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-content-wide px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Simple pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Scale with your firm. No hidden fees.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { name: 'Starter', price: 'Free', desc: '1 project, 2 users', features: ['Decision log', 'Basic messaging', '3 GB storage'], cta: 'Get started', highlighted: false },
                { name: 'Professional', price: '$49', period: '/mo', desc: 'Per active project', features: ['Unlimited decisions', 'Contextual threads', 'Templates', 'Reports', '20 GB storage'], cta: 'Start trial', highlighted: true },
                { name: 'Enterprise', price: 'Custom', desc: 'Unlimited projects', features: ['SSO / SAML', 'E-sign integration', 'Dedicated support', 'Custom handover'], cta: 'Contact sales', highlighted: false },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    'rounded-xl border p-6 transition-all duration-200',
                    plan.highlighted
                      ? 'border-primary bg-primary/5 shadow-card-hover scale-[1.02]'
                      : 'border-border bg-card shadow-card hover:shadow-card-hover'
                  )}
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-base font-normal text-muted-foreground">{plan.period}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? 'accent' : 'outline'}
                    className="mt-6 w-full"
                    asChild
                  >
                    <Link to={plan.name === 'Enterprise' ? '/help' : '/signup'}>{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary/5 py-16 md:py-24">
          <div className="mx-auto max-w-content-wide px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to reduce scope creep and approval delays?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join architecture firms that use Choose & Build as their single source of truth for client decisions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/help">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-content-wide px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© Choose & Build. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
