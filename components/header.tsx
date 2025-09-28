import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">LinkCraft</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6"></nav>
      </div>
    </header>
  )
}
