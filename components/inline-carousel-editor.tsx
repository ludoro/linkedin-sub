"use client"

import { useState, useEffect } from "react"
import html2canvas from "html2canvas-pro"
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
  Layers
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CarouselSlide } from "@/types/carousel"

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

interface InlineCarouselEditorProps {
  content: string
  contentType: 'social' | 'newsletter'
  onClose?: () => void
}

export function InlineCarouselEditor({ content, contentType, onClose }: InlineCarouselEditorProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

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

  const handleSlideUpdate = (slideIndex: number, updatedSlide: CarouselSlide) => {
    setSlides(prev => prev.map((slide, index) => 
      index === slideIndex ? updatedSlide : slide
    ))
  }

  const startEditing = (slideIndex: number) => {
    setEditingSlide(slides[slideIndex])
    setIsEditing(true)
  }

  const saveEditing = () => {
    if (editingSlide) {
      handleSlideUpdate(currentSlide, editingSlide)
      setIsEditing(false)
      setEditingSlide(null)
      toast({
        title: "Slide updated",
        description: "Your changes have been saved",
      })
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingSlide(null)
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
    
    // If it's already a hex color, return as is
    if (color.startsWith('#')) return color
    
    // If it's an rgb/rgba color, return as is
    if (color.startsWith('rgb')) return color
    
    // If it's an oklch, lch, lab, or other modern color format, convert to hex
    if (color.includes('oklch') || color.includes('lch') || color.includes('lab') || color.includes('var(') || color.includes('hsl')) {
      try {
        // Create a temporary element to compute the color
        const tempEl = document.createElement('div')
        tempEl.style.color = color
        tempEl.style.visibility = 'hidden'
        tempEl.style.position = 'absolute'
        tempEl.style.top = '-9999px'
        tempEl.style.left = '-9999px'
        tempEl.style.pointerEvents = 'none'
        tempEl.style.width = '1px'
        tempEl.style.height = '1px'
        tempEl.style.opacity = '0'
        tempEl.style.zIndex = '-9999'
        document.body.appendChild(tempEl)
        
        // Force a reflow to ensure the color is computed
        tempEl.offsetHeight
        
        const computedColor = window.getComputedStyle(tempEl).color
        document.body.removeChild(tempEl)
        
        // Convert rgb(r,g,b) to hex
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
        
        // Fallback for rgba values
        const rgbaMatch = computedColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
        if (rgbaMatch) {
          const r = parseInt(rgbaMatch[1])
          const g = parseInt(rgbaMatch[2])
          const b = parseInt(rgbaMatch[3])
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
      } catch (error) {
        console.warn('Failed to convert color:', color, error)
      }
    }
    
    // Default fallback
    return '#ffffff'
  }

  const exportCarousel = async () => {
    setIsExporting(true)
    try {
      if (slides.length === 0) {
        throw new Error('No slides to export')
      }

      console.log('Starting PDF export for', slides.length, 'slides')

      // Try simple export first (current slide only)
      const carouselElement = document.getElementById('carousel-container')
      if (carouselElement && slides.length === 1) {
        try {
          console.log('Attempting simple single-slide export')
          
          // Temporarily make the element more visible for capture
          const originalStyle = carouselElement.style.cssText
          carouselElement.style.position = 'fixed'
          carouselElement.style.left = '0'
          carouselElement.style.top = '0'
          carouselElement.style.zIndex = '9999'
          carouselElement.style.width = '400px'
          carouselElement.style.height = '600px'
          carouselElement.style.visibility = 'visible'
          carouselElement.style.opacity = '1'

          await new Promise(resolve => setTimeout(resolve, 300))

          const canvas = await html2canvas(carouselElement, {
            backgroundColor: convertToRGB(slides[0]?.backgroundColor || '#ffffff'),
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: 400,
            height: 600,
            ignoreElements: (element) => {
              // Skip elements that might cause color parsing issues
              return element.style.color?.includes('oklch') || 
                     element.style.backgroundColor?.includes('oklch') ||
                     element.style.borderColor?.includes('oklch')
            },
            onclone: (clonedDoc) => {
              // Convert any remaining oklch colors in the cloned document
              const allElements = clonedDoc.querySelectorAll('*')
              allElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el)
                if (computedStyle.color?.includes('oklch') || computedStyle.backgroundColor?.includes('oklch')) {
                  el.style.color = convertToRGB(computedStyle.color)
                  el.style.backgroundColor = convertToRGB(computedStyle.backgroundColor)
                }
              })
            }
          })

          // Restore original styles
          carouselElement.style.cssText = originalStyle

          if (canvas.width > 0 && canvas.height > 0) {
            const imgData = canvas.toDataURL('image/png', 0.95)
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = (pdfHeight - imgHeight * ratio) / 2

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
            pdf.save(`carousel-${contentType}-${new Date().getTime()}.pdf`)

            toast({
              title: "Carousel exported",
              description: "Current slide exported as PDF",
            })
            
            setIsExporting(false)
            return
          }
        } catch (simpleError) {
          console.log('Simple export failed, falling back to complex method:', simpleError)
          // Ensure carousel element styles are restored even on error
          try {
            carouselElement.style.cssText = originalStyle
          } catch (restoreError) {
            console.warn('Could not restore carousel element styles:', restoreError)
          }
        }
      }

      // Create a multi-page PDF with all slides
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        console.log(`Processing slide ${i + 1}/${slides.length}`)

        try {
          // Create a temporary container for this slide with better dimensions
          const tempContainer = document.createElement('div')
          tempContainer.style.position = 'absolute'
          tempContainer.style.left = '-2000px'
          tempContainer.style.top = '0'
          tempContainer.style.width = '800px'
          tempContainer.style.height = '600px'
          tempContainer.style.backgroundColor = convertToRGB(slides[i]?.backgroundColor || '#ffffff')
          tempContainer.style.color = convertToRGB(slides[i]?.textColor || '#000000')
          tempContainer.style.padding = '60px'
          tempContainer.style.display = 'flex'
          tempContainer.style.flexDirection = 'column'
          tempContainer.style.justifyContent = 'center'
          tempContainer.style.alignItems = slides[i]?.textAlign === 'left' ? 'flex-start' : slides[i]?.textAlign === 'right' ? 'flex-end' : 'center'
          tempContainer.style.textAlign = slides[i]?.textAlign || 'center'
          tempContainer.style.fontFamily = getCSSFontFamily(slides[i]?.fontFamily || 'inter')
          tempContainer.style.fontWeight = slides[i]?.fontWeight || 'bold'
          tempContainer.style.fontSize = slides[i]?.textSize === 'large' ? '32px' : slides[i]?.textSize === 'small' ? '20px' : '24px'
          tempContainer.style.borderRadius = '16px'
          tempContainer.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
          tempContainer.style.zIndex = '-1'
          tempContainer.style.visibility = 'hidden'
          tempContainer.style.opacity = '0'
          tempContainer.style.pointerEvents = 'none'

          // Add background image if exists
          if (slides[i]?.backgroundImage) {
            tempContainer.style.backgroundImage = `url(${slides[i].backgroundImage})`
            tempContainer.style.backgroundSize = 'cover'
            tempContainer.style.backgroundPosition = 'center'
            tempContainer.style.backgroundRepeat = 'no-repeat'
          }

          const headline = document.createElement('h2')
          headline.textContent = slides[i]?.headline || 'Slide Title'
          headline.style.marginBottom = '24px'
          headline.style.lineHeight = '1.2'
          headline.style.fontSize = slides[i]?.textSize === 'large' ? '36px' : slides[i]?.textSize === 'small' ? '24px' : '30px'
          headline.style.fontWeight = slides[i]?.fontWeight || 'bold'
          headline.style.fontFamily = getCSSFontFamily(slides[i]?.fontFamily || 'inter')
          headline.style.color = convertToRGB(slides[i]?.textColor || '#000000')
          headline.style.textAlign = slides[i]?.textAlign || 'center'
          headline.style.margin = '0 0 24px 0'

          const content = document.createElement('p')
          content.textContent = slides[i]?.content || 'Slide content goes here...'
          content.style.fontSize = slides[i]?.textSize === 'large' ? '24px' : slides[i]?.textSize === 'small' ? '16px' : '20px'
          content.style.fontWeight = 'normal'
          content.style.lineHeight = '1.5'
          content.style.fontFamily = getCSSFontFamily(slides[i]?.fontFamily || 'inter')
          content.style.color = convertToRGB(slides[i]?.textColor || '#000000')
          content.style.textAlign = slides[i]?.textAlign || 'center'
          content.style.margin = '0'
          content.style.maxWidth = '100%'

          tempContainer.appendChild(headline)
          tempContainer.appendChild(content)
          document.body.appendChild(tempContainer)

          // Wait longer for fonts and rendering to complete
          await new Promise(resolve => setTimeout(resolve, 500))

          console.log(`Capturing slide ${i + 1} with html2canvas`)

          // Capture the slide with html2canvas-pro (supports OKLCH colors)
          const canvas = await html2canvas(tempContainer, {
            backgroundColor: convertToRGB(slides[i]?.backgroundColor || '#ffffff'),
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            width: 800,
            height: 600,
            logging: true,
            removeContainer: false,
            foreignObjectRendering: false,
            imageTimeout: 5000
          })

          // Always remove the temporary container to prevent popup issues
          try {
            if (tempContainer && tempContainer.parentNode) {
              document.body.removeChild(tempContainer)
            }
          } catch (removeError) {
            console.warn('Could not remove temporary container:', removeError)
          }

          console.log(`Slide ${i + 1} canvas dimensions:`, canvas.width, 'x', canvas.height)

          // Verify canvas has content
          if (canvas.width === 0 || canvas.height === 0) {
            console.error(`Empty canvas for slide ${i + 1} - skipping`)
            continue
          }

          const imgData = canvas.toDataURL('image/png', 0.95)
          
          // Check if image data is valid
          if (imgData === 'data:,' || !imgData || imgData.length < 100) {
            console.error(`Invalid image data for slide ${i + 1} - skipping`)
            continue
          }

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = canvas.width
          const imgHeight = canvas.height
          
          // Calculate proper scaling to fit page
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9 // 90% of page
          const imgX = (pdfWidth - imgWidth * ratio) / 2
          const imgY = (pdfHeight - imgHeight * ratio) / 2

          console.log(`Adding slide ${i + 1} to PDF with dimensions:`, imgWidth * ratio, 'x', imgHeight * ratio)

          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
          
          console.log(`Successfully added slide ${i + 1} to PDF`)
        } catch (slideError) {
          console.error(`Error processing slide ${i + 1}:`, slideError)
          
          // Ensure temporary container is removed even on error
          try {
            if (tempContainer && tempContainer.parentNode) {
              document.body.removeChild(tempContainer)
            }
          } catch (removeError) {
            console.warn('Could not remove temporary container after error:', removeError)
          }
          
          // Add a placeholder page for failed slides with more info
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

      console.log('PDF export completed successfully')

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
      // Cleanup any remaining temporary elements
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
            <Layers className="h-6 w-6" />
            Carousel Editor
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Preview */}
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
                {/* Preview Area */}
                <div className="flex items-center justify-center mb-6">
                  <div 
                    id="carousel-container"
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
                    <div className={`relative z-20 w-full ${getTextAlignClass(slides[currentSlide]?.textAlign || 'center')}`}>
                      <h2 className={`${getTextSizeClass(slides[currentSlide]?.textSize || 'medium')} ${getFontClass(slides[currentSlide]?.fontFamily || 'inter')} ${getFontWeightClass(slides[currentSlide]?.fontWeight || 'bold')} mb-4 leading-tight`}>
                        {slides[currentSlide]?.headline || 'Slide Title'}
                      </h2>
                      <p className={`text-base ${getFontClass(slides[currentSlide]?.fontFamily || 'inter')} ${getFontWeightClass(slides[currentSlide]?.fontWeight || 'normal')} leading-relaxed`}>
                        {slides[currentSlide]?.content || 'Slide content goes here...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
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

          {/* Right Side - Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Slide Editor
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
                {isEditing && editingSlide ? (
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="style">Style</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <Label htmlFor="headline" className="text-sm font-medium">Headline</Label>
                        <Textarea
                          id="headline"
                          value={editingSlide.headline}
                          onChange={(e) => setEditingSlide(prev => 
                            prev ? { ...prev, headline: e.target.value } : null
                          )}
                          className="min-h-[80px] text-sm"
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
                          className="min-h-[120px] text-sm"
                          placeholder="Enter slide content..."
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="backgroundImage" className="text-sm font-medium">Background Image Description</Label>
                        <Textarea
                          id="backgroundImage"
                          value={editingSlide.backgroundImage || ''}
                          onChange={(e) => setEditingSlide(prev => 
                            prev ? { ...prev, backgroundImage: e.target.value || null } : null
                          )}
                          className="min-h-[80px] text-sm"
                          placeholder="Describe the background image you want..."
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="style" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingSlide.backgroundColor}
                              onChange={(e) => setEditingSlide(prev => 
                                prev ? { ...prev, backgroundColor: e.target.value } : null
                              )}
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={editingSlide.backgroundColor}
                              onChange={(e) => setEditingSlide(prev => 
                                prev ? { ...prev, backgroundColor: e.target.value } : null
                              )}
                              className="flex-1 text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingSlide.textColor}
                              onChange={(e) => setEditingSlide(prev => 
                                prev ? { ...prev, textColor: e.target.value } : null
                              )}
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={editingSlide.textColor}
                              onChange={(e) => setEditingSlide(prev => 
                                prev ? { ...prev, textColor: e.target.value } : null
                              )}
                              className="flex-1 text-sm"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Font Family</Label>
                        <Select
                          value={editingSlide.fontFamily}
                          onValueChange={(value: any) => 
                            setEditingSlide(prev => 
                              prev ? { ...prev, fontFamily: value } : null
                            )
                          }
                        >
                          <SelectTrigger>
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
                            <SelectTrigger>
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
                            <SelectTrigger>
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
                              className="flex items-center gap-2"
                            >
                              <align.icon className="h-4 w-4" />
                              {align.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium">Headline:</span>
                      <p className="text-muted-foreground mt-1">{slides[currentSlide]?.headline}</p>
                    </div>
                    <div>
                      <span className="font-medium">Content:</span>
                      <p className="text-muted-foreground mt-1 line-clamp-3">{slides[currentSlide]?.content}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Background:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: slides[currentSlide]?.backgroundColor }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {slides[currentSlide]?.backgroundColor}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Text:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: slides[currentSlide]?.textColor }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {slides[currentSlide]?.textColor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Font:</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {slides[currentSlide]?.fontFamily}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {slides[currentSlide]?.textSize}
                        </Badge>
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
              <CardContent className="space-y-3">
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => exportCarousel()}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Export PDF
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your carousel for sharing or further editing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
