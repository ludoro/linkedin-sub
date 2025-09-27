"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Save,
  X,
  Eye,
  Edit3,
  Download,
  FileText,
  Settings,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Layers,
  Grid3X3,
  Sparkles
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CarouselSlide } from "@/types/carousel"
import { CarouselTemplate, TemplateElement } from "@/types/template"
import { carouselTemplates, getTemplateById, createSlideFromTemplate } from "@/lib/templates"
import { ContentEditableEditor } from "./contenteditable-editor"

const fontOptions = [
  { value: 'inter', label: 'Inter', class: 'font-sans' },
  { value: 'roboto', label: 'Roboto', class: 'font-sans' },
  { value: 'opensans', label: 'Open Sans', class: 'font-sans' },
  { value: 'playfair', label: 'Playfair Display', class: 'font-serif' },
  { value: 'montserrat', label: 'Montserrat', class: 'font-sans' },
  { value: 'lato', label: 'Lato', class: 'font-sans' }
]

const fontWeightOptions = [
  { value: 'normal', label: 'Normal', icon: Type },
  { value: 'medium', label: 'Medium', icon: Type },
  { value: 'semibold', label: 'Semi Bold', icon: Bold },
  { value: 'bold', label: 'Bold', icon: Bold }
]

const textAlignOptions = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight }
]

interface TemplateCarouselEditorProps {
  content: string
  contentType: 'social' | 'newsletter'
  onClose?: () => void
}

export function TemplateCarouselEditor({ content, contentType, onClose }: TemplateCarouselEditorProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate | null>(null)
  const [editingElement, setEditingElement] = useState<TemplateElement | null>(null)
  const { toast } = useToast()
  const slideRef = useRef<HTMLDivElement>(null)

  // Generate carousel slides when component mounts
  useEffect(() => {
    if (content && slides.length === 0) {
      generateCarousel()
    }
  }, [content])

  const generateCarousel = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type: contentType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSlides(data.slides)
        toast({
          title: "Carousel generated",
          description: "Your carousel slides have been created successfully",
        })
      } else {
        toast({
          title: "Generation failed",
          description: data.error || "Could not generate carousel",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Carousel generation error:", error)
      toast({
        title: "Network error",
        description: "Could not connect to carousel generation service",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const applyTemplate = (template: CarouselTemplate) => {
    setSelectedTemplate(template)
    
    // Convert content into slides using the template
    const contentLines = content.split('\n').filter(line => line.trim())
    const slidesPerTemplate = Math.ceil(contentLines.length / 2) // Rough estimate
    
    const newSlides = []
    for (let i = 0; i < Math.max(slidesPerTemplate, 3); i++) {
      const slideContent = contentLines.slice(i * 2, (i + 1) * 2).join('\n') || content
      const slide = createSlideFromTemplate(template, i + 1, slideContent)
      newSlides.push(slide)
    }
    
    setSlides(newSlides)
    toast({
      title: "Template applied",
      description: `${template.name} template has been applied to your carousel`,
    })
  }

  const handleSlideUpdate = (slideIndex: number, updatedSlide: CarouselSlide) => {
    setSlides(prev => prev.map((slide, index) => 
      index === slideIndex ? updatedSlide : slide
    ))
  }

  const handleElementUpdate = (elementId: string, updates: Partial<TemplateElement>) => {
    if (!editingSlide) return
    
    const updatedSlide = {
      ...editingSlide,
      elements: editingSlide.elements?.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ) || []
    }
    
    setEditingSlide(updatedSlide)
  }

  const startEditing = (slideIndex: number) => {
    setEditingSlide(slides[slideIndex])
    setIsEditing(true)
  }

  const startElementEditing = (element: TemplateElement) => {
    setEditingElement(element)
  }

  const saveEditing = () => {
    if (editingSlide) {
      handleSlideUpdate(currentSlide, editingSlide)
      setIsEditing(false)
      setEditingSlide(null)
      setEditingElement(null)
      toast({
        title: "Slide updated",
        description: "Your changes have been saved",
      })
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingSlide(null)
    setEditingElement(null)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  const getTextSizeClass = (size: string) => {
    switch (size) {
      case 'large': return 'text-3xl'
      case 'medium': return 'text-xl'
      case 'small': return 'text-lg'
      default: return 'text-xl'
    }
  }

  const getFontClass = (fontFamily: string) => {
    const font = fontOptions.find(f => f.value === fontFamily)
    return font?.class || 'font-sans'
  }

  const getFontWeightClass = (weight: string) => {
    switch (weight) {
      case 'normal': return 'font-normal'
      case 'medium': return 'font-medium'
      case 'semibold': return 'font-semibold'
      case 'bold': return 'font-bold'
      default: return 'font-medium'
    }
  }

  const getTextAlignClass = (align: string) => {
    switch (align) {
      case 'left': return 'text-left'
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }

  const getCSSFontFamily = (fontFamily: string) => {
    switch (fontFamily) {
      case 'inter': return 'Inter, sans-serif'
      case 'roboto': return 'Roboto, sans-serif'
      case 'opensans': return 'Open Sans, sans-serif'
      case 'playfair': return 'Playfair Display, serif'
      case 'montserrat': return 'Montserrat, sans-serif'
      case 'lato': return 'Lato, sans-serif'
      default: return 'Inter, sans-serif'
    }
  }

  const convertToRGB = (color: string): string => {
    if (!color) return '#ffffff'
    
    if (color.startsWith('#')) return color
    if (color.startsWith('rgb')) return color
    
    if (color.includes('oklch') || color.includes('lch') || color.includes('lab') || color.includes('var(') || color.includes('hsl')) {
      try {
        const tempEl = document.createElement('div')
        tempEl.style.color = color
        tempEl.style.visibility = 'hidden'
        tempEl.style.position = 'absolute'
        tempEl.style.top = '-9999px'
        tempEl.style.left = '-9999px'
        tempEl.style.pointerEvents = 'none'
        document.body.appendChild(tempEl)
        
        tempEl.offsetHeight
        
        const computedColor = window.getComputedStyle(tempEl).color
        document.body.removeChild(tempEl)
        
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
      } catch (error) {
        console.warn('Failed to convert color:', color, error)
      }
    }
    
    return '#ffffff'
  }

  const exportCarousel = async () => {
    setIsExporting(true)
    try {
      if (slides.length === 0) {
        throw new Error('No slides to export')
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        const slide = slides[i]
        const template = selectedTemplate || getTemplateById(slide.templateId || '')

        try {
          const tempContainer = document.createElement('div')
          tempContainer.style.position = 'absolute'
          tempContainer.style.left = '-2000px'
          tempContainer.style.top = '0'
          tempContainer.style.width = '800px'
          tempContainer.style.height = '600px'
          tempContainer.style.backgroundColor = convertToRGB(slide.backgroundColor || '#ffffff')
          tempContainer.style.padding = '60px'
          tempContainer.style.display = 'flex'
          tempContainer.style.flexDirection = 'column'
          tempContainer.style.justifyContent = 'center'
          tempContainer.style.alignItems = slide.textAlign === 'left' ? 'flex-start' : slide.textAlign === 'right' ? 'flex-end' : 'center'
          tempContainer.style.borderRadius = '16px'
          tempContainer.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
          tempContainer.style.zIndex = '-1'
          tempContainer.style.visibility = 'hidden'
          tempContainer.style.opacity = '0'
          tempContainer.style.pointerEvents = 'none'

          if (slide.backgroundImage) {
            tempContainer.style.backgroundImage = `url(${slide.backgroundImage})`
            tempContainer.style.backgroundSize = 'cover'
            tempContainer.style.backgroundPosition = 'center'
            tempContainer.style.backgroundRepeat = 'no-repeat'
          }

          // If using template elements, render them
          if (slide.elements && template) {
            slide.elements.forEach(element => {
              if (element.type === 'text') {
                const textEl = document.createElement('div')
                textEl.textContent = element.content
                textEl.style.position = 'absolute'
                textEl.style.left = `${element.position.x}%`
                textEl.style.top = `${element.position.y}%`
                textEl.style.width = `${element.position.width}%`
                textEl.style.height = `${element.position.height}%`
                textEl.style.fontSize = `${element.style.fontSize || 24}px`
                textEl.style.color = convertToRGB(element.style.color)
                textEl.style.fontFamily = getCSSFontFamily(element.style.fontFamily)
                textEl.style.fontWeight = element.style.fontWeight || 'normal'
                textEl.style.textAlign = element.style.textAlign
                textEl.style.display = 'flex'
                textEl.style.alignItems = 'center'
                textEl.style.justifyContent = element.style.textAlign === 'center' ? 'center' : element.style.textAlign === 'right' ? 'flex-end' : 'flex-start'
                tempContainer.appendChild(textEl)
              } else if (element.type === 'shape') {
                const shapeEl = document.createElement('div')
                shapeEl.style.position = 'absolute'
                shapeEl.style.left = `${element.position.x}%`
                shapeEl.style.top = `${element.position.y}%`
                shapeEl.style.width = `${element.position.width}%`
                shapeEl.style.height = `${element.position.height}%`
                shapeEl.style.backgroundColor = convertToRGB(element.style.backgroundColor || '#000000')
                shapeEl.style.borderRadius = `${element.style.borderRadius || 0}px`
                tempContainer.appendChild(shapeEl)
              }
            })
          } else {
            // Fallback to simple text rendering
            const headline = document.createElement('h2')
            headline.textContent = slide.headline || 'Slide Title'
            headline.style.marginBottom = '24px'
            headline.style.lineHeight = '1.2'
            headline.style.fontSize = slide.textSize === 'large' ? '36px' : slide.textSize === 'small' ? '24px' : '30px'
            headline.style.fontWeight = slide.fontWeight || 'bold'
            headline.style.fontFamily = getCSSFontFamily(slide.fontFamily || 'inter')
            headline.style.color = convertToRGB(slide.textColor || '#000000')
            headline.style.textAlign = slide.textAlign || 'center'
            headline.style.margin = '0 0 24px 0'

            const content = document.createElement('p')
            content.textContent = slide.content || 'Slide content goes here...'
            content.style.fontSize = slide.textSize === 'large' ? '24px' : slide.textSize === 'small' ? '16px' : '20px'
            content.style.fontWeight = 'normal'
            content.style.lineHeight = '1.5'
            content.style.fontFamily = getCSSFontFamily(slide.fontFamily || 'inter')
            content.style.color = convertToRGB(slide.textColor || '#000000')
            content.style.textAlign = slide.textAlign || 'center'
            content.style.margin = '0'
            content.style.maxWidth = '100%'

            tempContainer.appendChild(headline)
            tempContainer.appendChild(content)
          }

          document.body.appendChild(tempContainer)

          await new Promise(resolve => setTimeout(resolve, 500))

          const canvas = await html2canvas(tempContainer, {
            backgroundColor: convertToRGB(slide.backgroundColor || '#ffffff'),
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            width: 800,
            height: 600,
            logging: false,
            removeContainer: false,
            foreignObjectRendering: false,
            imageTimeout: 5000
          })

          try {
            if (tempContainer && tempContainer.parentNode) {
              document.body.removeChild(tempContainer)
            }
          } catch (removeError) {
            console.warn('Could not remove temporary container:', removeError)
          }

          if (canvas.width === 0 || canvas.height === 0) {
            console.error(`Empty canvas for slide ${i + 1} - skipping`)
            continue
          }

          const imgData = canvas.toDataURL('image/png', 0.95)
          
          if (imgData === 'data:,' || !imgData || imgData.length < 100) {
            console.error(`Invalid image data for slide ${i + 1} - skipping`)
            continue
          }

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = canvas.width
          const imgHeight = canvas.height
          
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9
          const imgX = (pdfWidth - imgWidth * ratio) / 2
          const imgY = (pdfHeight - imgHeight * ratio) / 2

          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        } catch (slideError) {
          console.error(`Error processing slide ${i + 1}:`, slideError)
          
          try {
            if (tempContainer && tempContainer.parentNode) {
              document.body.removeChild(tempContainer)
            }
          } catch (removeError) {
            console.warn('Could not remove temporary container after error:', removeError)
          }
          
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          pdf.setFontSize(16)
          pdf.text(`Error loading slide ${i + 1}`, pdfWidth / 2 - 40, pdfHeight / 2)
          pdf.setFontSize(12)
          pdf.text(`Error: ${slideError.message || 'Unknown error'}`, pdfWidth / 2 - 60, pdfHeight / 2 + 10)
        }
      }

      const fileName = `carousel-${contentType}-${new Date().getTime()}.pdf`
      pdf.save(fileName)

      toast({
        title: "Carousel exported",
        description: `Carousel exported as PDF with ${slides.length} slides`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Could not export carousel. Please try again.",
        variant: "destructive",
      })
    } finally {
      const tempElements = document.querySelectorAll('[style*="-2000px"]')
      tempElements.forEach(el => {
        try {
          if (el.parentNode) {
            el.parentNode.removeChild(el)
          }
        } catch (cleanupError) {
          console.warn('Could not remove temporary element:', cleanupError)
        }
      })
      
      setIsExporting(false)
    }
  }

  const renderSlidePreview = (slide: CarouselSlide, template?: CarouselTemplate) => {
    if (slide.elements && template) {
      // Render template-based slide
      return (
        <div className="relative w-full h-full overflow-hidden">
          {slide.elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.position.x}%`,
                top: `${element.position.y}%`,
                width: `${element.position.width}%`,
                height: `${element.position.height}%`,
                fontSize: `${element.style.fontSize || 24}px`,
                color: element.style.color,
                fontFamily: getCSSFontFamily(element.style.fontFamily),
                fontWeight: element.style.fontWeight,
                textAlign: element.style.textAlign,
                backgroundColor: element.style.backgroundColor,
                borderRadius: `${element.style.borderRadius || 0}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: element.style.textAlign === 'center' ? 'center' : element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
                padding: `${element.style.padding || 0}px`,
                margin: `${element.style.margin || 0}px`,
                cursor: element.editable ? 'pointer' : 'default'
              }}
              onClick={() => element.editable && startElementEditing(element)}
            >
              {element.type === 'text' ? (
                <span className={element.editable ? 'hover:bg-blue-100 rounded px-1' : ''}>
                  {element.content}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )
    } else {
      // Render simple slide
      return (
        <div className={`relative z-20 w-full ${getTextAlignClass(slide.textAlign || 'center')}`}>
          <h2 className={`${getTextSizeClass(slide.textSize || 'medium')} ${getFontClass(slide.fontFamily || 'inter')} ${getFontWeightClass(slide.fontWeight || 'bold')} mb-4 leading-tight`}>
            {slide.headline || 'Slide Title'}
          </h2>
          <p className={`text-base ${getFontClass(slide.fontFamily || 'inter')} ${getFontWeightClass(slide.fontWeight || 'normal')} leading-relaxed`}>
            {slide.content || 'Slide content goes here...'}
          </p>
        </div>
      )
    }
  }

  if (isGenerating) {
    return (
      <Card className="mt-6">
        <CardContent className="py-20">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Generating your carousel slides...</h3>
            <p className="text-muted-foreground">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slides.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="py-20">
          <div className="text-center space-y-4">
            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">No carousel slides available</h3>
            <p className="text-muted-foreground">Generate slides to start editing your carousel</p>
            <Button onClick={generateCarousel} size="lg">
              Generate Carousel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Sparkles className="h-6 w-6" />
            Template-Based Carousel Editor
          </CardTitle>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Template Selection - Full Width */}
          <div className="w-full">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  Choose Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {carouselTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-20 h-16 rounded border shadow-sm"
                          style={{ 
                            backgroundColor: template.backgroundColor,
                            aspectRatio: template.aspectRatio === '9:16' ? '9/16' : 
                                        template.aspectRatio === '16:9' ? '16/9' :
                                        template.aspectRatio === '1:1' ? '1/1' : '4/3'
                          }}
                        />
                        <div className="text-center">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                          <Badge variant="outline" className="text-xs mt-2">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Preview
                    </CardTitle>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      Slide {currentSlide + 1} of {slides.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      ref={slideRef}
                      className="w-full max-w-sm aspect-[9/16] rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 relative overflow-hidden border-2 border-gray-200"
                      style={{
                        backgroundColor: slides[currentSlide]?.backgroundColor || '#ffffff',
                        color: slides[currentSlide]?.textColor || '#000000',
                        backgroundImage: slides[currentSlide]?.backgroundImage ? `url(${slides[currentSlide].backgroundImage})` : undefined,
                        backgroundSize: slides[currentSlide]?.backgroundImage ? 'cover' : undefined,
                        backgroundPosition: slides[currentSlide]?.backgroundImage ? 'center' : undefined,
                        backgroundRepeat: slides[currentSlide]?.backgroundImage ? 'no-repeat' : undefined,
                        minHeight: '400px',
                        minWidth: '300px'
                      }}
                    >
                      {slides[currentSlide]?.backgroundImage && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10" />
                      )}
                      {slides[currentSlide] && renderSlidePreview(slides[currentSlide], selectedTemplate || undefined)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={prevSlide}
                      disabled={slides.length <= 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentSlide 
                              ? 'bg-primary scale-125' 
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={nextSlide}
                      disabled={slides.length <= 1}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Editor */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Editor
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(currentSlide)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveEditing}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                {editingElement ? (
                  <ContentEditableEditor
                    element={editingElement}
                    onSave={(updates) => {
                      handleElementUpdate(editingElement.id, updates)
                      setEditingElement(null)
                    }}
                    onCancel={() => setEditingElement(null)}
                  />
                ) : isEditing && editingSlide ? (
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="style">Style</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-6 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="headline" className="text-sm font-medium">Headline</Label>
                          <Textarea
                            id="headline"
                            value={editingSlide.headline}
                            onChange={(e) => setEditingSlide(prev => 
                              prev ? { ...prev, headline: e.target.value } : null
                            )}
                            className="min-h-[100px] text-sm"
                            placeholder="Enter compelling headline..."
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                          <Textarea
                            id="content"
                            value={editingSlide.content}
                            onChange={(e) => setEditingSlide(prev => 
                              prev ? { ...prev, content: e.target.value } : null
                            )}
                            className="min-h-[140px] text-sm"
                            placeholder="Enter slide content..."
                          />
                        </div>
                      </div>

                      {editingSlide.elements && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">Template Elements</h4>
                          <div className="space-y-3">
                            {editingSlide.elements.map((element) => (
                              <div key={element.id} className="p-4 border rounded-lg bg-gray-50/50">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium capitalize">{element.id}</span>
                                  {element.editable && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => startElementEditing(element)}
                                      className="h-8"
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </div>
                                <div className="p-3 bg-white rounded border text-sm">
                                  {element.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="style" className="space-y-6 mt-4">
                      {/* Color Controls */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Colors</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Background Color</Label>
                            <div className="flex gap-3">
                              <Input
                                type="color"
                                value={editingSlide.backgroundColor}
                                onChange={(e) => setEditingSlide(prev => 
                                  prev ? { ...prev, backgroundColor: e.target.value } : null
                                )}
                                className="w-16 h-12 p-1 border rounded-lg cursor-pointer"
                              />
                              <Input
                                value={editingSlide.backgroundColor}
                                onChange={(e) => setEditingSlide(prev => 
                                  prev ? { ...prev, backgroundColor: e.target.value } : null
                                )}
                                className="flex-1 h-12 text-sm"
                                placeholder="#ffffff"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Text Color</Label>
                            <div className="flex gap-3">
                              <Input
                                type="color"
                                value={editingSlide.textColor}
                                onChange={(e) => setEditingSlide(prev => 
                                  prev ? { ...prev, textColor: e.target.value } : null
                                )}
                                className="w-16 h-12 p-1 border rounded-lg cursor-pointer"
                              />
                              <Input
                                value={editingSlide.textColor}
                                onChange={(e) => setEditingSlide(prev => 
                                  prev ? { ...prev, textColor: e.target.value } : null
                                )}
                                className="flex-1 h-12 text-sm"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Typography Controls */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Typography</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Font Family</Label>
                            <Select
                              value={editingSlide.fontFamily}
                              onValueChange={(value: any) => 
                                setEditingSlide(prev => 
                                  prev ? { ...prev, fontFamily: value } : null
                                )
                              }
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fontOptions.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Text Size</Label>
                              <Select
                                value={editingSlide.textSize}
                                onValueChange={(value: 'large' | 'medium' | 'small') => 
                                  setEditingSlide(prev => 
                                    prev ? { ...prev, textSize: value } : null
                                  )
                                }
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Font Weight</Label>
                              <Select
                                value={editingSlide.fontWeight}
                                onValueChange={(value: 'normal' | 'medium' | 'semibold' | 'bold') => 
                                  setEditingSlide(prev => 
                                    prev ? { ...prev, fontWeight: value } : null
                                  )
                                }
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fontWeightOptions.map((weight) => (
                                    <SelectItem key={weight.value} value={weight.value}>
                                      {weight.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alignment Controls */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Alignment</h4>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Text Alignment</Label>
                          <div className="flex gap-2">
                            {textAlignOptions.map((align) => (
                              <Button
                                key={align.value}
                                variant={editingSlide.textAlign === align.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setEditingSlide(prev => 
                                  prev ? { ...prev, textAlign: align.value as any } : null
                                )}
                                className="flex items-center gap-2 h-12 px-4"
                              >
                                <align.icon className="h-4 w-4" />
                                {align.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="font-medium text-sm">Headline</span>
                        <p className="text-muted-foreground text-sm p-3 bg-gray-50 rounded border">
                          {slides[currentSlide]?.headline}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-medium text-sm">Content</span>
                        <p className="text-muted-foreground text-sm p-3 bg-gray-50 rounded border line-clamp-4">
                          {slides[currentSlide]?.content}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Design Properties</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <span className="font-medium text-sm">Colors</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                              <div 
                                className="w-6 h-6 rounded border shadow-sm"
                                style={{ backgroundColor: slides[currentSlide]?.backgroundColor }}
                              />
                              <div>
                                <p className="text-xs font-medium">Background</p>
                                <p className="text-xs text-muted-foreground">
                                  {slides[currentSlide]?.backgroundColor}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                              <div 
                                className="w-6 h-6 rounded border shadow-sm"
                                style={{ backgroundColor: slides[currentSlide]?.textColor }}
                              />
                              <div>
                                <p className="text-xs font-medium">Text</p>
                                <p className="text-xs text-muted-foreground">
                                  {slides[currentSlide]?.textColor}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="font-medium text-sm">Typography</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded border">
                              <p className="text-xs font-medium mb-1">Font</p>
                              <Badge variant="outline" className="text-xs">
                                {slides[currentSlide]?.fontFamily}
                              </Badge>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border">
                              <p className="text-xs font-medium mb-1">Size</p>
                              <Badge variant="outline" className="text-xs">
                                {slides[currentSlide]?.textSize}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Carousel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => exportCarousel()}
                    disabled={isExporting}
                    className="w-full h-12 flex items-center gap-2"
                  >
                    {isExporting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                    Export PDF
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Export your carousel for sharing or further editing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>        </div>
      </CardContent>
    </Card>
  )
}
