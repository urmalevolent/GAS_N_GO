<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';


// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref('');
const isLoading = ref(false);

// Dummy Data: Daftar pengguna (customer) yang bisa dijadikan Admin
const users = ref([
  { id: 101, username: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '081233445566' },
  { id: 102, username: 'Andi Wijaya', email: 'andi.widjaja@outlook.com', phone: '081988776655' },
  { id: 103, username: 'Clara Michelle', email: 'clara.m@yahoo.com', phone: '-' },
  { id: 104, username: 'Daniel Pratama', email: 'dan.pratama@executive.com', phone: '082211223344' },
  { id: 105, username: 'Erick Thohir', email: 'erick.t@gasngo.com', phone: '085566778899' },
]);

// --- MOCKUP FUNCTIONS ---

// Logika Pencarian Lokal (Frontend)
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();

  return users.value.filter(user => {
    const name = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });
});

// Simulasi Jadikan Admin (Make Admin)
const makeAdmin = (user) => {
  Swal.fire({
    title: 'Angkat Menjadi Administrator?',
    text: `Pengguna ${user.username} (${user.email}) akan memiliki akses penuh ke panel admin GASNGO.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Jadikan Admin!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Simulasi Loading
      isLoading.value = true;

      setTimeout(() => {
        isLoading.value = false;

        // Hapus dari daftar dummy setelah sukses (seolah-olah sudah pindah role)
        users.value = users.value.filter(u => u.id !== user.id);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `${user.username} sekarang memiliki hak akses Administrator.`,
          timer: 2000,
          showConfirmButton: false
        });
      }, 800);
    }
  });
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Tambah Admin Baru</h1>
        <p class="text-sm text-[#727687]">Cari pelanggan yang ada dan tingkatkan hak aksesnya menjadi Administrator.</p>
      </div>

      <!-- Tombol Kembali -->
      <router-link
        to="/admin/accounts"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#f2f4f6] border border-[#c2c6d8] text-[#424656] text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">arrow_back</span> Kembali ke Daftar
      </router-link>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6] bg-[#f7f9fb]/50">
        <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-3">Pencarian Pengguna</label>
        <div class="relative w-full md:w-1/2">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik email atau nama pengguna..."
            class="w-full pl-11 pr-4 py-3.5 bg-white border border-[#c2c6d8]/60 rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all text-[#191c1e] font-medium shadow-sm"
          >
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto relative">
        <!-- Overlay Loading -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
           <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-2">sync</span>
           <span class="text-xs font-bold uppercase tracking-widest text-[#0050cb]">Memproses...</span>
        </div>

        <table class="w-full text-left whitespace-nowrap min-w-[700px]">
          <!-- Header Tabel dengan warna Navy -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4">PENGGUNA</th>
              <th class="px-6 py-4">KONTAK</th>
              <th class="px-6 py-4 text-center">AKSI</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Jika tidak ada user ditemukan -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="p-12 text-center text-[#727687] font-medium">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50 block">person_search</span>
                Pengguna tidak ditemukan.
              </td>
            </tr>

            <!-- Looping Data User -->
            <tr v-else v-for="(user, index) in filteredUsers" :key="user.id"
                class="transition-colors hover:bg-blue-50/30"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Profil -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-xs font-black text-[#0050cb] uppercase border border-[#b3c5ff]/50 shrink-0">
                    {{ (user.username || 'U').substring(0,2) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-extrabold text-[#191c1e] text-base">{{ user.username }}</span>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687] mt-0.5">ID: ACC-{{ user.id }}</span>
                  </div>
                </div>
              </td>

              <!-- 3. Kontak (Email & HP digabung) -->
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-[#424656] text-sm font-medium">
                    <span class="material-symbols-outlined text-[16px] text-[#727687]">mail</span>
                    {{ user.email }}
                  </div>
                  <div class="flex items-center gap-2 text-[#424656] text-sm font-medium">
                    <span class="material-symbols-outlined text-[16px] text-[#727687]">call</span>
                    {{ user.phone || 'Tidak tersedia' }}
                  </div>
                </div>
              </td>

              <!-- 4. Aksi -->
              <td class="px-6 py-5 text-center">
                <button
                  @click="makeAdmin(user)"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  Beri Akses Admin
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Spinner (Jika dibutuhkan untuk loading state) */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
