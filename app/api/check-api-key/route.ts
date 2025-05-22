import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the API key exists
    if (!process.env.PPLX_API_KEY) {
      return NextResponse.json({ error: "PPLX_API_KEY environment variable is not set" }, { status: 500 })
    }

    // Check if the API key has a valid format (basic check)
    const apiKey = process.env.PPLX_API_KEY
    if (typeof apiKey !== "string" || apiKey.length < 10) {
      return NextResponse.json({ error: "PPLX_API_KEY appears to be invalid (too short)" }, { status: 500 })
    }

    return NextResponse.json({
      message: "API key is configured",
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 3) + "..." + apiKey.substring(apiKey.length - 3),
    })
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({ error: "Failed to check API key: " + error.message }, { status: 500 })
  }
}
