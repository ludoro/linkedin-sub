import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { carouselTemplates, createSlideFromTemplate, splitContentIntoSlides } from "@/lib/templates"

export async function POST(request: NextRequest) {
  try {
    console.log("Carousel generation API called")

    const { content, type, templateId } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // If templateId is provided, use template-based generation
    if (templateId) {
      const template = carouselTemplates.find(t => t.id === templateId)
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 })
      }

      // Split the content intelligently into slides
      const slideContents = splitContentIntoSlides(content, 5)
      
      // Create slides using the template with proper content distribution
      const slides = slideContents.map((slideContent, index) => 
        createSlideFromTemplate(template, index + 1, slideContent)
      )

      return NextResponse.json({
        success: true,
        slides: slides,
        template: template
      })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("GEMINI_API_KEY not found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Generating carousel slides with Gemini...")

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    // Create a detailed prompt for generating carousel slides
    const carouselPrompt = `You are a carousel content generator. Create exactly 5 slides for a ${type === "social" ? "social media" : "newsletter"} carousel based on this content:

${content}

IMPORTANT: You must respond with ONLY a valid JSON array. No other text, explanations, or markdown formatting.

Requirements:
- Split the content into exactly 5 engaging slides
- Each slide should have a clear, focused message
- Use compelling headlines and concise text
- Ensure smooth flow between slides
- Each slide should be self-contained but part of a cohesive story

JSON format (respond with ONLY this structure):
[
  {
    "slideNumber": 1,
    "headline": "Compelling headline for slide 1",
    "content": "Main content text for slide 1",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "textSize": "medium",
    "fontFamily": "inter",
    "textAlign": "center",
    "fontWeight": "bold",
    "backgroundImage": null
  },
  {
    "slideNumber": 2,
    "headline": "Compelling headline for slide 2",
    "content": "Main content text for slide 2",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "textSize": "medium",
    "fontFamily": "inter",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 3,
    "headline": "Compelling headline for slide 3",
    "content": "Main content text for slide 3",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "textSize": "medium",
    "fontFamily": "inter",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 4,
    "headline": "Compelling headline for slide 4",
    "content": "Main content text for slide 4",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "textSize": "medium",
    "fontFamily": "inter",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 5,
    "headline": "Compelling headline for slide 5",
    "content": "Main content text for slide 5",
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "textSize": "medium",
    "fontFamily": "inter",
    "textAlign": "center",
    "fontWeight": "bold",
    "backgroundImage": null
  }
]

Remember: Respond with ONLY the JSON array, no other text.`

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: carouselPrompt,
    })

    console.log("Carousel generation response received")

    const responseText = result.text?.trim()
    console.log("Raw response:", responseText)

    if (!responseText) {
      console.error("No response text received from Gemini")
      return NextResponse.json({ 
        error: "No response received from AI service"
      }, { status: 500 })
    }

    // Try to extract JSON from the response
    let carouselData
    try {
      // First try to parse the entire response as JSON
      try {
        carouselData = JSON.parse(responseText)
      } catch {
        // If that fails, look for JSON array in the response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          carouselData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON array found in response")
        }
      }
    } catch (parseError) {
      console.error("Failed to parse carousel JSON:", parseError)
      console.error("Response text:", responseText)
      return NextResponse.json({ 
        error: "Failed to parse carousel data from AI response",
        details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        rawResponse: responseText.substring(0, 500) // Include first 500 chars for debugging
      }, { status: 500 })
    }

    // Validate that we have exactly 5 slides
    if (!Array.isArray(carouselData) || carouselData.length !== 5) {
      console.error("Invalid carousel data structure:", carouselData)
      return NextResponse.json({ 
        error: "Invalid carousel data structure - expected exactly 5 slides"
      }, { status: 500 })
    }

    // Validate each slide has required fields
    for (let i = 0; i < carouselData.length; i++) {
      const slide = carouselData[i]
      if (!slide.headline || !slide.content || !slide.backgroundColor || !slide.textColor || !slide.textSize) {
        console.error(`Invalid slide ${i + 1}:`, slide)
        return NextResponse.json({ 
          error: `Invalid slide ${i + 1} - missing required fields`
        }, { status: 500 })
      }
    }

    console.log("Carousel generated successfully with", carouselData.length, "slides")

    return NextResponse.json({
      success: true,
      slides: carouselData
    })

  } catch (error: any) {
    console.error("Error generating carousel:", error)
    
    let errorMessage = "Failed to generate carousel"
    let statusCode = 500

    if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded"
      statusCode = 429
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Rate limit exceeded"
      statusCode = 429
    } else if (error.message?.includes("model not found")) {
      errorMessage = "Carousel generation model not available"
      statusCode = 503
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error.message
    }, { status: statusCode })
  }
}
