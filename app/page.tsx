"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LinkConverter } from "@/components/link-converter"

interface GeneratedContent {
  title: string
  socialPost: string
  newsletter: string
  originalUrl?: string
}

export default function HomePage() {
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  // Scroll to top when component mounts with existing content (e.g., after refresh)
  useEffect(() => {
    if (hasGeneratedContent) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [hasGeneratedContent])

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content)
    setHasGeneratedContent(true)
    // Scroll to top when content is generated
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LinkConverter 
        onContentGenerated={handleContentGenerated}
        initialContent={generatedContent}
      />
      {!hasGeneratedContent && <Features />}
    </main>
  )
}
