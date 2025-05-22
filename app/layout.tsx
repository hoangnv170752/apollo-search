import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { CounterScripts } from "@/components/counter-scripts"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Apolo Search | Academic Research Assistant",
  description: "AI-powered academic research assistant for finding scholarly papers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 relative">{children}</main>
            <footer className="relative z-10 border-t py-4 text-center text-sm text-muted-foreground bg-background">
              <p className="mb-2">Apollo Search © {new Date().getFullYear()} | To Open Science</p>
              <div className="flex items-center justify-center">
                <div id="free-counter-display" className="inline-block"></div>
                <a
                  href="https://www.free-counters.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline ml-2"
                >
                  powered by Free-Counters
                </a>
              </div>
              <CounterScripts />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
