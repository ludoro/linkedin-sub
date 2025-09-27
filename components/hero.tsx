import { Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Zap className="h-4 w-4" />
          Powered by Gemini AI
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
          Transform Links into
          <span className="text-primary"> Engaging Content</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-6 text-pretty max-w-2xl mx-auto">
          Convert any web link into compelling social media posts and newsletter articles using advanced AI. Save hours
          of content creation with intelligent summarization.
        </p>
      </div>
    </section>
  )
}
