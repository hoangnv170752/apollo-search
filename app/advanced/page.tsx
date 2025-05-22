"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useState } from "react"
import { searchPapers } from "@/lib/perplexity"
import { SearchResults } from "@/components/search-results"
import { LoadingState } from "@/components/loading-state"

export default function AdvancedSearch() {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    yearFrom: "",
    yearTo: "",
    journal: "",
    doi: "",
    keywords: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [errorDetails, setErrorDetails] = useState("")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id === "year-from" ? "yearFrom" : id === "year-to" ? "yearTo" : id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Build a query string from the form fields
    const queryParts = []
    
    if (formData.title) queryParts.push(`title:"${formData.title}"`)
    if (formData.authors) queryParts.push(`author:"${formData.authors}"`)
    if (formData.journal) queryParts.push(`journal:"${formData.journal}"`)
    if (formData.doi) queryParts.push(`doi:"${formData.doi}"`)
    if (formData.keywords) {
      const keywordsList = formData.keywords.split(",").map(k => k.trim())
      keywordsList.forEach(keyword => {
        if (keyword) queryParts.push(`"${keyword}"`)
      })
    }
    
    // Add year range if specified
    if (formData.yearFrom || formData.yearTo) {
      const yearFrom = formData.yearFrom || "1900"
      const yearTo = formData.yearTo || new Date().getFullYear().toString()
      queryParts.push(`year:${yearFrom}-${yearTo}`)
    }
    
    // If no specific fields were filled, use keywords as generic search
    if (queryParts.length === 0 && formData.keywords) {
      queryParts.push(formData.keywords)
    }
    
    // Combine all parts into a query string
    const query = queryParts.join(" AND ")
    
    if (!query) {
      setError("Please enter at least one search term")
      return
    }
    
    setIsLoading(true)
    setError("")
    setErrorDetails("")
    setResults(null)
    
    try {
      console.log("Performing advanced search for:", query)
      const searchResults = await searchPapers(query)
      console.log("Received advanced search results:", searchResults)
      setResults(searchResults)
    } catch (err: unknown) {
      console.error("Advanced search error:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while searching. Please try again."
      setError(errorMessage)
      
      // Safely check for details property on error object
      if (err && typeof err === 'object' && 'details' in err) {
        setErrorDetails(String(err.details))
      }
    } finally {
      setIsLoading(false)
    }
  }
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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Advanced Search</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Refine your search with specific criteria
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Paper Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter paper title or keywords in title..."
                      className="border-primary/20"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authors">Authors</Label>
                    <Input
                      id="authors"
                      placeholder="Enter author names (e.g., 'Smith, J., Johnson, A.')..."
                      className="border-primary/20"
                      value={formData.authors}
                      onChange={handleChange}
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
                        value={formData.yearFrom}
                        onChange={handleChange}
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
                        value={formData.yearTo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="journal">Journal or Conference</Label>
                    <Input
                      id="journal"
                      placeholder="Enter journal or conference name..."
                      className="border-primary/20"
                      value={formData.journal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doi">DOI</Label>
                    <Input 
                      id="doi" 
                      placeholder="Enter DOI (e.g., 10.1000/xyz123)..." 
                      className="border-primary/20" 
                      value={formData.doi}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas..."
                      className="border-primary/20"
                      value={formData.keywords}
                      onChange={handleChange}
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

          {isLoading && (
            <div className="mt-6">
              <LoadingState />
            </div>
          )}

          {!isLoading && !results && !error && (
            <div className="mt-6 text-center">
              <p className="inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
                Use the form above to search for specific papers based on detailed criteria
              </p>
            </div>
          )}

          {results && !isLoading && (
            <div className="mt-6">
              <SearchResults results={results} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
