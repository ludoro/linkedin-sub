"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Type, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Save,
  X
} from "lucide-react"

interface ContentEditableEditorProps {
  element: {
    id: string
    content: string
    style: {
      fontSize?: number
      color: string
      fontFamily: string
      fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
      textAlign: 'left' | 'center' | 'right'
      backgroundColor?: string
    }
  }
  onSave: (updates: Partial<typeof element>) => void
  onCancel: () => void
}

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'opensans', label: 'Open Sans' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'lato', label: 'Lato' }
]

const fontWeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' }
]

const textAlignOptions = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight }
]

export function ContentEditableEditor({ element, onSave, onCancel }: ContentEditableEditorProps) {
  const [editedElement, setEditedElement] = useState(element)
  const [isEditing, setIsEditing] = useState(true)
  const editableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editableRef.current && isEditing) {
      editableRef.current.focus()
      // Select all text for easy replacement
      const range = document.createRange()
      range.selectNodeContents(editableRef.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  const handleContentChange = () => {
    if (editableRef.current) {
      setEditedElement(prev => ({
        ...prev,
        content: editableRef.current?.innerText || prev.content
      }))
    }
  }

  const handleStyleChange = (property: string, value: any) => {
    setEditedElement(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [property]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(editedElement)
    setIsEditing(false)
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Text Element</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          className="min-h-[100px] p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          style={{
            fontSize: `${editedElement.style.fontSize || 24}px`,
            color: editedElement.style.color,
            fontFamily: getCSSFontFamily(editedElement.style.fontFamily),
            fontWeight: editedElement.style.fontWeight,
            textAlign: editedElement.style.textAlign,
            backgroundColor: editedElement.style.backgroundColor || 'transparent',
            lineHeight: '1.4'
          }}
        >
          {editedElement.content}
        </div>
      </div>

      {/* Style Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Size</Label>
          <Input
            type="number"
            value={editedElement.style.fontSize || 24}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value) || 24)}
            className="text-sm"
            min="12"
            max="72"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Family</Label>
          <Select
            value={editedElement.style.fontFamily}
            onValueChange={(value) => handleStyleChange('fontFamily', value)}
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

        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Weight</Label>
          <Select
            value={editedElement.style.fontWeight}
            onValueChange={(value: any) => handleStyleChange('fontWeight', value)}
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

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Align</Label>
          <div className="flex gap-1">
            {textAlignOptions.map((align) => (
              <Button
                key={align.value}
                variant={editedElement.style.textAlign === align.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleStyleChange('textAlign', align.value)}
                className="flex items-center gap-1"
              >
                <align.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={editedElement.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={editedElement.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="flex-1 text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={editedElement.style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              value={editedElement.style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Quick Style Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Styles</Label>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStyleChange('fontWeight', 'bold')}
            className="flex items-center gap-2"
          >
            <Bold className="h-4 w-4" />
            Bold
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStyleChange('fontWeight', 'normal')}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            Normal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStyleChange('textAlign', 'center')}
            className="flex items-center gap-2"
          >
            <AlignCenter className="h-4 w-4" />
            Center
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStyleChange('color', '#3b82f6')}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Blue
          </Button>
        </div>
      </div>
    </div>
  )
}
