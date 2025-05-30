import { NextResponse } from "next/server"

// The prompt for generating abstracts based on research titles and saved papers
const SYSTEM_PROMPT = `
You are an AI research assistant specializing in academic literature analysis, powered by Perplexity. Your task is to generate a comprehensive abstract based on the provided research title and any saved papers related to the topic.

When presented with a research title and saved papers:

1. Analyze the research title to understand the core topic and research question.
2. Review the saved papers to extract key findings, methodologies, and conclusions relevant to the research title.
3. Synthesize this information into a well-structured, academic-style abstract that:
   - Introduces the research area and its significance
   - Outlines the key research questions or objectives
   - Summarizes the methodological approaches used in the field
   - Highlights the main findings and their implications
   - Suggests potential directions for future research
4. Suggest an improved, more specific research title based on the generated abstract and the analyzed papers.

Your abstract should be approximately 250-300 words, written in formal academic language, and should accurately represent the current state of knowledge based on the provided papers.

Your response should be in JSON format with the following structure:
{
  "abstract": "The generated abstract text",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "renamedTitle": "An improved, more specific research title"
}

IMPORTANT: 
- Generate 5 relevant keywords that accurately represent the main themes of the abstract.
- The renamed title should be more specific, academically appropriate, and reflective of the content in the abstract.
`

export async function POST(request: Request) {
  try {
    const { title, savedPapers } = await request.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Research title is required" }, { status: 400 })
    }

    if (!Array.isArray(savedPapers)) {
      return NextResponse.json({ error: "Saved papers must be an array" }, { status: 400 })
    }

    console.log("Generating abstract for:", title)
    console.log("Using saved papers:", savedPapers.length)

    // Check if API key exists
    if (!process.env.PPLX_API_KEY) {
      console.error("PPLX_API_KEY environment variable is not set")
      return NextResponse.json({ error: "API configuration error. Please check server logs." }, { status: 500 })
    }

    try {
      console.log("Calling Perplexity API with model: sonar-pro")

      // Prepare the content for the user message
      let userContent = `Research Title: ${title}\n\n`
      
      if (savedPapers.length > 0) {
        userContent += "Saved Papers:\n"
        savedPapers.forEach((paper: any, index: number) => {
          userContent += `${index + 1}. Title: ${paper.title}\n`
          if (paper.authors) userContent += `   Authors: ${paper.authors.join(", ")}\n`
          if (paper.year) userContent += `   Year: ${paper.year}\n`
          if (paper.journal) userContent += `   Journal: ${paper.journal}\n`
          if (paper.doi) userContent += `   DOI: ${paper.doi}\n`
          userContent += "\n"
        })
      } else {
        userContent += "No saved papers provided. Generate an abstract based solely on the research title."
      }

      const apiResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PPLX_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: userContent
            }
          ],
          max_tokens: 1000
        })
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("Perplexity API error response:", errorText)
        throw new Error(`API responded with status ${apiResponse.status}: ${errorText}`)
      }

      const responseData = await apiResponse.json()
      console.log("Received response from Perplexity")

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
        try {
          const jsonRegex = /\{[\s\S]*\}/g;
          const matches = content.match(jsonRegex);
          
          if (matches && matches.length > 0) {
            for (const match of matches) {
              try {
                const cleanedMatch = match.trim();
                const extractedJson = JSON.parse(cleanedMatch);
                return NextResponse.json(extractedJson);
              } catch (innerError) {
                console.log("Failed to parse potential JSON match, trying next one");
              }
            }
          }
          
          console.error("No valid JSON found in the response");
        } catch (e) {
          console.error("Failed to extract JSON:", e);
        }

        // If we can't parse JSON, return a simplified response with the raw text
        return NextResponse.json(
          {
            error: "Failed to parse abstract generation results. Please try again.",
            rawResponse: content.substring(0, 1000), // Include part of the raw response for debugging
          },
          { status: 500 },
        )
      }
    } catch (apiError) {
      console.error("Perplexity API error:", apiError)

      // Try to extract more detailed error information
      let errorMessage = "Error communicating with the API."
      let errorDetails = null

      if (apiError instanceof Error) {
        errorMessage = apiError.message
        errorDetails = apiError.stack
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
    console.error("Error generating abstract:", error)
    return NextResponse.json(
      {
        error: "Failed to generate abstract. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
