<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- MOCKUP STATE (Tanpa Backend) ---
const isLoading = ref(false);

// Dummy Data Profil Pelanggan GASNGO
const user = ref({
  id: 105,
  username: 'Erick Thohir',
  email: 'erick.t@gasngo.com',
  phone: '085566778899',
  createdAt: '2023-11-20T10:00:00Z',
  address: 'Kawasan Elit Pondok Indah, Jakarta Selatan'
});

// Dummy Data Statistik
const stats = ref({
  total_orders: 4,
  total_spent: 12500 // Dalam USD sesuai contoh GASNGO
});

// Dummy Data Riwayat Pesanan Sewa Mobil
const orders = ref([
  {
    id: 'LX-8892-TY',
    car_name: 'Porsche Taycan',
    created_at: '2024-05-10T08:30:00Z',
    duration: 3, // Hari
    total_price: 4350,
    status: 'completed'
  },
  {
    id: 'LX-8871-FR',
    car_name: 'Ferrari F8 Tributo',
    created_at: '2024-02-15T14:00:00Z',
    duration: 1,
    total_price: 2450,
    status: 'completed'
  },
  {
    id: 'LX-8820-BM',
    car_name: 'BMW M8 Gran Coupe',
    created_at: '2024-01-05T09:15:00Z',
    duration: 2,
    total_price: 1900,
    status: 'completed'
  },
  {
    id: 'LX-8999-AD',
    car_name: 'Audi RS7 Performance',
    created_at: '2024-05-12T10:00:00Z',
    duration: 5,
    total_price: 6000,
    status: 'pending' // Belum dibayar / masih berjalan
  }
]);

// --- MOCKUP FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Detail Pelanggan</h1>
        <p class="text-sm text-[#727687]">Ringkasan profil dan riwayat penyewaan armada pelanggan.</p>
      </div>

      <button @click="router.go(-1)" class="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#f2f4f6] border border-[#c2c6d8] text-[#424656] text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
        <span class="material-symbols-outlined text-lg">arrow_back</span> Kembali
      </button>
    </div>

    <!-- Loading Overlay (Mockup) -->
    <div v-if="isLoading" class="p-20 text-center bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0050cb] mx-auto mb-4"></div>
        <p class="text-[#727687] font-bold text-sm uppercase tracking-widest">Memuat Profil Pengguna...</p>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="space-y-6">

      <!-- ================= KARTU STATISTIK ATAS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Total Pengeluaran (Highlight Biru Navy) -->
        <div class="bg-gradient-to-br from-[#003161] to-[#0050cb] text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col justify-center relative overflow-hidden group">
          <div class="relative z-10">
            <p class="text-[#b3c5ff] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Total Pendapatan dari User</p>
            <h3 class="text-3xl md:text-4xl font-black tracking-tighter">{{ formatPrice(stats.total_spent || 0) }}</h3>
          </div>
          <span class="material-symbols-outlined absolute -bottom-6 -right-6 text-8xl text-white opacity-10 group-hover:scale-110 transition-transform duration-500">payments</span>
        </div>

        <!-- Total Pesanan -->
        <div class="bg-white border border-[#c2c6d8]/40 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-center">
          <p class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Total Sewa Kendaraan</p>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center">
              <span class="material-symbols-outlined text-[#0050cb]">car_rental</span>
            </span>
            <h3 class="text-3xl font-black text-[#191c1e] tracking-tighter">{{ stats.total_orders || 0 }} <span class="text-lg text-[#727687] font-bold">Kali</span></h3>
          </div>
        </div>

        <!-- Member Sejak -->
        <div class="bg-white border border-[#c2c6d8]/40 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-center">
          <p class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Terdaftar Sejak</p>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center">
              <span class="material-symbols-outlined text-[#0050cb]">calendar_today</span>
            </span>
            <h3 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight">{{ user ? formatDate(user.createdAt) : '-' }}</h3>
          </div>
        </div>

      </div>

      <!-- ================= DETAIL PROFIL & RIWAYAT ================= -->
      <div class="flex flex-col rounded-3xl border border-[#c2c6d8]/40 bg-white shadow-sm overflow-hidden">

        <!-- Bagian Profil -->
        <div class="p-6 md:p-8 border-b border-[#f2f4f6] bg-[#f7f9fb]/50">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-[#0050cb] text-2xl">account_circle</span>
            <h2 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Profil Pelanggan</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" v-if="user">
            <!-- Username -->
            <div>
              <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Nama Lengkap</label>
              <p class="text-[#191c1e] font-extrabold text-base">{{ user.username }}</p>
            </div>
            <!-- Email -->
            <div>
              <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Email</label>
              <p class="text-[#191c1e] font-bold text-sm">{{ user.email }}</p>
            </div>
            <!-- Phone -->
            <div>
              <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">No. Telepon</label>
              <p class="text-[#191c1e] font-bold text-sm">{{ user.phone || '-' }}</p>
            </div>
            <!-- Alamat -->
            <div>
              <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Domisili</label>
              <p class="text-[#191c1e] font-bold text-sm truncate" :title="user.address">{{ user.address || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Bagian Riwayat Pesanan -->
        <div class="p-6 md:p-8">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-[#0050cb] text-2xl">history</span>
            <h2 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Riwayat Penyewaan Terakhir</h2>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead class="bg-[#f2f4f6] text-[#727687] uppercase text-[10px] font-black tracking-widest border-y border-[#c2c6d8]/40">
                <tr>
                  <th class="px-6 py-4 w-32">REFERENSI</th>
                  <th class="px-6 py-4">KENDARAAN & TANGGAL</th>
                  <th class="px-6 py-4 text-center">DURASI</th>
                  <th class="px-6 py-4 text-right">TAGIHAN</th>
                  <th class="px-6 py-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <!-- Jika Kosong -->
                <tr v-if="orders.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-[#727687] font-medium italic">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>

                <!-- Looping Order -->
                <tr v-for="order in orders" :key="order.id" class="hover:bg-blue-50/30 transition-colors">
                  <!-- ID Order -->
                  <td class="px-6 py-5">
                    <span class="font-bold text-[#0050cb] bg-[#e6eeff] px-2.5 py-1 rounded text-xs border border-[#b3c5ff]/50">
                      {{ order.id }}
                    </span>
                  </td>

                  <!-- Nama Kendaraan & Tanggal -->
                  <td class="px-6 py-5">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-extrabold text-[#191c1e] text-sm">{{ order.car_name }}</span>
                      <span class="text-[11px] text-[#727687] font-medium flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">event</span> {{ formatDate(order.created_at) }}
                      </span>
                    </div>
                  </td>

                  <!-- Durasi -->
                  <td class="px-6 py-5 text-center text-[#424656] font-bold text-sm">
                    {{ order.duration }} Hari
                  </td>

                  <!-- Total Tagihan -->
                  <td class="px-6 py-5 text-right">
                    <span class="font-black text-[#191c1e] text-base">{{ formatPrice(order.total_price) }}</span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-5 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      :class="{
                        'bg-green-100 text-green-700 border-green-200': order.status === 'completed',
                        'bg-orange-100 text-orange-700 border-orange-200': order.status === 'pending',
                        'bg-red-100 text-red-700 border-red-200': order.status === 'cancelled',
                        'bg-blue-100 text-blue-700 border-blue-200': order.status === 'active'
                      }"
                    >
                      <!-- Mengubah Teks Status agar relevan dengan sewa -->
                      {{
                        order.status === 'completed' ? 'SELESAI' :
                        order.status === 'pending' ? 'MENUNGGU' :
                        order.status === 'active' ? 'DISEWA' : 'DIBATALKAN'
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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

/* Animasi Spinner Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
