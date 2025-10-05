"use client"

import { LinkConverter } from "@/components/link-converter";
import { Hero } from "@/components/hero";
import { MemoryManager } from "@/components/memory-manager";

export default function Dashboard() {
  return (
    <main className="flex-1">
      <Hero />
      <LinkConverter />
      <MemoryManager />
    </main>
  );
}