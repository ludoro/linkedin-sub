import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    console.log("Image generation API called")

    const { prompt, type } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("GEMINI_API_KEY not found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Generating image with Gemini...")

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    // Create a detailed image generation prompt
    const imagePrompt = `Create a visually appealing ${type === "social" ? "social media" : "newsletter"} image for the following content: ${prompt}. 
    
    Style requirements:
    - Modern, professional design
    - High contrast and readable
    - Suitable for ${type === "social" ? "social media platforms" : "newsletter headers"}
    - Clean typography if text is included
    - Engaging visual elements
    - ${type === "social" ? "Square or landscape format" : "Banner format"}
    
    Generate an image that would complement this content perfectly.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: imagePrompt,
    })

    console.log("Image generation response received")

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data
        console.log("Image data received, length:", imageData.length)

        // Return the base64 image data
        return NextResponse.json({
          success: true,
          imageUrl: `data:image/png;base64,${imageData}`,
          message: "Image generated successfully!",
        })
      }
    }

    // If no image data found in response
    return NextResponse.json({
      success: false,
      message: "No image data received from Gemini",
      imageUrl: null,
    })
  } catch (error: any) {
    console.error("Image generation failed:", error)

    let errorMessage = "Failed to generate image"
    let userMessage = "Could not generate image. Please try again later."

    if (error.message && error.message.includes("quota")) {
      errorMessage = "API quota exceeded"
      userMessage =
        "API quota limit reached. Please wait a few minutes before trying again, or check your Gemini API billing settings."
    } else if (error.message && error.message.includes("429")) {
      errorMessage = "Rate limit exceeded"
      userMessage = "Too many requests. Please wait a moment before trying again."
    } else if (error.message && error.message.includes("401")) {
      errorMessage = "Authentication failed"
      userMessage = "API key authentication failed. Please check your Gemini API configuration."
    } else if (error.message && error.message.includes("404")) {
      errorMessage = "Model not found"
      userMessage = "The image generation model is not available. This feature may not be fully released yet."
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: userMessage,
        details: error.message,
      },
      { status: error.status || 500 },
    )
  }
}
