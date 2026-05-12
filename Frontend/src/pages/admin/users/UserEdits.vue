<script setup>
import { reactive, ref } from 'vue';
import Swal from 'sweetalert2';


// --- MOCKUP STATE (Tanpa Backend) ---
const isLoading = ref(false);

// Dummy Data Profil Admin GASNGO
const adminData = reactive({
  username: 'Julian Vance',
  email: 'julian.vance@gasngo.com',
  phoneNumber: '081234567891',
});

// --- MOCKUP FUNCTION ---
const updateAdmin = () => {
  // Validasi Kosong
  if (!adminData.username || !adminData.email || !adminData.phoneNumber) {
    Swal.fire({
      icon: 'warning',
      title: 'Data Tidak Lengkap',
      text: 'Pastikan seluruh kolom informasi administrator telah terisi.',
      confirmButtonColor: '#0050cb'
    });
    return;
  }

  isLoading.value = true;

  // Simulasi Proses Jaringan (Delay 1 Detik)
  setTimeout(() => {
    isLoading.value = false;

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan!',
      text: 'Profil administrator berhasil diperbarui.',
      confirmButtonColor: '#0050cb',
      showConfirmButton: false,
      timer: 1500
    });

    // Simulasi kembali ke halaman daftar akun (uncomment jika router siap)
    // router.push('/admin/accounts');

  }, 1000);
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Edit Profil Administrator</h1>
        <p class="text-sm text-[#727687]">Perbarui informasi kontak dan data diri administrator sistem.</p>
      </div>

      <!-- Tombol Kembali -->
      <router-link
        to="/admin/accounts"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#f2f4f6] border border-[#c2c6d8] text-[#424656] text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">arrow_back</span> Kembali
      </router-link>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col max-w-4xl">

      <!-- Banner Hiasan Atas Form -->
      <div class="h-24 bg-gradient-to-r from-[#003161] to-[#0050cb] relative overflow-hidden">
        <span class="material-symbols-outlined absolute -bottom-10 -right-4 text-9xl text-white opacity-10">admin_panel_settings</span>
      </div>

      <!-- Area Form -->
      <div class="p-6 md:p-10 relative">

        <!-- Avatar Mengambang (Estetika) -->
        <div class="absolute -top-12 left-6 md:left-10 w-20 h-20 bg-[#e6eeff] border-4 border-white rounded-full flex items-center justify-center text-[#0050cb] font-black text-2xl uppercase shadow-md">
          {{ adminData.username.substring(0, 2) }}
        </div>

        <form @submit.prevent="updateAdmin" class="pt-12">

          <div class="mb-8">
            <span class="inline-block px-3 py-1 bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20 text-[10px] font-black uppercase tracking-widest rounded mb-2">Hak Akses: Penuh</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            <!-- Input Nama Lengkap (Username) -->
            <div>
              <label for="username" class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#727687] mb-2">Nama Lengkap</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">person</span>
                <input
                  v-model="adminData.username"
                  type="text"
                  id="username"
                  placeholder="Masukkan nama lengkap"
                  class="w-full pl-11 pr-4 py-3.5 bg-[#f2f4f6] border border-transparent rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-bold"
                >
              </div>
            </div>

            <!-- Input Nomor Telepon -->
            <div>
              <label for="phone-number" class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#727687] mb-2">Nomor Telepon</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">call</span>
                <input
                  v-model="adminData.phoneNumber"
                  type="tel"
                  id="phone-number"
                  placeholder="Contoh: 08123456..."
                  class="w-full pl-11 pr-4 py-3.5 bg-[#f2f4f6] border border-transparent rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-bold"
                >
              </div>
            </div>

            <!-- Input Email (Span 2 Kolom di Desktop) -->
            <div class="md:col-span-2">
              <label for="email" class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#727687] mb-2">Alamat Email Tautan</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">mail</span>
                <input
                  v-model="adminData.email"
                  type="email"
                  id="email"
                  placeholder="admin@domain.com"
                  class="w-full pl-11 pr-4 py-3.5 bg-[#f2f4f6] border border-transparent rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-bold"
                >
              </div>
              <p class="text-[10px] text-[#727687] mt-1.5 italic">*Email ini digunakan untuk login ke dalam sistem portal admin GASNGO.</p>
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="mt-10 pt-8 border-t border-[#f2f4f6] flex flex-col-reverse sm:flex-row items-center justify-end gap-4">

            <router-link
              to="/admin/accounts"
              class="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#c2c6d8] text-[#424656] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#f2f4f6] transition-all shadow-sm text-center active:scale-95"
            >
              Batal
            </router-link>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full sm:w-auto signature-gradient px-8 py-3.5 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#0050cb]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span v-else class="material-symbols-outlined text-[18px]">save</span>
              {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>

          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Custom sesuai tema GASNGO */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Animasi Putar untuk Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
