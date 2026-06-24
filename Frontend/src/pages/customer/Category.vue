<script setup>
import { ref, computed, onMounted } from 'vue'
import BookingModal from '@/pages/customer/Booking.vue'

// --- VISUAL DETAILS MAP FOR CATEGORIES ---
const categoryDetailsMap = {
  'Luxury Car': {
    description: 'Kenyamanan kelas satu dengan kemewahan dan performa tanpa kompromi.',
    image_url: 'https://images.unsplash.com/photo-1503376760366-5a413e971510?q=80&w=2070&auto=format&fit=crop'
  },
  'Sedan Eksekutif': {
    description: 'Kenyamanan kelas satu untuk perjalanan bisnis maupun liburan eksklusif Anda.',
    image_url: 'https://images.unsplash.com/photo-1503376760366-5a413e971510?q=80&w=2070&auto=format&fit=crop'
  },
  'SUV Premium': {
    description: 'Ruang ekstra, ketangguhan, dan kemewahan yang berpadu tanpa kompromi.',
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
  },
  'SUV Performa': {
    description: 'Ketangguhan SUV dengan performa mesin luar biasa untuk segala medan.',
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
  },
  'Mobil Sport': {
    description: 'Performa tingkat tinggi untuk Anda yang mendambakan adrenalin di jalan raya.',
    image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop'
  },
  'Sport Car': {
    description: 'Performa tingkat tinggi untuk Anda yang mendambakan adrenalin di jalan raya.',
    image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop'
  },
  'Elektrik Mewah': {
    description: 'Tenaga instan yang senyap dengan teknologi ramah lingkungan masa depan.',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
  },
  'Electric': {
    description: 'Tenaga instan yang senyap dengan teknologi ramah lingkungan masa depan.',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
  },
  'Hypercar': {
    description: 'Mahakarya otomotif langka dengan desain eksotis dan tenaga buas luar biasa.',
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop'
  }
}

// --- STATE ---
const categories = ref([])
const allCars = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

const selectedCategory = ref(null)
const carsInCategory = ref([])

// State untuk Modal Booking
const isBookingOpen = ref(false)
const selectedCarForBooking = ref(null)

// --- FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price)
}

const carCountByCategory = (catName) => {
  return allCars.value.filter(c => c.category === catName).length
}

const openCategory = (cat) => {
  selectedCategory.value = cat
  carsInCategory.value = allCars.value.filter(c => c.category === cat.name)
}

// Menghubungkan tombol sewa ke modal Booking
const openBooking = (car) => {
  selectedCategory.value = null // Tutup modal kategori
  selectedCarForBooking.value = {
    id: car.id,
    name: car.name,
    brand_name: car.brand,
    price: car.price_per_day,
    image: car.image_url
  }
  isBookingOpen.value = true
}

// Fetch data dari database via API backend
const fetchDatabaseData = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    // 1. Ambil data kategori dari API backend
    const catResponse = await fetch('http://localhost:5000/api/categories')
    const catData = await catResponse.json()
    if (!catResponse.ok || !catData.success) throw new Error(catData.message || 'Gagal memuat kategori.')
    
    // 2. Ambil data semua mobil dari API backend
    const carsResponse = await fetch('http://localhost:5000/api/cars')
    const carsData = await carsResponse.json()
    if (!carsResponse.ok || !carsData.success) throw new Error(carsData.message || 'Gagal memuat armada.')
    
    allCars.value = carsData.data || []
    
    // 3. Format ke array kategori memakai data asli dari API
    categories.value = (catData.data || []).map((cat, index) => {
      return {
        id: cat.id || index + 1,
        name: cat.name,
        description: cat.description || `Koleksi armada kelas ${cat.name} terbaik untuk kenyamanan perjalanan Anda.`,
        image_url: cat.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop'
      }
    })
  } catch (err) {
    console.error('Error fetching data:', err)
    errorMsg.value = err.message || 'Gagal memuat kategori dari database. Coba lagi nanti.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDatabaseData()
})
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-24 animate-fadeIn">

    <!-- ================= HERO BANNER ================= -->
    <section class="relative pt-32 pb-32 overflow-hidden bg-[#f7f9fb]">
      <!-- Efek Cahaya Halus ala GASNGO -->
      <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#0050cb] blur-[120px] opacity-20 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#0066ff] blur-[120px] opacity-20 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black text-[#191c1e] mb-4 tracking-tighter uppercase leading-none">
          Jelajahi Berdasarkan <br class="hidden md:block"/> <span class="text-[#0050cb]">Kategori</span>
        </h1>
        <p class="text-lg md:text-xl text-[#424656] max-w-2xl mx-auto font-medium mt-6">
          Temukan tipe kendaraan yang paling sempurna untuk menyempurnakan perjalanan eksklusif Anda.
        </p>
      </div>
    </section>

    <!-- ================= KATEGORI GRID ================= -->
    <div class="relative z-20 bg-white rounded-t-[3rem] sm:rounded-t-[4rem] -mt-16 pt-24 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border-t border-[#c2c6d8]/30">
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-4 block">sync</span>
          <p class="text-[#727687] font-bold text-sm uppercase tracking-widest">Memuat kategori armada...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMsg" class="text-center py-20 max-w-md mx-auto">
          <span class="material-symbols-outlined text-4xl text-[#ba1a1a] mb-4 block">error</span>
          <p class="text-[#ba1a1a] font-extrabold text-lg mb-2">{{ errorMsg }}</p>
          <button @click="fetchDatabaseData" class="px-6 py-2.5 bg-[#0050cb] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#0066ff] transition-all active:scale-95">Coba Lagi</button>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="openCategory(cat)"
            class="group relative bg-[#f2f4f6] rounded-[2.5rem] overflow-hidden border border-[#c2c6d8]/40 shadow-sm hover:shadow-2xl hover:shadow-[#0050cb]/20 transition-all duration-500 hover:-translate-y-2 text-left flex flex-col"
          >
            <!-- Image Header -->
            <div class="h-48 w-full overflow-hidden relative shrink-0 bg-white border-b border-[#c2c6d8]/40">
               <img v-if="cat.image_url" :src="cat.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            <!-- Info Kategori -->
            <div class="p-8 flex flex-col flex-grow relative bg-white">
              <!-- Glow blob hover -->
              <div class="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#0050cb]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <h3 class="text-2xl font-black text-[#191c1e] mb-2 group-hover:text-[#0050cb] transition-colors uppercase tracking-tight">{{ cat.name }}</h3>
              <p class="text-[#727687] font-medium text-sm leading-relaxed mb-8 line-clamp-2">{{ cat.description }}</p>

              <!-- Counter Badge & Panah -->
              <div class="flex items-center justify-between mt-auto">
                <span class="inline-flex items-center gap-1.5 bg-[#e6eeff] text-[#0050cb] border border-[#b3c5ff]/50 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0050cb]"></span>
                  {{ carCountByCategory(cat.name) }} Armada
                </span>
                <span class="text-[#0050cb] font-bold text-xs uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Eksplorasi
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </button>

        </div>
      </section>
    </div>

    <!-- ================= SLIDE-OVER PANEL (Menampilkan Mobil dalam Kategori) ================= -->
    <transition name="fade">
      <div v-if="selectedCategory" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">

        <!-- Latar Belakang Gelap Blur -->
        <div class="absolute inset-0 bg-[#191c1e]/60 backdrop-blur-sm" @click="selectedCategory = null"></div>

        <!-- Kotak Modal Panel -->
        <div class="relative z-10 bg-white w-full sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">

          <!-- Panel Header -->
          <div class="relative bg-gradient-to-br from-[#003161] to-[#0050cb] px-6 sm:px-8 py-8 shrink-0">
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <p class="text-[#b3c5ff] text-[10px] font-bold uppercase tracking-widest mb-1">Kategori Terpilih</p>
                <h2 class="text-3xl font-black text-white uppercase tracking-tight">{{ selectedCategory.name }}</h2>
                <p class="text-[#e6eeff] text-sm mt-1 font-medium">{{ carsInCategory.length }} kendaraan tersedia</p>
              </div>
              <button @click="selectedCategory = null" class="w-10 h-10 bg-white/20 hover:bg-[#ba1a1a] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Daftar Mobil Grid -->
          <div class="overflow-y-auto flex-grow p-6 sm:p-8 bg-[#f7f9fb] custom-scrollbar">

            <!-- Jika Kosong -->
            <div v-if="carsInCategory.length === 0" class="text-center py-16">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#c2c6d8]/40">
                <span class="material-symbols-outlined text-3xl text-[#727687]">car_crash</span>
              </div>
              <h4 class="font-bold text-[#191c1e]">Belum ada mobil di kategori ini.</h4>
            </div>

            <!-- Jika Ada Mobil -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="car in carsInCategory"
                :key="car.id"
                class="group bg-white rounded-[2rem] overflow-hidden border border-[#c2c6d8]/30 shadow-sm hover:shadow-2xl hover:shadow-[#0050cb]/20 transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                <!-- Foto -->
                <div class="relative h-48 overflow-hidden bg-[#f2f4f6] p-2">
                  <div class="w-full h-full overflow-hidden rounded-[1.5rem]">
                    <img :src="car.image_url" :alt="car.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div class="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md text-[#191c1e] text-[10px] font-bold px-3 py-1 rounded-xl shadow-sm border border-gray-100 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full" :class="car.status === 'available' ? 'bg-[#16a34a]' : 'bg-[#ba1a1a]'"></span>
                    {{ car.status === 'available' ? 'Tersedia' : 'Tidak Tersedia' }}
                  </div>
                </div>

                <!-- Info Konten -->
                <div class="p-6 flex-grow flex flex-col">
                  <p class="text-[9px] font-black text-[#0050cb] uppercase tracking-[0.2em] mb-1">{{ car.brand }}</p>
                  <h3 class="text-xl font-black text-[#191c1e] leading-tight mb-2">{{ car.name }}</h3>

                  <!-- Tombol & Harga -->
                  <div class="pt-5 border-t border-[#f2f4f6] mt-auto flex flex-col gap-4">
                    <div class="flex items-end justify-between">
                      <div>
                        <span class="text-[#727687] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Tarif Sewa</span>
                        <div class="flex items-baseline gap-1">
                          <span class="text-xl font-black text-[#191c1e]">{{ formatPrice(car.price_per_day) }}</span>
                          <span class="text-[#727687] text-xs font-medium">/hari</span>
                        </div>
                      </div>
                    </div>

                    <button
                      @click="openBooking(car)"
                      :disabled="car.status !== 'available'"
                      class="signature-gradient text-white hover:shadow-lg hover:shadow-[#0050cb]/30 font-bold text-xs uppercase tracking-widest px-4 py-3.5 rounded-xl transition-all duration-300 w-full active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <span class="material-symbols-outlined text-[16px]">{{ car.status === 'available' ? 'lock' : 'lock_open' }}</span>
                      {{ car.status === 'available' ? 'Sewa Sekarang' : 'Habis Dipesan' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <!-- KOMPONEN MODAL BOOKING -->
    <BookingModal
      :show="isBookingOpen"
      @close="isBookingOpen = false"
      :carData="selectedCarForBooking"
    />

  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Biru GASNGO */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Transisi Fade Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi Rotasi Loading */
.animate-spin {
  animation: spin 1.5s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Custom Scrollbar Khusus untuk Konten Modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c2c6d8;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #727687;
}
</style>
