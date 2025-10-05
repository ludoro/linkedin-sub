import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    console.log("API route called")
    const { url, articleText, mode, memories } = await request.json()
    console.log("Mode:", mode)
    console.log("URL received:", url)
    console.log("Article text length:", articleText?.length || 0)

    if (mode === "url") {
      if (!url) {
        console.log("No URL provided")
        return NextResponse.json({ error: "URL is required" }, { status: 400 })
      }

      try {
        new URL(url)
      } catch {
        console.log("Invalid URL format:", url)
        return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
      }
    } else if (mode === "text") {
      if (!articleText || !articleText.trim()) {
        console.log("No article text provided")
        return NextResponse.json({ error: "Article text is required" }, { status: 400 })
      }
    } else {
      console.log("Invalid mode provided:", mode)
      return NextResponse.json({ error: "Invalid mode. Must be 'url' or 'text'" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log("Missing GEMINI_API_KEY")
      return NextResponse.json(
        {
          error: "AI service not configured. Please check your API key.",
        },
        { status: 500 },
      )
    }

    console.log("Generating content with Gemini...")

    let socialPrompt: string
    let newsletterPrompt: string

    const memoryPrompt =
      memories && memories.length > 0
        ? `
- Emulate the writing style, tone, and voice from the following examples:
${memories.map((m: string) => `- "${m}"`).join("\n")}
`
        : ""

    if (mode === "url") {
      socialPrompt = `Create an engaging social media post from the content at ${url}. Requirements:
      - Keep it under 280 characters
      - Make it compelling and shareable
      - Include 2-3 relevant hashtags
      - Focus on the key insight or value proposition
      - Use an engaging hook or question if appropriate
      ${memoryPrompt}
      Generate only the social media post, no additional text:`

      newsletterPrompt = `Transform the content at ${url} into a well-structured newsletter section. Requirements:
      - Start with a compelling hook or introduction
      - Present 3-4 key points or insights
      - Include actionable takeaways
      - End with a thought-provoking conclusion
      - Keep it concise but informative (200-400 words)
      - Use a conversational, engaging tone
      ${memoryPrompt}
      Generate only the newsletter content, no additional text:`
    } else {
      socialPrompt = `Create an engaging social media post from the following article text. Requirements:
      - Keep it under 280 characters
      - Make it compelling and shareable
      - Include 2-3 relevant hashtags
      - Focus on the key insight or value proposition
      - Use an engaging hook or question if appropriate
      ${memoryPrompt}
      Article text:
      ${articleText}
      
      Generate only the social media post, no additional text:`

      newsletterPrompt = `Transform the following article text into a well-structured newsletter section. Requirements:
      - Start with a compelling hook or introduction
      - Present 3-4 key points or insights
      - Include actionable takeaways
      - End with a thought-provoking conclusion
      - Keep it concise but informative (200-400 words)
      - Use a conversational, engaging tone
      ${memoryPrompt}
      Article text:
      ${articleText}
      
      Generate only the newsletter content, no additional text:`
    }

    const [socialResult, newsletterResult] = await Promise.all([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [socialPrompt],
        config: mode === "url" ? {
          tools: [{ urlContext: {} }],
        } : undefined,
      }).catch((err) => {
        console.error("Social post generation failed:", err)
        return null
      }),
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [newsletterPrompt],
        config: mode === "url" ? {
          tools: [{ urlContext: {} }],
        } : undefined,
      }).catch((err) => {
        console.error("Newsletter generation failed:", err)
        return null
      }),
    ])

    if (!socialResult || !newsletterResult) {
      console.log("AI generation failed")
      return NextResponse.json(
        {
          error: "Failed to generate content with AI",
        },
        { status: 500 },
      )
    }

    const socialPost = socialResult.text?.trim() || "Failed to generate social post"
    const newsletter = newsletterResult.text?.trim() || "Failed to generate newsletter"

    console.log("Content generated successfully")
    console.log("Social post length:", socialPost.length)
    console.log("Newsletter length:", newsletter.length)

    // Log metadata to see which URLs the model retrieved (only for URL mode)
    if (mode === "url") {
      console.log("Social post URL metadata:", socialResult.candidates?.[0]?.urlContextMetadata)
      console.log("Newsletter URL metadata:", newsletterResult.candidates?.[0]?.urlContextMetadata)
    }

    return NextResponse.json({
      title: mode === "url" ? "Generated from URL" : "Generated Content",
      socialPost,
      newsletter,
    })
  } catch (error) {
    console.error("Error converting content:", error)
    return NextResponse.json({ error: "Failed to convert content. Please try again." }, { status: 500 })
  }
}
