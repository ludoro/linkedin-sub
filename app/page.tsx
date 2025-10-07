import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { LinkConverterHome } from "./link-converter-home"

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <LinkConverterHome />
      <Features />
      <Pricing />
    </main>
  )
}
