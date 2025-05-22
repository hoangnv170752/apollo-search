"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Copy, Check } from "lucide-react"

interface PaperResultsProps {
  results: {
    summary: string
    sources: Array<{
      title: string
      authors: string[]
      year: string
      journal?: string
      url?: string
      doi?: string
    }>
  }
}

export function PaperResults({ results }: PaperResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [savedPapers, setSavedPapers] = useState<number[]>([])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleSavePaper = (index: number) => {
    if (savedPapers.includes(index)) {
      setSavedPapers(savedPapers.filter((i) => i !== index))
    } else {
      setSavedPapers([...savedPapers, index])
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 dark:border-primary/30">
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
        <h2 className="text-xl font-semibold mb-4">Academic Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.sources.map((source, index) => (
            <Card key={index} className="paper-card border-primary/20 dark:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg line-clamp-2">{source.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSavePaper(index)}
                    className={savedPapers.includes(index) ? "text-primary" : ""}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Save paper</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm line-clamp-1">
                    <span className="font-medium">Authors:</span> {source.authors.join(", ")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Year:</span> {source.year}
                  </p>
                  {source.journal && (
                    <p className="text-sm line-clamp-1">
                      <span className="font-medium">Journal:</span> {source.journal}
                    </p>
                  )}
                  {source.doi && (
                    <p className="text-sm line-clamp-1">
                      <span className="font-medium">DOI:</span> {source.doi}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 justify-end">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
