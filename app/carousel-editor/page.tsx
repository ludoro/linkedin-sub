"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TemplateCarouselEditor } from "@/components/template-carousel-editor"
import { carouselTemplates } from "@/lib/templates"
import { Sparkles, Layers } from "lucide-react"

export default function CarouselEditorPage() {
  const [content, setContent] = useState("")
  const [contentType, setContentType] = useState<'social' | 'newsletter'>('social')
  const [showEditor, setShowEditor] = useState(false)

  const handleGenerateCarousel = () => {
    if (content.trim()) {
      setShowEditor(true)
    }
  }

  const resetEditor = () => {
    setShowEditor(false)
    setContent("")
  }

  if (showEditor) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={resetEditor}
              className="flex items-center gap-2 mb-4"
            >
              ← Back to Input
            </Button>
          </div>
          
          <TemplateCarouselEditor
            content={content}
            contentType={contentType}
            onClose={resetEditor}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            Template-Based Carousel Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning carousels with our template-based editor. Choose from professional templates 
            and customize every element with real-time editing.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-6 w-6" />
              Available Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carouselTemplates.map((template) => (
                <div key={template.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-16 h-10 rounded border flex-shrink-0"
                      style={{ 
                        backgroundColor: template.backgroundColor,
                        aspectRatio: template.aspectRatio === '9:16' ? '9/16' : 
                                    template.aspectRatio === '16:9' ? '16/9' :
                                    template.aspectRatio === '1:1' ? '1/1' : '4/3'
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {template.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary-foreground rounded">
                      {template.aspectRatio}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Carousel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter your content here. You can include headlines, body text, and key points. Each line or paragraph will be used to create engaging carousel slides."
              />
            </div>

            <Button 
              onClick={handleGenerateCarousel}
              disabled={!content.trim()}
              className="w-full"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Template-Based Carousel
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Template Library:</strong> Choose from professionally designed templates for different use cases</li>
            <li>• <strong>Real-time Editing:</strong> Edit text and styles with live preview</li>
            <li>• <strong>ContentEditable:</strong> Direct text editing with WYSIWYG experience</li>
            <li>• <strong>Export Options:</strong> Download as PDF with high-quality rendering</li>
            <li>• <strong>Responsive Design:</strong> Templates work across different aspect ratios</li>
            <li>• <strong>Custom Styling:</strong> Full control over fonts, colors, and layout</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
