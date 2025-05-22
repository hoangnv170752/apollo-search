// Client-side function to call our API route
export async function searchPapers(query: string) {
  try {
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

    return await response.json()
  } catch (error) {
    console.error("Error searching papers:", error)
    throw new Error("Failed to search for papers. Please try again.")
  }
}
