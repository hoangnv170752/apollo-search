"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { searchPapers } from "@/lib/perplexity"
import { SearchResults } from "@/components/search-results"
import { LoadingSpinner } from "@/components/loading-spinner"
import { LoadingState } from "@/components/loading-state"
import Link from "next/link"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    setResults(null)

    try {
      const searchResults = await searchPapers(query)
      setResults(searchResults)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while searching. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-accent/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Search Academic Papers</h2>
              <p className="text-sm text-muted-foreground">
                Enter your research topic or question to find relevant academic papers
              </p>
            </div>

            <Textarea
              placeholder="Enter your research question or topic (e.g., 'What are the latest advancements in quantum computing for cryptography?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] border-primary/20 focus-visible:ring-primary"
            />

            <div className="flex items-center justify-between">
              <Link href="/advanced" className="text-sm text-primary hover:underline">
                Advanced Search Options
              </Link>
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Papers
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/30">{error}</div>
      )}

      {isLoading && <LoadingState />}

      {results && !isLoading && <SearchResults results={results} />}
    </div>
  )
}
