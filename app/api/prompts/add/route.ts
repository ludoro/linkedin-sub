import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { title, prompt_text } = await request.json();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if a prompt with the same title already exists for this user
  const { data: existingPrompt, error: existingPromptError } = await supabase
    .from('prompts')
    .select('id')
    .eq('user_id', user.id)
    .eq('title', title)
    .single();

  if (existingPrompt) {
    return NextResponse.json({ error: 'A prompt with this title already exists.' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert([{ user_id: user.id, title, prompt_text: prompt_text }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
