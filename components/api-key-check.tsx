"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"

export function ApiKeyCheck() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const checkApiKey = async () => {
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/check-api-key", {
        method: "GET",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error || "Unknown error occurred")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check API key: " + (error.message || "Unknown error"))
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>API Key Status Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">Check if the Perplexity API key is properly configured in the environment variables.</p>

        <div className="flex justify-between items-center">
          <Button onClick={checkApiKey} disabled={status === "loading"} className="bg-primary hover:bg-primary/90">
            {status === "loading" ? (
              <>
                <LoadingSpinner className="mr-2" />
                Checking...
              </>
            ) : (
              "Check API Key"
            )}
          </Button>

          {status !== "idle" && (
            <div className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>{message}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
