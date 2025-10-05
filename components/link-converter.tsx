"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Loader2, AlertCircle, Type, FileText, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"

interface ConversionResult {
  socialPost: string
  newsletter: string
  title: string
}

import { MemoryManager } from "./memory-manager"

export function LinkConverter() {
  const router = useRouter()
  const pathname = usePathname()
  const [inputMode, setInputMode] = useState<"url" | "text">("url")
  const [url, setUrl] = useState("")
  const [articleText, setArticleText] = useState("")
  const [textPrompt, setTextPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleConvert = async () => {
    if (pathname === "/") {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }
    }

    console.log("Convert button clicked, mode:", inputMode)

    if (inputMode === "url") {
      if (!url) {
        console.log("No URL provided")
        setError("Please enter a URL")
        return
      }

      if (!isValidUrl(url)) {
        console.log("Invalid URL provided:", url)
        setError("Please enter a valid URL")
        return
      }
    } else {
      if (!articleText.trim()) {
        console.log("No article text provided")
        setError("Please enter article text")
        return
      }
    }

    console.log("Starting conversion process")
    setIsLoading(true)
    setError(null)

    try {
      console.log("Making API request to /api/convert")
      const requestBody =
        inputMode === "url"
          ? { url, textPrompt, mode: "url" }
          : { articleText, textPrompt, mode: "text" }

      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("API error response:", errorData)
        throw new Error(errorData.error || "Failed to convert content")
      }

      const data = await response.json()
      console.log("API success response:", data)

      // Navigate to results page with the generated content
      const params = new URLSearchParams({
        title: encodeURIComponent(data.title),
        socialPost: encodeURIComponent(data.socialPost),
        newsletter: encodeURIComponent(data.newsletter),
        ...(inputMode === "url" &&
          url && { originalUrl: encodeURIComponent(url) }),
      })

      router.push(`/results?${params.toString()}`)

      toast({
        title: "Conversion successful",
        description: "Redirecting to results page...",
      })
    } catch (error) {
      console.log("Conversion error:", error)
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Conversion failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      console.log("Conversion process completed")
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleConvert()
    }
  }

  return (
    <section className="pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
          <p className="text-muted-foreground">
            {inputMode === "url"
              ? "Paste any link and watch AI transform it into engaging content"
              : "Paste your article text and watch AI transform it into engaging content"}
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-1/3">
            <MemoryManager />
          </div>
          <div className="w-2/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {inputMode === "url" ? (
                    <Link className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  {inputMode === "url"
                    ? "Link to Content Converter"
                    : "Text to Content Converter"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input Mode Toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant={inputMode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setInputMode("url")
                      setError(null)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    URL
                  </Button>
                  <Button
                    variant={inputMode === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setInputMode("text")
                      setError(null)
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Text
                  </Button>
                </div>

                {inputMode === "url" ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value)
                          setError(null)
                        }}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={() => {
                          console.log("Button clicked!")
                          handleConvert()
                        }}
                        disabled={!url || isLoading || !isValidUrl(url)}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Converting
                          </>
                        ) : (
                          "Convert"
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Text Style Prompt (Optional)
                      </label>
                      <Textarea
                        placeholder="e.g., Make it casual and friendly, use emojis, target young professionals..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        className="min-h-[80px]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Article Text
                      </label>
                      <Textarea
                        placeholder="Paste your article text here..."
                        value={articleText}
                        onChange={(e) => {
                          setArticleText(e.target.value)
                          setError(null)
                        }}
                        className="min-h-[200px]"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Text Style Prompt (Optional)
                      </label>
                      <Textarea
                        placeholder="e.g., Make it casual and friendly, use emojis, target young professionals..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        className="min-h-[80px]"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      onClick={() => {
                        console.log("Button clicked!")
                        handleConvert()
                      }}
                      disabled={!articleText.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Converting
                        </>
                      ) : (
                        "Convert"
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
