"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"


import { createClient } from "@/lib/supabase/client"






export function LinkConverterHome() {
  const router = useRouter()



  const [isLoading, setIsLoading] = useState(false)


  const handleConvert = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      router.push("/dashboard")
      return
    }

    if (!user) {
      router.push("/login")
      return
    }
  }



  return (
    <section className="pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <Button
            onClick={handleConvert}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting
              </>
            ) : (
              "Try It Now"
            )}
          </Button>
          <p className="text-muted-foreground">
            Paste any link and watch AI transform it into engaging content
          </p>
        </div>

        <div className="flex gap-6">

          <div className="w-full">
            <Card className="mb-6">

              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/article"
                      className="flex-1"
                      disabled={true}
                    />
                    <Button
                      onClick={handleConvert}
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting
                        </>
                      ) : (
                        "Try it now"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
