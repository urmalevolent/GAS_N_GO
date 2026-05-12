<script setup>
import { reactive, ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- MOCKUP STATE (Tanpa Backend) ---
const form = reactive({
  name: 'Porsche 911 Carrera',
  brand: 'Porsche',
  category: 'Mobil Sport',
  transmission: 'Matic (PDK)',
  seats: 2,
  price: 1550,
  description: 'Kendaraan ini berada dalam kondisi prima dengan paket perawatan tahunan penuh. Cocok untuk pelanggan VIP yang mencari kecepatan dan kemewahan dalam satu paket.',
  is_promotion: 1,
  discount_price: 1250
});

const files = reactive({ image_1: null, image_2: null, image_3: null });
const previews = reactive({
  image_1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl',
  image_2: null,
  image_3: null
});

const brands = ref(['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ferrari']);
const categories = ref(['Sedan Eksekutif', 'SUV Premium', 'Mobil Sport', 'Mobil Listrik']);
const isLoading = ref(false);

// --- FUNCTIONS ---

// Menangani Preview Gambar (Secara Lokal)
const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    files[key] = selectedFile;
    previews[key] = URL.createObjectURL(selectedFile);
  }
};

// Logika Dummy SweetAlert untuk Input Persen Diskon
const askForDiscount = async () => {
  if (!form.price || form.price <= 0) {
    Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Isi tarif sewa utama terlebih dahulu!', confirmButtonColor: '#0050cb' });
    form.is_promotion = 0;
    return false;
  }

  const { value: discountPercent } = await Swal.fire({
    title: 'Atur Diskon Promo',
    input: 'number',
    inputLabel: 'Masukkan persentase diskon (1-99%)',
    inputPlaceholder: 'Contoh: 20',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    inputAttributes: { min: 1, max: 99 },
    inputValidator: (value) => {
      if (!value || value < 1 || value > 99) return 'Masukkan angka antara 1 sampai 99%';
    }
  });

  if (discountPercent) {
    const reduction = (form.price * discountPercent) / 100;
    form.discount_price = Math.round(form.price - reduction);

    Swal.fire({
      icon: 'success',
      title: 'Diskon Terpasang!',
      text: `Tarif promo menjadi: $${form.discount_price.toLocaleString()}`,
      timer: 1500,
      showConfirmButton: false
    });
    return true;
  }
  return false;
};

// Mengatur Toggle Checkbox Switch
const handlePromotionToggle = async () => {
  if (form.is_promotion) {
    const success = await askForDiscount();
    if (!success) {
      form.is_promotion = 0;
      form.discount_price = 0;
    }
  } else {
    form.discount_price = 0;
  }
};

// Simulasi Update Produk ke Backend
const updateCar = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Sukses!',
      text: 'Data armada berhasil diperbarui.',
      confirmButtonColor: '#0050cb',
      timer: 1500,
      showConfirmButton: false
    });
    // router.push({ name: 'admin-cars-list' }); // Uncomment jika ingin dialihkan otomatis
    alert('Simulasi Edit Selesai!');
  }, 1000);
};

</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col gap-2 mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Edit Armada</h1>
      <p class="text-sm text-[#727687]">Perbarui informasi, harga, dan foto untuk <span class="font-bold text-[#0050cb]">{{ form.name }}</span>.</p>
    </div>

    <!-- Kotak Formulir -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden">
      <div class="p-6 md:p-8">
        <form @submit.prevent="updateCar">
          <div class="space-y-10">

            <!-- ================= UNGGAH FOTO ================= -->
            <div>
              <label class="block text-base font-bold text-[#191c1e] mb-4">Galeri Kendaraan</label>
              <div class="flex flex-wrap gap-6">
                <!-- Foto 1 -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Foto Utama</span>
                   <div class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#c2c6d8] rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage1.click()">
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_1')" />
                    <img v-if="previews.image_1" :src="previews.image_1" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div v-else class="text-[#727687] text-xs font-bold"><span class="material-symbols-outlined text-2xl block mb-1">add_a_photo</span> Unggah</div>
                    <div class="absolute inset-0 bg-[#191c1e]/60 hidden group-hover:flex flex-col items-center justify-center text-white font-bold text-xs backdrop-blur-sm transition-all">
                      <span class="material-symbols-outlined text-xl mb-1">edit</span> UBAH
                    </div>
                  </div>
                </div>

                <!-- Foto 2 -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Sisi Luar</span>
                   <div class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#c2c6d8] rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage2.click()">
                    <input type="file" ref="inputImage2" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_2')" />
                    <img v-if="previews.image_2" :src="previews.image_2" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div v-else class="text-[#727687] text-xs font-bold text-center"><span class="material-symbols-outlined text-2xl block mb-1">add_a_photo</span> Unggah<br>Samping</div>
                    <div class="absolute inset-0 bg-[#191c1e]/60 hidden group-hover:flex flex-col items-center justify-center text-white font-bold text-xs backdrop-blur-sm transition-all">
                      <span class="material-symbols-outlined text-xl mb-1">edit</span> UBAH
                    </div>
                  </div>
                </div>

                <!-- Foto 3 -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Detail Interior</span>
                   <div class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#c2c6d8] rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group" @click="$refs.inputImage3.click()">
                    <input type="file" ref="inputImage3" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_3')" />
                    <img v-if="previews.image_3" :src="previews.image_3" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div v-else class="text-[#727687] text-xs font-bold text-center"><span class="material-symbols-outlined text-2xl block mb-1">add_a_photo</span> Unggah<br>Interior</div>
                    <div class="absolute inset-0 bg-[#191c1e]/60 hidden group-hover:flex flex-col items-center justify-center text-white font-bold text-xs backdrop-blur-sm transition-all">
                      <span class="material-symbols-outlined text-xl mb-1">edit</span> UBAH
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= PROMO & HARGA ================= -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end p-6 bg-[#f7f9fb] border border-[#c2c6d8]/40 rounded-2xl shadow-inner">

              <!-- Harga Utama -->
              <div>
                <label class="block text-sm font-bold text-[#191c1e] mb-2">Tarif Harian Normal (USD) <span class="text-[#ba1a1a]">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#727687]">$</span>
                  <input v-model="form.price" type="number" class="w-full pl-8 pr-5 py-3 border border-[#c2c6d8]/60 rounded-xl focus:ring-2 focus:ring-[#0050cb] outline-none transition bg-white text-[#191c1e] font-bold">
                </div>
              </div>

              <!-- Switch Promo -->
              <div class="flex items-center space-x-4 p-4 bg-white border border-[#c2c6d8]/50 rounded-xl shadow-sm h-full">
                <!-- Checkbox Switch Ala iOS/Tailwind -->
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" v-model="form.is_promotion" :true-value="1" :false-value="0" @change="handlePromotionToggle" class="sr-only peer">
                  <div class="w-11 h-6 bg-[#c2c6d8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c2c6d8] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16a34a]"></div>
                </label>

                <div class="flex-1 min-w-0">
                  <span class="text-[11px] font-black text-[#191c1e] uppercase tracking-widest block mb-0.5">Berikan Promo?</span>

                  <div v-if="form.is_promotion && form.discount_price > 0" class="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p class="text-lg text-[#16a34a] font-black leading-none">
                      ${{ form.discount_price.toLocaleString() }}
                    </p>
                    <button
                      type="button"
                      @click="askForDiscount"
                      class="text-[9px] bg-[#0050cb] text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#0066ff] transition shadow-sm active:scale-95 uppercase tracking-widest w-fit"
                    >
                      Ubah Diskon
                    </button>
                  </div>
                  <p v-else class="text-[10px] text-[#727687] italic mt-0.5">Toggle untuk memberi harga coret.</p>
                </div>
              </div>
            </div>

            <hr class="border-[#c2c6d8]/40">

            <!-- ================= DETAIL KENDARAAN ================= -->
            <div class="space-y-6">

              <!-- Nama -->
              <div>
                <label class="block text-sm font-bold text-[#191c1e] mb-2">Nama Model Kendaraan <span class="text-[#ba1a1a]">*</span></label>
                <input v-model="form.name" type="text" class="w-full px-5 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#191c1e] font-medium">
              </div>

              <!-- Merek & Kategori -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Merek <span class="text-[#ba1a1a]">*</span></label>
                  <div class="relative">
                    <select v-model="form.brand" class="w-full px-5 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-[#0050cb] text-sm text-[#424656] font-medium outline-none">
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
                    <select v-model="form.category" class="w-full px-5 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-[#0050cb] text-sm text-[#424656] font-medium outline-none">
                      <option v-for="(cat, i) in categories" :key="i" :value="cat">{{ cat }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                      <span class="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transmisi & Kapasitas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Transmisi / Penggerak <span class="text-[#ba1a1a]">*</span></label>
                  <div class="relative">
                    <select v-model="form.transmission" class="w-full px-5 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none cursor-pointer focus:ring-1 focus:ring-[#0050cb] text-sm text-[#424656] font-medium outline-none">
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
                  <input v-model="form.seats" type="number" class="w-full px-5 py-3.5 border border-[#c2c6d8]/60 rounded-xl focus:ring-1 focus:ring-[#0050cb] outline-none transition text-sm text-[#191c1e] font-medium">
                </div>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-sm font-bold text-[#191c1e] mb-2">Deskripsi & Keunggulan</label>
                <textarea v-model="form.description" rows="5" class="w-full px-6 py-4 border border-[#c2c6d8]/60 rounded-xl resize-none focus:ring-1 focus:ring-[#0050cb] outline-none text-sm text-[#424656] leading-relaxed"></textarea>
              </div>
            </div>

            <!-- ================= ACTION BUTTONS ================= -->
            <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <!-- Tombol Simpan -->
              <button type="submit" :disabled="isLoading" class="w-full sm:w-auto flex-1 bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#0050cb]/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                <span v-if="isLoading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin">sync</span> Menyimpan...
                </span>
                <span v-else>Simpan Perubahan</span>
              </button>

              <!-- Tombol Batal -->
              <router-link to="/admin/cars" class="w-full sm:w-auto flex-1 bg-white text-[#424656] font-bold text-sm uppercase tracking-widest px-8 py-4 border border-[#c2c6d8] rounded-xl hover:bg-[#f2f4f6] transition-all text-center">
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
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
