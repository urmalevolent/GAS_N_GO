<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'

// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref("")

// Data Dummy Kendaraan GASNGO
const products = ref([
  {
    id: 1,
    name: 'Porsche Taycan',
    category_name: 'Elektrik Mewah',
    brand_name: 'Porsche',
    status: 'active',
    is_promotion: 1,
    price: 1550,
    discount_price: 1250,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvD6TQs93A1RrjIH7Rv96GLKfynEZps_hQ-uFhsmuMgmyndxwQJmhDHdy-7M3Hd2995hl9oVrkv4OzRgXF-MDId7BFkbcr2xw3TlJFjgucg5DAW_cpdTpO4fucwfuZm8KirYn3H7rC6A_K7aNiVlOzCpU5TFoiRRIqrjDlSAQgryccot_v9aCsXP4Ro5oMpxgeS37JSIUpW1_syxsr-UfVjthj3LyupQpBMsaBRo_OtQnu53uSNznRtPDkhvKLfrvJD8J8hklnJ6P8'
  },
  {
    id: 2,
    name: 'BMW M8 Gran Coupe',
    category_name: 'Sedan Eksekutif',
    brand_name: 'BMW',
    status: 'active',
    is_promotion: 0,
    price: 950,
    discount_price: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE'
  },
  {
    id: 3,
    name: 'Ferrari F8 Tributo',
    category_name: 'Hypercar',
    brand_name: 'Ferrari',
    status: 'inactive',
    is_promotion: 0,
    price: 2450,
    discount_price: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp'
  }
])

// --- MOCKUP FUNCTIONS ---

// Simulasi Search (Fitur Frontend Filter saja)
const filterProducts = () => {
  if (searchQuery.value) {
    alert(`Mensimulasikan pencarian untuk: ${searchQuery.value}`)
  }
}

// Simulasi Nonaktifkan (Soft Delete)
const deleteProduct = (id, name) => {
  Swal.fire({
    title: `Nonaktifkan ${name}?`,
    text: "Kendaraan tidak akan muncul di halaman katalog pelanggan, tapi data tetap ada.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Ya, Nonaktifkan!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Cari produk di array lokal dan ubah statusnya
      const prod = products.value.find(p => p.id === id)
      if (prod) prod.status = 'inactive'
      Swal.fire('Berhasil!', 'Kendaraan telah dinonaktifkan.', 'success')
    }
  })
}

// Simulasi Aktifkan (Restore)
const restoreProduct = (id, name) => {
  Swal.fire({
    title: `Aktifkan ${name}?`,
    text: "Kendaraan akan muncul kembali di halaman katalog pelanggan.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Ya, Aktifkan!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      const prod = products.value.find(p => p.id === id)
      if (prod) prod.status = 'active'
      Swal.fire('Berhasil!', 'Kendaraan sekarang aktif kembali.', 'success')
    }
  })
}

// Format Mata Uang (USD untuk contoh mewah)
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Daftar Armada</h1>
        <p class="text-sm text-[#727687]">Kelola seluruh kendaraan yang tersedia untuk disewakan.</p>
      </div>

      <!-- Tombol Tambah Produk (Akan ke /admin/cars/create) -->
      <router-link
        to="/admin/cars/add"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-[#0050cb] hover:bg-[#0066ff] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">add</span> Tambah Armada
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
            @keyup.enter="filterProducts"
            type="text"
            placeholder="Cari nama kendaraan atau merek..."
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
              <th class="px-6 py-4 w-28">FOTO</th>
              <th class="px-6 py-4">DETAIL KENDARAAN</th>
              <th class="px-6 py-4">STATUS</th>
              <th class="px-6 py-4 text-right">TARIF SEWA</th>
              <th class="px-6 py-4 text-center">AKSI</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Jika tidak ada produk -->
            <tr v-if="products.length === 0">
              <td colspan="6" class="p-8 text-center text-[#727687] italic font-medium">Tidak ada armada yang ditemukan.</td>
            </tr>

            <!-- Looping Data Produk -->
            <tr v-else v-for="(product, index) in products" :key="product.id"
                class="transition-colors hover:bg-blue-50/30"
                :class="{'opacity-50 bg-gray-50': product.status === 'inactive'}"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Foto Kendaraan -->
              <td class="px-6 py-5">
                 <img :src="product.image" class="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
              </td>

              <!-- 3. Detail Kendaraan -->
              <td class="px-6 py-5">
                 <div class="flex flex-col gap-1.5">
                   <span class="font-extrabold text-[#191c1e] text-base" :class="{'line-through text-[#727687]': product.status === 'inactive'}">
                      {{ product.name }}
                   </span>
                   <div class="flex gap-2 items-center">
                      <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e6eeff] text-[#0050cb] uppercase tracking-widest border border-[#b3c5ff]/50">{{ product.category_name }}</span>
                      <span class="text-[10px] text-[#727687] font-bold uppercase tracking-widest">{{ product.brand_name }}</span>
                   </div>
                 </div>
              </td>

              <!-- 4. Status Produk -->
              <td class="px-6 py-5">
                <div class="flex flex-col gap-2 items-start">
                  <span v-if="product.status === 'active'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                      AKTIF
                  </span>
                  <span v-else class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200">
                      NONAKTIF
                  </span>

                  <span v-if="product.is_promotion === 1 && product.status === 'active'"
                        class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#cc4204]/10 text-[#cc4204] border border-[#cc4204]/30 animate-pulse">
                      🔥 PROMO
                  </span>
                </div>
              </td>

              <!-- 5. Harga / Tarif -->
              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-1">
                  <!-- Tampilan Promo -->
                  <template v-if="product.is_promotion === 1 && product.status === 'active'">
                    <span class="text-[11px] text-[#ba1a1a] font-bold line-through decoration-[#ba1a1a] opacity-80">
                      {{ formatPrice(product.price) }}/hari
                    </span>
                    <span class="font-black text-[#191c1e] text-lg leading-none">
                      {{ formatPrice(product.discount_price) }}
                    </span>
                  </template>

                  <!-- Tampilan Normal -->
                  <template v-else>
                    <span class="font-black text-[#191c1e] text-lg leading-none">
                      {{ formatPrice(product.price) }}
                    </span>
                    <span class="text-[10px] text-[#727687] font-bold uppercase tracking-widest">/Hari</span>
                  </template>
                </div>
              </td>

              <!-- 6. Aksi (Edit/Hapus/Restore) -->
              <td class="px-6 py-5">
                  <div class="flex gap-2 items-center justify-center">
                      <!-- Tombol Detail (Biru) -->
                      <button class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Lihat Detail">
                          <span class="material-symbols-outlined text-[18px]">visibility</span>
                      </button>

                      <template v-if="product.status === 'active'">
                          <!-- Tombol Edit (Kuning/Oren) -->
                          <button class="w-8 h-8 rounded bg-[#eab308] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Edit Data">
                              <span class="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          <!-- Tombol Hapus/Nonaktifkan (Merah) -->
                          <button @click="deleteProduct(product.id, product.name)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan">
                              <span class="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                      </template>

                      <template v-else>
                          <!-- Tombol Restore/Aktifkan (Hijau) -->
                          <button @click="restoreProduct(product.id, product.name)"
                                  class="h-8 px-3 rounded bg-[#16a34a] text-white flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity" title="Aktifkan Kembali">
                              <span class="material-symbols-outlined text-[18px]">restore</span>
                              <span class="text-[10px] font-black uppercase tracking-widest">PULIHKAN</span>
                          </button>
                      </template>
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Tabel (Summary Status) -->
      <div class="p-5 md:p-6 border-t border-[#f2f4f6] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f7f9fb]/50">
          <p class="text-sm text-[#727687] font-medium">Total Armada: <span class="font-black text-[#191c1e] text-base">{{ products.length }}</span></p>
          <div class="flex gap-6">
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></span> Aktif
              </span>
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#d32f2f] rounded-full"></span> Nonaktif (Disembunyikan)
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
