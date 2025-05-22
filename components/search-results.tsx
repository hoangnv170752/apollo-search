"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Copy, Check, Filter, Download } from "lucide-react"
import { savePaper, removePaper, isPaperSaved } from "@/lib/saved-papers"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Paper {
  title: string
  authors: string[]
  year: string
  journal?: string
  url?: string
  doi?: string
}

interface SearchResultsProps {
  results: {
    summary: string
    sources: Paper[]
  }
}

export function SearchResults({ results }: SearchResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [savedPaperIndices, setSavedPaperIndices] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<"relevance" | "year" | "title">("relevance")
  const { toast } = useToast()
  
  // Check which papers are already saved on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialSavedIndices = results.sources.map((source, index) => {
        return isPaperSaved(source) ? index : -1
      }).filter(index => index !== -1)
      
      setSavedPaperIndices(initialSavedIndices)
    }
  }, [results.sources])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleSavePaper = (index: number) => {
    const source = results.sources[index]
    
    if (savedPaperIndices.includes(index)) {
      // Remove paper from saved papers
      const success = removePaper(source)
      if (success) {
        setSavedPaperIndices(savedPaperIndices.filter((i) => i !== index))
        toast({
          title: "Paper removed",
          description: "Paper has been removed from your saved papers",
        })
      }
    } else {
      // Add paper to saved papers
      const success = savePaper(source)
      if (success) {
        setSavedPaperIndices([...savedPaperIndices, index])
        toast({
          title: "Paper saved",
          description: "Paper has been saved to your collection",
        })
      }
    }
  }

  const sortedSources = [...results.sources].sort((a, b) => {
    if (sortBy === "year") {
      return Number.parseInt(b.year) - Number.parseInt(a.year)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    return 0 // Default is relevance, which is the original order
  })

  const getDoiUrl = (doi: string) => {
    if (doi.startsWith("http")) return doi
    return `https://doi.org/${doi.replace(/^doi:/, "")}`
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Research Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>{results.summary}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(results.summary, -1)}>
            {copiedIndex === -1 ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Summary
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Academic Sources ({results.sources.length})</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("relevance")}>Relevance</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("year")}>Year (newest first)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>Title (A-Z)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {sortedSources.map((source, index) => (
            <Card key={index} className="paper-card border-primary/20 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{source.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSavePaper(index)}
                    className={savedPaperIndices.includes(index) ? "text-primary" : ""}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Save paper</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Authors:</span> {source.authors.join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      {source.year}
                    </Badge>
                    {source.journal && (
                      <Badge variant="outline" className="bg-primary/5">
                        {source.journal}
                      </Badge>
                    )}
                  </div>
                  {source.doi && (
                    <p className="text-sm">
                      <span className="font-medium">DOI:</span>{" "}
                      <a
                        href={getDoiUrl(source.doi)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {source.doi}
                      </a>
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `${source.title} by ${source.authors.join(", ")} (${source.year})${source.journal ? ` in ${source.journal}` : ""}${source.doi ? ` DOI: ${source.doi}` : ""}`,
                      index,
                    )
                  }
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Citation
                    </>
                  )}
                </Button>
                {source.url && (
                  <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Paper
                    </a>
                  </Button>
                )}
                {source.doi && !source.url && (
                  <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                    <a href={getDoiUrl(source.doi)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View via DOI
                    </a>
                  </Button>
                )}
                {(source.url || source.doi) && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={source.url || (source.doi ? getDoiUrl(source.doi) : '#')} target="_blank" rel="noopener noreferrer" download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
