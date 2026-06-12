import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Peringatan: SUPABASE_URL atau SUPABASE_ANON_KEY belum dikonfigurasi di file .env Backend');
}

export const supabase = createClient(
  supabaseUrl || 'https://nxtumcsfqgvcturfrqgz.supabase.co',
  supabaseAnonKey || ''
);
