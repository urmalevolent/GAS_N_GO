<script setup>
import { ref } from 'vue';

// --- MOCKUP STATE (Tanpa Backend) ---
const isLoading = ref(false);

// Data Dummy Detail Kendaraan GASNGO
const product = ref({
  id: 1,
  name: 'Porsche 911 Carrera',
  brand_name: 'Porsche',
  category_name: 'Mobil Sport',
  transmission: 'PDK (Automatic)',
  seats: 2,
  condition: 5,
  price: 1550,
  is_promotion: 1,
  discount_price: 1250,
  description: 'Porsche 911 Carrera adalah perpaduan sempurna antara desain ikonik dan performa murni. Menawarkan akselerasi cepat dengan mesin flat-six twin-turbo, cocok untuk Anda yang menginginkan pengalaman berkendara yang mendebarkan namun tetap mewah. Dilengkapi interior kulit premium dan sistem infotainment terkini.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl',
  image_2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fnN2n36EMlYbVWIjzvWQqy9bOQXh86J9uhMK1aAKD_024CTTyyXZDroDQfoM-MOxF1rj9Jvgxj8nzvwBf5QzlWRVUZoaov2jBkyQl-vR7aurPWWs9wTy2J1SO04uN5fU8v25R92TFmh41zyJBNMNYxa1kS_fo2zW8BKtdiyUP_mv8S7zJIhq7vQcPTWX8jJhf2m7NISDeyA1M5gQ3H4_UGGns6amc4YN_Z_RwqjSEfB573SFj_vdEBaCBzgaGCTVCDl2EKpv-j64',
  image_3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABRxaX7S4GWq20T0lGvvxVi2RYvEqgRhjsDC74q7PrNy2wQU9rbBuAWrR1qDcpRzdyZzEe-SN10R02nNHLGoF-uSX3KPEOcELba_mCJU1WsDt-gj8MiJ1vSEsCl8lBSMveZbpTQTaOIB7R4IcnvKm_63AtLpj5W0tZKL9PIu9ElH3-Fy4JGNl2TFGSzLFhTyKd1uuddI-zvn1Z-amzzPr7zlHstn95yNfujGvVOmx9J3Nsl2n3RTaGvED7nT0kZvfZud4SpYKModrO'
});

// --- FUNCTIONS ---

// Format Uang Dolar (Mockup)
const formatPrice = (price) => {
  if (!price) return '$ 0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

// Terjemahan Kondisi (1-5)
const getConditionText = (num) => {
  const conditions = {
    5: 'Sempurna (Seperti Baru)',
    4: 'Sangat Baik',
    3: 'Baik',
    2: 'Cukup',
    1: 'Buruk'
  };
  return conditions[num] || 'Tidak Diketahui';
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- HEADER -->
    <div class="flex flex-col gap-2 mb-6">
      <div class="flex items-center gap-4 flex-wrap">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Detail Armada</h1>

        <!-- Badge Promo Jika Sedang Promo -->
        <span v-if="product.is_promotion"
              class="bg-[#cc4204]/10 text-[#cc4204] border border-[#cc4204]/30 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
          🔥 Sedang Promo
        </span>
      </div>

      <!-- Breadcrumb Navigasi -->
      <nav class="text-xs md:text-sm font-bold text-[#727687] uppercase tracking-widest flex items-center flex-wrap gap-2 mt-2">
          <router-link to="/admin/cars" class="hover:text-[#0050cb] transition-colors">Manajemen Armada</router-link>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="text-[#0050cb]">{{ product.name || 'Memuat...' }}</span>
      </nav>
    </div>

    <!-- LOADING STATE (Murni Mockup) -->
    <div v-if="isLoading" class="p-20 text-center bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0050cb] mx-auto"></div>
        <p class="mt-4 text-[#727687] font-bold text-sm uppercase tracking-widest">Memuat Detail Kendaraan...</p>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="flex flex-col rounded-3xl border border-[#c2c6d8]/40 bg-white shadow-sm overflow-hidden transition-all">
      <div class="p-6 md:p-8">

        <form @submit.prevent>
          <div class="space-y-10">

            <!-- ================= GALERI FOTO ================= -->
            <div>
              <label class="flex items-center gap-3 text-lg font-extrabold text-[#191c1e] mb-6">
                <span class="material-symbols-outlined text-[#0050cb]">photo_library</span>
                Galeri Foto Kendaraan
              </label>

              <div class="flex flex-col md:flex-row gap-6">
                <!-- Foto Utama (Besar) -->
                <div class="flex flex-col gap-2 w-full md:w-1/2 lg:w-2/5">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Foto Utama</span>
                   <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-[#c2c6d8]/40 bg-[#f2f4f6] group shadow-sm">
                     <img :src="product.image"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                   </div>
                </div>

                <!-- Foto Sampingan (Kecil-kecil berdampingan) -->
                <div class="flex flex-row md:flex-col gap-4 w-full md:w-1/2 lg:w-1/4">
                  <div class="flex flex-col gap-2 flex-1">
                     <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Tampak Samping/Luar</span>
                     <div class="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-[#c2c6d8]/40 bg-[#f2f4f6] group shadow-sm">
                       <img v-if="product.image_2" :src="product.image_2"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                       <div v-else class="w-full h-full flex items-center justify-center text-[#727687] text-xs font-medium italic">Tidak ada foto</div>
                     </div>
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                     <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Detail Interior</span>
                     <div class="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-[#c2c6d8]/40 bg-[#f2f4f6] group shadow-sm">
                       <img v-if="product.image_3" :src="product.image_3"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                       <div v-else class="w-full h-full flex items-center justify-center text-[#727687] text-xs font-medium italic">Tidak ada foto</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <hr class="border-[#c2c6d8]/40">

            <!-- ================= SPESIFIKASI & HARGA ================= -->
            <div class="space-y-8">

                <!-- Nama Kendaraan -->
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Model Kendaraan</label>
                  <p class="text-2xl font-black text-[#191c1e]">
                    {{ product.name }}
                  </p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <!-- Merek -->
                    <div>
                        <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Merek</label>
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-[#424656] text-lg">workspace_premium</span>
                          <span class="font-bold text-[#191c1e] text-base">{{ product.brand_name }}</span>
                        </div>
                    </div>

                    <!-- Kategori -->
                    <div>
                        <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Kategori</label>
                        <div class="inline-block px-3 py-1 bg-[#e6eeff] border border-[#b3c5ff]/50 rounded text-[11px] font-bold text-[#0050cb] uppercase tracking-widest">
                            {{ product.category_name }}
                        </div>
                    </div>

                    <!-- Transmisi / Tipe -->
                    <div>
                        <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Tipe Mesin</label>
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-[#424656] text-lg">settings</span>
                          <span class="font-bold text-[#191c1e] text-base">{{ product.transmission }}</span>
                        </div>
                    </div>

                    <!-- Kapasitas Kursi -->
                    <div>
                        <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Kapasitas</label>
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-[#424656] text-lg">airline_seat_recline_extra</span>
                          <span class="font-bold text-[#191c1e] text-base">{{ product.seats }} Kursi</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <!-- Kondisi Visual -->
                    <div class="p-6 bg-[#f2f4f6] rounded-2xl border border-[#c2c6d8]/30">
                      <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-3">Kondisi Fisik Kendaraan</label>
                      <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <span class="material-symbols-outlined text-[#16a34a]">verified</span>
                        </span>
                        <span class="font-extrabold text-[#191c1e] text-lg">
                          {{ getConditionText(product.condition) }}
                        </span>
                      </div>
                    </div>

                    <!-- Area Harga / Promo -->
                    <div class="p-6 bg-[#f2f4f6] rounded-2xl border border-[#c2c6d8]/30">
                      <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-3">Tarif Sewa Harian</label>

                      <!-- Jika Ada Promo -->
                      <div v-if="product.is_promotion" class="flex flex-col gap-2">
                        <div class="flex items-center gap-3">
                          <span class="text-3xl font-black text-[#191c1e]">{{ formatPrice(product.discount_price) }}</span>
                          <span class="text-sm text-[#ba1a1a] line-through decoration-[#ba1a1a] font-bold opacity-80">{{ formatPrice(product.price) }}</span>
                        </div>
                        <div class="inline-block px-2 py-1 bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20 rounded text-[10px] font-black uppercase tracking-widest w-fit mt-1">
                          Hemat {{ Math.round((1 - product.discount_price / product.price) * 100) }}% Untuk Pelanggan
                        </div>
                      </div>

                      <!-- Harga Normal -->
                      <div v-else class="flex items-end gap-1">
                        <span class="text-3xl font-black text-[#191c1e]">{{ formatPrice(product.price) }}</span>
                        <span class="text-xs font-bold text-[#727687] uppercase tracking-widest mb-1.5">/ Hari</span>
                      </div>
                    </div>
                </div>

                <!-- Deskripsi -->
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-3">Deskripsi Kendaraan</label>
                  <div class="w-full p-6 md:p-8 border border-[#c2c6d8]/30 rounded-2xl bg-white shadow-sm text-[#424656] leading-relaxed text-sm md:text-base">
                    {{ product.description || 'Tidak ada deskripsi tersedia.' }}
                  </div>
                </div>
            </div>
          </div>

          <!-- ================= ACTION BUTTONS ================= -->
          <div class="mt-12 flex flex-col-reverse md:flex-row items-center gap-4">
            <!-- Tombol Kembali -->
            <router-link to="/admin/cars" class="w-full md:w-auto bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-sm uppercase tracking-widest px-10 py-4 border border-[#c2c6d8]/50 rounded-xl transition-all shadow-sm text-center">
              Kembali ke Daftar
            </router-link>

            <!-- Tombol Edit (Dummy Link) -->
            <router-link :to="`/admin/cars/edit/${product.id}`" class="w-full md:w-auto bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-xl transition-all shadow-md shadow-blue-600/20 text-center active:scale-95 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px]">edit</span>
              Edit Kendaraan
            </router-link>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Badge Promo */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .7; }
}
</style>
