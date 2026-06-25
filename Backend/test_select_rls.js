import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const targetId = 'ac049e6c-29c7-4b60-bef4-ed4327a996a9'; // Super Admin 123
  console.log("Checking RLS for id:", targetId);
  
  // Try to read profile using anon key without JWT (should fail or return empty if RLS blocks public read)
  const { data: anonData, error: anonErr } = await supabase.from('profiles').select('*').eq('id', targetId).single();
  console.log("Anon select:", anonErr ? anonErr.message : "Success");
}
run();
