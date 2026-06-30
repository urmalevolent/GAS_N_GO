<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const currentStep = ref(0)

const guideSteps = [
  {
    title: '1. Eksplorasi Armada Premium',
    icon: 'directions_car',
    description: 'Jelajahi koleksi mobil mewah kami. Gunakan filter untuk menemukan mobil impian Anda berdasarkan kategori, merek, maupun spesifikasi.',
    media: '/images/guide/Step1N.png',
    type: 'image'
  },
  {
    title: '2. Login & Pemesanan',
    icon: 'how_to_reg',
    description: 'Masuk ke akun Anda atau daftar jika belum memiliki akun. Pilih tanggal sewa yang Anda inginkan pada kalender pintar kami.',
    media: '/images/guide/step2.mp4',
    type: 'video'
  },
  {
    title: '3. Pembayaran DP',
    icon: 'credit_card',
    description: 'Amankan pesanan Anda dengan membayar DP (Down Payment) sebesar 15% dari total harga melalui metode pembayaran instan.',
    media: '/images/guide/step3.mp4',
    type: 'video'
  },
  {
    title: '4. Konfirmasi & Nikmati',
    icon: 'task_alt',
    description: 'Setelah pembayaran terkonfirmasi, pesanan Anda diproses. Serah terima kendaraan akan dilakukan sesuai jadwal pilihan Anda.',
    media: '/images/guide/step4.mp4',
    type: 'video'
  }
]

onMounted(() => {
  // Inject Spline Viewer script if it doesn't exist
  if (!document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.9.32/build/spline-viewer.js"]')) {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.32/build/spline-viewer.js'
    document.head.appendChild(script)
  }
})

const openModal = () => {
  currentStep.value = 0
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const nextStep = () => {
  if (currentStep.value < guideSteps.length - 1) {
    currentStep.value++
  } else {
    closeModal()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <div>
    <!-- Floating Action Button -->
    <button 
      @click="openModal"
      class="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-[#0050cb] to-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 font-bold group animate-bounce-slow"
    >
      <span class="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">help</span>
      <span class="text-sm tracking-wide hidden sm:block">How to Order?</span>
    </button>

    <!-- Modal Overlay Layar Penuh -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] bg-slate-950 font-['Manrope'] overflow-hidden flex items-center justify-center">
        
        <!-- 3D Spline Background -->
        <div class="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
          <spline-viewer 
            url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" 
            class="w-full h-full"
          ></spline-viewer>
        </div>

        <!-- Gradien Penutup agar teks terbaca -->
        <div class="absolute inset-0 z-0 bg-gradient-to-br from-slate-950/70 via-blue-950/40 to-slate-950/80 pointer-events-none"></div>

        <!-- Tombol Close (Pojok Kanan Atas) -->
        <button 
          @click="closeModal"
          class="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>

        <!-- Konten Tengah (Glass Card) -->
        <div class="relative z-10 w-full max-w-5xl px-4 sm:px-6">
          <!-- Step Indicator Bars -->
          <div class="flex gap-2 mb-6 max-w-lg mx-auto">
            <div 
              v-for="(_, index) in guideSteps" 
              :key="'dot-'+index"
              class="h-1.5 rounded-full flex-1 transition-all duration-500"
              :class="index <= currentStep ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-white/20'"
            ></div>
          </div>

          <!-- Slide Content (Transisi Halus) -->
          <transition name="slide-up" mode="out-in">
            <div :key="currentStep" class="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl overflow-hidden group flex flex-col md:flex-row items-center gap-8 md:gap-12">
              
              <!-- Efek Cahaya Glow di background -->
              <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <!-- KIRI: Gambar / Video Screenshot -->
              <div class="w-full md:w-1/2 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-blue-400/30 transition-colors duration-500 bg-slate-900 h-60 md:h-80 flex items-center justify-center">
                
                <template v-if="guideSteps[currentStep].type === 'video'">
                  <video 
                    :src="guideSteps[currentStep].media" 
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    autoplay loop muted playsinline
                  ></video>
                </template>
                <template v-else>
                  <img 
                    :src="guideSteps[currentStep].media" 
                    :alt="guideSteps[currentStep].title" 
                    class="w-full h-full object-cover object-top hover:object-bottom transition-all duration-[3s] ease-in-out cursor-ns-resize" 
                  />
                </template>

                <!-- Gradien bayangan halus di atas media -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
              </div>

              <!-- KANAN: Teks & Navigasi -->
              <div class="relative z-10 w-full md:w-1/2 text-left flex flex-col justify-center">
                
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6 text-blue-400 shadow-inner">
                  <span class="material-symbols-outlined text-3xl">{{ guideSteps[currentStep].icon }}</span>
                </div>
                
                <h3 class="text-2xl sm:text-3xl font-black text-white mb-4 tracking-wide leading-tight">{{ guideSteps[currentStep].title }}</h3>
                
                <p class="text-slate-300 leading-relaxed font-medium text-sm sm:text-base mb-8">
                  {{ guideSteps[currentStep].description }}
                </p>

                <!-- Tombol Navigasi Bawah -->
                <div class="flex items-center gap-4 mt-auto">
                  <button 
                    v-if="currentStep > 0"
                    @click="prevStep"
                    class="px-6 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors font-bold text-sm tracking-wide"
                  >
                    Back
                  </button>
                  <div v-else class="flex-1"></div>

                  <button 
                    @click="nextStep"
                    class="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0050cb] hover:bg-blue-600 text-white transition-all font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
                  >
                    {{ currentStep === guideSteps.length - 1 ? 'Selesai' : 'Next Step' }}
                    <span class="material-symbols-outlined text-[18px]">{{ currentStep === guideSteps.length - 1 ? 'check' : 'arrow_forward' }}</span>
                  </button>
                </div>

              </div>
            </div>
          </transition>
        </div>
        
      </div>
    </transition>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Transisi Modal Penuh */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transisi Ganti Kartu */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Animasi Floating Button Default */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
</style>
