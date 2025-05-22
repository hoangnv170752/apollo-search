"use client"

import type React from "react"

import { ApoloLogo } from "@/components/apolo-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Redirect to search page with the query
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        className="absolute inset-0 bg-[url('/circular-library.jpeg')] bg-cover bg-center bg-no-repeat"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      ></div>
      <div className="relative flex flex-1 items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col items-center justify-center">
              <ApoloLogo size="lg" />
              <p className="mt-4 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-center text-lg text-white font-medium">
                AI-powered academic search engine for scholarly research
              </p>
            </div>

            <div className="rounded-lg bg-background/90 p-6 shadow-lg backdrop-blur border border-border">
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your research query..."
                    className="h-14 pl-4 pr-12 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="absolute right-1 top-1 h-12 w-12 rounded-md bg-primary">
                    <Search className="h-6 w-6" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>

                <div className="text-center">
                  <Link href="/advanced" className="text-sm text-primary hover:underline">
                    Advanced Search Options
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
                To open science and knowledge for everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
