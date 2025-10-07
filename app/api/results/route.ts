import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = createClient()
  try {
    const { title, socialPost, newsletter, originalUrl } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("conversion_results")
      .insert([
        {
          title,
          social_post: socialPost,
          newsletter,
          original_url: originalUrl,
          user_id: user.id,
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Failed to save results to database.")
    }

    return NextResponse.json({ id: data.id })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from("conversion_results")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    )
  }
}
