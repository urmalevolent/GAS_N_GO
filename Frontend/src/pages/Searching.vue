<script setup>
import { ref} from 'vue'

// --- MOCKUP DATA KATEGORI ---
const categories = ref([
  {
    id: 1,
    name: 'Sedan Eksekutif',
    description: 'Kenyamanan kelas satu untuk perjalanan bisnis maupun liburan eksklusif Anda.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SNbMs3riBVFAKFnRL7sMK4rzp30K8474Iy0A-_328VW4EoOqUZxG9pmbiJM1NlrMULQeTNuOttjSe-rtrOqa-fhMy__teQnEL5JUqzi2OmC7ct9FjHBA59CU4thiV3M_sryU_xM9lpVIaedp9kaheNORDUEhXATlJoJ8JEhGeyAGDqCIKTWjgDShiEgA1PAVbjZQWTboT0ZZsIT8Xwn5OyVbPBlA2_TvE_qw4bw95zhV3hhRWYTYQeuGPi07pzVpl7ZS7w9PTZ4H'
  },
  {
    id: 2,
    name: 'SUV Premium',
    description: 'Ruang ekstra, ketangguhan, dan kemewahan yang berpadu tanpa kompromi.',
    image_url: 'https://images.unsplash.com/photo-1503376760366-5a413e971510?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Mobil Sport',
    description: 'Performa tingkat tinggi untuk Anda yang mendambakan adrenalin di jalan raya.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl'
  },
  {
    id: 4,
    name: 'Elektrik Mewah',
    description: 'Tenaga instan yang senyap dengan teknologi otonom masa depan.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVmS9a62zCS7ZFtaRjBN4fhlnzPinTcotpFsDSLzJNiYk8Q1ZyOUKSQgP3D_LD7tir_9aEqf0gEbcOXwCYTwP4b6kv7jrhsHMnrirpmXjUXpdtfUM0RGEFsnIUoYl4hSQhv3yXK1vqUKcchGqEVwIUQjw3oRU5anW_4Nh5tf0A0kAGEWbAEsLmOqwFMKqOxIzV2C6p45vhMJK7Rg5VZNkZ4eElGc6UlNrMGAepvXdAfXBfhxjo55fyc0jnkk6_KqJkz9BVfL--77rE'
  },
  {
    id: 5,
    name: 'Hypercar',
    description: 'Mahakarya otomotif langka dengan desain eksotis dan tenaga buas.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp'
  }
])

// --- MOCKUP DATA MOBIL ---
const allCars = ref([
  { id: 1, name: 'Porsche 911', brand: 'Porsche', category: 'Mobil Sport', year: '2024', price_per_day: 850, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl' },
  { id: 2, name: 'Audi RS7', brand: 'Audi', category: 'Sedan Eksekutif', year: '2023', price_per_day: 1200, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SNbMs3riBVFAKFnRL7sMK4rzp30K8474Iy0A-_328VW4EoOqUZxG9pmbiJM1NlrMULQeTNuOttjSe-rtrOqa-fhMy__teQnEL5JUqzi2OmC7ct9FjHBA59CU4thiV3M_sryU_xM9lpVIaedp9kaheNORDUEhXATlJoJ8JEhGeyAGDqCIKTWjgDShiEgA1PAVbjZQWTboT0ZZsIT8Xwn5OyVbPBlA2_TvE_qw4bw95zhV3hhRWYTYQeuGPi07pzVpl7ZS7w9PTZ4H' },
  { id: 3, name: 'Model X Plaid', brand: 'Tesla', category: 'Elektrik Mewah', year: '2024', price_per_day: 450, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVmS9a62zCS7ZFtaRjBN4fhlnzPinTcotpFsDSLzJNiYk8Q1ZyOUKSQgP3D_LD7tir_9aEqf0gEbcOXwCYTwP4b6kv7jrhsHMnrirpmXjUXpdtfUM0RGEFsnIUoYl4hSQhv3yXK1vqUKcchGqEVwIUQjw3oRU5anW_4Nh5tf0A0kAGEWbAEsLmOqwFMKqOxIzV2C6p45vhMJK7Rg5VZNkZ4eElGc6UlNrMGAepvXdAfXBfhxjo55fyc0jnkk6_KqJkz9BVfL--77rE' },
  { id: 4, name: 'Ferrari F8', brand: 'Ferrari', category: 'Hypercar', year: '2023', price_per_day: 2450, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp' },
])

// --- MOCKUP STATE ---
const selectedCategory = ref(null)
const carsInCategory = ref([])

// --- MOCKUP FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  }).format(price)
}

const carCountByCategory = (catName) => {
  return allCars.value.filter(c => c.category === catName).length
}

const openCategory = (cat) => {
  selectedCategory.value = cat
  carsInCategory.value = allCars.value.filter(c => c.category === cat.name)
}

const simulateBooking = (car) => {
  alert(`Simulasi: Anda akan memesan ${car.name}. Buka modal booking di sini!`)
}
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-24">

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

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

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
                    <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>Tersedia
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
                      @click="simulateBooking(car)"
                      class="signature-gradient text-white hover:shadow-lg hover:shadow-[#0050cb]/30 font-bold text-xs uppercase tracking-widest px-4 py-3.5 rounded-xl transition-all duration-300 w-full active:scale-95"
                    >
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>

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
