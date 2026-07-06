import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\admin\users\UserLists.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add forceVerifyUser function
old_func = '''// Ubah Role (Admin <=> Customer) Khusus Super Admin'''
new_func = '''// Verifikasi Paksa (Force Verify) Khusus Super Admin
const forceVerifyUser = (user) => {
  if (!isSuperAdmin.value) return;

  Swal.fire({
    title: 'Verifikasi User?',
    text: `Apakah Anda yakin ingin memverifikasi KTP pengguna ${user.full_name || user.email} secara langsung?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Verifikasi!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = authStore.session?.access_token;
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${user.id}/verify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ account_status: 'verified' })
        });
        
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Gagal memverifikasi user');
        
        user.account_status = 'verified';
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'User berhasil diverifikasi.', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
      }
    }
  });
};

// Ubah Role (Admin <=> Customer) Khusus Super Admin'''
content = content.replace(old_func, new_func)

# Add button in template
old_btn = '''                    <!-- Tombol Nonaktifkan (Merah) -->
                    <button v-if="user.is_active !== false" @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan Akun">
                      <Trash class="size-6 text-white" />
                    </button>'''
new_btn = '''                    <!-- Tombol Manual Verify (Hijau) hanya untuk Super Admin jika user belum verified -->
                    <button v-if="isSuperAdmin && user.account_status !== 'verified'" @click="forceVerifyUser(user)" class="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Verifikasi Paksa Akun">
                      <span class="material-symbols-outlined text-[18px]">verified_user</span>
                    </button>

                    <!-- Tombol Nonaktifkan (Merah) -->
                    <button v-if="user.is_active !== false" @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan Akun">
                      <Trash class="size-6 text-white" />
                    </button>'''
content = content.replace(old_btn, new_btn)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
