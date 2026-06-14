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

/**
 * Creates or returns a Supabase client scoped to the request's authorization token.
 * This is crucial for satisfying Row-Level Security (RLS) policies when writing/reading user data.
 */
export const getSupabaseClient = (req) => {
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return createClient(
      supabaseUrl || 'https://nxtumcsfqgvcturfrqgz.supabase.co',
      supabaseAnonKey || '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
  }
  return supabase;
};
