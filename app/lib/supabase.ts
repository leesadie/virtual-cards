import { createClient } from '@supabase/supabase-js'

export type Card = {
  id: string
  recipient_name: string
  message: string
  front_image_url: string
  created_at: string
}

export type Signature = {
  id: string
  card_id: string
  name: string
  personal_message: string | null
  created_at: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
