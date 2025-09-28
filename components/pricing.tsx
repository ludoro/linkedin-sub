import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const pricingTiers = [
  {
    title: "✨ Starter",
    price: "$19",
    description: "Unlimited text + carousel generation.",
    features: [
      "10 image credits / mo included ($10 value)",
      "Extra credits: $1 / image",
    ],
    buttonText: "Get Started",
  },
  {
    title: "🚀 Pro",
    price: "$49",
    description: "Unlimited text + carousel generation.",
    features: [
      "50 image credits / mo included ($50 value)",
      "Extra credits: $0.80 / image",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    title: "🏆 Team",
    price: "$99",
    description: "Unlimited text + carousel generation.",
    features: [
      "150 image credits / mo included ($150 value)",
      "Extra credits: $0.60 / image",
    ],
    buttonText: "Contact Sales",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the plan that's right for you</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent pricing for every need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`border-border/50 flex flex-col ${tier.popular ? "border-primary/80" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{tier.title}</CardTitle>
                <p className="text-4xl font-bold">{tier.price} <span className="text-lg font-normal text-muted-foreground">/ mo</span></p>
                <p className="text-muted-foreground pt-4">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
