<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// ASSETS
import carhome1 from '@/assets/images/gambar_mobil_home.png'
import Taycan from '@/assets/images/Taycan_TurboS.png'
import BeverlyPNG from '@/assets/images/BeverlyHills.png'

// IMPORT KOMPONEN MODAL
import CarDetailModal from '@/pages/customer/CarDetail.vue' // Sesuaikan jika ini ada di folder components
import BookingModal from '@/pages/customer/Booking.vue'     // Sesuaikan jika ini ada di folder components

const router = useRouter()

// --- STATE UNTUK MODAL ---
const isModalOpen = ref(false)
const isBookingOpen = ref(false)
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

// Fungsi format harga
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

// Data Dummy Armada Populer (Sesuai gaya May 13)
const popularCars = ref([
  {
    id: 1,
    name: 'Porsche Taycan',
    brand: 'Porsche',
    category_name: 'Elektrik Mewah', // Sesuaikan key category_name agar sesuai props modal detail
    year: '2024',
    price: 2000000, // Sesuaikan dengan key 'price' yang dibaca modal
    discount_price: 1800000,
    is_promotion: 1,
    transmission: 'Auto (EV)',
    seats: 4,
    speed: '2.8s',
    engine: '750 HP',
    description: 'Tenaga listrik tanpa kompromi berpadu dengan kemewahan artisanal. Mahakarya otomotif masa depan.',
    image: Taycan // Sesuaikan key 'image' agar terbaca oleh modal
  },
  {
    id: 2,
    name: 'BMW M8 Gran Coupe',
    brand_name: 'BMW', // Sesuaikan key brand_name
    category_name: 'Sedan Eksekutif',
    year: '2023',
    price: 2000000,
    is_promotion: 0,
    transmission: 'XDRIVE',
    seats: 4,
    speed: '3.0s',
    engine: '617 HP',
    description: 'Perpaduan sempurna antara performa sport dan kenyamanan sedan mewah untuk perjalanan bisnis maupun liburan Anda.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE'
  },
  {
    id: 3,
    name: 'Ferrari F8 Tributo',
    brand_name: 'Ferrari',
    category_name: 'Supercar Eksotis',
    year: '2024',
    price: 24500000,
    is_promotion: 0,
    transmission: 'RWD',
    seats: 2,
    speed: '2.9s',
    engine: '710 HP',
    description: 'Mesin V8 terkuat dalam sejarah. Rasakan sensasi berkendara mendebarkan tiada tara dengan performa tanpa batas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp'
  }
])
</script>

<template>
  <div class="bg-[#f8fafa] min-h-screen pb-20 font-['Manrope']">

    <!-- ==========================================
         1. HERO SECTION (Gaya Cinematic dengan Latar Gambar)
         ========================================== -->
    <section
      class="relative pt-28 pb-40 lg:pt-36 lg:pb-56 overflow-hidden bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${BeverlyPNG})` }"
    >
      <div class="absolute inset-0 bg-white/75 sm:bg-white/40"></div>
      <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-500 blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-cyan-400 blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f8fafa] to-transparent z-0"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-block bg-white/80 backdrop-blur-md text-blue-700 font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-widest mb-6 shadow-sm border border-blue-200/50">
          Tingkatkan Pengalaman Anda
        </div>

        <h1 class="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-[#111827] mb-6 tracking-tight leading-[1.1] uppercase drop-shadow-sm">
          Kendarai <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0050cb] to-[#00b4d8]">Kemewahan Sempurna</span>
        </h1>

        <p class="text-base md:text-xl text-slate-700 max-w-2xl mx-auto mb-10 font-bold leading-relaxed drop-shadow-sm">
          Rasakan puncak mahakarya otomotif melalui koleksi eksklusif supercar kelas dunia dan sedan mewah kami.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4 relative z-20">
          <RouterLink
            to="/cars"
            class="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(13,110,253,0.3)] transition-all uppercase tracking-widest text-sm transform hover:-translate-y-1 inline-block text-center"
          >
            Jelajahi Mobil
          </RouterLink>
          <RouterLink
            to="/services"
            class="bg-white/90 backdrop-blur-md text-[#0d6efd] border border-white hover:bg-white font-bold px-10 py-4 rounded-full transition-all uppercase tracking-widest text-sm transform hover:-translate-y-1 inline-block text-center shadow-lg"
          >
            Layanan
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ==========================================
         2. OVERLAPPING SECTION (Semua Konten Bawah)
         ========================================== -->
    <div class="relative z-20 bg-white rounded-t-[3rem] sm:rounded-t-[4rem] -mt-24 pt-16 sm:pt-24 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-gray-100">

      <!-- ================= POPULAR CARS ================= -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 pt-10">
        <div class="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 text-center sm:text-left">
          <div class="relative">
            <div class="absolute -inset-1 bg-blue-100 blur-2xl rounded-full opacity-50"></div>
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 uppercase relative z-10">Mobil <span class="text-[#0d6efd]">Populer</span></h2>
            <p class="text-slate-500 mt-3 text-lg font-medium relative z-10">Pilihan kendaraan terbaik untuk menemani perjalanan eksklusif Anda.</p>
          </div>
          <RouterLink to="/cars" class="mt-6 sm:mt-0 font-bold text-[#0d6efd] hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-widest text-sm">
            Lihat Semua <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

          <!-- Looping Mobil Populer -->
          <div v-for="car in popularCars" :key="car.id" class="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(13,110,253,0.3)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col relative">

            <!-- Gambar Mobil -->
            <div class="relative h-60 sm:h-64 overflow-hidden bg-slate-50 p-2">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]"></div>

              <div class="w-full h-full overflow-hidden rounded-[2rem] relative bg-white">
                <img :src="car.image" :alt="car.name" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              </div>

              <!-- Badge Kategori & Tahun -->
              <div class="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <div class="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1.5 w-max">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0d6efd]"></span>
                  {{ car.year }}
                </div>
                <div class="bg-[#111827]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm border border-white/10 uppercase tracking-widest w-max">
                  {{ car.category_name }}
                </div>
              </div>
            </div>

            <!-- Deskripsi Bawah Mobil -->
            <div class="p-8 pt-6 flex-grow flex flex-col relative bg-white">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="text-[10px] font-black text-[#0d6efd] uppercase tracking-[0.2em] mb-1.5">{{ car.brand_name || car.brand }}</p>
                  <h3 class="text-2xl font-black text-slate-900 leading-tight">{{ car.name }}</h3>
                </div>
              </div>

              <p class="text-slate-500 text-sm mt-2 mb-8 line-clamp-2 leading-relaxed flex-grow font-medium">{{ car.description }}</p>

              <!-- Tombol & Harga -->
              <div class="pt-6 border-t border-slate-100 flex flex-col gap-5 mt-auto">
                <div class="flex items-end justify-between">
                  <div>
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Tarif Sewa</span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-2xl font-black text-slate-900">{{ formatPrice(car.price) }}</span>
                      <span class="text-slate-400 text-sm font-medium">/hari</span>
                    </div>
                  </div>
                </div>

                <!-- PERUBAHAN PADA TOMBOL: RouterLink diubah menjadi button yang memanggil fungsi pop-up modal -->
                <div class="flex gap-3">
                  <button @click="openDetail(car)" class="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm py-3 rounded-xl transition-colors border border-slate-200 shadow-sm active:scale-95">
                    Detail
                  </button>
                  <button @click="openBooking(car)" class="flex-1 bg-[#111827] text-white hover:bg-[#0d6efd] hover:shadow-lg hover:shadow-blue-500/40 font-bold text-sm py-3 rounded-xl transition-all duration-300 shadow-sm active:scale-95">
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ================= CARA SEWA (How It Works) ================= -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="text-center mb-16 relative">
          <div class="absolute -inset-1 bg-blue-100 blur-2xl rounded-full w-40 h-40 mx-auto opacity-50"></div>
          <h2 class="text-3xl md:text-4xl font-black text-[#111827] uppercase relative z-10">Langkah <span class="text-[#0d6efd]">Mudah</span></h2>
          <p class="text-slate-500 mt-3 text-lg font-medium relative z-10">Proses penyewaan yang cepat dalam 3 tahap sederhana.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <!-- Connector Line (Desktop Only) -->
          <div class="hidden md:block absolute top-12 left-20 right-20 h-[2px] bg-slate-100 z-0"></div>

          <!-- Step 1 -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 group transition-transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0d6efd] group-hover:bg-[#0d6efd] group-hover:text-white transition-colors duration-300">
                <span class="material-symbols-outlined text-3xl">key</span>
              </div>
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 mb-2">1. Pilih Mobil</h3>
            <p class="text-slate-500 font-medium px-4 text-sm leading-relaxed">Jelajahi katalog kami dan temukan kendaraan yang paling sesuai untuk perjalanan Anda.</p>
          </div>

          <!-- Step 2 -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 group transition-transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0d6efd] group-hover:bg-[#0d6efd] group-hover:text-white transition-colors duration-300">
                <span class="material-symbols-outlined text-3xl">calendar_month</span>
              </div>
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 mb-2">2. Tentukan Tanggal</h3>
            <p class="text-slate-500 font-medium px-4 text-sm leading-relaxed">Pilih jadwal pengambilan dan pengembalian sesuai dengan rencana liburan Anda.</p>
          </div>

          <!-- Step 3 -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 group transition-transform hover:-translate-y-2">
              <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0d6efd] group-hover:bg-[#0d6efd] group-hover:text-white transition-colors duration-300">
                <span class="material-symbols-outlined text-3xl">verified</span>
              </div>
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 mb-2">3. Selesai & Nikmati</h3>
            <p class="text-slate-500 font-medium px-4 text-sm leading-relaxed">Konfirmasi pesanan dengan aman, dan mobil impian Anda siap menunggu kedatangan Anda!</p>
          </div>
        </div>
      </section>

      <!-- ================= CALL TO ACTION ================= -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div class="bg-white rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100">

          <div class="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-60"></div>
          <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-100 rounded-full blur-[80px] opacity-60"></div>

          <div class="relative z-10 max-w-3xl mx-auto">
            <h2 class="text-3xl md:text-5xl font-black text-[#111827] uppercase leading-tight mb-6 tracking-tight">
              Siap Mengubah <br class="hidden sm:block" />
              Perspektif Perjalanan Anda?
            </h2>
            <p class="text-slate-500 text-lg mb-10 font-medium">
              Bergabunglah dengan klub eksklusif GASNGO untuk mendapatkan akses prioritas ke unit terbaru dan penawaran khusus member.
            </p>

            <form @submit.prevent class="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xl mx-auto bg-slate-50 p-2 rounded-full border border-gray-200">
              <input
                type="email"
                placeholder="Alamat email Anda"
                required
                class="w-full sm:flex-1 bg-transparent px-6 py-4 outline-none text-slate-800 placeholder-slate-400 font-bold"
              />
              <button
                type="submit"
                class="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full uppercase text-xs tracking-widest transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
              >
                Gabung Sekarang
              </button>
            </form>
          </div>
        </div>
      </section>

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
/* Pengaturan Ikon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi mengambang untuk badge */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
</style>

