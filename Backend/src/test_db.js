import dotenv from 'dotenv';
dotenv.config();

function scanEnv() {
  console.log("=== SCANNING ENV KEYS ===");
  const keys = Object.keys(process.env);
  const matched = keys.filter(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('key') || k.toLowerCase().includes('service') || k.toLowerCase().includes('role'));
  console.log("Matched env keys:", matched);
  matched.forEach(k => {
    // Print the first few characters of the value for identification (e.g. to see if it's service_role vs anon)
    const val = process.env[k] || '';
    console.log(`- ${k}: val length = ${val.length}, starts with = ${val.substring(0, 15)}...`);
  });
}

scanEnv();
