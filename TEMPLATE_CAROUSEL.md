# Template-Based Carousel Generator

This implementation follows the recommended tech stack for a template-based carousel generator with advanced editing capabilities.

## 🏗️ Tech Stack

- **Frontend Framework**: Next.js (React) with App Router
- **UI Layer**: TailwindCSS + Shadcn/UI (built on Radix)
- **Text Editing**: ContentEditable divs with real-time style binding
- **Template Management**: JSON schema-based templates
- **Export**: html2canvas + jsPDF for high-quality PDF generation

## ✨ Key Features

### 1. Template System
- **JSON Schema**: Each template defined as structured JSON with elements, styles, and layouts
- **Multiple Categories**: Social media, newsletter, presentation, and marketing templates
- **Flexible Layouts**: Support for different aspect ratios (9:16, 16:9, 1:1, 4:3)
- **Element Positioning**: Precise positioning using percentage-based coordinates

### 2. ContentEditable Editing
- **Real-time Preview**: Changes reflect immediately in the preview
- **Style Binding**: Font size, color, family, weight, and alignment controls
- **WYSIWYG Experience**: Direct text editing with visual feedback
- **Quick Style Buttons**: One-click styling for common formats

### 3. Template Library
Pre-built templates include:
- **Modern Social**: Clean design for social media posts
- **Professional Newsletter**: Business-focused layout
- **Bold Marketing**: High-impact marketing campaigns
- **Clean Presentation**: Minimalist presentation slides

### 4. Enhanced Export System
- **High-Quality Rendering**: Uses html2canvas with optimized settings
- **Multi-page PDF**: Combines all slides into a single PDF
- **Color Conversion**: Handles modern CSS color formats (oklch, hsl) safely
- **Error Handling**: Robust error handling with fallbacks

## 🚀 Usage

### Basic Usage
```typescript
import { TemplateCarouselEditor } from "@/components/template-carousel-editor"

<TemplateCarouselEditor
  content="Your content here"
  contentType="social"
  onClose={() => {}}
/>
```

### Template Selection
```typescript
import { carouselTemplates, getTemplateById } from "@/lib/templates"

const template = getTemplateById('social-modern')
const slides = createSlideFromTemplate(template, 1, content)
```

### Custom Template Creation
```typescript
const customTemplate: CarouselTemplate = {
  id: 'custom-template',
  name: 'Custom Template',
  description: 'My custom template',
  category: 'social',
  aspectRatio: '9:16',
  backgroundColor: '#ffffff',
  elements: [
    {
      id: 'headline',
      type: 'text',
      content: 'Default headline',
      position: { x: 10, y: 20, width: 80, height: 25 },
      style: {
        fontSize: 32,
        color: '#000000',
        fontFamily: 'inter',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      editable: true
    }
  ],
  defaultColors: { /* ... */ },
  defaultFonts: { /* ... */ }
}
```

## 🎨 Template Structure

Each template follows this JSON schema:

```typescript
interface CarouselTemplate {
  id: string
  name: string
  description: string
  category: 'social' | 'newsletter' | 'presentation' | 'marketing'
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:3'
  backgroundColor: string
  elements: TemplateElement[]
  defaultColors: ColorPalette
  defaultFonts: FontPalette
}

interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'shape'
  content: string
  position: Position // percentage-based
  style: ElementStyle
  editable?: boolean
}
```

## 🔧 API Integration

The API supports both template-based and AI-generated carousels:

```typescript
// Template-based generation
POST /api/generate-carousel
{
  "content": "Your content",
  "type": "social",
  "templateId": "social-modern"
}

// AI-generated (fallback)
POST /api/generate-carousel
{
  "content": "Your content",
  "type": "social"
}
```

## 📱 Responsive Design

Templates are designed with mobile-first approach:
- Percentage-based positioning works across screen sizes
- Aspect ratio preservation maintains design integrity
- Touch-friendly editing controls for mobile devices

## 🎯 Best Practices

1. **Template Design**: Keep templates simple and focused on specific use cases
2. **Element Positioning**: Use percentage-based positioning for responsiveness
3. **Color Management**: Use consistent color palettes across templates
4. **Font Selection**: Choose web-safe fonts with good readability
5. **Export Optimization**: Test export quality with different content lengths

## 🔮 Future Enhancements

- Image upload and management
- Animation and transition effects
- Collaborative editing
- Template marketplace
- Advanced typography controls
- Brand kit integration

This implementation provides a solid foundation for a professional carousel generator that can be extended with additional features as needed.
