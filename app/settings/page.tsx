"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { ApiKeyCheck } from "@/components/api-key-check"
import { jsPDF } from "jspdf"
import { getSavedPapers, SavedPaper } from "@/lib/saved-papers"
import { formatAPACitation } from "@/lib/citation-formats"
import { toast } from "@/components/ui/use-toast"
import { Download, Check } from "lucide-react"

export default function Settings() {
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([])
  const [downloading, setDownloading] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSavedPapers(getSavedPapers())
    }
  }, [])
  
  const handleExportToPDF = () => {
    setDownloading(true)
    
    try {
      const doc = new jsPDF()
      const lineHeight = 10
      let y = 20
      
      // Add title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("Apollo Search - Saved Papers", 20, y)
      y += lineHeight * 2
      
      // Add date
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y)
      y += lineHeight * 2
      
      if (savedPapers.length === 0) {
        doc.text("No saved papers found.", 20, y)
      } else {
        // Add papers count
        doc.setFont("helvetica", "bold")
        doc.text(`Total Papers: ${savedPapers.length}`, 20, y)
        y += lineHeight * 2
        
        // Add each paper
        savedPapers.forEach((paper, index) => {
          // Reset font for each paper
          doc.setFont("helvetica", "normal")
          doc.setFontSize(12)
          
          // Check if we need a new page
          if (y > 260) {
            doc.addPage()
            y = 20
          }
          
          // Add paper number and title with proper text wrapping
          doc.setFont("helvetica", "bold")
          const title = `${index + 1}. ${paper.title}`
          const wrappedTitle = doc.splitTextToSize(title, 170)
          doc.text(wrappedTitle, 20, y)
          y += lineHeight * wrappedTitle.length
          
          // Add authors with proper text wrapping
          doc.setFont("helvetica", "normal")
          const authors = `Authors: ${paper.authors.join(', ')}`
          const wrappedAuthors = doc.splitTextToSize(authors, 170)
          doc.text(wrappedAuthors, 20, y)
          y += lineHeight * wrappedAuthors.length
          
          // Add year and journal with proper text wrapping
          const yearJournal = `Year: ${paper.year}${paper.journal ? ` | Journal: ${paper.journal}` : ''}`
          const wrappedYearJournal = doc.splitTextToSize(yearJournal, 170)
          doc.text(wrappedYearJournal, 20, y)
          y += lineHeight * wrappedYearJournal.length
          
          // Add DOI if available with proper text wrapping
          if (paper.doi) {
            const doi = `DOI: ${paper.doi}`
            const wrappedDoi = doc.splitTextToSize(doi, 170)
            doc.text(wrappedDoi, 20, y)
            y += lineHeight * wrappedDoi.length
          }
          
          // Add citation
          doc.setFont("helvetica", "italic")
          const citation = formatAPACitation(paper)
          
          // Split long citations into multiple lines
          const splitCitation = doc.splitTextToSize(citation, 170)
          doc.text(splitCitation, 20, y)
          y += lineHeight * (splitCitation.length + 1)
          
          // Add separator between papers
          if (index < savedPapers.length - 1) {
            doc.setDrawColor(200, 200, 200)
            doc.line(20, y - lineHeight / 2, 190, y - lineHeight / 2)
            y += lineHeight
          }
        })
      }
      
      // Save the PDF
      doc.save("apollo-search-saved-papers.pdf")
      
      toast({
        title: "PDF Downloaded Successfully",
        description: `${savedPapers.length} papers exported to PDF.`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error Downloading PDF",
        description: "There was a problem generating your PDF file.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
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
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">Settings</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <ThemeSwitch id="dark-mode" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Search Preferences</CardTitle>
              <CardDescription>Customize your search experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save Search History</Label>
                  <p className="text-sm text-muted-foreground">Keep a record of your previous searches</p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-cite">Auto-generate Citations</Label>
                  <p className="text-sm text-muted-foreground">Automatically format citations for saved papers</p>
                </div>
                <Switch id="auto-cite" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the application by sharing anonymous usage data
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <Label>Export Your Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download your saved papers and notes for backup or offline use
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleExportToPDF}
                    disabled={downloading || savedPapers.length === 0}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    {downloading ? (
                      <>
                        <Check className="h-4 w-4" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export Saved Papers (PDF)
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-1 w-full">
                    {savedPapers.length > 0 
                      ? `You have ${savedPapers.length} saved papers that will be included in the PDF.`
                      : "You don't have any saved papers yet."}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Button variant="destructive">Clear All Data</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will delete all your saved papers, notes, and search history
                </p>
              </div>
            </CardContent>
          </Card>

          <ApiKeyCheck />
        </div>
      </div>
    </>
  )
}
