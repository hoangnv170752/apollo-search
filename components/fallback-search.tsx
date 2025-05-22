"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ExternalLink } from "lucide-react"

export function FallbackSearch({ query }: { query: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchUrl, setSearchUrl] = useState("")

  const searchGoogle = () => {
    setIsLoading(true)
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
    setSearchUrl(url)
    window.open(url, "_blank")
    setIsLoading(false)
  }

  const searchSemanticScholar = () => {
    setIsLoading(true)
    const url = `https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`
    setSearchUrl(url)
    window.open(url, "_blank")
    setIsLoading(false)
  }

  const searchArxiv = () => {
    setIsLoading(true)
    const url = `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`
    setSearchUrl(url)
    window.open(url, "_blank")
    setIsLoading(false)
  }

  return (
    <Card className="border-primary/20 bg-accent/50">
      <CardHeader>
        <CardTitle>Alternative Search Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Our AI search service is currently experiencing issues. You can try searching these academic sources directly:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button onClick={searchGoogle} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <LoadingSpinner className="mr-2" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            Google Scholar
          </Button>

          <Button onClick={searchSemanticScholar} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <LoadingSpinner className="mr-2" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            Semantic Scholar
          </Button>

          <Button onClick={searchArxiv} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <LoadingSpinner className="mr-2" /> : <ExternalLink className="mr-2 h-4 w-4" />}
            arXiv
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium mb-2">Your search query:</p>
          <Textarea value={query} readOnly className="min-h-[80px] border-primary/20 focus-visible:ring-primary" />
          <p className="text-xs text-muted-foreground mt-2">
            You can copy this query and paste it into any of the search engines above.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
