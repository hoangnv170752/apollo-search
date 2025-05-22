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

    // Check if API key exists
    if (!process.env.PPLX_API_KEY) {
      console.error("PPLX_API_KEY environment variable is not set")
      return NextResponse.json({ error: "API configuration error. Please check server logs." }, { status: 500 })
    }

    try {
      console.log("Calling Perplexity API with model: sonar")

      const apiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PPLX_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: query
            }
          ],
          max_tokens: 4000,
          web_search_options: {
            search_context_size: "high"
          }
        })
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("Perplexity API error response:", errorText)
        throw new Error(`API responded with status ${apiResponse.status}: ${errorText}`)
      }

      const responseData = await apiResponse.json()
      console.log("Received response from Perplexity:", responseData)

      if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
        throw new Error("Unexpected API response format")
      }

      const content = responseData.choices[0].message.content
      
      // Parse the JSON response
      try {
        const results = JSON.parse(content)
        return NextResponse.json(results)
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        console.log("Raw response:", content)

        // Attempt to extract JSON from the text if it's not properly formatted
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0])
            return NextResponse.json(extractedJson)
          } catch (e) {
            console.error("Failed to extract JSON:", e)
          }
        }

        // If we can't parse JSON, return a simplified response with the raw text
        return NextResponse.json(
          {
            error: "Failed to parse search results. Please try again.",
            rawResponse: content.substring(0, 1000), // Include part of the raw response for debugging
          },
          { status: 500 },
        )
      }
    } catch (apiError) {
      console.error("Perplexity API error:", apiError)

      // Try to extract more detailed error information
      let errorMessage = "Error communicating with the search API."
      let errorDetails = null

      if (apiError instanceof Error) {
        errorMessage = apiError.message
        errorDetails = apiError.stack
      }

      // Check if apiError is an object with a response property
      if (apiError && typeof apiError === 'object' && 'response' in apiError && apiError.response) {
        try {
          // TypeScript needs this type assertion
          const response = apiError.response as Response;
          const responseData = await response.json()
          console.error("API error response:", responseData)
          errorDetails = JSON.stringify(responseData)
        } catch (e) {
          console.error("Could not parse error response:", e)
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          message:
            "There was an error with the Perplexity API. This could be due to rate limiting, invalid parameters, or service issues.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error searching papers:", error)
    return NextResponse.json(
      {
        error: "Failed to search for papers. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
