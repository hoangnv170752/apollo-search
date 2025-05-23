"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Bookmark, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { SavedPaper, savePaper, isPaperSaved } from "@/lib/saved-papers"

interface OpenAlexAuthor {
  id: string
  orcid?: string
  display_name: string
  display_name_alternatives: string[]
  works_count: number
  cited_by_count: number
  summary_stats: {
    h_index: number
    i10_index: number
  }
  affiliations: Array<{
    institution: {
      id: string
      display_name: string
      country_code: string
      type: string
    }
    years: number[]
  }>
}

interface OpenAlexWork {
  id: string
  doi?: string
  title: string
  publication_year: number
  publication_date: string
  authorships: Array<{
    author: {
      id: string
      display_name: string
    }
  }>
  primary_location?: {
    source?: {
      display_name?: string
    }
  }
}

interface OpenAlexResponse<T> {
  meta: {
    count: number
    page: number
    per_page: number
  }
  results: T[]
}

export default function OpenAlexSearch() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "works" // Default to works if not specified
  
  const [results, setResults] = useState<OpenAlexAuthor[] | OpenAlexWork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOpenAlexData = async () => {
      if (!query) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://api.openalex.org/${type}?search=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error(`OpenAlex API error: ${response.status}`)
        }
        
        const data = await response.json() as OpenAlexResponse<any>
        setResults(data.results)
      } catch (err) {
        console.error("Error fetching OpenAlex data:", err)
        setError("Failed to fetch data from OpenAlex. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOpenAlexData()
  }, [query, type])

  const handleSavePaper = (work: OpenAlexWork) => {
    const paper: Omit<SavedPaper, 'savedAt'> = {
      title: work.title,
      authors: work.authorships.map(a => a.author.display_name),
      year: work.publication_year.toString(), // Convert number to string
      journal: work.primary_location?.source?.display_name || "",
      doi: work.doi,
      url: work.doi ? `https://doi.org/${work.doi.replace(/^doi:/, "")}` : undefined
    }

    const success = savePaper(paper)
    if (success) {
      toast({
        title: "Paper saved",
        description: "Paper has been added to your saved papers",
      })
    } else {
      toast({
        title: "Paper already saved",
        description: "This paper is already in your saved papers",
      })
    }
  }

  const renderAuthorResults = () => {
    const authors = results as OpenAlexAuthor[]
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {authors.map((author) => (
          <Card key={author.id} className="border-primary/20 transition-colors hover:bg-accent/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{author.display_name}</CardTitle>
              <CardDescription>
                {author.display_name_alternatives.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Also known as: {author.display_name_alternatives.slice(0, 3).join(", ")}
                    {author.display_name_alternatives.length > 3 && " and more..."}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p><span className="font-medium">Works:</span> {author.works_count}</p>
                  <p><span className="font-medium">Citations:</span> {author.cited_by_count}</p>
                </div>
                <div>
                  <p><span className="font-medium">h-index:</span> {author.summary_stats.h_index}</p>
                  <p><span className="font-medium">i10-index:</span> {author.summary_stats.i10_index}</p>
                </div>
              </div>
              
              {author.affiliations.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium">Affiliations:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {author.affiliations.slice(0, 3).map((affiliation, index) => (
                      <li key={index}>
                        {affiliation.institution.display_name} ({affiliation.institution.country_code})
                      </li>
                    ))}
                    {author.affiliations.length > 3 && <li>+ {author.affiliations.length - 3} more</li>}
                  </ul>
                </div>
              )}
              
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <a href={author.id} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <a 
                    href={`https://scholar.google.com/scholar?q=author:${encodeURIComponent(author.display_name)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Google Scholar
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderWorkResults = () => {
    const works = results as OpenAlexWork[]
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {works.map((work) => (
          <Card key={work.id} className="border-primary/20 transition-colors hover:bg-accent/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{work.title}</CardTitle>
              <CardDescription>
                {work.authorships.map(a => a.author.display_name).join(", ")} ({work.publication_year})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                {work.primary_location?.source?.display_name && (
                  <p><span className="font-medium">Journal:</span> {work.primary_location.source.display_name}</p>
                )}
                
                {work.doi && (
                  <p>
                    <span className="font-medium">DOI:</span>{" "}
                    <a
                      href={`https://doi.org/${work.doi.replace(/^doi:/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {work.doi}
                    </a>
                  </p>
                )}
              </div>
              
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSavePaper(work)}
                  disabled={work.doi ? isPaperSaved({
                    title: work.title,
                    authors: work.authorships.map(a => a.author.display_name)
                  }) : false}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {work.doi && isPaperSaved({
                    title: work.title,
                    authors: work.authorships.map(a => a.author.display_name)
                  }) ? "Saved" : "Save Paper"}
                </Button>
                
                {work.doi && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    asChild
                    className="bg-primary hover:bg-primary/90"
                  >
                    <a href={`https://doi.org/${work.doi.replace(/^doi:/, "")}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Paper
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
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
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">OpenAlex Results</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Searching {type === "authors" ? "authors" : "works"} for: {query}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="border-primary/20">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="pt-2 flex justify-end gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>No results found</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No {type === "authors" ? "authors" : "works"} found matching your search query.</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <p className="mb-4 text-sm font-medium inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white">
                Found {results.length} {type === "authors" ? "authors" : "works"} matching your search
              </p>
              {type === "authors" ? renderAuthorResults() : renderWorkResults()}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
