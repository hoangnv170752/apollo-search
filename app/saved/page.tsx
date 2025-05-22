"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { getSavedPapers, removePaper, SavedPaper } from "@/lib/saved-papers"
import { formatAPACitation } from "@/lib/citation-formats"
import { Bookmark, ExternalLink, Copy, Check, Trash2, ClipboardCopy, CheckSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function SavedPapers() {
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [selectedPapers, setSelectedPapers] = useState<number[]>([])
  const [bulkCopied, setBulkCopied] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSavedPapers(getSavedPapers())
    }
  }, [])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }
  
  const copySelectedCitations = () => {
    if (selectedPapers.length === 0) {
      toast({
        title: "No papers selected",
        description: "Please select at least one paper to copy citations",
      })
      return
    }
    
    const selectedCitations = selectedPapers
      .map(index => {
        const paper = savedPapers[index]
        return formatAPACitation(paper)
      })
      .join('\n\n')
    
    navigator.clipboard.writeText(selectedCitations)
    setBulkCopied(true)
    
    toast({
      title: `${selectedPapers.length} citation${selectedPapers.length > 1 ? 's' : ''} copied`,
      description: "Citations have been copied to your clipboard",
    })
    
    setTimeout(() => setBulkCopied(false), 2000)
  }
  
  const togglePaperSelection = (index: number) => {
    setSelectedPapers(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }
  
  const toggleSelectAll = () => {
    if (selectedPapers.length === savedPapers.length) {
      // Deselect all
      setSelectedPapers([])
    } else {
      // Select all
      setSelectedPapers(savedPapers.map((_, i) => i))
    }
  }
  
  const handleRemovePaper = (paper: SavedPaper, index: number) => {
    const success = removePaper(paper)
    if (success) {
      setSavedPapers(prev => prev.filter((_, i) => i !== index))
      toast({
        title: "Paper removed",
        description: "Paper has been removed from your saved papers",
      })
    }
  }
  
  const getDoiUrl = (doi: string | undefined) => {
    if (!doi) return "#"
    if (doi.startsWith("http")) return doi
    return `https://doi.org/${doi.replace(/^doi:/, "")}`
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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Saved Papers</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Access your saved research papers and citations
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {savedPapers.length > 0 && (
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectedPapers.length === savedPapers.length && savedPapers.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  {selectedPapers.length === savedPapers.length && savedPapers.length > 0 
                    ? "Deselect all" 
                    : "Select all"}
                </label>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={copySelectedCitations}
                disabled={selectedPapers.length === 0}
                className={selectedPapers.length > 0 ? "bg-primary/10" : ""}
              >
                {bulkCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied {selectedPapers.length} {selectedPapers.length === 1 ? "citation" : "citations"}
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    Copy {selectedPapers.length || "all"} selected citations
                  </>
                )}
              </Button>
            </div>
          )}
          
          {savedPapers.length === 0 ? (
            <Card className="border-primary/20 bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle>No Saved Papers Yet</CardTitle>
                <CardDescription>
                  Your saved papers will appear here. Search for papers and save them to access them later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  To save a paper, click the bookmark icon on any paper in your search results.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary drop-shadow-sm">Saved Papers ({savedPapers.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {savedPapers.map((paper, index) => (
                  <Card key={index} className="paper-card border-primary/20 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`paper-${index}`} 
                            checked={selectedPapers.includes(index)}
                            onCheckedChange={() => togglePaperSelection(index)}
                          />
                          <CardTitle className="text-lg">{paper.title}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePaper(paper, index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove paper</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <p className="text-sm">
                          <span className="font-medium">Authors:</span> {paper.authors.join(", ")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Year:</span> {paper.year}
                        </p>
                        {paper.journal && (
                          <p className="text-sm">
                            <span className="font-medium">Journal:</span> {paper.journal}
                          </p>
                        )}
                        {paper.doi && (
                          <p className="text-sm">
                            <span className="font-medium">DOI:</span>{" "}
                            <a
                              href={getDoiUrl(paper.doi)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {paper.doi}
                            </a>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Saved on: {format(new Date(paper.savedAt), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `${paper.title} by ${paper.authors.join(", ")} (${paper.year})${paper.journal ? ` in ${paper.journal}` : ""}${paper.doi ? ` DOI: ${paper.doi}` : ""}`,
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
                      {paper.url && (
                        <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                          <a href={paper.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Paper
                          </a>
                        </Button>
                      )}
                      {paper.doi && !paper.url && (
                        <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                          <a href={getDoiUrl(paper.doi)} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View via DOI
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
