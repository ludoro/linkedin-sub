"use client"

import { LinkConverter } from "@/components/link-converter";
import { Hero } from "@/components/hero";

export default function Dashboard() {
  return (
    <main className="flex-1">
      <Hero />
      <LinkConverter />
    </main>
  );
}