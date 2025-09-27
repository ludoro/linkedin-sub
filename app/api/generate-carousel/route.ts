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

    // Check if API key is available for AI generation
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("GEMINI_API_KEY not found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Generating carousel slides with Gemini...")

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    // If templateId is provided, we'll still use AI to generate content but apply the template afterward
    if (templateId) {
      const template = carouselTemplates.find(t => t.id === templateId)
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 })
      }

      // Use AI to generate carousel content first
      const carouselPrompt = `You are a carousel content generator. Create exactly 5 slides for a ${type === "social" ? "social media" : "newsletter"} carousel based on this content:

${content}

IMPORTANT: You must respond with ONLY a valid JSON array. No other text, explanations, or markdown formatting.

Requirements:
- Craft exactly 5 engaging slides with original, compelling text
- Each slide should have a clear, focused message derived from the source content
- Create compelling headlines and concise, impactful text
- Ensure smooth flow between slides
- Each slide should be self-contained but part of a cohesive story
- DO NOT simply break up the original text - instead, create new, engaging content inspired by it

JSON format (respond with ONLY this structure):
[
  {
    "slideNumber": 1,
    "headline": "Compelling headline for slide 1",
    "content": "Main content text for slide 1",
    "backgroundColor": "${template.backgroundColor}",
    "textColor": "${template.defaultColors.text}",
    "textSize": "medium",
    "fontFamily": "${template.defaultFonts.heading}",
    "textAlign": "center",
    "fontWeight": "bold",
    "backgroundImage": null
  },
  {
    "slideNumber": 2,
    "headline": "Compelling headline for slide 2",
    "content": "Main content text for slide 2",
    "backgroundColor": "${template.backgroundColor}",
    "textColor": "${template.defaultColors.text}",
    "textSize": "medium",
    "fontFamily": "${template.defaultFonts.heading}",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 3,
    "headline": "Compelling headline for slide 3",
    "content": "Main content text for slide 3",
    "backgroundColor": "${template.backgroundColor}",
    "textColor": "${template.defaultColors.text}",
    "textSize": "medium",
    "fontFamily": "${template.defaultFonts.heading}",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 4,
    "headline": "Compelling headline for slide 4",
    "content": "Main content text for slide 4",
    "backgroundColor": "${template.backgroundColor}",
    "textColor": "${template.defaultColors.text}",
    "textSize": "medium",
    "fontFamily": "${template.defaultFonts.heading}",
    "textAlign": "center",
    "fontWeight": "semibold",
    "backgroundImage": null
  },
  {
    "slideNumber": 5,
    "headline": "Compelling headline for slide 5",
    "content": "Main content text for slide 5",
    "backgroundColor": "${template.backgroundColor}",
    "textColor": "${template.defaultColors.text}",
    "textSize": "medium",
    "fontFamily": "${template.defaultFonts.heading}",
    "textAlign": "center",
    "fontWeight": "bold",
    "backgroundImage": null
  }
]

Remember: Respond with ONLY the JSON array, no other text.`

      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: carouselPrompt,
        })

        const responseText = result.text?.trim()
        if (!responseText) {
          throw new Error("No response received from AI service")
        }

        // Parse the AI response
        let carouselData
        try {
          carouselData = JSON.parse(responseText)
        } catch {
          const jsonMatch = responseText.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            carouselData = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No JSON array found in response")
          }
        }

        // Validate that we have exactly 5 slides
        if (!Array.isArray(carouselData) || carouselData.length !== 5) {
          throw new Error("Invalid carousel data structure - expected exactly 5 slides")
        }

        // Apply template styling to AI-generated content
        const templatedSlides = carouselData.map((slide: any, index: number) => {
          const templatedSlide = createSlideFromTemplate(template, index + 1, {
            headline: slide.headline,
            content: slide.content
          })
          
          // Preserve any AI-specified styling
          return {
            ...templatedSlide,
            backgroundColor: slide.backgroundColor || templatedSlide.backgroundColor,
            textColor: slide.textColor || templatedSlide.textColor,
            fontFamily: slide.fontFamily || templatedSlide.fontFamily,
            textAlign: slide.textAlign || templatedSlide.textAlign,
            fontWeight: slide.fontWeight || templatedSlide.fontWeight,
            textSize: slide.textSize || templatedSlide.textSize
          }
        })

        return NextResponse.json({
          success: true,
          slides: templatedSlides,
          template: template
        })

      } catch (error: any) {
        console.error("AI generation failed for template, falling back to template-only:", error)
        
        // If AI fails, fall back to basic template structure but with better content
        const slideContents = splitContentIntoSlides(content, 5)
        const slides = slideContents.map((slideContent, index) => 
          createSlideFromTemplate(template, index + 1, slideContent)
        )

        return NextResponse.json({
          success: true,
          slides: slides,
          template: template,
          note: "Generated using template fallback due to AI service unavailability"
        })
      }
    }

    // Create a detailed prompt for generating carousel slides
    const carouselPrompt = `You are a carousel content generator. Create exactly 5 slides for a ${type === "social" ? "social media" : "newsletter"} carousel based on this content:

${content}

IMPORTANT: You must respond with ONLY a valid JSON array. No other text, explanations, or markdown formatting.

Requirements:
- Craft exactly 5 engaging slides with original, compelling text
- Each slide should have a clear, focused message derived from the source content
- Create compelling headlines and concise, impactful text
- Ensure smooth flow between slides
- Each slide should be self-contained but part of a cohesive story
- DO NOT simply break up the original text - instead, create new, engaging content inspired by it

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
