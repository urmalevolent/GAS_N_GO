<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BeverlyPNG from '@/assets/images/BeverlyHills.png'

const router = useRouter()

// Data Layanan Utama
const services = ref([
  {
    id: 1,
    icon: 'volunteer_activism',
    title: 'Layanan Pramutamu Premium',
    description: 'Kendaraan mewah Anda akan diantar langsung ke depan pintu rumah, hotel, atau bandara, dan dijemput kembali saat durasi sewa selesai.',
    badge: 'CONCIERGE'
  },
  {
    id: 2,
    icon: 'bolt',
    title: 'Pemesanan Instan & Cepat',
    description: 'Sistem pemesanan digital penuh tanpa dokumen fisik yang berbelit-belit. Selesai verifikasi dan siap mengemudi dalam waktu kurang dari 5 menit.',
    badge: 'FAST PROCESS'
  },
  {
    id: 3,
    icon: 'diamond',
    title: 'Armada Pilihan Elit',
    description: 'Setiap unit kendaraan merupakan edisi terbaru dengan perawatan mekanik rutin berstandar pabrikan resmi untuk memastikan performa yang sempurna.',
    badge: 'ELITE FLEET'
  },
  {
    id: 4,
    icon: 'route',
    title: 'Kebebasan Tanpa Batas',
    description: 'Opsi jarak tempuh tanpa batas (unlimited mileage) serta fleksibilitas tinggi untuk pengembalian kendaraan antar-kota metropolitan.',
    badge: 'FLEXIBLE'
  },
  {
    id: 5,
    icon: 'support_agent',
    title: 'Dukungan Siaga 24/7',
    description: 'Layanan darurat jalan raya dan bantuan pelanggan siaga penuh selama 24 jam sehari untuk memberikan rasa aman penuh sepanjang perjalanan Anda.',
    badge: 'SAFE JOURNEY'
  }

])

// Data FAQ
const faqs = ref([
  {
    question: 'Apa saja persyaratan utama untuk menyewa mobil?',
    answer: 'Penyewa wajib mengunggah foto KTP dan SIM A yang masih aktif saat memesan. Untuk warga negara asing, wajib melampirkan paspor dan SIM Internasional.',
    open: false
  },
  {
    question: 'Bagaimana proses pengantaran dan penjemputan kendaraan?',
    answer: 'Setelah pemesanan dikonfirmasi, tim pramutamu kami akan menghubungi Anda untuk mencocokkan titik koordinat lokasi pengantaran. Layanan ini mencakup area bandara, hotel, dan tempat tinggal.',
    open: false
  },
  {
    question: 'Apakah harga yang tertera sudah termasuk asuransi?',
    answer: 'Ya, seluruh armada kami dilindungi oleh asuransi all-risk komprehensif. Detail biaya pertanggungan mandiri jika terjadi insiden kecil tercantum pada formulir pemesanan.',
    open: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<template>
  <div class="bg-[#f8fafa] min-h-screen pb-20 font-['Manrope']">
    
    <!-- ==========================================
         1. HERO SECTION (Layanan Khusus)
         ========================================== -->
    <section 
      class="relative pt-28 pb-40 lg:pt-36 lg:pb-48 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${BeverlyPNG})` }"
    >
      <div class="absolute inset-0 bg-white/80 sm:bg-white/45"></div>
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f8fafa] to-transparent z-0"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-block bg-white/90 backdrop-blur-md text-[#0050cb] font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-widest mb-6 shadow-sm border border-blue-100">
          Layanan Eksklusif Kami
        </div>

        <h1 class="text-4xl md:text-6xl font-black text-[#111827] mb-6 tracking-tight leading-[1.1] uppercase">
          Layanan <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0050cb] to-[#00b4d8]">Tanpa Batas</span>
        </h1>

        <p class="text-base md:text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed mb-6">
          Kami mendefinisikan ulang standar mobilitas mewah melalui kenyamanan personalisasi, armada elit terawat, dan sistem terpadu berkecepatan tinggi.
        </p>
      </div>
    </section>

    <!-- ==========================================
         2. MAIN SERVICES GRID
         ========================================== -->
    <div class="relative z-20 bg-white rounded-t-[3rem] sm:rounded-t-[4rem] -mt-24 pt-16 sm:pt-24 pb-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border-t border-gray-100">
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 uppercase">Standar Mobilitas <span class="text-[#0050cb]">GASNGO</span></h2>
          <p class="text-slate-500 mt-4 text-sm md:text-base leading-relaxed font-semibold">
            Nikmati fasilitas bintang lima yang melengkapi kenyamanan perjalanan berkendara Anda dengan mobil impian Anda.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <!-- Card Service -->
          <div 
            v-for="service in services" 
            :key="service.id" 
            class="group bg-[#f8fafa] rounded-[2.5rem] p-8 border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,80,203,0.12)] hover:bg-white hover:border-[#0050cb]/20 transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between"
          >
            <div>
              <div class="flex justify-between items-start mb-6">
                <div class="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-[#0050cb] shadow-sm border border-slate-100 group-hover:bg-[#0050cb] group-hover:text-white transition-colors duration-500">
                  <span class="material-symbols-outlined text-3xl">{{ service.icon }}</span>
                </div>
                <span class="text-[9px] font-black tracking-widest text-[#0050cb]/80 bg-[#0050cb]/5 px-3 py-1 rounded-full uppercase">{{ service.badge }}</span>
              </div>

              <h3 class="text-xl font-extrabold text-slate-900 mb-4 group-hover:text-[#0050cb] transition-colors duration-300">{{ service.title }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed font-medium">{{ service.description }}</p>
            </div>
            
           
          </div>

        </div>

      </section>

      <!-- ==========================================
           3. FAQ SECTION
           ========================================== -->
      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 uppercase">Pertanyaan <span class="text-[#0050cb]">Sering Diajukan</span></h2>
          <p class="text-slate-500 mt-3 text-sm font-medium">Beberapa jawaban untuk mempermudah pemahaman alur layanan kami.</p>
        </div>

        <div class="space-y-4">
          <div 
            v-for="(faq, idx) in faqs" 
            :key="idx" 
            class="bg-[#f8fafa] rounded-2xl border border-gray-100 overflow-hidden"
          >
            <button 
              @click="toggleFaq(idx)" 
              class="w-full flex justify-between items-center p-5 font-extrabold text-left text-slate-800 hover:text-[#0050cb] transition-colors focus:outline-none"
            >
              <span class="text-sm md:text-base">{{ faq.question }}</span>
              <span 
                class="material-symbols-outlined transition-transform duration-300"
                :class="{'rotate-180 text-[#0050cb]': faq.open}"
              >
                expand_more
              </span>
            </button>
            <transition name="slide-fade">
              <div v-if="faq.open" class="px-5 pb-5 pt-1 text-slate-500 text-xs md:text-sm leading-relaxed font-medium border-t border-slate-200/20 bg-white/50">
                {{ faq.answer }}
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- ==========================================
           4. CALL TO ACTION
           ========================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div class="bg-[#070b19] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          
          <div class="absolute -top-32 -left-32 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

          <div class="relative z-10 max-w-2xl mx-auto">
            <h2 class="text-2xl md:text-4xl font-black text-white uppercase leading-tight mb-4 tracking-tight">
              Rasakan Sensasi Kenyamanan Berkendara Mewah
            </h2>
            <p class="text-slate-400 text-xs md:text-sm mb-8 font-medium">
              Katalog armada terbaik kami siap mengantar Anda pada perjalanan bisnis maupun rekreasi dengan prestise tertinggi.
            </p>

            <button
              @click="router.push('/cars')"
              class="bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold px-8 py-3.5 rounded-full uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              Mulai Sewa Mobil
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Transisi FAQ */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
