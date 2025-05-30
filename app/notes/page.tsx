"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, BookmarkIcon, ExternalLink, Search } from "lucide-react"
import { getSavedPapers, SavedPaper } from "@/lib/saved-papers"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type AbstractResponse = {
  abstract: string
  keywords: string[]
  renamedTitle?: string
  error?: string
}

type SimilarPaper = {
  title: string;
  authors: string[];
  year: string;
  journal?: string;
  url?: string;
  doi?: string;
}

export default function Notes() {
  const [title, setTitle] = useState<string>("");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [abstractResult, setAbstractResult] = useState<AbstractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [similarPapers, setSimilarPapers] = useState<SimilarPaper[]>([]);
  const [isSearchingSimilar, setIsSearchingSimilar] = useState<boolean>(false);
  const [similarPapersError, setSimilarPapersError] = useState<string | null>(null);
  
  // Load saved papers from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSavedPapers(getSavedPapers());
    }
  }, []);

  const handlePaperSelection = (paperIndex: number) => {
    setSelectedPapers(prev => {
      const indexStr = paperIndex.toString();
      if (prev.includes(indexStr)) {
        return prev.filter(id => id !== indexStr);
      } else {
        return [...prev, indexStr];
      }
    });
  };
  
  const searchSimilarPapers = async (searchTitle: string) => {
    if (!searchTitle) return;
    
    setIsSearchingSimilar(true);
    setSimilarPapersError(null);
    setSimilarPapers([]);
    setModalOpen(true);
    
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `Find academic papers similar to: "${searchTitle}"`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search for similar papers");
      }

      if (data.sources && Array.isArray(data.sources)) {
        setSimilarPapers(data.sources.map((source: any) => ({
          title: source.title || "Unknown Title",
          authors: source.authors || [],
          year: source.year || "Unknown Year",
          journal: source.journal || undefined,
          url: source.url || undefined,
          doi: source.doi || undefined
        })));
      } else {
        setSimilarPapers([]);
      }
    } catch (err) {
      setSimilarPapersError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSearchingSimilar(false);
    }
  };

  const generateAbstract = async () => {
    if (!title.trim()) {
      setError("Please enter a research title");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAbstractResult(null);

    try {
      // Get the full paper objects for selected paper indices
      const papersToSend = selectedPapers.map(indexStr => {
        const index = parseInt(indexStr, 10);
        return savedPapers[index];
      }).filter(paper => paper !== undefined);

      const response = await fetch("/api/notes/abstract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          savedPapers: papersToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate abstract");
      }

      setAbstractResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Research Notes</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Generate abstracts from your research titles and saved papers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="md:col-span-1">
            <Card className="border-primary/20 bg-background/95 backdrop-blur h-full">
              <CardHeader>
                <CardTitle>Saved Papers</CardTitle>
                <CardDescription>Select papers to include in your abstract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {savedPapers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">No saved papers found</p>
                    <Link href="/saved" className="text-sm text-primary hover:underline flex items-center justify-center">
                      <BookmarkIcon className="h-4 w-4 mr-1" /> Go to Saved Papers
                    </Link>
                  </div>
                ) : (
                  savedPapers.map((paper, index) => (
                    <div key={index} className="flex items-start space-x-2 pb-3 border-b border-border/50">
                      <Checkbox 
                        id={`paper-${index}`} 
                        checked={selectedPapers.includes(index.toString())}
                        onCheckedChange={() => handlePaperSelection(index)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={`paper-${index}`}
                          className="font-medium cursor-pointer"
                        >
                          {paper.title}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {paper.authors.join(", ")} ({paper.year})
                        </p>
                        {paper.journal && (
                          <p className="text-xs italic">{paper.journal}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="border-primary/20 bg-background/95 backdrop-blur mb-6">
              <CardHeader>
                <CardTitle>Generate Abstract</CardTitle>
                <CardDescription>Enter your research title and generate an abstract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Research Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter the title of your research paper"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={generateAbstract} 
                    disabled={isGenerating || !title.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Abstract"
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {abstractResult && (
              <Card className="border-primary/20 bg-background/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Generated Abstract</CardTitle>
                  <CardDescription>Based on your research title and selected papers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {abstractResult.renamedTitle && (
                    <div className="space-y-2">
                      <Label>Suggested Research Title</Label>
                      <div 
                        className="p-3 bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20 transition-colors group"
                        onClick={() => searchSimilarPapers(abstractResult.renamedTitle || '')}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-primary">{abstractResult.renamedTitle}</p>
                          <div className="text-primary/70 group-hover:text-primary">
                            <Search className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Click to find similar papers</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Abstract</Label>
                    <Textarea 
                      value={abstractResult.abstract} 
                      readOnly 
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <div className="flex flex-wrap gap-2">
                      {abstractResult.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    {abstractResult.renamedTitle && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(abstractResult.renamedTitle || '');
                        }}
                      >
                        Copy Title
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(abstractResult.abstract);
                      }}
                    >
                      Copy Abstract
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        let text = abstractResult.abstract;
                        if (abstractResult.renamedTitle) {
                          text = `${abstractResult.renamedTitle}\n\n${text}`;
                        }
                        text += `\n\nKeywords: ${abstractResult.keywords.join(', ')}`;
                        navigator.clipboard.writeText(text);
                      }}
                    >
                      Copy All
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal for similar papers */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Similar Research Papers</DialogTitle>
            <DialogDescription>
              Papers similar to the suggested research title
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-grow py-4">
            {isSearchingSimilar ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Searching for similar papers...</p>
              </div>
            ) : similarPapersError ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                <p>{similarPapersError}</p>
              </div>
            ) : similarPapers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No similar papers found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {similarPapers.map((paper, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{paper.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Authors:</span> {paper.authors.join(", ")}
                        </p>
                        {paper.year && (
                          <p>
                            <span className="font-medium">Year:</span> {paper.year}
                          </p>
                        )}
                        {paper.journal && (
                          <p>
                            <span className="font-medium">Journal:</span> {paper.journal}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="py-2 flex justify-end space-x-2">
                      {paper.doi && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi.replace(/^doi:/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View DOI
                          </a>
                        </Button>
                      )}
                      {paper.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View Paper
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
