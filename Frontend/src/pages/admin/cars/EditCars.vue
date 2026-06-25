<script setup>
import { reactive, ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const carId = route.params.id;
const authStore = useAuthStore();

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
const isLoading = ref(true);
const isSaving = ref(false);

// --- FUNCTIONS ---

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/categories');
    const resData = await response.json();
    if (!response.ok || !resData.success) throw new Error(resData.message);
    categories.value = (resData.data || []).map(c => c.name);
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

const fetchCarDetails = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5000/api/cars/${carId}`);
    const resData = await response.json();
    if (!response.ok || !resData.success) throw new Error(resData.message || 'Gagal memuat detail kendaraan.');
    const data = resData.data;
    
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
    Swal.fire('Error', err.message || 'Gagal memuat detail kendaraan.', 'error');
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

// Proses Update Produk ke Database via Backend API
const updateCar = async () => {
  isSaving.value = true;
  try {
    let mainImageUrl = previews.image_1;
    if (files.image_1) {
      mainImageUrl = await uploadImage(files.image_1);
    }
    
    const token = authStore.session?.access_token;
    const response = await fetch(`http://localhost:5000/api/admin/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.name,
        brand: form.brand,
        category: form.category,
        transmission: form.transmission,
        seats: parseInt(form.seats) || 4,
        price_per_day: parseInt(form.price),
        description: form.description || '',
        image_url: mainImageUrl
      })
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) throw new Error(resData.message || 'Gagal memperbarui data kendaraan.');
    
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
    Swal.fire('Error', err.message || 'Gagal memperbarui data kendaraan.', 'error');
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  router.push('/admin/cars');
};
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] min-h-screen pb-20">
    
    <!-- ================= BREADCRUMB & HEADER ================= -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c2c6d8]/40 pb-6">
      <div>
        <nav class="flex items-center gap-2 text-xs font-bold text-[#727687] uppercase tracking-widest mb-3">
          <button @click="goBack" class="hover:text-[#0050cb] transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">arrow_back</span> Kembali
          </button>
          <span class="w-1 h-1 rounded-full bg-[#c2c6d8]"></span>
          <span>Manajemen Armada</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-black tracking-tight text-[#191c1e] flex items-center gap-3">
          Edit Kendaraan
        </h1>
      </div>
    </div>

    <!-- ================= LOADING STATE ================= -->
    <div v-if="isLoading" class="animate-pulse space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-24 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
          <div class="grid grid-cols-2 gap-6">
            <div class="h-24 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
            <div class="h-24 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
          </div>
          <div class="h-40 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
        </div>
        <div class="lg:col-span-1 space-y-6">
          <div class="h-64 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
          <div class="h-32 bg-[#f2f4f6] rounded-[2rem] border border-[#c2c6d8]/30"></div>
        </div>
      </div>
    </div>

    <!-- ================= MAIN CONTENT ================= -->
    <div v-else class="animate-fadeIn">
      <form @submit.prevent="updateCar">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- KIRI: INFORMASI UTAMA -->
          <div class="lg:col-span-2 space-y-8">
            
            <div class="bg-white rounded-[2rem] p-8 border border-[#c2c6d8]/40 shadow-sm space-y-8">
              <h3 class="text-sm font-black uppercase tracking-widest text-[#191c1e] flex items-center gap-2 border-b border-[#c2c6d8]/40 pb-4">
                <span class="material-symbols-outlined text-[#0050cb]">info</span> Informasi Kendaraan
              </h3>

              <div class="space-y-6">
                <!-- Nama -->
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Nama Model Kendaraan <span class="text-[#ba1a1a]">*</span></label>
                  <input v-model="form.name" required type="text" class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-bold text-[#191c1e]">
                </div>

                <!-- Brand& Kategori -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Brand<span class="text-[#ba1a1a]">*</span></label>
                    <input v-model="form.brand" required type="text" placeholder="Contoh: Porsche" class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-bold text-[#191c1e]">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Kategori <span class="text-[#ba1a1a]">*</span></label>
                    <div class="relative">
                      <select v-model="form.category" required class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-bold text-[#191c1e]">
                        <option value="" disabled>Pilih Kategori</option>
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
                    <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Transmisi <span class="text-[#ba1a1a]">*</span></label>
                    <div class="relative">
                      <select v-model="form.transmission" required class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl appearance-none cursor-pointer focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-bold text-[#191c1e]">
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
                    <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Kapasitas Kursi <span class="text-[#ba1a1a]">*</span></label>
                    <input v-model="form.seats" type="number" required class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-bold text-[#191c1e]">
                  </div>
                </div>

                <!-- Deskripsi -->
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-2">Deskripsi & Keunggulan</label>
                  <textarea v-model="form.description" rows="5" class="w-full px-5 py-4 bg-[#f7f9fb] border border-[#c2c6d8]/60 rounded-xl resize-none focus:bg-white focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-sm font-medium text-[#424656] leading-relaxed"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- KANAN: FOTO & HARGA & SUBMIT -->
          <div class="lg:col-span-1 space-y-8">
            
            <!-- UPLOAD FOTO -->
            <div class="bg-white rounded-[2rem] p-8 border border-[#c2c6d8]/40 shadow-sm">
              <h3 class="text-sm font-black uppercase tracking-widest text-[#191c1e] flex items-center gap-2 border-b border-[#c2c6d8]/40 pb-4 mb-6">
                <span class="material-symbols-outlined text-[#0050cb]">image</span> Foto Utama
              </h3>
              
              <div class="aspect-[4/3] w-full border-2 border-dashed border-[#c2c6d8] rounded-[1.5rem] bg-[#f7f9fb] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-[#0050cb] transition-colors" @click="$refs.inputImage1.click()">
                <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_1')" />
                <img v-if="previews.image_1" :src="previews.image_1" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div v-else class="text-[#727687] flex flex-col items-center">
                  <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                    <span class="material-symbols-outlined text-2xl text-[#0050cb]">add_a_photo</span>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-widest">Klik untuk Unggah</span>
                </div>
                
                <div v-if="previews.image_1" class="absolute inset-0 bg-[#191c1e]/40 hidden group-hover:flex flex-col items-center justify-center text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 duration-300">
                  <span class="material-symbols-outlined text-3xl mb-2">edit</span>
                  <span class="text-[10px] font-black uppercase tracking-widest">Ganti Foto</span>
                </div>
              </div>
            </div>

            <!-- HARGA & ACTION -->
            <div class="bg-[#f7f9fb] rounded-[2rem] p-8 border border-[#c2c6d8]/50 shadow-sm sticky top-28">
              <div class="mb-8">
                <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-3">Tarif Sewa Harian (Rupiah) <span class="text-[#ba1a1a]">*</span></label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#727687]">Rp</span>
                  <input v-model="form.price" type="number" required class="w-full pl-14 pr-5 py-4 bg-white border border-[#c2c6d8]/60 rounded-xl focus:outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20 transition duration-300 text-xl font-black text-[#191c1e]">
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <button type="submit" :disabled="isSaving" class="w-full signature-gradient text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="isSaving" class="flex items-center gap-2">
                    <span class="material-symbols-outlined animate-spin">sync</span> MENYIMPAN...
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">save</span> Simpan Perubahan
                  </span>
                </button>
                <button type="button" @click="goBack" class="w-full bg-white text-[#191c1e] border border-[#c2c6d8]/60 font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#f2f4f6] transition-all flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">close</span> Batal
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
