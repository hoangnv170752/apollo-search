"use client"

import { SearchForm } from "@/components/search-form"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { searchPapers } from "@/lib/perplexity"
import { SearchResults } from "@/components/search-results"
import { LoadingState } from "@/components/loading-state"

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        setIsLoading(true)
        setError("")
        setResults(null)

        try {
          console.log("Performing search for:", query)
          const searchResults = await searchPapers(query)
          console.log("Received search results:", searchResults)
          setResults(searchResults)
        } catch (err) {
          console.error("Search error:", err)
          setError(err instanceof Error ? err.message : "An error occurred while searching. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }

      performSearch()
    }
  }, [query])

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
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Search Papers</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Find academic papers and research for your thesis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchForm initialQuery={query} />

          {error && (
            <div className="mt-6 bg-destructive/15 text-destructive p-4 rounded-md border border-destructive/30">
              {error}
            </div>
          )}

          {isLoading && <LoadingState />}

          {results && !isLoading && <SearchResults results={results} />}
        </div>
      </div>
    </>
  )
}
