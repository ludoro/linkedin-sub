"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function MemoryManager() {
  const [memoryText, setMemoryText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleAddMemory = async () => {
    if (isAdding || isDeleting) return;
    setIsAdding(true);
    try {
      const response = await fetch("/api/memory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: memoryText }),
      });

      if (!response.ok) {
        throw new Error("Failed to add memory.");
      }

      setMemoryText("");
      toast({
        title: "Memory Added",
        description: "Your memory has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteMemory = async () => {
    if (isAdding || isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/memory/delete", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to delete memories.");
      }

      toast({
        title: "Memories Deleted",
        description: "Your memories have been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete memories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Memory Manager</h2>
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="Type your memory here."
          value={memoryText}
          onChange={(e) => setMemoryText(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleAddMemory} disabled={isAdding}>
            {isAdding ? "Adding..." : "Add Memory"}
          </Button>
          <Button onClick={handleDeleteMemory} variant="destructive" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Memories"}
          </Button>
        </div>
      </div>
    </div>
  );
}