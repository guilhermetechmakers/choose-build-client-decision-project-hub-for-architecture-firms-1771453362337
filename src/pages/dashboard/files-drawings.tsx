import { useParams } from 'react-router-dom'
import { FileStack, Folder, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FilesDrawings() {
  useParams<{ projectId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Files & Drawings</h1>
          <p className="text-muted-foreground">Manage project assets with versions and link to decisions.</p>
        </div>
        <Button variant="accent" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Folder browser</CardTitle>
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="h-5 w-5" />
                <span>Root</span>
              </div>
              <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
                <FileStack className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No files yet</p>
                <p className="text-sm text-muted-foreground">Upload drawings or documents. Link files to decisions from the preview.</p>
                <Button variant="outline" className="mt-4">Upload file</Button>
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
