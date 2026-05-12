<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'


// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref("")
const currentUserId = ref(1) // Asumsi ID admin yang sedang login adalah 1

// Data Dummy Pengguna GASNGO
const users = ref([
  {
    id: 1,
    username: 'Julian Vance',
    email: 'admin@gasngo.com',
    phone: '081234567890',
    role: 'admin',
    is_active: true,
  },
  {
    id: 2,
    username: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '081987654321',
    role: 'customer',
    is_active: true,
  },
  {
    id: 3,
    username: 'Marcus Thorne',
    email: 'marcus.t@outlook.com',
    phone: '082211223344',
    role: 'customer',
    is_active: false,
  },
  {
    id: 4,
    username: 'Sophia Chen',
    email: 'sophia.c@yahoo.com',
    phone: '-',
    role: 'admin',
    is_active: true,
  }
])

// --- MOCKUP FUNCTIONS ---

// Logika Searching Lokal (Frontend)
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => {
    return (
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });
});

// Simulasi Ubah Role (Admin <=> Customer)
const toggleUserRole = (user) => {
  const newRole = user.role === 'admin' ? 'customer' : 'admin';

  Swal.fire({
    title: 'Ubah Peran?',
    text: `Ubah akun ${user.username} menjadi ${newRole.toUpperCase()}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Ubah!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Ubah data di array lokal
      const usr = users.value.find(u => u.id === user.id)
      if (usr) usr.role = newRole

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Peran ${user.username} berhasil diperbarui.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  })
}

// Simulasi Toggle Status
const toggleUserStatus = (user) => {
  const isActive = user.is_active;
  const actionText = isActive ? "Menonaktifkan" : "Mengaktifkan";

  Swal.fire({
    title: 'Konfirmasi Status',
    text: `Anda akan ${actionText.toLowerCase()} akun ${user.username}. Lanjutkan?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: isActive ? '#d33' : '#16a34a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: `Ya, ${actionText}!`,
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Ubah data di array lokal
      const usr = users.value.find(u => u.id === user.id)
      if (usr) usr.is_active = !isActive

      Swal.fire({
        icon: 'success',
        title: 'Status Diperbarui',
        text: `Akun ${user.username} telah di-${actionText.toLowerCase()}.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  })
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Manajemen Akun</h1>
        <p class="text-sm text-[#727687]">Kelola peran dan status dari seluruh pelanggan serta admin GASNGO.</p>
      </div>

      <!-- Tombol Tambah User (Akan ke /admin/users/add) -->
      <!-- Jika diperlukan fitur ini nantinya -->
      <router-link
        to="/admin/users/add"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-[#0050cb] hover:bg-[#0066ff] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">person_add</span> Tambah Akun
      </router-link>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
          >
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[900px]">
          <!-- Header Tabel dengan warna Navy khas referensi gambar -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4">NAMA LENGKAP</th>
              <th class="px-6 py-4">EMAIL</th>
              <th class="px-6 py-4">NO. TELEPON</th>
              <th class="px-6 py-4">PERAN</th>
              <th class="px-6 py-4 text-center">STATUS</th>
              <th class="px-6 py-4 text-center">AKSI</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Jika tidak ada user -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="p-8 text-center text-[#727687] italic font-medium">Data akun tidak ditemukan.</td>
            </tr>

            <!-- Looping Data User -->
            <tr v-else v-for="(user, index) in filteredUsers" :key="user.id"
                class="transition-colors hover:bg-blue-50/30"
                :class="{'opacity-60 bg-gray-50': !user.is_active}"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Nama & Inisial Avatar -->
              <td class="px-6 py-5 text-[#191c1e] font-extrabold flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-xs font-black text-[#0050cb] uppercase border border-[#b3c5ff]/50">
                  {{ (user.username || 'U').substring(0,2) }}
                </div>
                {{ user.username || 'Tanpa Nama' }}
              </td>

              <!-- 3. Email -->
              <td class="px-6 py-5 text-[#424656]">{{ user.email }}</td>

              <!-- 4. Telepon -->
              <td class="px-6 py-5 text-[#424656]">{{ user.phone || '-' }}</td>

              <!-- 5. Peran (Role) -->
              <td class="px-6 py-5">
                <span class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border"
                      :class="user.role === 'admin' ? 'bg-[#425ca0]/10 text-[#425ca0] border-[#425ca0]/30' : 'bg-[#e0e3e5]/50 text-[#424656] border-[#c2c6d8]'">
                  {{ user.role ? user.role : '-' }}
                </span>
              </td>

              <!-- 6. Status -->
              <td class="px-6 py-5 text-center">
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      :class="user.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                  {{ user.is_active ? 'AKTIF' : 'NONAKTIF' }}
                </span>
              </td>

              <!-- 7. Aksi -->
              <td class="px-6 py-5">
                <div class="flex gap-2 items-center justify-center">

                  <!-- Tombol Detail (Biru) -->
                  <!-- Jika nanti digunakan router-link: -->
                  <!-- <router-link :to="`/admin/accounts/detail/${user.id}`" ...> -->
                  <button class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Lihat Profil">
                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                  </button>

                  <template v-if="user.id !== currentUserId">
                    <!-- Tombol Ubah Role (Kuning) -->
                    <button @click="toggleUserRole(user)" class="w-8 h-8 rounded bg-[#eab308] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Ubah Peran">
                      <span class="material-symbols-outlined text-[18px]">manage_accounts</span>
                    </button>

                    <!-- Tombol Nonaktifkan (Merah) -->
                    <button v-if="user.is_active" @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan Akun">
                      <span class="material-symbols-outlined text-[18px]">person_off</span>
                    </button>

                    <!-- Tombol Aktifkan/Restore (Hijau) -->
                    <button v-else @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Aktifkan Kembali">
                      <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
                    </button>
                  </template>

                  <template v-else>
                    <!-- Tanda Untuk Diri Sendiri -->
                    <span class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#727687] bg-[#f2f4f6] rounded border border-[#c2c6d8]/50 select-none">
                      SAYA
                    </span>
                  </template>

                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Footer Tabel (Summary Status) -->
      <div class="p-5 md:p-6 border-t border-[#f2f4f6] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f7f9fb]/50">
          <p class="text-sm text-[#727687] font-medium">Menampilkan <span class="font-black text-[#191c1e] text-base">{{ filteredUsers.length }}</span> dari <span class="font-black text-[#191c1e] text-base">{{ users.length }}</span> Akun</p>
          <div class="flex gap-6">
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></span> Aktif
              </span>
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#d32f2f] rounded-full"></span> Nonaktif
              </span>
          </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
