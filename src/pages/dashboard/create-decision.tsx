import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateDecision() {
  const { projectId } = useParams<{ projectId: string }>()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (_data: FormValues) => {
    // Publish decision placeholder
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/dashboard/projects/${projectId}/decisions`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create decision</h1>
          <p className="text-muted-foreground">Multi-step publisher: info, options, cost, recommendation, audience.</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Decision details</CardTitle>
              <CardDescription>Title and short description for the decision card.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Exterior cladding option"
                    className={cn(errors.title && 'border-destructive')}
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief context for the client"
                    {...register('description')}
                  />
                </div>
                <Button type="submit" variant="accent">Continue to options</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="options" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
              <CardDescription>Add comparison options with images or PDFs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop option images or PDFs</p>
                <Button variant="outline" className="mt-4">Upload options</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cost" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost impact</CardTitle>
              <CardDescription>Add cost deltas per option if applicable.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cost fields and recommendation selector go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="publish" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience & publish</CardTitle>
              <CardDescription>Set required approvers and schedule publish.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Audience selection and publish button. Creates immutable version and notifies recipients.</p>
              <Button variant="accent" className="mt-4">Publish decision</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
