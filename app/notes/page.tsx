import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Notes() {
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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">My Notes</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Organize your research notes and insights
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>The notes feature is currently under development.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notes will help you organize your thoughts and insights from your research papers. This feature will be
                available in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
