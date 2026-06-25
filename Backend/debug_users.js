import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log("Mencoba listUsers dengan pagination...");
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 50
  });
  
  if (error) {
    console.error("Masih error listUsers:", error.message);
  } else {
    console.log("Berhasil mendapatkan list users:", data.users.map(u => u.email));
  }
}

run();
