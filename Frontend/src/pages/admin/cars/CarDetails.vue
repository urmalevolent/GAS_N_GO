<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const carId = route.params.id;
const isLoading = ref(true);
const product = ref(null);

const fetchCarDetails = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5000/api/cars/${carId}`);
    const resData = await response.json();
    if (!response.ok || !resData.success) throw new Error(resData.message || 'Gagal memuat detail kendaraan.');
    const data = resData.data;
    
    product.value = {
      id: data.id,
      name: data.name,
      brand_name: data.brand,
      category_name: data.category,
      transmission: data.transmission,
      seats: data.seats,
      condition: 5, // Default condition
      price: data.price_per_day,
      is_promotion: 0,
      discount_price: null,
      description: data.description || 'Tidak ada deskripsi tersedia.',
      image: data.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop',
      image_2: null,
      image_3: null
    };
  } catch (err) {
    console.error('Error fetching car details:', err);
    Swal.fire('Error', err.message || 'Gagal memuat detail kendaraan.', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCarDetails();
});

const formatPrice = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

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
            <!-- ================= FOTO UTAMA ================= -->
            <div>
              <label class="flex items-center gap-3 text-lg font-extrabold text-[#191c1e] mb-6">
                <span class="material-symbols-outlined text-[#0050cb]">photo_library</span>
                Foto Kendaraan
              </label>

              <div class="max-w-2xl">
                 <div class="aspect-[16/9] rounded-2xl overflow-hidden border border-[#c2c6d8]/40 bg-[#f2f4f6] group shadow-sm">
                   <img :src="product.image"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
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
