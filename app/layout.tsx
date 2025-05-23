import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { VisitorCounterModal } from "@/components/visitor-counter-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Apollo Search | Academic Research Assistant",
  description: "AI-powered academic research assistant for finding scholarly papers",
  generator: "Akashi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 relative">{children}</main>
            <footer className="relative z-10 border-t py-4 text-center text-sm text-muted-foreground bg-background">
              <div className="flex items-center justify-center gap-4">
                <p className="inline-block px-3 py-1 rounded-md bg-primary/10 dark:bg-primary/20 text-primary font-medium">
                  Apollo Search © {new Date().getFullYear()} | To Open Science | By Akashi | v0.0.1
                </p>
                <VisitorCounterModal />
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
