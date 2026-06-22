import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const targetId = 'db27c405-e0d5-4841-89d6-85fe72b7c666';

async function run() {
  console.log("Fetching detailed tables structure...");
  
  const { data: rental } = await supabase.from('rentals').select('*').eq('id', targetId).single();
  const { data: details } = await supabase.from('rental_details').select('*').eq('rental_id', targetId).single();
  const { data: payment } = await supabase.from('rental_payments').select('*').eq('rental_id', targetId).single();

  console.log("Rental keys:", Object.keys(rental || {}));
  console.log("Rental details keys:", Object.keys(details || {}));
  console.log("Rental payments keys:", Object.keys(payment || {}));
  
  console.log("Rental record:", JSON.stringify(rental, null, 2));
  console.log("Rental details record:", JSON.stringify(details, null, 2));
  console.log("Rental payments record:", JSON.stringify(payment, null, 2));
}

run();
