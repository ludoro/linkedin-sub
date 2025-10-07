import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Share2, Mail, Clock, Target, Sparkles } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description: "Advanced Gemini AI extracts key insights and transforms content intelligently",
  },
  {
    icon: Share2,
    title: "Social Media Ready",
    description: "Generate engaging posts optimized for Twitter, LinkedIn, and other platforms",
  },
  {
    icon: Mail,
    title: "Newsletter Format",
    description: "Create professional newsletter content with proper structure and flow",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get converted content in seconds, not hours of manual writing",
  },
  {
    icon: Target,
    title: "Audience Focused",
    description: "Content tailored for maximum engagement and readability",
  },
  {
    icon: Sparkles,
    title: "Add Your Memories",
    description: "Add your own memories to make the content truly yours and fit your style",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Content Creators</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform links into engaging content across all your channels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
