import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Notes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-primary">My Notes</h1>
          <p className="text-muted-foreground mt-2">Organize your research notes and insights</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>No Notes Yet</CardTitle>
            <CardDescription>Your research notes will appear here. Create a new note to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notes help you organize your thoughts and insights from your research papers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
