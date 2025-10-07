"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { List, Edit, Trash, Save, PlusCircle } from "lucide-react"

interface Prompt {
  id: string
  title: string
  prompt_text: string
}

interface PromptManagerProps {
  prompts: Prompt[]
  onPromptSelect: (prompt: string) => void
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>
}

export function PromptManager({ prompts, onPromptSelect, setPrompts }: PromptManagerProps) {
  const [newPromptTitle, setNewPromptTitle] = useState("")
  const [newPromptText, setNewPromptText] = useState("")
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch("/api/prompts/get")
        if (!response.ok) {
          throw new Error("Failed to fetch prompts.")
        }
        const data = await response.json()
        setPrompts(data.prompts)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch prompts. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchPrompts()
  }, [toast, setPrompts])

  const handleSavePrompt = async () => {
    setIsSaving(true)
    try {
      const url = editingPrompt ? "/api/prompts/update" : "/api/prompts/add"
      const method = editingPrompt ? "PUT" : "POST"
      const body = editingPrompt
        ? JSON.stringify({ id: editingPrompt.id, title: newPromptTitle, prompt_text: newPromptText })
        : JSON.stringify({ title: newPromptTitle, prompt_text: newPromptText })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save prompt.")
      }

      // Refetch prompts to get the latest list
      const fetchResponse = await fetch("/api/prompts/get")
      const data = await fetchResponse.json()
      setPrompts(data.prompts)

      setNewPromptTitle("")
      setNewPromptText("")
      setEditingPrompt(null)
      toast({
        title: "Prompt Saved",
        description: "Your prompt has been successfully saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setNewPromptTitle(prompt.title)
    setNewPromptText(prompt.prompt_text)
  }

  const handleDeletePrompt = async (id: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/prompts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete prompt.")
      }

      setPrompts(prompts.filter((p) => p.id !== id))
      toast({
        title: "Prompt Deleted",
        description: "Your prompt has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    onPromptSelect(prompt.prompt_text)
    toast({
      title: "Prompt Selected",
      description: `"${prompt.title}" is now active.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Prompt Manager
        </CardTitle>
        <CardDescription>
          Manage your saved prompts. Select one to use it in the conversion.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Prompt title"
            value={newPromptTitle}
            onChange={(e) => setNewPromptTitle(e.target.value)}
          />
          <Textarea
            placeholder="Type your new prompt here."
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSavePrompt}
            disabled={isSaving || !newPromptTitle.trim() || !newPromptText.trim()}
          >
            {isSaving ? (
              "Saving..."
            ) : editingPrompt ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Update Prompt
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" /> Save New Prompt
              </>
            )}
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Saved Prompts</h3>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <p className="flex-grow font-semibold">{prompt.title}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectPrompt(prompt)}
                >
                  Select
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPrompt(prompt)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePrompt(prompt.id)}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
