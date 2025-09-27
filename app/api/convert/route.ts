import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function extractContentFromHtml(html: string) {
  // Remove script and style tags
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")

  // Extract main content areas
  const mainContent =
    content.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    content.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    content.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)

  if (mainContent) {
    content = mainContent[1]
  }

  // Clean HTML tags and normalize whitespace
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 8000) // Increased limit for better context
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)

  return (ogTitleMatch?.[1] || titleMatch?.[1] || h1Match?.[1] || "Untitled").trim()
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { url, textPrompt } = await request.json()
    console.log("[v0] URL received:", url)
    console.log("[v0] Text prompt:", textPrompt)

    if (!url) {
      console.log("[v0] No URL provided")
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      new URL(url)
    } catch {
      console.log("[v0] Invalid URL format:", url)
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log("[v0] Fetching webpage content...")
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkCraft/1.0; +https://linkcraft.ai)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log("[v0] Failed to fetch webpage:", response.status, response.statusText)
      return NextResponse.json(
        {
          error: `Failed to fetch webpage: ${response.status} ${response.statusText}`,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Webpage fetched successfully")
    const html = await response.text()

    const textContent = extractContentFromHtml(html)
    const title = extractTitle(html)

    console.log("[v0] Extracted title:", title)
    console.log("[v0] Content length:", textContent.length)

    if (!textContent || textContent.length < 100) {
      console.log("[v0] Insufficient content extracted")
      return NextResponse.json(
        {
          error: "Could not extract sufficient content from the webpage",
        },
        { status: 400 },
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log("[v0] Missing GEMINI_API_KEY")
      return NextResponse.json(
        {
          error: "AI service not configured. Please check your API key.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Generating content with Gemini...")
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const socialPrompt = `
    Create an engaging social media post from this webpage content. Requirements:
    - Keep it under 280 characters
    - Make it compelling and shareable
    - Include 2-3 relevant hashtags
    - Focus on the key insight or value proposition
    - Use an engaging hook or question if appropriate
    ${textPrompt ? `- Additional style requirements: ${textPrompt}` : ""}
    
    Title: ${title}
    Content: ${textContent}
    
    Generate only the social media post, no additional text:
    `

    const newsletterPrompt = `
    Transform this webpage content into a well-structured newsletter section. Requirements:
    - Start with a compelling hook or introduction
    - Present 3-4 key points or insights
    - Include actionable takeaways
    - End with a thought-provoking conclusion
    - Keep it concise but informative (200-400 words)
    - Use a conversational, engaging tone
    ${textPrompt ? `- Additional style requirements: ${textPrompt}` : ""}
    
    Title: ${title}
    Content: ${textContent}
    
    Generate only the newsletter content, no additional text:
    `

    const [socialResult, newsletterResult] = await Promise.all([
      model.generateContent(socialPrompt).catch((err) => {
        console.error("[v0] Social post generation failed:", err)
        return null
      }),
      model.generateContent(newsletterPrompt).catch((err) => {
        console.error("[v0] Newsletter generation failed:", err)
        return null
      }),
    ])

    if (!socialResult || !newsletterResult) {
      console.log("[v0] AI generation failed")
      return NextResponse.json(
        {
          error: "Failed to generate content with AI",
        },
        { status: 500 },
      )
    }

    const socialPost = socialResult.response.text().trim()
    const newsletter = newsletterResult.response.text().trim()

    console.log("[v0] Content generated successfully")
    console.log("[v0] Social post length:", socialPost.length)
    console.log("[v0] Newsletter length:", newsletter.length)

    return NextResponse.json({
      title,
      socialPost,
      newsletter,
    })
  } catch (error) {
    console.error("[v0] Error converting content:", error)
    return NextResponse.json({ error: "Failed to convert content. Please try again." }, { status: 500 })
  }
}
