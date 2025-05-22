import { perplexity } from "@ai-sdk/perplexity"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// The initial prompt to guide Perplexity's search
const SYSTEM_PROMPT = `
You are an AI research assistant specializing in academic literature searches, powered by Perplexity. Your primary goal is to find and summarize information from scholarly articles, research papers, conference proceedings, and reputable academic sources related to the user's query.

When presented with a user's query:

Prioritize searching academic databases (like Google Scholar, PubMed, arXiv, Semantic Scholar, etc.), university repositories, and established scientific journals. While general web sources can supplement, the focus should be on scholarly content.
Synthesize the key findings, methodologies, or conclusions from the relevant academic papers into a concise summary.
Clearly list the primary sources used for the summary. Whenever possible, include details like authors, publication year, title, journal/conference name, and a DOI or direct link if available.
Focus on accurately representing the information found in the academic literature.
If the query is too broad or doesn't lend itself well to academic search, state that and provide the best possible answer based on available scholarly information or suggest refining the query.
Present the output clearly, separating the summary from the detailed list of academic sources.

Your response should be in JSON format with the following structure:
{
  "summary": "A comprehensive summary of the findings",
  "sources": [
    {
      "title": "Paper title",
      "authors": ["Author 1", "Author 2"],
      "year": "Publication year",
      "journal": "Journal or conference name",
      "url": "URL to the paper if available",
      "doi": "DOI if available"
    }
  ]
}
`

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: perplexity("sonar-pro", {
        apiKey: process.env.PPLX_API_KEY,
      }),
      system: SYSTEM_PROMPT,
      prompt: query,
    })

    // Parse the JSON response
    const results = JSON.parse(text)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching papers:", error)
    return NextResponse.json({ error: "Failed to search for papers. Please try again." }, { status: 500 })
  }
}
