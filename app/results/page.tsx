"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ContentOutput } from "@/components/content-output"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

interface GeneratedContent {
  title: string
  socialPost: string
  newsletter: string
  originalUrl?: string
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get content from URL search params
    const title = searchParams.get('title')
    const socialPost = searchParams.get('socialPost')
    const newsletter = searchParams.get('newsletter')
    const originalUrl = searchParams.get('originalUrl')

    if (title && socialPost && newsletter) {
      setContent({
        title: decodeURIComponent(title),
        socialPost: decodeURIComponent(socialPost),
        newsletter: decodeURIComponent(newsletter),
        originalUrl: originalUrl ? decodeURIComponent(originalUrl) : undefined
      })
    } else {
      setError("No content found. Please try converting again.")
    }
    setIsLoading(false)
  }, [searchParams])

  const handleBackToConverter = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading results...</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleBackToConverter} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Converter
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToConverter}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Converter
          </Button>
        </div>
        
        <ContentOutput
          title={content.title}
          socialPost={content.socialPost}
          newsletter={content.newsletter}
          originalUrl={content.originalUrl}
        />
      </div>
    </main>
  )
}
