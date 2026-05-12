<script setup>
import { reactive, ref } from 'vue'
import Swal from 'sweetalert2'


// --- MOCKUP STATE (Tanpa Backend) ---
const form = reactive({
  name: '',
  brand: '',
  category: '',
  type: '', // Misalnya: Manual / Matic / Electric
  seats: '', // Jumlah kursi
  price: '',
  description: ''
})

// State untuk 3 Gambar
const files = reactive({
  image_1: null,
  image_2: null,
  image_3: null
})

const previews = reactive({
  image_1: null,
  image_2: null,
  image_3: null
})

const isLoading = ref(false)

// Data Dummy
const brands = ref(['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ferrari'])
const categories = ref(['Sedan Eksekutif', 'SUV Premium', 'Mobil Sport', 'Mobil Listrik'])

// --- FUNCTIONS ---

// Menangani Perubahan File Gambar
const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    files[key] = selectedFile
    previews[key] = URL.createObjectURL(selectedFile)
  }
}

// Simulasi Proses Pembuatan Kendaraan (Mockup Submit)
const createCar = () => {
  // Validasi Dummy Sederhana
  if (!form.name || !form.price || !form.brand || !form.category || !files.image_1) {
    Swal.fire({
      icon: 'warning',
      title: 'Data Belum Lengkap',
      text: 'Pastikan nama mobil, harga, merek, kategori, dan foto utama sudah terisi.',
      confirmButtonColor: '#0050cb'
    })
    return
  }

  isLoading.value = true

  // Simulasi delay jaringan (1.5 detik)
  setTimeout(() => {
    isLoading.value = false

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Armada kendaraan baru telah ditambahkan ke katalog.',
      confirmButtonColor: '#0050cb',
      showConfirmButton: false,
      timer: 1500
    })

    // Setelah sukses, kembali ke daftar armada (pastikan nama route ini benar di router Anda)
    // router.push({ name: 'admin-products' })
    alert('Simulasi Sukses! Kembali ke halaman daftar mobil.')

  }, 1500)
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col gap-2 mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Tambah Armada Kendaraan</h1>
      <p class="text-sm text-[#727687]">Tambahkan unit kendaraan baru ke dalam katalog penyewaan GASNGO.</p>
    </div>

    <!-- Kotak Formulir -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden">
      <div class="p-6 md:p-8">
        <form @submit.prevent="createCar">
          <div class="space-y-8">

            <!-- SECTION: UNGGAH FOTO -->
            <div>
              <label class="block text-base font-bold text-[#191c1e] mb-4">Foto Kendaraan <span class="text-[#ba1a1a]">*</span></label>

              <div class="flex flex-wrap gap-6">

                <!-- Foto 1 (Utama) -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Foto Utama *</span>
                   <div
                    class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#0050cb]/40 rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage1.click()"
                  >
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_1')" />
                    <img v-if="previews.image_1" :src="previews.image_1" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center group-hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined text-2xl text-[#0050cb] mb-1">add_a_photo</span>
                        <span class="text-[10px] font-bold text-[#0050cb]">Unggah<br>Utama</span>
                    </div>
                  </div>
                </div>

                <!-- Foto 2 (Samping) -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Tampak Samping</span>
                   <div
                    class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#c2c6d8] rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage2.click()"
                  >
                    <input type="file" ref="inputImage2" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_2')" />
                    <img v-if="previews.image_2" :src="previews.image_2" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center group-hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined text-2xl text-[#727687] mb-1">add_a_photo</span>
                        <span class="text-[10px] font-bold text-[#727687]">Unggah<br>Samping</span>
                    </div>
                  </div>
                </div>

                <!-- Foto 3 (Interior) -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Detail Interior</span>
                   <div
                    class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#c2c6d8] rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage3.click()"
                  >
                    <input type="file" ref="inputImage3" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_3')" />
                    <img v-if="previews.image_3" :src="previews.image_3" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center group-hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined text-2xl text-[#727687] mb-1">add_a_photo</span>
                        <span class="text-[10px] font-bold text-[#727687]">Unggah<br>Interior</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <hr class="border-[#c2c6d8]/40">

            <!-- SECTION: DETAIL KENDARAAN -->
            <div class="space-y-6">
                <!-- Nama Kendaraan -->
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Nama Model Kendaraan <span class="text-[#ba1a1a]">*</span></label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="Cth: Porsche 911 Carrera">
                </div>

                <!-- Merek dan Kategori -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-[#191c1e] mb-2">Merek <span class="text-[#ba1a1a]">*</span></label>
                        <div class="relative">
                            <select v-model="form.brand" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#424656]">
                                <option value="" disabled selected>Pilih Merek Kendaraan</option>
                                <option v-for="(brand, i) in brands" :key="i" :value="brand">{{ brand }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                              <span class="material-symbols-outlined text-xl">expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-[#191c1e] mb-2">Kategori <span class="text-[#ba1a1a]">*</span></label>
                        <div class="relative">
                            <select v-model="form.category" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#424656]">
                                <option value="" disabled selected>Pilih Kategori</option>
                                <option v-for="(cat, i) in categories" :key="i" :value="cat">{{ cat }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                              <span class="material-symbols-outlined text-xl">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tipe Mesin & Kapasitas Penumpang -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-[#191c1e] mb-2">Tipe Penggerak / Transmisi <span class="text-[#ba1a1a]">*</span></label>
                      <div class="relative">
                          <select v-model="form.type" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#424656]">
                              <option value="" disabled selected>Pilih Tipe</option>
                              <option value="Matic (PDK)">Matic (PDK)</option>
                              <option value="Manual">Manual</option>
                              <option value="Full Electric">Full Electric (EV)</option>
                              <option value="Hybrid">Hybrid</option>
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                            <span class="material-symbols-outlined text-xl">expand_more</span>
                          </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-[#191c1e] mb-2">Jumlah Kursi <span class="text-[#ba1a1a]">*</span></label>
                      <input v-model="form.seats" type="number" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="Cth: 2 atau 4">
                    </div>
                </div>

                <!-- Harga Sewa Harian -->
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Tarif Sewa Harian (USD/IDR) <span class="text-[#ba1a1a]">*</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#727687]">$</span>
                    <input v-model="form.price" type="number" class="w-full pl-8 pr-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="Cth: 1250">
                  </div>
                </div>

                <!-- Deskripsi Kendaraan -->
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Deskripsi & Keunggulan</label>
                  <textarea v-model="form.description" rows="5" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm resize-none" placeholder="Tuliskan deskripsi mewah tentang kendaraan ini..."></textarea>
                </div>
            </div>

            <!-- BUTTONS -->
            <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <button type="submit" :disabled="isLoading" class="w-full sm:w-auto bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#0050cb]/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                <span v-if="isLoading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin">sync</span> Menyimpan...
                </span>
                <span v-else>Simpan Kendaraan</span>
              </button>

              <!-- Pastikan router-link ini mengarah kembali ke tabel armada -->
              <router-link to="/admin/products" class="w-full sm:w-auto bg-white text-[#424656] font-bold text-sm uppercase tracking-widest px-8 py-4 border border-[#c2c6d8] rounded-xl hover:bg-[#f2f4f6] transition-all text-center">
                Batal
              </router-link>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ikon Google Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
