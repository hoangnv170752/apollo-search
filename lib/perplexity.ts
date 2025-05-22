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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to search for papers")
    }

    const data = await response.json()
    console.log("Search results:", data)
    return data
  } catch (error) {
    console.error("Error searching papers:", error)
    throw new Error("Failed to search for papers. Please try again.")
  }
}
