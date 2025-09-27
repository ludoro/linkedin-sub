"use client"

import { useState } from "react"
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

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content)
    setHasGeneratedContent(true)
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
