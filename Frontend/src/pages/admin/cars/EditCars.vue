<script setup>
import { reactive, ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const route = useRoute();
const router = useRouter();
const carId = route.params.id;

const form = reactive({
  name: '',
  brand: '',
  category: '',
  transmission: '',
  seats: 4,
  price: '',
  description: ''
});

const files = reactive({ image_1: null });
const previews = reactive({
  image_1: null
});

const brands = ref(['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ferrari', 'Toyota', 'Honda', 'Mitsubishi']);
const categories = ref([]);
const isLoading = ref(false);

// --- FUNCTIONS ---

const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('car_categories')
      .select('name');
    if (error) throw error;
    categories.value = data.map(c => c.name);
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

const fetchCarDetails = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();
    if (error) throw error;
    
    form.name = data.name;
    form.brand = data.brand;
    form.category = data.category;
    form.transmission = data.transmission;
    form.seats = data.seats;
    form.price = data.price_per_day;
    form.description = data.description || '';
    
    previews.image_1 = data.image_url;
  } catch (err) {
    console.error('Error fetching car:', err);
    Swal.fire('Error', 'Gagal memuat detail kendaraan.', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchCarDetails();
});

// Menangani Preview Gambar (Secara Lokal)
const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    files[key] = selectedFile;
    previews[key] = URL.createObjectURL(selectedFile);
  }
};

// Upload image helper
const uploadImage = async (file) => {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('cars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('cars')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

// Proses Update Produk ke Database
const updateCar = async () => {
  isLoading.value = true;
  try {
    let mainImageUrl = previews.image_1;
    if (files.image_1) {
      mainImageUrl = await uploadImage(files.image_1);
    }
    
    const { error } = await supabase
      .from('cars')
      .update({
        name: form.name,
        brand: form.brand,
        category: form.category,
        transmission: form.transmission,
        seats: parseInt(form.seats) || 4,
        price_per_day: parseInt(form.price),
        description: form.description || '',
        image_url: mainImageUrl
      })
      .eq('id', carId);
      
    if (error) throw error;
    
    Swal.fire({
      icon: 'success',
      title: 'Sukses!',
      text: 'Data armada berhasil diperbarui.',
      confirmButtonColor: '#0050cb',
      timer: 1500,
      showConfirmButton: false
    });
    
    router.push({ name: 'admin-cars-list' });
  } catch (err) {
    console.error('Error updating car:', err);
    Swal.fire('Error', 'Gagal memperbarui data kendaraan.', 'error');
  } finally {
    isLoading.value = false;
  }
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
              </div>
            </div>

            <!-- ================= HARGA ================= -->
            <div class="p-6 bg-[#f7f9fb] border border-[#c2c6d8]/40 rounded-2xl shadow-inner">
              <!-- Harga Utama -->
              <div>
                <label class="block text-sm font-bold text-[#191c1e] mb-2">Tarif Harian Normal (Rupiah) <span class="text-[#ba1a1a]">*</span></label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#727687]">Rp</span>
                  <input v-model="form.price" type="number" class="w-full pl-10 pr-5 py-3 border border-[#c2c6d8]/60 rounded-xl focus:ring-2 focus:ring-[#0050cb] outline-none transition bg-white text-[#191c1e] font-bold">
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
