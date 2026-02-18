import { LayoutTemplate, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function Templates() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates Library</h1>
          <p className="text-muted-foreground">Reusable project and decision templates. Apply to new projects to speed setup.</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Plus className="h-4 w-4" />
          New template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardContent className="pt-0">
            <Input placeholder="Search templates..." className="max-w-sm mb-4" />
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <LayoutTemplate className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">No templates yet</p>
              <p className="text-sm text-muted-foreground">Create a template from an existing project or from scratch. Version and reuse.</p>
              <Button variant="outline" className="mt-4">Create template</Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
