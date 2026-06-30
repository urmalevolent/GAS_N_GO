<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// IMPORT KOMPONEN MODAL
import CarDetailModal from '@/pages/customer/CarDetail.vue'
import BookingModal from '@/pages/customer/Booking.vue'

// --- STATE ---
const allCars = ref([])
const categories = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

// Filter States
const selectedCategories = ref([])
const maxPrice = ref(10000000)
const selectedBrand = ref('All')

// Paginasi States
const currentPage = ref(1)
const pageSize = ref(6)

// Modal States
const isModalOpen = ref(false)
const isBookingOpen = ref(false)
const selectedCarData = ref(null)

// --- NORMALISASI KENDARAAN ---
const normalizeCar = (car) => {
  return {
    ...car,
    price: car.price_per_day,
    brand_name: car.brand,
    category_name: car.category,
    image: car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop',
    badge: car.status === 'available' ? 'Available' : 'Unavailable',
    is_rare: car.category === 'Luxury Car' || car.category === 'Hypercar'
  }
}

// --- FETCH DATA FROM BACKEND API ---
const fetchCarsAndCategories = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    // 1. Ambil kategori dari API backend
    const catResponse = await fetch('http://localhost:5000/api/categories')
    const catData = await catResponse.json()
    if (!catResponse.ok || !catData.success) throw new Error(catData.message || 'Failed to load categories.')
    categories.value = catData.data || []

    // 2. Ambil data mobil dari API backend
    const carsResponse = await fetch('http://localhost:5000/api/cars')
    const carsData = await carsResponse.json()
    if (!carsResponse.ok || !carsData.success) throw new Error(carsData.message || 'Failed to load cars.')
    allCars.value = (carsData.data || []).map(normalizeCar)

    // Set slider harga maksimal berdasarkan harga tertinggi di database
    if (allCars.value.length > 0) {
      const prices = allCars.value.map(c => c.price)
      const maxCarPrice = Math.max(...prices)
      maxPrice.value = maxCarPrice > 0 ? maxCarPrice : 10000000
    }
  } catch (err) {
    console.error('Error fetching cars page data:', err)
    errorMsg.value = err.message || 'Failed to load fleet data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCarsAndCategories()
})

// --- FILTER & PAGINASI LOGIC ---
const uniqueBrands = computed(() => {
  const brands = allCars.value.map(c => (c.brand || '').trim())
  const uniqueMap = {}
  brands.forEach(b => {
    if (!b) return
    const key = b.toLowerCase()
    if (!uniqueMap[key]) {
      uniqueMap[key] = b
    }
  })
  return ['All', ...Object.values(uniqueMap)]
})

const filteredCars = computed(() => {
  return allCars.value.filter(car => {
    // Filter Kategori
    const matchesCategory = selectedCategories.value.length === 0 || 
                            selectedCategories.value.includes(car.category)
    
    // Filter Tarif
    const matchesPrice = car.price <= maxPrice.value

    // Filter Brand (Case-Insensitive)
    const matchesBrand = selectedBrand.value === 'All' || 
                         (car.brand || '').trim().toLowerCase() === selectedBrand.value.toLowerCase()

    return matchesCategory && matchesPrice && matchesBrand
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredCars.value.length / pageSize.value) || 1
})

const paginatedCars = computed(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCars.value.slice(start, end)
})

// Reset ke halaman 1 ketika filter berubah
watch([selectedCategories, maxPrice, selectedBrand], () => {
  currentPage.value = 1
}, { deep: true })

// --- MODAL FUNCTIONS ---
const openDetail = (carObj) => {
  selectedCarData.value = carObj
  isModalOpen.value = true
}

const openBooking = (carObj) => {
  selectedCarData.value = carObj
  isBookingOpen.value = true
}

const goToCheckout = (carObj) => {
  isModalOpen.value = false
  setTimeout(() => {
    openBooking(carObj)
  }, 300)
}

// --- PAGINATION FUNCTIONS ---
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const setPage = (page) => {
  currentPage.value = page
}

// Formatting Harga
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <!-- Wrapper utama halaman Fleet/Cars -->
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-20 pt-28 md:pt-36 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto antialiased animate-fadeIn">

    <!-- ================= EDITORIAL HEADER ================= -->
    <section class="relative py-12 md:py-20 overflow-hidden bg-white border border-[#c2c6d8]/40 rounded-[2.5rem] shadow-sm mb-10 md:mb-12">
      <!-- Efek Cahaya Halus ala GASNGO -->
      <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#0050cb] blur-[120px] opacity-20 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#0066ff] blur-[120px] opacity-20 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-[#191c1e] mb-4 tracking-tighter uppercase leading-none">
          Premium Car <br class="hidden md:block"/> <span class="text-[#0050cb]">Collection</span>
        </h1>
        <p class="text-base md:text-lg text-[#424656] max-w-2xl mx-auto font-medium mt-4 md:mt-6 leading-relaxed">
          High-performance vehicles specially curated for discerning drivers. Experience the pinnacle of automotive engineering and boundless luxury.
        </p>
      </div>
    </section>

    <!-- Layout Flex (Filter Kiri & Grid Kanan) -->
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

      <!-- ================= SIDEBAR FILTER ================= -->
      <aside class="w-full lg:w-72 flex-shrink-0 space-y-8 md:space-y-10 lg:border-r lg:border-[#c2c6d8]/40 lg:pr-10 pb-8 lg:pb-0 border-b border-[#c2c6d8]/40 lg:border-b-0 sticky top-28">

        <!-- Category Filter -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Category</h3>
          <div v-if="categories.length === 0" class="text-xs text-[#727687]">Loading categories...</div>
          <div v-else class="space-y-3 md:space-y-4">
            <label v-for="cat in categories" :key="cat.id" class="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                :value="cat.name" 
                v-model="selectedCategories"
                class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]"
              />
              <span class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors">{{ cat.name }}</span>
            </label>
          </div>
        </section>

        <!-- Daily Rate Range -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Maximum Rate</h3>
          <div class="px-2">
            <input 
              type="range"
              min="0"
              max="10000000"
              step="100000"
              v-model="maxPrice"
              class="w-full h-1.5 bg-[#c2c6d8]/50 rounded-lg appearance-none cursor-pointer accent-[#0050cb]"
            />
            <div class="flex justify-between mt-4 text-xs font-bold text-[#424656]">
              <span>Rp 0</span>
              <span>{{ formatPrice(maxPrice) }}</span>
            </div>
          </div>
        </section>

        <!-- Manufacturer/Brand Filter -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Brand</h3>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="brand in uniqueBrands" 
              :key="brand"
              @click="selectedBrand = brand"
              :class="selectedBrand === brand ? 'bg-[#0050cb] text-white shadow-md shadow-blue-600/20' : 'bg-white border border-[#c2c6d8]/50 text-[#424656] hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]'"
              class="py-2.5 px-4 rounded-md text-xs font-bold transition-all truncate"
            >
              {{ brand === 'All' ? 'All' : brand }}
            </button>
          </div>
        </section>
      </aside>

      <!-- ================= KONTEN KANAN ================= -->
      <div class="flex-grow w-full space-y-16">

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-4 block">sync</span>
          <p class="text-[#727687] font-bold text-sm uppercase tracking-widest">Loading vehicle fleet...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMsg" class="text-center py-20 max-w-md mx-auto">
          <span class="material-symbols-outlined text-4xl text-[#ba1a1a] mb-4 block">error</span>
          <p class="text-[#ba1a1a] font-extrabold text-lg mb-2">{{ errorMsg }}</p>
          <button @click="fetchCarsAndCategories" class="px-6 py-2.5 bg-[#0050cb] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#0066ff] transition-all active:scale-95">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="paginatedCars.length === 0" class="text-center py-20 border-2 border-dashed border-[#c2c6d8]/50 rounded-[2.5rem]">
          <span class="material-symbols-outlined text-5xl text-[#727687] mb-4 block">directions_car</span>
          <h3 class="text-xl font-bold text-[#191c1e] mb-1">Fleet Not Found</h3>
          <p class="text-[#727687] text-sm">No vehicles match your filter criteria.</p>
        </div>

        <!-- --- SECTION: DAFTAR MOBIL (CARS GRID) --- -->
        <section v-else>
          <div class="flex justify-between items-end mb-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#191c1e] uppercase relative z-10">
              All <span class="text-[#0050cb]">Cars</span>
            </h2>
            <span class="text-xs font-bold text-[#727687] uppercase tracking-widest">{{ filteredCars.length }} matching fleets</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">

            <!-- Looping Semua Armada -->
            <div v-for="car in paginatedCars" :key="'all-'+car.id" class="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,80,203,0.2)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col relative">

              <!-- Image Section -->
              <div class="relative h-64 overflow-hidden bg-[#f2f4f6] p-2">
                <div class="absolute inset-0 bg-gradient-to-t from-[#191c1e]/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]"></div>
                <div class="w-full h-full overflow-hidden rounded-[2rem] relative bg-white">
                  <img :src="car.image" :alt="car.name" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                </div>

                <!-- Floating Badges -->
                <div class="absolute top-6 left-6 z-20 flex flex-col gap-2">
                  <div class="bg-white/90 backdrop-blur-md text-[#191c1e] text-[10px] sm:text-xs font-bold px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex items-center gap-1.5 w-max">
                    <span class="w-1.5 h-1.5 rounded-full" :class="car.status === 'available' ? 'bg-[#16a34a]' : 'bg-[#ba1a1a]'"></span>
                    {{ car.badge }}
                  </div>
                  <div class="bg-[#191c1e]/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm border border-white/10 uppercase tracking-widest w-max">
                    {{ car.category_name }}
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-6 sm:p-8 pt-6 flex-grow flex flex-col relative bg-white">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="text-[10px] font-black text-[#0050cb] uppercase tracking-[0.2em] mb-1.5">{{ car.brand_name }}</p>
                    <h3 class="text-2xl sm:text-3xl font-black text-[#191c1e] leading-none">{{ car.name }}</h3>
                  </div>
                </div>

                <p class="text-[#727687] text-xs sm:text-sm mt-2 sm:mt-3 mb-6 sm:mb-8 line-clamp-2 leading-relaxed flex-grow font-medium">{{ car.description }}</p>

                <!-- Bottom Action Area -->
                <div class="pt-6 border-t border-[#f2f4f6] flex flex-col gap-5 mt-auto">
                  <div class="flex items-end justify-between">
                    <div>
                      <span class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Rental Rate</span>
                      <div class="flex items-baseline gap-1">
                        <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(car.price) }}</span>
                        <span class="text-[#727687] text-sm font-medium">/day</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button @click="openDetail(car)" class="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition-colors border border-transparent text-center flex items-center justify-center">
                      Detail
                    </button>
                    <button 
                      @click="openBooking(car)" 
                      :disabled="car.status !== 'available'"
                      class="flex-1 signature-gradient text-white hover:shadow-lg hover:shadow-blue-600/30 font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <span class="material-symbols-outlined text-[16px]">{{ car.status === 'available' ? 'lock' : 'lock_open' }}</span>
                      <span>{{ car.status === 'available' ? 'Rent Now' : 'Fully Booked' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ================= PAGINATION ================= -->
          <div v-if="totalPages > 1" class="mt-12 md:mt-16 pt-8 border-t border-[#c2c6d8]/40 flex justify-center items-center gap-3 md:gap-5">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md disabled:opacity-40 disabled:hover:border-[#c2c6d8]/50 disabled:hover:text-[#424656] disabled:hover:shadow-none"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <div class="flex gap-2">
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="setPage(page)"
                :class="currentPage === page ? 'signature-gradient text-white font-bold shadow-lg shadow-[#0050cb]/30 transform hover:-translate-y-0.5' : 'bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm'"
                class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all"
              >
                {{ page }}
              </button>
            </div>

            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md disabled:opacity-40 disabled:hover:border-[#c2c6d8]/50 disabled:hover:text-[#424656] disabled:hover:shadow-none"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

        </section>
      </div>
    </div>

    <!-- KOMPONEN MODAL DETAIL MOBIL -->
    <CarDetailModal
      :show="isModalOpen"
      :carDetail="selectedCarData"
      @close="isModalOpen = false"
      @book="goToCheckout"
    />

    <!-- KOMPONEN MODAL BOOKING -->
    <BookingModal
      :show="isBookingOpen"
      @close="isBookingOpen = false"
      :carData="selectedCarData"
    />

  </div>
</template>

<style scoped>
/* Pengaturan Material Icons */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Biru Kustom */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Checkbox & Slider styling */
input[type="checkbox"] {
  accent-color: #0050cb;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #0050cb;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 80, 203, 0.4);
}
</style>
