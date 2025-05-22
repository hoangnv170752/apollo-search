"use client"

import { useEffect, useRef } from "react"

export function CounterContainer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    // Add the counter authentication script
    const authScript = document.createElement("script")
    authScript.type = "text/javascript"
    authScript.src = "https://www.freevisitorcounters.com/auth.php?id=26983c836e9d44b4918cb74f28d2084bb0df4c6a"
    authScript.async = true
    
    // Add the counter script with properly formatted parameters
    const counterScript = document.createElement("script")
    counterScript.type = "text/javascript"
    counterScript.src = "https://www.freevisitorcounters.com/en/home/counter/1343620/t/6"
    counterScript.async = true
    
    // Append scripts to the container
    containerRef.current.appendChild(authScript)
    containerRef.current.appendChild(counterScript)
    
    return () => {
      if (containerRef.current) {
        if (authScript.parentNode === containerRef.current) {
          containerRef.current.removeChild(authScript)
        }
        if (counterScript.parentNode === containerRef.current) {
          containerRef.current.removeChild(counterScript)
        }
      }
    }
  }, [])

  return <div ref={containerRef} style={{ display: "none" }} id="counter-container"></div>
}
