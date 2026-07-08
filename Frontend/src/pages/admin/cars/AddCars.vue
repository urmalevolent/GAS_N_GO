<script setup>
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  brand: '',
  category: '',
  type: '', // Misalnya: Manual / Matic / Electric
  seats: '', // Jumlah kursi
  fuel: 'Gasoline',
  price: '',
  description: ''
})

// State untuk Gambar
const files = reactive({
  image_1: null
})

const previews = reactive({
  image_1: null
})

const isLoading = ref(false)

// Data Brand& Kategori dari Database
const brands = ref(['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ferrari', 'Toyota', 'Honda', 'Mitsubishi'])
const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/categories')
    const resData = await response.json()
    if (!response.ok || !resData.success) throw new Error(resData.message)
    categories.value = (resData.data || []).map(c => c.name)
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

onMounted(() => {
  fetchCategories()
})

// Menangani Perubahan File Gambar
const handleFileChange = (event, key) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    files[key] = selectedFile
    previews[key] = URL.createObjectURL(selectedFile)
  }
}

// Upload image helper
const uploadImage = async (file) => {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
  const { data, error } = await supabase.storage
    .from('cars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('cars')
    .getPublicUrl(fileName)
    
  return publicUrl
}

// Proses Pembuatan Kendaraan ke Supabase via Backend API
const createCar = async () => {
  if (!form.name || !form.price || !form.brand || !form.category || !files.image_1) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Data',
      text: 'Please fill in the car name, price, brand, category, and main photo.',
      confirmButtonColor: '#0050cb'
    })
    return
  }

  isLoading.value = true

  try {
    // 1. Upload main image to storage
    const mainImageUrl = await uploadImage(files.image_1)
    
    // 2. Insert into cars table via backend API
    const token = authStore.session?.access_token
    const response = await fetch('http://localhost:5000/api/admin/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.name,
        brand: form.brand,
        category: form.category,
        transmission: form.type,
        seats: parseInt(form.seats) || 4,
        fuel: form.fuel,
        price_per_day: parseInt(form.price),
        description: form.description || '',
        image_url: mainImageUrl
      })
    })

    const resData = await response.json()
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Failed to add vehicle.')
    }

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'New vehicle has been added to the catalog.',
      confirmButtonColor: '#0050cb',
      showConfirmButton: false,
      timer: 1500
    })

    router.push({ name: 'admin-cars-list' })
  } catch (err) {
    console.error('Error creating car:', err)
    Swal.fire('Error', 'Failed to add vehicle. ' + err.message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col gap-2 mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Add New Vehicle</h1>
      <p class="text-sm text-[#727687]">Add a new vehicle unit to the GASNGO rental catalog.</p>
    </div>

    <!-- Kotak Formulir -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden">
      <div class="p-6 md:p-8">
        <form @submit.prevent="createCar">
          <div class="space-y-8">

            <!-- SECTION: UNGGAH FOTO -->
            <div>
              <label class="block text-base font-bold text-[#191c1e] mb-4">Vehicle Photo <span class="text-[#ba1a1a]">*</span></label>

              <div class="flex flex-wrap gap-6">

                <!-- Foto 1 (Utama) -->
                <div class="flex flex-col gap-2">
                   <span class="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Main Photo *</span>
                   <div
                    class="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#0050cb]/40 rounded-2xl bg-[#f2f4f6] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors overflow-hidden relative group"
                    @click="$refs.inputImage1.click()"
                  >
                    <input type="file" ref="inputImage1" class="hidden" accept="image/*" @change="(e) => handleFileChange(e, 'image_1')" />
                    <img v-if="previews.image_1" :src="previews.image_1" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center p-2 text-center group-hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined text-2xl text-[#0050cb] mb-1">add_a_photo</span>
                        <span class="text-[10px] font-bold text-[#0050cb]">Upload<br>Photo</span>
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
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Vehicle Model Name <span class="text-[#ba1a1a]">*</span></label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="e.g. Porsche 911 Carrera">
                </div>

                <!-- Brand dan Kategori -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-[#191c1e] mb-2">Brand <span class="text-[#ba1a1a]">*</span></label>
                        <input v-model="form.brand" type="text" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="Contoh: Porsche">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-[#191c1e] mb-2">Kategori <span class="text-[#ba1a1a]">*</span></label>
                        <div class="relative">
                            <select v-model="form.category" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#424656]">
                                <option value="" disabled selected>Select Category</option>
                                <option v-for="(cat, i) in categories" :key="i" :value="cat">{{ cat }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                              <span class="material-symbols-outlined text-xl">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tipe Mesin, Kapasitas & Fuel -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-[#191c1e] mb-2">Tipe Penggerak / Transmisi <span class="text-[#ba1a1a]">*</span></label>
                      <div class="relative">
                          <select v-model="form.type" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white appearance-none focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm text-[#424656]">
                              <option value="" disabled selected>Select Type</option>
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
                      <label class="block text-sm font-bold text-[#191c1e] mb-2">Number of Seats <span class="text-[#ba1a1a]">*</span></label>
                      <input v-model="form.seats" type="number" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="e.g. 2 or 4">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-[#191c1e] mb-2">Fuel Type <span class="text-[#ba1a1a]">*</span></label>
                      <div class="relative">
                          <select v-model="form.fuel" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 appearance-none cursor-pointer text-sm font-medium">
                              <option value="Gasoline">Gasoline</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Electric">Electric</option>
                              <option value="Hybrid">Hybrid</option>
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727687]">
                            <span class="material-symbols-outlined text-xl">expand_more</span>
                          </div>
                      </div>
                    </div>
                </div>

                <!-- Harga Sewa Harian -->
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Daily Rental Rate (IDR) <span class="text-[#ba1a1a]">*</span></label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#727687]">Rp</span>
                    <input v-model="form.price" type="number" class="w-full pl-10 pr-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm" placeholder="Cth: 500000">
                  </div>
                </div>

                <!-- Deskripsi Kendaraan -->
                <div>
                  <label class="block text-sm font-bold text-[#191c1e] mb-2">Description & Highlights</label>
                  <textarea v-model="form.description" rows="5" class="w-full px-4 py-3.5 border border-[#c2c6d8]/60 rounded-xl bg-white focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition duration-200 text-sm resize-none" placeholder="Write a compelling description about this vehicle..."></textarea>
                </div>
            </div>

            <!-- BUTTONS -->
            <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <button type="submit" :disabled="isLoading" class="w-full sm:w-auto bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#0050cb]/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
                <span v-if="isLoading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined animate-spin">sync</span> Saving...
                </span>
                <span v-else>Save Vehicle</span>
              </button>

              <!-- Ensure this router-link points back to the fleet table -->
              <router-link to="/admin/cars" class="w-full sm:w-auto bg-white text-[#424656] font-bold text-sm uppercase tracking-widest px-8 py-4 border border-[#c2c6d8] rounded-xl hover:bg-[#f2f4f6] transition-all text-center">
                Cancel
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
