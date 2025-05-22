// Client-side function to call our API route
export async function searchPapers(query: string) {
  try {
    console.log("Sending search request for:", query)

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.error || "Failed to search for papers")
      // @ts-ignore - Adding custom properties to Error
      error.details = data.details || data.message || null
      // @ts-ignore
      error.rawResponse = data.rawResponse || null
      throw error
    }

    console.log("Search results:", data)
    return data
  } catch (error) {
    console.error("Error searching papers:", error)

    // If it's already our custom error with details, just rethrow it
    if (error instanceof Error && (error as any).details) {
      throw error
    }

    // Otherwise create a new error
    const newError = new Error("Failed to search for papers. Please try again.")
    // @ts-ignore
    newError.details = error instanceof Error ? error.message : String(error)
    throw newError
  }
}
