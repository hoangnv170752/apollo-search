import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SavedPapers() {
  return (
    <>
      <div
        className="fixed inset-0 bg-[url('/circular-library.jpeg')] bg-cover bg-center bg-no-repeat"
        style={{
          zIndex: -1,
        }}
      ></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Saved Papers</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Access your saved research papers and citations
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
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
    </>
  )
}
