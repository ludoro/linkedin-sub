"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LinkConverter } from "@/components/link-converter"

export default function HomePage() {
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LinkConverter onContentGenerated={setHasGeneratedContent} />
      {!hasGeneratedContent && <Features />}
    </main>
  )
}
