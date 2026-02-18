import { Link } from 'react-router-dom'
import { Book, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Help() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-content-wide items-center justify-between px-4 md:px-6">
          <Link to="/" className="font-semibold text-primary">
            Choose & Build
          </Link>
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 py-12 md:px-6 space-y-12 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="mt-2 text-muted-foreground">
            FAQs, guides, walkthroughs, and contact.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Guides & FAQs</CardTitle>
              <CardDescription>Onboarding guides and common questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                How to create a project, publish a decision, and invite clients. Release notes and documentation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <CardTitle>Contact support</CardTitle>
              <CardDescription>Create a support ticket with logs or artifacts.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input id="message" placeholder="Describe your issue" className="min-h-[80px]" />
                </div>
                <Button variant="accent">Send</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </div>
      </main>
    </div>
  )
}
