import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SavedPapers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Saved Papers</h1>
        <p className="text-muted-foreground mt-2">Access your saved research papers and citations</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>No Saved Papers Yet</CardTitle>
            <CardDescription>
              Your saved papers will appear here. Search for papers and save them to access them later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              To save a paper, click the bookmark icon on any paper in your search results.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
