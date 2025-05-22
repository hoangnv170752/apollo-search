"use client"

import { useEffect, useRef } from "react"

export function CounterContainer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create an iframe to load the counter
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = "https://www.freevisitorcounters.com/en/home/counter/1343620/t/6"

    containerRef.current.appendChild(iframe)

    return () => {
      if (containerRef.current && iframe.parentNode === containerRef.current) {
        containerRef.current.removeChild(iframe)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ display: "none" }} id="counter-container"></div>
}
