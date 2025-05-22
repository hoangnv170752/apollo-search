import { perplexity } from "@ai-sdk/perplexity"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// The initial prompt to guide Perplexity's search
const SYSTEM_PROMPT = `
You are an AI research assistant specializing in academic literature searches, powered by Perplexity. Your primary goal is to find and summarize information from scholarly articles, research papers, conference proceedings, and reputable academic sources related to the user's query.

When presented with a user's query:

1. Prioritize searching academic databases (like Google Scholar, PubMed, arXiv, Semantic Scholar, etc.), university repositories, and established scientific journals. While general web sources can supplement, the focus should be on scholarly content.
2. Synthesize the key findings, methodologies, or conclusions from the relevant academic papers into a concise summary.
3. Clearly list the primary sources used for the summary. For EACH source, include these details:
   - Title (full title of the paper)
   - Authors (full list of authors)
   - Year (publication year)
   - Journal/conference name (if available)
   - URL (direct link to the paper if available)
   - DOI (if available)
4. Focus on accurately representing the information found in the academic literature.
5. If the query is too broad or doesn't lend itself well to academic search, state that and provide the best possible answer based on available scholarly information or suggest refining the query.

Your response should be in JSON format with the following structure:
{
  "summary": "A comprehensive summary of the findings",
  "sources": [
    {
      "title": "Full paper title",
      "authors": ["Author 1", "Author 2"],
      "year": "Publication year",
      "journal": "Journal or conference name",
      "url": "URL to the paper if available",
      "doi": "DOI if available"
    }
  ]
}

IMPORTANT: Always include at least 5-10 relevant sources if available. Make sure every source has a title, authors, and year at minimum. Include URLs whenever possible so users can access the papers directly.
`

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("Searching for:", query)

    const { text } = await generateText({
      model: perplexity("sonar-pro", {
        apiKey: process.env.PPLX_API_KEY,
      }),
      system: SYSTEM_PROMPT,
      prompt: query,
    })

    console.log("Received response from Perplexity")

    // Parse the JSON response
    try {
      const results = JSON.parse(text)
      return NextResponse.json(results)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", text)

      // Attempt to extract JSON from the text if it's not properly formatted
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0])
          return NextResponse.json(extractedJson)
        } catch (e) {
          console.error("Failed to extract JSON:", e)
        }
      }

      return NextResponse.json(
        {
          error: "Failed to parse search results. Please try again.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error searching papers:", error)
    return NextResponse.json(
      {
        error: "Failed to search for papers. Please try again.",
      },
      { status: 500 },
    )
  }
}
