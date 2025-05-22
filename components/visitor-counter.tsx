"use client"

import { useEffect, useRef } from "react"

export function VisitorCounter() {
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create auth script
    const authScript = document.createElement("script")
    authScript.type = "text/javascript"
    authScript.src = "https://www.freevisitorcounters.com/auth.php?id=26983c836e9d44b4918cb74f28d2084bb0df4c6a"

    // Create counter script
    const counterScript = document.createElement("script")
    counterScript.type = "text/javascript"
    counterScript.src = "https://www.freevisitorcounters.com/en/home/counter/1343620/t/6"

    // Append scripts to the container
    if (counterRef.current) {
      counterRef.current.appendChild(authScript)
      counterRef.current.appendChild(counterScript)
    }

    // Cleanup function
    return () => {
      if (counterRef.current) {
        if (authScript.parentNode === counterRef.current) {
          counterRef.current.removeChild(authScript)
        }
        if (counterScript.parentNode === counterRef.current) {
          counterRef.current.removeChild(counterScript)
        }
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center gap-2">
      <div ref={counterRef} className="inline-block"></div>
      <a
        href="https://www.free-counters.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:underline"
      >
        powered by Free-Counters
      </a>
    </div>
  )
}
