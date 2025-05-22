"use client"

import { SearchForm } from "@/components/search-form"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { searchPapers } from "@/lib/perplexity"
import { SearchResults } from "@/components/search-results"
import { LoadingState } from "@/components/loading-state"
import { FallbackSearch } from "@/components/fallback-search"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [errorDetails, setErrorDetails] = useState("")
  const [apiFailure, setApiFailure] = useState(false)

  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        setIsLoading(true)
        setError("")
        setErrorDetails("")
        setResults(null)
        setApiFailure(false)

        try {
          console.log("Performing search for:", query)
          const searchResults = await searchPapers(query)
          console.log("Received search results:", searchResults)
          setResults(searchResults)
        } catch (err) {
          console.error("Search error:", err)

          // Check if this is an API failure or just a parsing error
          const errorMessage =
            err instanceof Error ? err.message : "An error occurred while searching. Please try again."
          setError(errorMessage)

          if (err.details) {
            setErrorDetails(err.details)
          }

          // If it seems like an API connection issue, set apiFailure to true
          if (
            errorMessage.includes("API") ||
            errorMessage.includes("network") ||
            errorMessage.includes("timeout") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("authentication")
          ) {
            setApiFailure(true)
          }
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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Search Papers</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Find academic papers and research for your thesis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchForm initialQuery={query} />

          {error && (
            <div className="mt-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Search Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {errorDetails && (
                    <details className="mt-2 text-xs">
                      <summary>Technical Details</summary>
                      <pre className="mt-2 whitespace-pre-wrap bg-destructive/10 p-2 rounded">{errorDetails}</pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isLoading && <LoadingState />}

          {apiFailure && !isLoading && (
            <div className="mt-6">
              <FallbackSearch query={query} />
            </div>
          )}

          {results && !isLoading && <SearchResults results={results} />}
        </div>
      </div>
    </>
  )
}
