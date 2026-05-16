<script setup>
import { ref } from 'vue'


// IMPORT KOMPONEN MODAL
import CarDetailModal from '@/pages/CarDetail.vue' // (Atau sesuaikan jika di folder components)
import BookingModal from '@/pages/Booking.vue'     // <-- TAMBAHKAN IMPORT INI


// --- STATE UNTUK MODAL ---
const isModalOpen = ref(false)
const isBookingOpen = ref(false) // <-- STATE UNTUK MODAL BOOKING
const selectedCarData = ref(null)

// --- FUNGSI MODAL DETAIL ---
const openDetail = (carObj) => {
  selectedCarData.value = carObj
  isModalOpen.value = true
}

// --- FUNGSI MODAL BOOKING (Saat tombol "Sewa Sekarang" ditekan) ---
const openBooking = (carObj) => {
  selectedCarData.value = carObj
  isBookingOpen.value = true
}

// --- FUNGSI KETIKA MODAL DETAIL INGIN LANJUT SEWA ---
const goToCheckout = (carObj) => {
  isModalOpen.value = false // Tutup modal detail
  setTimeout(() => {
    openBooking(carObj) // Buka modal booking dengan jeda sedikit agar halus
  }, 300)
}

// Fungsi Format Rupiah/Dolar
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}


// --- DATA MOCKUP: SEMUA ARMADA ---
const allCars = ref([
  {
    id: 1,
    name: 'Porsche 911 Carrera',
    brand_name: 'Porsche',
    category_name: 'Mobil Sport',
    price: 850,
    transmission: 'PDK',
    seats: 2,
    description: 'Perpaduan sempurna antara desain ikonik dan performa murni. Menawarkan akselerasi mendebarkan namun tetap mewah.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl',
    badge: 'Tersedia',
    is_rare: false
  },
  {
    id: 2,
    name: 'Audi RS7 Performance',
    brand_name: 'Audi',
    category_name: 'Sedan Eksekutif',
    price: 1200,
    transmission: 'QUATTRO',
    seats: 4,
    description: 'Menggabungkan keganasan performa lintasan dengan kenyamanan kabin sedan eksklusif terbaik.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SNbMs3riBVFAKFnRL7sMK4rzp30K8474Iy0A-_328VW4EoOqUZxG9pmbiJM1NlrMULQeTNuOttjSe-rtrOqa-fhMy__teQnEL5JUqzi2OmC7ct9FjHBA59CU4thiV3M_sryU_xM9lpVIaedp9kaheNORDUEhXATlJoJ8JEhGeyAGDqCIKTWjgDShiEgA1PAVbjZQWTboT0ZZsIT8Xwn5OyVbPBlA2_TvE_qw4bw95zhV3hhRWYTYQeuGPi07pzVpl7ZS7w9PTZ4H',
    badge: 'Tersedia',
    is_rare: false
  },
  {
    id: 3,
    name: 'Ferrari F8 Tributo',
    brand_name: 'Ferrari',
    category_name: 'Hypercar',
    price: 2450,
    transmission: 'RWD',
    seats: 2,
    description: 'Mesin V8 terkuat dalam sejarah dengan penanganan tiada tara untuk sang penikmat adrenalin.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp',
    badge: 'Koleksi Langka',
    is_rare: true
  },
  {
    id: 4,
    name: 'Model X Plaid',
    brand_name: 'Tesla',
    category_name: 'Elektrik Mewah',
    price: 450,
    transmission: 'AWD',
    seats: 6,
    description: 'SUV tercepat yang menawarkan kenyamanan senyap dengan fitur autopilot pintar untuk perjalanan Anda.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVmS9a62zCS7ZFtaRjBN4fhlnzPinTcotpFsDSLzJNiYk8Q1ZyOUKSQgP3D_LD7tir_9aEqf0gEbcOXwCYTwP4b6kv7jrhsHMnrirpmXjUXpdtfUM0RGEFsnIUoYl4hSQhv3yXK1vqUKcchGqEVwIUQjw3oRU5anW_4Nh5tf0A0kAGEWbAEsLmOqwFMKqOxIzV2C6p45vhMJK7Rg5VZNkZ4eElGc6UlNrMGAepvXdAfXBfhxjo55fyc0jnkk6_KqJkz9BVfL--77rE',
    badge: 'Tersedia',
    is_rare: false
  },
  {
    id: 5,
    name: 'M8 Gran Coupe',
    brand_name: 'BMW',
    category_name: 'Sedan Eksekutif',
    price: 950,
    transmission: 'XDRIVE',
    seats: 4,
    description: 'Kombinasi estetika coupe dengan kelegaan sebuah sedan empat pintu berbahan material kelas satu.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE',
    badge: 'Tersedia',
    is_rare: false
  }
])
</script>

<template>
  <!-- Wrapper utama halaman Fleet/Cars -->
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-20 pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto antialiased">

    <!-- EDITORIAL HEADER -->
    <div class="mb-8 md:mb-12 pb-8 border-b border-[#c2c6d8]/40">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#191c1e] mb-3 md:mb-4">
        KOLEKSI ARMADA PREMIUM
      </h1>
      <p class="text-[#424656] text-base md:text-lg max-w-2xl leading-relaxed">
        Kendaraan performa tinggi yang dikurasi khusus bagi pengemudi berselera tinggi. Rasakan puncak mahakarya teknik otomotif dan kemewahan.
      </p>
    </div>

    <!-- Layout Flex (Filter Kiri & Grid Kanan) -->
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

      <!-- ================= SIDEBAR FILTER (Tetap) ================= -->
      <aside class="w-full lg:w-72 flex-shrink-0 space-y-8 md:space-y-10 lg:border-r lg:border-[#c2c6d8]/40 lg:pr-10 pb-8 lg:pb-0 border-b border-[#c2c6d8]/40 lg:border-b-0 sticky top-28">

        <!-- Category Filter -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Kategori</h3>
          <div class="space-y-3 md:space-y-4">
            <label class="flex items-center cursor-pointer group">
              <input checked class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]" type="checkbox"/>
              <span class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors">Sedan Eksekutif</span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]" type="checkbox"/>
              <span class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors">SUV Performa</span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]" type="checkbox"/>
              <span class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors">Hypercar</span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]" type="checkbox"/>
              <span class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors">Elektrik Mewah</span>
            </label>
          </div>
        </section>

        <!-- Daily Rate Range -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Tarif Harian</h3>
          <div class="px-2">
            <input class="w-full h-1.5 bg-[#c2c6d8]/50 rounded-lg appearance-none cursor-pointer accent-[#0050cb]" type="range"/>
            <div class="flex justify-between mt-4 text-xs font-bold text-[#424656]">
              <span>$250</span>
              <span>$5,000+</span>
            </div>
          </div>
        </section>

        <!-- Manufacturer Filter -->
        <section>
          <h3 class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase">Merek</h3>
          <div class="grid grid-cols-2 gap-2">
            <button class="bg-[#0050cb] text-white py-2.5 px-4 rounded-md text-xs font-bold transition-all shadow-md shadow-blue-600/20">Porsche</button>
            <button class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]">Tesla</button>
            <button class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]">Ferrari</button>
            <button class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]">BMW</button>
          </div>
        </section>
      </aside>

      <!-- ================= KONTEN KANAN ================= -->
      <div class="flex-grow w-full space-y-16">

        <!-- --- SECTION: SEMUA ARMADA (ALL CARS) --- -->
        <section>
          <div class="flex justify-between items-end mb-8">
            <h2 class="text-2xl md:text-3xl font-black text-[#191c1e] uppercase relative z-10">Semua <span class="text-[#0050cb]">Armada</span></h2>
          </div>

          <!-- Ganti grid col-span ke format desktop 2, layar super lebar 3 -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">

            <!-- Looping Semua Armada -->
            <div v-for="car in allCars" :key="'all-'+car.id" class="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,80,203,0.2)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col relative">

              <!-- Image Section -->
              <div class="relative h-64 overflow-hidden bg-[#f2f4f6] p-2">
                <div class="absolute inset-0 bg-gradient-to-t from-[#191c1e]/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]"></div>
                <div class="w-full h-full overflow-hidden rounded-[2rem] relative bg-white">
                  <img :src="car.image" :alt="car.name" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                </div>

                <!-- Floating Badges -->
                <div class="absolute top-6 left-6 z-20 flex flex-col gap-2">
                  <div class="bg-white/90 backdrop-blur-md text-[#191c1e] text-[10px] sm:text-xs font-bold px-4 py-2 rounded-2xl shadow-sm border border-white/50 flex items-center gap-1.5 w-max">
                    <span class="w-1.5 h-1.5 rounded-full" :class="car.is_rare ? 'bg-[#ba1a1a]' : 'bg-[#0050cb]'"></span>
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
                      <span class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-1">Tarif Sewa</span>
                      <div class="flex items-baseline gap-1">
                        <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(car.price) }}</span>
                        <span class="text-[#727687] text-sm font-medium">/hari</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button @click="openDetail(car)" class="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition-colors border border-transparent text-center flex items-center justify-center">
                      Detail
                    </button>
                    <!-- PERUBAHAN: Diubah menjadi tombol <button> yang memicu openBooking -->
                    <button @click="openBooking(car)" class="flex-1 signature-gradient text-white hover:shadow-lg hover:shadow-blue-600/30 font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-center flex items-center justify-center">
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ================= PAGINATION ================= -->
          <div class="mt-12 md:mt-16 pt-8 border-t border-[#c2c6d8]/40 flex justify-center items-center gap-3 md:gap-5">
            <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <div class="flex gap-2">
              <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl signature-gradient text-white font-bold shadow-lg shadow-[#0050cb]/30 transform hover:-translate-y-0.5 transition-all">1</button>
              <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all">2</button>
              <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all hidden sm:flex">3</button>
              <span class="w-10 h-10 md:w-12 md:h-12 items-center justify-center text-[#424656] font-bold tracking-widest hidden sm:flex">...</span>
              <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all hidden sm:flex">8</button>
            </div>

            <button class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md">
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
    <!-- Diletakkan di paling bawah -->
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
