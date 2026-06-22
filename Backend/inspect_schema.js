import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  console.log("Fetching detailed cars table structure...");
  
  const { data: cars, error } = await supabase.from('cars').select('*').limit(1);
  if (error) {
    console.error("Error fetching cars:", error);
  } else {
    console.log("Car record:", JSON.stringify(cars[0], null, 2));
    console.log("Car keys:", Object.keys(cars[0] || {}));
  }
}

run();
