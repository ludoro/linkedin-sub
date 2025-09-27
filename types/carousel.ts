import { TemplateElement } from './template'

export interface CarouselSlide {
  slideNumber: number
  templateId?: string
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
