import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function inspect() {
  console.log("Fetching all cars summary...");
  const { data: cars, error: carError } = await supabase.from('cars').select('id, name, brand, category, price_per_day, status');
  if (carError) console.error("Car query error:", carError);
  else console.log("All cars:", JSON.stringify(cars, null, 2));
}

inspect();
