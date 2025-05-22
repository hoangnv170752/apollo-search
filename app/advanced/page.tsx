import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export default function AdvancedSearch() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Advanced Search</h1>
        <p className="mt-2 text-muted-foreground">Refine your search with specific criteria</p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter paper title or keywords in title..."
                    className="border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Authors</Label>
                  <Input
                    id="authors"
                    placeholder="Enter author names (e.g., 'Smith, J., Johnson, A.')..."
                    className="border-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year-from">Year From</Label>
                    <Input
                      id="year-from"
                      type="number"
                      placeholder="Earliest year..."
                      min="1900"
                      max={new Date().getFullYear()}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year-to">Year To</Label>
                    <Input
                      id="year-to"
                      type="number"
                      placeholder="Latest year..."
                      min="1900"
                      max={new Date().getFullYear()}
                      className="border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal">Journal or Conference</Label>
                  <Input id="journal" placeholder="Enter journal or conference name..." className="border-primary/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input id="doi" placeholder="Enter DOI (e.g., 10.1000/xyz123)..." className="border-primary/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords separated by commas..."
                    className="border-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
                  <Search className="mr-2 h-4 w-4" />
                  Search Papers
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Use the form above to search for specific papers based on detailed criteria
          </p>
        </div>
      </div>
    </div>
  )
}
