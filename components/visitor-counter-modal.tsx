"use client"

import { useState, useEffect } from "react"
import { X, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisitorCounterBox } from "@/components/visitor-counter-box"
import { CounterContainer } from "@/components/counter-container"

export function VisitorCounterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("visitorCounterOpen")
    if (savedState !== null) {
      setIsOpen(savedState === "true")
    }

    // Always load the counter scripts regardless of visibility
    setHasBeenOpened(true)
  }, [])

  // Save preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem("visitorCounterOpen", isOpen.toString())
  }, [isOpen])

  const toggleModal = () => {
    setIsOpen(!isOpen)
    setHasBeenOpened(true)
  }

  return (
    <>
      {/* Toggle button in footer */}
      <Button
        onClick={toggleModal}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 border-primary/20"
      >
        <BarChart2 className="h-4 w-4" />
        <span>Stats</span>
      </Button>

      {/* Modal */}
      {(isOpen || hasBeenOpened) && (
        <div
          className={`fixed bottom-16 right-4 z-50 transition-all duration-300 transform ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border shadow-md z-10"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="shadow-lg rounded-lg overflow-hidden">
              <VisitorCounterBox />
            </div>
          </div>
        </div>
      )}

      {/* Always render the counter container for scripts */}
      <CounterContainer />
    </>
  )
}
