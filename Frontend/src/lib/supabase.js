import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxtumcsfqgvcturfrqgz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('Peringatan: VITE_SUPABASE_ANON_KEY belum dikonfigurasi di file .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
