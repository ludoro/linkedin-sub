export interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'shape'
  content: string
  position: {
    x: number // percentage from left
    y: number // percentage from top
    width: number // percentage of container width
    height: number // percentage of container height
  }
  style: {
    fontSize?: number
    color: string
    fontFamily: string
    fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
    textAlign: 'left' | 'center' | 'right'
    backgroundColor?: string
    borderRadius?: number
    padding?: number
    margin?: number
  }
  editable?: boolean
}

export interface CarouselTemplate {
  id: string
  name: string
  description: string
  category: 'social' | 'newsletter' | 'presentation' | 'marketing' | 'geometric'
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:3'
  backgroundColor: string
  backgroundImage?: string
  elements: TemplateElement[]
  defaultColors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  defaultFonts: {
    heading: string
    body: string
    accent: string
  }
}

export interface CarouselSlide {
  slideNumber: number
  templateId: string
  headline: string
  content: string
  backgroundColor: string
  textColor: string
  textSize: 'large' | 'medium' | 'small'
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'playfair' | 'montserrat' | 'lato'
  backgroundImage?: string | null
  textAlign: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  elements?: TemplateElement[]
  customStyles?: Record<string, any>
}
