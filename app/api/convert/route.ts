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

    let sourceContent: string;
    let isSummary = false;

    if (mode === "url") {
      sourceContent = `the content at ${url}`;
    } else {
      if (articleText.length > 15000) {
        console.log("Article text is long, generating summary first...");
        isSummary = true;
        const summaryPrompt = `Summarize the following article text into a concise summary of around 300-400 words, extracting the key points and main arguments. Text to summarize:\n${articleText}`;
        const summaryResult = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [summaryPrompt],
        });
        sourceContent = summaryResult.text?.trim() || articleText;
        console.log("Summary generated, length:", sourceContent.length);
      } else {
        sourceContent = `the following article text:\n${articleText}`;
      }
    }

    let memoryStyle = ""
    if (memories && memories.length > 0) {
      if (memories.length > 10) {
        const stylePrompt = `Analyze the following writing examples and generate an incredibly detailed description of the writing style, tone, and voice.

        Examples:\n${memories.map((m: string) => `- "${m}"`).join("\n")}

        Description:`
        const styleResult = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [stylePrompt],
        })
        memoryStyle = `- Emulate the following writing style, tone, and voice:\n${styleResult.text}`
      } else {
        memoryStyle = `- Emulate the writing style, tone, and voice from the following examples:\n${memories.map((m: string) => `- "${m}"`).join("\n")}`
      }
    }

    const baseRequirements = `
    - Avoid AI slop, you MUST sound like a real human, not AI.
    - No over-the-top superlatives.
    ${memoryStyle}
  `;

  const contentDescription = isSummary ? `the following summary of an article:\n${sourceContent}` : sourceContent;

  const socialPrompt = `Create an engaging social media post from ${contentDescription}. 
    Requirements:
    - Focus on the key insight or value proposition
    - Use an engaging hook or question if appropriate
    - Never include any hashtags
    - The post must have 4 paragraphs.
    - Use a bullet point list if appropriate.
    ${baseRequirements}
    Generate only the social media post, no additional text:`;

  const newsletterPrompt = `Transform ${contentDescription} into a well-structured newsletter article. 
    Requirements:
    - Start with a TLDR summary.
    - Follow up with an "Introduction" section explaining the setting and the context.
    - One, two or three sections with the main points depending on the complexity of the content.
    - Make sure to outline tradeoffs if you see them.
    - Close with a main takeaway section for MLEs.
    - The newsletter should have minimum 1500 characters.
    ${baseRequirements}
    Generate only the newsletter content, no additional text:`;

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
