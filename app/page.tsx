"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { LinkConverter } from "@/components/link-converter"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <LinkConverter />
      <Features />
      <Pricing />
    </main>
  )
}
