import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function inspectCategories() {
  console.log("Checking car_categories...");
  const { data: categories, error: error } = await supabase.from('car_categories').select('*');
  if (error) {
    console.error("car_categories query error:", error);
  } else {
    console.log("Categories:", JSON.stringify(categories, null, 2));
  }
}

inspectCategories();
