import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    console.log("Regenerate API route called")
    const { type, originalUrl, currentContent } = await request.json()
    console.log("Regeneration type:", type)
    console.log("Original URL:", originalUrl)
    console.log("Current content:", currentContent?.substring(0, 100) + "...")

    if (!type || !["social", "newsletter"].includes(type)) {
      return NextResponse.json({ error: "Invalid type. Must be 'social' or 'newsletter'" }, { status: 400 })
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

    // If we don't have an original URL, we can't regenerate from scratch
    // Instead, we'll try to improve the current failed content
    if (!originalUrl) {
      console.log("No original URL provided, attempting to improve current content")
      return NextResponse.json(
        {
          error: "Cannot regenerate without original source. Please try converting again from the main page.",
        },
        { status: 400 },
      )
    }

    console.log("Regenerating content with Gemini...")

    let prompt: string
    if (type === "social") {
      prompt = `Please create an engaging social media post based on the content from this URL: ${originalUrl}

Requirements:
- Keep it concise and engaging (under 280 characters if possible)
- Include relevant hashtags
- Make it shareable and attention-grabbing
- Focus on the key insights or value proposition
- Use a conversational, friendly tone

Please provide only the social media post content, no additional formatting or explanations.`
    } else {
      prompt = `Please create a comprehensive newsletter article based on the content from this URL: ${originalUrl}

Requirements:
- Write a well-structured article with clear sections
- Include an engaging introduction that hooks the reader
- Provide detailed insights and analysis
- Use professional yet accessible language
- Include key takeaways or actionable insights
- Aim for 300-500 words
- Format with proper paragraphs and structure

Please provide only the newsletter article content, no additional formatting or explanations.`
    }

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
        config: {
          tools: [{ urlContext: {} }],
        }
      })
      
      if (!result) {
        console.log("AI regeneration failed - no response")
        return NextResponse.json(
          {
            error: "Failed to regenerate content with AI",
          },
          { status: 500 },
        )
      }

      const generatedContent = result.text?.trim()
      
      if (!generatedContent) {
        console.log("AI regeneration failed - empty content")
        return NextResponse.json(
          {
            error: "AI returned empty content",
          },
          { status: 500 },
        )
      }

      console.log("Content regenerated successfully")
      console.log("Regenerated content length:", generatedContent.length)

      const responseData: any = {
        title: "Regenerated Content",
      }
      
      if (type === "social") {
        responseData.socialPost = generatedContent
      } else {
        responseData.newsletter = generatedContent
      }

      return NextResponse.json(responseData)
    } catch (aiError: any) {
      console.error("AI regeneration error:", aiError)
      
      let errorMessage = "Failed to regenerate content"
      if (aiError.message?.includes("quota")) {
        errorMessage = "API quota exceeded"
      } else if (aiError.message?.includes("rate limit")) {
        errorMessage = "Rate limit exceeded"
      }
      
      return NextResponse.json(
        {
          error: errorMessage,
          details: aiError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in regenerate API:", error)
    return NextResponse.json({ error: "Failed to regenerate content. Please try again." }, { status: 500 })
  }
}
