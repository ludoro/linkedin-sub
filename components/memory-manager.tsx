"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BrainCircuit } from "lucide-react"

export function MemoryManager() {
  const [memoryText, setMemoryText] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleAddMemory = async () => {
    if (isAdding || isDeleting) return
    setIsAdding(true)
    try {
      const response = await fetch("/api/memory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: memoryText }),
      })

      if (!response.ok) {
        throw new Error("Failed to add memory.")
      }

      setMemoryText("")
      toast({
        title: "Memory Added",
        description: "Your memory has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add memory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteMemory = async () => {
    if (isAdding || isDeleting) return
    setIsDeleting(true)
    try {
      const response = await fetch("/api/memory/delete", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete memories.")
      }

      toast({
        title: "Memories Deleted",
        description: "Your memories have been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete memories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Memory Manager
        </CardTitle>
        <CardDescription>
          Add or delete memories to influence the AI&apos;s behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type your memory here."
          value={memoryText}
          onChange={(e) => setMemoryText(e.target.value)}
          className="min-h-[160px]"
        />
        <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleAddMemory}
                    disabled={isAdding || !memoryText.trim()}
                  >
                    {isAdding ? "Adding..." : "Add Memory"}
                  </Button>
                  <Button
                    onClick={handleDeleteMemory}
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete All Memories"}
                  </Button>
                </div>      </CardContent>
    </Card>
  )
}