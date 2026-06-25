import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum disetel di .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const targetId = process.argv[2];

  console.log("Mengambil data profil pengguna...");
  const { data: profiles, error: profileErr } = await supabaseAdmin.from('profiles').select('*');
  
  if (profileErr) {
    console.error("Gagal mengambil data profil:", profileErr);
    return;
  }

  if (!targetId) {
    console.log("\n==============================================");
    console.log("Penggunaan: node setup_super_admin.js <USER_ID>");
    console.log("==============================================\n");
    console.log("Daftar Pengguna yang tersedia (silakan copy ID-nya):\n");
    profiles.forEach(p => {
      console.log(`- ID: ${p.id}`);
      console.log(`  Nama: ${p.full_name || 'Tanpa Nama'} | Role Saat Ini: ${p.role}`);
      console.log('----------------------------------------------');
    });
    process.exit(1);
  }

  const userProfile = profiles.find(p => p.id === targetId);

  if (!userProfile) {
    console.error(`\n[ERROR] Profil dengan ID ${targetId} tidak ditemukan di database.`);
    process.exit(1);
  }

  console.log(`\nUser ditemukan: ${userProfile.full_name || 'Tanpa Nama'} (${userProfile.id})`);
  console.log("Mengubah role menjadi super_admin...");

  // 1. Update di tabel public.profiles
  const { error: updateDbErr } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', targetId);

  if (updateDbErr) {
    console.error("Gagal update public.profiles:", updateDbErr);
    return;
  }

  // 2. Update di auth.users (user_metadata) 
  // Gunakan updateUserById yang tidak memerlukan listUsers
  const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(targetId, {
    user_metadata: { role: 'super_admin' }
  });

  if (updateAuthErr) {
    console.error("Gagal update user_metadata (Auth API Error):", updateAuthErr.message);
    console.log("CATATAN: Walaupun Auth API gagal, Role di tabel profiles sudah berhasil diubah.");
    console.log("User tetap akan memiliki akses Super Admin saat mereka relogin karena sistem kita sekarang memprioritaskan pengecekan role di tabel profiles.");
  } else {
    console.log("BERHASIL! User sekarang adalah super_admin secara penuh (Profiles & Auth Metadata).");
  }
}

run();
