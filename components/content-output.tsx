"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Copy,
  CheckCircle,
  Share2,
  ImageIcon,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Layers,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TemplateCarouselEditor } from "./template-carousel-editor"

interface ContentOutputProps {
  title: string
  socialPost: string
  newsletter: string
  originalUrl?: string
}


export function ContentOutput({ title, socialPost, newsletter, originalUrl }: ContentOutputProps) {
  const [copiedContent, setCopiedContent] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<{ social?: string; newsletter?: string }>({})
  const [showImageForm, setShowImageForm] = useState<{ social: boolean; newsletter: boolean }>({
    social: false,
    newsletter: false,
  })
  const [imagePrompts, setImagePrompts] = useState<{ social: string; newsletter: string }>({
    social: "",
    newsletter: "",
  })
  
  // Carousel editor state
  const [showCarouselEditor, setShowCarouselEditor] = useState<{ social: boolean; newsletter: boolean }>({
    social: false,
    newsletter: false,
  })
  const [carouselContent, setCarouselContent] = useState<{ content: string; type: 'social' | 'newsletter' } | null>(null)
  
  // Editing state management
  const [isEditing, setIsEditing] = useState<{ social: boolean; newsletter: boolean }>({
    social: false,
    newsletter: false,
  })
  const [editedContent, setEditedContent] = useState<{ social: string; newsletter: string }>({
    social: socialPost,
    newsletter: newsletter,
  })
  const [originalContent, setOriginalContent] = useState<{ social: string; newsletter: string }>({
    social: socialPost,
    newsletter: newsletter,
  })
  
  
  const { toast } = useToast()

  const generateImage = async (content: string, type: "social" | "newsletter") => {
    setGeneratingImage(type)
    try {
      console.log("Generating image for:", type)
      const customPrompt = imagePrompts[type]
      let finalPrompt = content

      if (customPrompt.trim()) {
        // Put additional content on top of the main text
        finalPrompt = `${customPrompt}\n\n${content}`
      }

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          type: type,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.imageUrl) {
          setGeneratedImages((prev) => ({ ...prev, [type]: data.imageUrl }))
          setShowImageForm((prev) => ({ ...prev, [type]: false }))
          toast({
            title: "Image generated",
            description: `${type === "social" ? "Social media" : "Newsletter"} image created successfully`,
          })
        } else {
          toast({
            title: "Feature coming soon",
            description: data.message,
          })
        }
      } else {
        let title = "Image generation failed"
        let description = data.message || "Could not generate image"

        if (data.error === "API quota exceeded") {
          title = "Quota limit reached"
          description = "You've reached your Gemini API quota. Please wait or upgrade your plan."
        } else if (data.error === "Rate limit exceeded") {
          title = "Too many requests"
          description = "Please wait a moment before generating another image."
        } else if (data.error === "Model not found") {
          title = "Feature not available"
          description = "Image generation is not fully available yet. Please try again later."
        }

        toast({
          title,
          description,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Image generation error:", error)
      toast({
        title: "Network error",
        description: "Could not connect to image generation service",
        variant: "destructive",
      })
    } finally {
      setGeneratingImage(null)
    }
  }


  const copyToClipboard = async (type: "social" | "newsletter") => {
    const content = type === "social" ? currentSocialPost : currentNewsletter
    const typeLabel = type === "social" ? "Social post" : "Newsletter"
    try {
      await navigator.clipboard.writeText(content)
      setCopiedContent(typeLabel)
      toast({
        title: "Copied to clipboard",
        description: `${typeLabel} content copied successfully`,
      })
      setTimeout(() => setCopiedContent(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard",
        variant: "destructive",
      })
    }
  }


  // Editing functions
  const startEditing = (type: "social" | "newsletter") => {
    setIsEditing((prev) => ({ ...prev, [type]: true }))
    setOriginalContent((prev) => ({ ...prev, [type]: editedContent[type] }))
  }

  const cancelEditing = (type: "social" | "newsletter") => {
    setIsEditing((prev) => ({ ...prev, [type]: false }))
    setEditedContent((prev) => ({ ...prev, [type]: originalContent[type] }))
  }

  const saveEditing = (type: "social" | "newsletter") => {
    setIsEditing((prev) => ({ ...prev, [type]: false }))
    setOriginalContent((prev) => ({ ...prev, [type]: editedContent[type] }))
    toast({
      title: "Content updated",
      description: `${type === "social" ? "Social post" : "Newsletter"} has been saved`,
    })
  }

  const handleContentChange = (type: "social" | "newsletter", value: string) => {
    setEditedContent((prev) => ({ ...prev, [type]: value }))
  }

  // Handle opening carousel editor inline
  const openCarouselEditorInline = (type: "social" | "newsletter") => {
    const content = type === "social" ? currentSocialPost : currentNewsletter
    setCarouselContent({ content, type })
    setShowCarouselEditor((prev) => ({ ...prev, [type]: true }))
  }

  // Handle closing carousel editor
  const closeCarouselEditor = (type: "social" | "newsletter") => {
    setShowCarouselEditor((prev) => ({ ...prev, [type]: false }))
    setCarouselContent(null)
  }

  // Use edited content for display
  const currentSocialPost = editedContent.social
  const currentNewsletter = editedContent.newsletter

  return (
    <>
      <div className="space-y-6">
        {/* Header with title and actions */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                {originalUrl && (
                  <p className="text-sm text-muted-foreground">
                    Generated from: <span className="font-mono text-xs">{originalUrl}</span>
                  </p>
                )}
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Generated
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Social Media Post */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5" />
                Social Media Post
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">

            {isEditing.social ? (
              <div className="space-y-3">
                <Textarea
                  value={editedContent.social}
                  onChange={(e) => handleContentChange("social", e.target.value)}
                  className="min-h-[100px] text-sm leading-relaxed"
                  placeholder="Enter your social media post..."
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveEditing("social")}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelEditing("social")}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{currentSocialPost}</p>
              </div>
            )}


            {generatedImages.social && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Generated Image</h4>
                <img
                  src={generatedImages.social || "/placeholder.svg"}
                  alt="Generated social media image"
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            )}

            {showImageForm.social && (
              <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Generate Custom Image</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageForm((prev) => ({ ...prev, social: false }))}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Describe the image you want (optional - this will be added on top of the post content)
                  </label>
                  <Input
                    placeholder="e.g., Modern minimalist design, bright colors, include tech elements..."
                    value={imagePrompts.social}
                    onChange={(e) => setImagePrompts((prev) => ({ ...prev, social: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => generateImage(currentSocialPost, "social")}
                    disabled={generatingImage === "social"}
                    className="flex items-center gap-2"
                  >
                    {generatingImage === "social" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    Generate Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageForm((prev) => ({ ...prev, social: false }))}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-2 flex-wrap">
              {!isEditing.social && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("social")}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard("social")}
                className="flex items-center gap-2"
              >
                {copiedContent === "Social post" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageForm((prev) => ({ ...prev, social: !prev.social }))}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                {showImageForm.social ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCarouselEditorInline('social')}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Generate Carousel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Carousel Editor */}
        {showCarouselEditor.social && carouselContent?.type === 'social' && (
          <TemplateCarouselEditor
            content={carouselContent.content}
            contentType="social"
            onClose={() => closeCarouselEditor('social')}
          />
        )}

        {/* Newsletter Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">Newsletter Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {isEditing.newsletter ? (
              <div className="space-y-3">
                <Textarea
                  value={editedContent.newsletter}
                  onChange={(e) => handleContentChange("newsletter", e.target.value)}
                  className="min-h-[200px] text-sm leading-relaxed"
                  placeholder="Enter your newsletter content..."
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveEditing("newsletter")}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelEditing("newsletter")}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-muted rounded-lg">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap leading-relaxed">{currentNewsletter}</div>
                </div>
              </div>
            )}

            {generatedImages.newsletter && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Generated Image</h4>
                <img
                  src={generatedImages.newsletter || "/placeholder.svg"}
                  alt="Generated newsletter image"
                  className="w-full max-w-2xl rounded-lg border"
                />
              </div>
            )}

            {showImageForm.newsletter && (
              <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Generate Custom Image</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageForm((prev) => ({ ...prev, newsletter: false }))}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Describe the image you want (optional - this will be added on top of the article content)
                  </label>
                  <Input
                    placeholder="e.g., Professional header image, corporate style, relevant to article topic..."
                    value={imagePrompts.newsletter}
                    onChange={(e) => setImagePrompts((prev) => ({ ...prev, newsletter: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => generateImage(currentNewsletter, "newsletter")}
                    disabled={generatingImage === "newsletter"}
                    className="flex items-center gap-2"
                  >
                    {generatingImage === "newsletter" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    Generate Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageForm((prev) => ({ ...prev, newsletter: false }))}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-2 flex-wrap">
              {!isEditing.newsletter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("newsletter")}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard("newsletter")}
                className="flex items-center gap-2"
              >
                {copiedContent === "Newsletter" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageForm((prev) => ({ ...prev, newsletter: !prev.newsletter }))}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                {showImageForm.newsletter ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCarouselEditorInline('newsletter')}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Generate Carousel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Carousel Editor */}
        {showCarouselEditor.newsletter && carouselContent?.type === 'newsletter' && (
          <TemplateCarouselEditor
            content={carouselContent.content}
            contentType="newsletter"
            onClose={() => closeCarouselEditor('newsletter')}
          />
        )}
      </div>

    </>
  )
}
