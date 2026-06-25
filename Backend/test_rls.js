import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  console.log("Testing UPDATE on profiles...");
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', '6130ee9f-f563-4191-a1f7-f427bb890233') // Administrator user
    .select();
    
  if (error) {
    console.error("Error updating profile:", error);
  } else {
    console.log("Updated profile:", JSON.stringify(profile, null, 2));
  }
}

run();
