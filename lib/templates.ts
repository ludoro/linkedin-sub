import { CarouselTemplate } from '@/types/template'

export const carouselTemplates: CarouselTemplate[] = [
  {
    id: 'social-modern',
    name: 'Modern Social',
    description: 'Clean, modern design perfect for social media',
    category: 'social',
    aspectRatio: '9:16',
    backgroundColor: '#ffffff',
    defaultColors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'inter',
      body: 'inter',
      accent: 'inter'
    },
    elements: [
      {
        id: 'headline',
        type: 'text',
        content: 'Your Headline Here',
        position: { x: 10, y: 20, width: 80, height: 25 },
        style: {
          fontSize: 32,
          color: '#1f2937',
          fontFamily: 'inter',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Your content goes here. Make it engaging and concise.',
        position: { x: 10, y: 50, width: 80, height: 30 },
        style: {
          fontSize: 18,
          color: '#64748b',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'accent-shape',
        type: 'shape',
        content: '',
        position: { x: 5, y: 85, width: 90, height: 8 },
        style: {
          backgroundColor: '#3b82f6',
          borderRadius: 4
        },
        editable: false
      }
    ]
  },
  {
    id: 'newsletter-professional',
    name: 'Professional Newsletter',
    description: 'Professional layout for newsletter content',
    category: 'newsletter',
    aspectRatio: '4:3',
    backgroundColor: '#f8fafc',
    defaultColors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#dc2626',
      text: '#1e293b',
      background: '#f8fafc'
    },
    defaultFonts: {
      heading: 'inter',
      body: 'inter',
      accent: 'inter'
    },
    elements: [
      {
        id: 'headline',
        type: 'text',
        content: 'Newsletter Title',
        position: { x: 10, y: 15, width: 80, height: 20 },
        style: {
          fontSize: 28,
          color: '#1e40af',
          fontFamily: 'inter',
          fontWeight: 'bold',
          textAlign: 'left'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Your newsletter content goes here. This template is designed for longer-form content with proper spacing and readability.',
        position: { x: 10, y: 40, width: 80, height: 45 },
        style: {
          fontSize: 16,
          color: '#475569',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'left'
        },
        editable: true
      },
      {
        id: 'footer',
        type: 'text',
        content: 'Learn more at yourcompany.com',
        position: { x: 10, y: 88, width: 80, height: 8 },
        style: {
          fontSize: 14,
          color: '#64748b',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'left'
        },
        editable: true
      }
    ]
  },
  {
    id: 'marketing-bold',
    name: 'Bold Marketing',
    description: 'High-impact design for marketing campaigns',
    category: 'marketing',
    aspectRatio: '1:1',
    backgroundColor: '#1f2937',
    defaultColors: {
      primary: '#f59e0b',
      secondary: '#ffffff',
      accent: '#ef4444',
      text: '#ffffff',
      background: '#1f2937'
    },
    defaultFonts: {
      heading: 'montserrat',
      body: 'inter',
      accent: 'montserrat'
    },
    elements: [
      {
        id: 'headline',
        type: 'text',
        content: 'BOLD MESSAGE',
        position: { x: 10, y: 25, width: 80, height: 30 },
        style: {
          fontSize: 36,
          color: '#f59e0b',
          fontFamily: 'montserrat',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Make an impact with bold, attention-grabbing content.',
        position: { x: 10, y: 60, width: 80, height: 25 },
        style: {
          fontSize: 18,
          color: '#ffffff',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'accent-bar',
        type: 'shape',
        content: '',
        position: { x: 20, y: 85, width: 60, height: 4 },
        style: {
          backgroundColor: '#ef4444',
          borderRadius: 2
        },
        editable: false
      }
    ]
  },
  {
    id: 'presentation-clean',
    name: 'Clean Presentation',
    description: 'Minimalist design for presentations',
    category: 'presentation',
    aspectRatio: '16:9',
    backgroundColor: '#ffffff',
    defaultColors: {
      primary: '#2563eb',
      secondary: '#6b7280',
      accent: '#10b981',
      text: '#111827',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'inter',
      body: 'inter',
      accent: 'inter'
    },
    elements: [
      {
        id: 'headline',
        type: 'text',
        content: 'Presentation Title',
        position: { x: 15, y: 30, width: 70, height: 20 },
        style: {
          fontSize: 28,
          color: '#2563eb',
          fontFamily: 'inter',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Key points and supporting information for your presentation slide.',
        position: { x: 15, y: 55, width: 70, height: 30 },
        style: {
          fontSize: 18,
          color: '#111827',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'bottom-accent',
        type: 'shape',
        content: '',
        position: { x: 0, y: 90, width: 100, height: 10 },
        style: {
          backgroundColor: '#10b981',
          borderRadius: 0
        },
        editable: false
      }
    ]
  },
  {
    id: 'geometric-hexagon',
    name: 'Hexagonal Pattern',
    description: 'Modern hexagonal geometric pattern with enhanced text readability',
    category: 'geometric',
    aspectRatio: '1:1',
    backgroundColor: '#0f172a',
    defaultColors: {
      primary: '#64748b',
      secondary: '#cbd5e1',
      accent: '#06b6d4',
      text: '#f8fafc',
      background: '#0f172a'
    },
    defaultFonts: {
      heading: 'inter',
      body: 'inter',
      accent: 'inter'
    },
    elements: [
      // Hexagonal background shapes
      {
        id: 'hex-1',
        type: 'shape',
        content: '',
        position: { x: 15, y: 10, width: 25, height: 25 },
        style: {
          backgroundColor: '#1e293b',
          borderRadius: 8,
          color: '#1e293b',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'hex-2',
        type: 'shape',
        content: '',
        position: { x: 60, y: 5, width: 20, height: 20 },
        style: {
          backgroundColor: '#334155',
          borderRadius: 6,
          color: '#334155',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'hex-3',
        type: 'shape',
        content: '',
        position: { x: 5, y: 70, width: 30, height: 30 },
        style: {
          backgroundColor: '#1e293b',
          borderRadius: 10,
          color: '#1e293b',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'hex-4',
        type: 'shape',
        content: '',
        position: { x: 70, y: 75, width: 25, height: 25 },
        style: {
          backgroundColor: '#475569',
          borderRadius: 8,
          color: '#475569',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      // Text overlay with shadow effect
      {
        id: 'text-shadow',
        type: 'shape',
        content: '',
        position: { x: 8, y: 38, width: 84, height: 35 },
        style: {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderRadius: 12,
          color: 'rgba(15, 23, 42, 0.8)',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'headline',
        type: 'text',
        content: 'Geometric Design',
        position: { x: 10, y: 38, width: 80, height: 15 },
        style: {
          fontSize: 28,
          color: '#f8fafc',
          fontFamily: 'inter',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Clean patterns that enhance your message',
        position: { x: 10, y: 58, width: 80, height: 15 },
        style: {
          fontSize: 16,
          color: '#cbd5e1',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'center'
        },
        editable: true
      }
    ]
  },
  {
    id: 'geometric-stripes',
    name: 'Diagonal Stripes',
    description: 'Dynamic diagonal stripes pattern with excellent text contrast',
    category: 'geometric',
    aspectRatio: '16:9',
    backgroundColor: '#1e40af',
    defaultColors: {
      primary: '#3b82f6',
      secondary: '#dbeafe',
      accent: '#fbbf24',
      text: '#ffffff',
      background: '#1e40af'
    },
    defaultFonts: {
      heading: 'montserrat',
      body: 'inter',
      accent: 'montserrat'
    },
    elements: [
      // Diagonal stripe elements
      {
        id: 'stripe-1',
        type: 'shape',
        content: '',
        position: { x: -10, y: 0, width: 25, height: 100 },
        style: {
          backgroundColor: '#2563eb',
          borderRadius: 0,
          color: '#2563eb',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'stripe-2',
        type: 'shape',
        content: '',
        position: { x: 20, y: 0, width: 15, height: 100 },
        style: {
          backgroundColor: '#1d4ed8',
          borderRadius: 0,
          color: '#1d4ed8',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'stripe-3',
        type: 'shape',
        content: '',
        position: { x: 85, y: 0, width: 20, height: 100 },
        style: {
          backgroundColor: '#2563eb',
          borderRadius: 0,
          color: '#2563eb',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      // Central content area with background
      {
        id: 'content-bg',
        type: 'shape',
        content: '',
        position: { x: 20, y: 25, width: 60, height: 50 },
        style: {
          backgroundColor: 'rgba(30, 64, 175, 0.9)',
          borderRadius: 8,
          color: 'rgba(30, 64, 175, 0.9)',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'headline',
        type: 'text',
        content: 'Dynamic Stripes',
        position: { x: 20, y: 32, width: 60, height: 15 },
        style: {
          fontSize: 24,
          color: '#ffffff',
          fontFamily: 'montserrat',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Bold geometric patterns for impactful presentations',
        position: { x: 20, y: 55, width: 60, height: 18 },
        style: {
          fontSize: 14,
          color: '#dbeafe',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'center'
        },
        editable: true
      }
    ]
  },
  {
    id: 'geometric-dots',
    name: 'Gradient Dots',
    description: 'Circular dot pattern with gradient effects and text enhancement',
    category: 'geometric',
    aspectRatio: '9:16',
    backgroundColor: '#111827',
    defaultColors: {
      primary: '#6366f1',
      secondary: '#a5b4fc',
      accent: '#f59e0b',
      text: '#f9fafb',
      background: '#111827'
    },
    defaultFonts: {
      heading: 'inter',
      body: 'inter',
      accent: 'inter'
    },
    elements: [
      // Dot pattern elements
      {
        id: 'dot-1',
        type: 'shape',
        content: '',
        position: { x: 10, y: 8, width: 12, height: 12 },
        style: {
          backgroundColor: '#4f46e5',
          borderRadius: 50,
          color: '#4f46e5',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'dot-2',
        type: 'shape',
        content: '',
        position: { x: 75, y: 15, width: 8, height: 8 },
        style: {
          backgroundColor: '#7c3aed',
          borderRadius: 50,
          color: '#7c3aed',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'dot-3',
        type: 'shape',
        content: '',
        position: { x: 5, y: 25, width: 6, height: 6 },
        style: {
          backgroundColor: '#6366f1',
          borderRadius: 50,
          color: '#6366f1',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'dot-4',
        type: 'shape',
        content: '',
        position: { x: 85, y: 35, width: 10, height: 10 },
        style: {
          backgroundColor: '#8b5cf6',
          borderRadius: 50,
          color: '#8b5cf6',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'dot-5',
        type: 'shape',
        content: '',
        position: { x: 15, y: 75, width: 14, height: 14 },
        style: {
          backgroundColor: '#4f46e5',
          borderRadius: 50,
          color: '#4f46e5',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'dot-6',
        type: 'shape',
        content: '',
        position: { x: 80, y: 85, width: 9, height: 9 },
        style: {
          backgroundColor: '#7c3aed',
          borderRadius: 50,
          color: '#7c3aed',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      // Central text area
      {
        id: 'text-backdrop',
        type: 'shape',
        content: '',
        position: { x: 8, y: 42, width: 84, height: 28 },
        style: {
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          borderRadius: 16,
          color: 'rgba(17, 24, 39, 0.85)',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'headline',
        type: 'text',
        content: 'Dotted Elegance',
        position: { x: 10, y: 45, width: 80, height: 8 },
        style: {
          fontSize: 26,
          color: '#f9fafb',
          fontFamily: 'inter',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Sophisticated patterns that complement your content beautifully',
        position: { x: 10, y: 60, width: 80, height: 10 },
        style: {
          fontSize: 14,
          color: '#a5b4fc',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'center'
        },
        editable: true
      }
    ]
  },
  {
    id: 'geometric-triangles',
    name: 'Triangle Mosaic',
    description: 'Dynamic triangular mosaic pattern with strategic text placement',
    category: 'geometric',
    aspectRatio: '4:3',
    backgroundColor: '#0c4a6e',
    defaultColors: {
      primary: '#0ea5e9',
      secondary: '#bae6fd',
      accent: '#fcd34d',
      text: '#ffffff',
      background: '#0c4a6e'
    },
    defaultFonts: {
      heading: 'montserrat',
      body: 'inter',
      accent: 'montserrat'
    },
    elements: [
      // Triangle pattern elements
      {
        id: 'triangle-1',
        type: 'shape',
        content: '',
        position: { x: 5, y: 5, width: 20, height: 25 },
        style: {
          backgroundColor: '#075985',
          borderRadius: 4,
          color: '#075985',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'triangle-2',
        type: 'shape',
        content: '',
        position: { x: 75, y: 10, width: 18, height: 20 },
        style: {
          backgroundColor: '#0284c7',
          borderRadius: 3,
          color: '#0284c7',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'triangle-3',
        type: 'shape',
        content: '',
        position: { x: 10, y: 70, width: 25, height: 25 },
        style: {
          backgroundColor: '#0369a1',
          borderRadius: 5,
          color: '#0369a1',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'triangle-4',
        type: 'shape',
        content: '',
        position: { x: 70, y: 75, width: 22, height: 20 },
        style: {
          backgroundColor: '#075985',
          borderRadius: 4,
          color: '#075985',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'triangle-5',
        type: 'shape',
        content: '',
        position: { x: 85, y: 45, width: 12, height: 15 },
        style: {
          backgroundColor: '#0284c7',
          borderRadius: 2,
          color: '#0284c7',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      // Central content area
      {
        id: 'content-panel',
        type: 'shape',
        content: '',
        position: { x: 25, y: 35, width: 50, height: 30 },
        style: {
          backgroundColor: 'rgba(12, 74, 110, 0.9)',
          borderRadius: 12,
          color: 'rgba(12, 74, 110, 0.9)',
          fontFamily: 'inter',
          fontWeight: 'normal',
          textAlign: 'center'
        },
        editable: false
      },
      {
        id: 'headline',
        type: 'text',
        content: 'Triangle Mosaic',
        position: { x: 27, y: 40, width: 46, height: 8 },
        style: {
          fontSize: 22,
          color: '#ffffff',
          fontFamily: 'montserrat',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        editable: true
      },
      {
        id: 'content',
        type: 'text',
        content: 'Geometric precision meets creative expression',
        position: { x: 27, y: 55, width: 46, height: 10 },
        style: {
          fontSize: 13,
          color: '#bae6fd',
          fontFamily: 'inter',
          fontWeight: 'medium',
          textAlign: 'center'
        },
        editable: true
      }
    ]
  }
]

export const getTemplateById = (id: string): CarouselTemplate | undefined => {
  return carouselTemplates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): CarouselTemplate[] => {
  return carouselTemplates.filter(template => template.category === category)
}

export const createSlideFromTemplate = (template: CarouselTemplate, slideNumber: number, slideContent: { headline: string; content: string }): any => {
  const headlineElement = template.elements.find(el => el.id === 'headline')
  const contentElement = template.elements.find(el => el.id === 'content')
  
  const headline = slideContent.headline || headlineElement?.content || `Slide ${slideNumber} Title`
  const body = slideContent.content || contentElement?.content || 'Slide content goes here...'
  
  return {
    slideNumber,
    templateId: template.id,
    headline,
    content: body,
    backgroundColor: template.backgroundColor,
    textColor: template.defaultColors.text,
    textSize: 'medium' as const,
    fontFamily: template.defaultFonts.heading as any,
    textAlign: headlineElement?.style.textAlign || 'center' as any,
    fontWeight: headlineElement?.style.fontWeight || 'bold' as any,
    backgroundImage: null,
    elements: template.elements.map(el => ({
      ...el,
      content: el.id === 'headline' ? headline : el.id === 'content' ? body : el.content
    })),
    customStyles: {}
  }
}

export const splitContentIntoSlides = (content: string, numSlides: number = 5): Array<{ headline: string; content: string }> => {
  // Split content into sentences and paragraphs
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
  
  // If we have clear paragraphs, use those
  if (paragraphs.length >= numSlides) {
    return paragraphs.slice(0, numSlides).map((paragraph, index) => {
      const lines = paragraph.split('\n').filter(line => line.trim())
      const headline = lines[0]?.trim() || `Key Point ${index + 1}`
      const body = lines.slice(1).join('\n').trim() || paragraph.trim()
      return { headline, content: body }
    })
  }
  
  // If we have enough sentences, group them
  if (sentences.length >= numSlides) {
    const sentencesPerSlide = Math.ceil(sentences.length / numSlides)
    const slides = []
    
    for (let i = 0; i < numSlides; i++) {
      const slideStart = i * sentencesPerSlide
      const slideEnd = Math.min(slideStart + sentencesPerSlide, sentences.length)
      const slideSentences = sentences.slice(slideStart, slideEnd)
      
      if (slideSentences.length > 0) {
        const firstSentence = slideSentences[0].trim()
        const headline = firstSentence.length > 50 ? 
          firstSentence.substring(0, 47) + '...' : 
          firstSentence
        const body = slideSentences.join('. ').trim() + '.'
        
        slides.push({ headline, content: body })
      }
    }
    
    return slides
  }
  
  // Fallback: split by word count
  const words = content.split(/\s+/)
  const wordsPerSlide = Math.ceil(words.length / numSlides)
  const slides = []
  
  for (let i = 0; i < numSlides; i++) {
    const slideStart = i * wordsPerSlide
    const slideEnd = Math.min(slideStart + wordsPerSlide, words.length)
    const slideWords = words.slice(slideStart, slideEnd)
    
    if (slideWords.length > 0) {
      const slideText = slideWords.join(' ')
      const firstSentence = slideText.split(/[.!?]/)[0]
      const headline = firstSentence.length > 50 ? 
        firstSentence.substring(0, 47) + '...' : 
        firstSentence
      
      slides.push({ 
        headline: headline || `Slide ${i + 1}`, 
        content: slideText 
      })
    }
  }
  
  return slides
}
