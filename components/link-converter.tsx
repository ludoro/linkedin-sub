"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Loader2, AlertCircle, Type } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ContentOutput } from "./content-output"

interface ConversionResult {
  socialPost: string
  newsletter: string
  title: string
}

interface LinkConverterProps {
  onContentGenerated?: (hasContent: boolean) => void
}

export function LinkConverter({ onContentGenerated }: LinkConverterProps) {
  const [url, setUrl] = useState("")
  const [textPrompt, setTextPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)
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
    console.log("Convert button clicked, URL:", url)

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

    console.log("Starting conversion process")
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Making API request to /api/convert")
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, textPrompt }),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("API error response:", errorData)
        throw new Error(errorData.error || "Failed to convert link")
      }

      const data = await response.json()
      console.log("API success response:", data)
      setResult(data)
      onContentGenerated?.(true)
      toast({
        title: "Conversion successful",
        description: "Your content has been generated successfully",
      })
    } catch (error) {
      console.log("Conversion error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
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

  const handleNewConversion = () => {
    setResult(null)
    setUrl("")
    setTextPrompt("")
    setError(null)
    onContentGenerated?.(false)
  }

  return (
    <section className="pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {!result ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
              <p className="text-muted-foreground">Paste any link and watch AI transform it into engaging content</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Link to Content Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Generated Content</h2>
              <Button variant="outline" onClick={handleNewConversion}>
                Convert Another Link
              </Button>
            </div>

            <ContentOutput
              title={result.title}
              socialPost={result.socialPost}
              newsletter={result.newsletter}
              originalUrl={url}
            />
          </>
        )}
      </div>
    </section>
  )
}
