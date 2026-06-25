<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  password: ''
});

const isLoading = ref(false);

const submitForm = async () => {
  if (!form.value.fullName || !form.value.email || !form.value.password) {
    Swal.fire('Form Tidak Lengkap', 'Nama, Email, dan Password wajib diisi.', 'warning');
    return;
  }

  isLoading.value = true;
  try {
    const token = authStore.session?.access_token;
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    });
    
    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Gagal mendaftarkan admin baru');
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: resData.message,
      timer: 2000,
      showConfirmButton: false
    });
    
    setTimeout(() => {
      router.push('/admin/accounts');
    }, 2000);
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: error.message });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Tambah Admin Baru</h1>
        <p class="text-sm text-[#727687]">Daftarkan akun administrator baru untuk membantu mengelola sistem.</p>
      </div>

      <router-link
        to="/admin/accounts"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#f2f4f6] border border-[#c2c6d8] text-[#424656] text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">arrow_back</span> Kembali ke Daftar
      </router-link>
    </div>

    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col max-w-2xl">
      <div class="p-6 md:p-8 space-y-6">
        
        <!-- Form Nama Lengkap -->
        <div>
          <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Nama Lengkap</label>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Contoh: Budi Santoso"
            class="w-full px-4 py-3 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all text-[#191c1e] font-medium"
          >
        </div>

        <!-- Form Email -->
        <div>
          <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Alamat Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@gasngo.com"
            class="w-full px-4 py-3 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all text-[#191c1e] font-medium"
          >
        </div>
        
        <!-- Form Telepon -->
        <div>
          <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Nomor Telepon</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="081234567890"
            class="w-full px-4 py-3 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all text-[#191c1e] font-medium"
          >
        </div>

        <!-- Form Password -->
        <div>
          <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Password Sementara</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Minimal 6 karakter"
            class="w-full px-4 py-3 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all text-[#191c1e] font-medium"
          >
        </div>

      </div>

      <div class="p-6 border-t border-[#f2f4f6] bg-[#f7f9fb]/50 flex justify-end">
        <button
          @click="submitForm"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <span v-if="isLoading" class="material-symbols-outlined animate-spin text-[16px]">sync</span>
          <span v-else class="material-symbols-outlined text-[16px]">person_add</span>
          {{ isLoading ? 'Menyimpan...' : 'Buat Admin Baru' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
