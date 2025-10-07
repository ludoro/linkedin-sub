"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Loader2,
  AlertCircle,
  Link,
  FileText,
  Globe,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MemoryManager } from "./memory-manager"
import { PromptManager } from "./prompt-manager"

interface ConversionResult {
  title: string
  summary: string
  hashtags: string[]
  instagram_caption: string
  tweet: string
  linkedin_post: string
  blog_post: string
  email_newsletter: string
  seo_keywords: string[]
  image_prompt: string
  carousel_data: {
    title: string
    summary: string
    items: {
      title: string
      description: string
    }[]
  }
}

interface Prompt {
  id: string
  title: string
  prompt_text: string
}

export function LinkConverter() {
  const router = useRouter()
  const pathname = usePathname()
  const [inputMode, setInputMode] = useState<"url" | "text">("url")
  const [url, setUrl] = useState("")
  const [articleText, setArticleText] = useState("")
  const [useMemory, setUseMemory] = useState(false)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch("/api/prompts/get")
        if (!response.ok) {
          throw new Error("Failed to fetch prompts.")
        }
        const data = await response.json()
        setPrompts(data.prompts)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch prompts. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchPrompts()
  }, [toast])

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handlePromptSelect = (prompt: string) => {
    if (prompt === "--none--") {
      setSelectedPrompt(null)
    } else {
      setSelectedPrompt(prompt)
    }
  }

  const handleConvert = async () => {


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
      let memories: string[] = []
      if (useMemory) {
        const response = await fetch("/api/memory/get")
        if (response.ok) {
          const data = await response.json()
          memories = data.memories
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch memories.",
            variant: "destructive",
          })
        }
      }

      console.log("Making API request to /api/convert")
      const requestBody =
        inputMode === "url"
          ? { url, mode: "url", memories, prompt: selectedPrompt }
          : { articleText, mode: "text", memories, prompt: selectedPrompt }

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

      const saveData = async (data: ConversionResult) => {
        const response = await fetch("/api/results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            ...(inputMode === "url" &&
              url && { originalUrl: url }),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save results.");
        }

        const { id } = await response.json();
        return id;
      };

      const newId = await saveData(data);
      router.push(`/results?id=${newId}`);


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


        <div className="flex gap-6">
          <div className="w-1/3 space-y-6">
            <MemoryManager />
            <PromptManager
              prompts={prompts}
              onPromptSelect={handlePromptSelect}
              setPrompts={setPrompts}
            />
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-memory"
                    checked={useMemory}
                    onCheckedChange={setUseMemory}
                  />
                  <Label htmlFor="use-memory">Use Memory</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt-select">Select a Prompt</Label>
                  <Select
                    onValueChange={handlePromptSelect}
                    value={selectedPrompt ?? "--none--"}
                  >
                    <SelectTrigger id="prompt-select">
                      <SelectValue placeholder="Select a prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="--none--">No prompt (default)</SelectItem>
                      {prompts.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.prompt_text}>
                          {prompt.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
