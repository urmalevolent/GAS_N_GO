<script setup>
import { ref, watch, onUnmounted } from 'vue'

const isOpen = ref(false)
const currentStep = ref(0)
let autoNextTimeout = null

const guideSteps = [
  {
    title: '1. Explore Premium Fleet',
    icon: 'directions_car',
    description: 'Explore our luxury car collection. Use filters to find your dream car by category, brand, or specifications.',
    media: '/images/guide/Step1N.png',
    type: 'image'
  },
  {
    title: '2. Login & Booking',
    icon: 'how_to_reg',
    description: "Log into your account or register if you don't have one. Select your desired rental dates on our smart calendar.",
    media: '/images/guide/step2.mp4',
    type: 'video'
  },
  {
    title: '3. Down Payment',
    icon: 'credit_card',
    description: 'Secure your booking by paying a 15% Down Payment (DP) of the total price via instant payment methods.',
    media: '/images/guide/step3.mp4',
    type: 'video'
  },
  {
    title: '4. Confirm & Enjoy',
    icon: 'task_alt',
    description: 'Once your payment is confirmed, your order is processed. Vehicle handover will be done according to your selected schedule.',
    media: '/images/guide/step4.mp4',
    type: 'video'
  }
]

const openModal = () => {
  currentStep.value = 0
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  clearTimeout(autoNextTimeout)
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

const handleMediaAutoNext = () => {
  clearTimeout(autoNextTimeout)
  if (!isOpen.value || isDragging.value) return

  const currentMedia = guideSteps[currentStep.value]
  if (currentMedia && currentMedia.type === 'image') {
    autoNextTimeout = setTimeout(() => {
      nextStep()
    }, 3000)
  }
}

watch([currentStep, isOpen], () => {
  handleMediaAutoNext()
})

onUnmounted(() => {
  clearTimeout(autoNextTimeout)
})

// Swipe logic
const isDragging = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
const swipeOffset = ref(0)

const onTouchStart = (e) => {
  isDragging.value = true
  clearTimeout(autoNextTimeout)
  touchStartX.value = e.type.includes('mouse') ? e.screenX : e.changedTouches[0].screenX
  touchEndX.value = touchStartX.value
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  touchEndX.value = e.type.includes('mouse') ? e.screenX : e.changedTouches[0].screenX
  swipeOffset.value = touchEndX.value - touchStartX.value
}

const onTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (swipeOffset.value < -70) {
    nextStep()
  } else if (swipeOffset.value > 70) {
    prevStep()
  }
  
  swipeOffset.value = 0
  handleMediaAutoNext() // Restart timer for images if needed
}

// Menghitung posisi deck animasi seperti kartu remi
const getMediaCardStyle = (index) => {
  const N = guideSteps.length
  // pos = 0 (aktif), pos = 1 (belakang 1), pos = N-1 (belakang paling ujung)
  const pos = (index - currentStep.value + N) % N
  
  if (pos === 0) {
    // Current card (active)
    let transformStr = `translateY(0px) scale(1) rotate(0deg)`
    if (swipeOffset.value !== 0) {
      transformStr = `translateX(${swipeOffset.value}px) rotate(${swipeOffset.value * 0.05}deg)`
    }
    return {
      zIndex: 20,
      opacity: 1,
      transform: transformStr,
      transition: isDragging.value ? 'none' : 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    }
  } else {
    // Stacked behind
    return {
      zIndex: 20 - pos,
      opacity: 1 - (pos * 0.2), // fading slightly as it goes back
      transform: `translateY(${pos * 20}px) scale(${1 - pos * 0.05})`,
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
      pointerEvents: 'none'
    }
  }
}

// Helper untuk load video dengan aman (hanya load video yang aktif atau di belakangnya)
const shouldRenderVideo = (index) => {
  const N = guideSteps.length
  const pos = (index - currentStep.value + N) % N
  return pos === 0 || pos === 1
}
</script>

<template>
  <div>
    <!-- Floating Action Button -->
    <button 
      @click="openModal"
      class="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold group animate-bounce-slow"
    >
      <span class="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">style</span>
      <span class="text-sm tracking-wide hidden sm:block">Guide</span>
    </button>

    <!-- Modal Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] font-['Manrope'] overflow-hidden flex flex-col items-center justify-center bg-[#060b19]">
        
        <!-- Dark Blue Rich Background -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/40 rounded-full blur-[150px]"></div>
          <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]"></div>
        </div>

        <!-- Header Modal -->
        <div class="absolute top-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between z-50">
          <div class="flex flex-col">
            <h2 class="text-white text-2xl font-black tracking-tight">How it Works</h2>
            <p class="text-blue-300/70 text-sm font-medium mt-1">Practical car rental guide</p>
          </div>
          <button 
            @click="closeModal"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white backdrop-blur-md transition-all border border-white/5"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <!-- Main Content Area: Deck (Left) + Text (Right) -->
        <div class="relative z-10 w-full max-w-5xl px-6 mt-6 sm:mt-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16" style="height: 65vh; min-height: 480px; max-height: 650px;">
          
          <!-- LEFT: Deck of Cards (Media) -->
          <div class="relative w-full md:w-1/2 h-[50%] md:h-[90%] perspective-1000"
               @touchstart.passive="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd"
               @mousedown="onTouchStart" @mousemove="onTouchMove" @mouseup="onTouchEnd" @mouseleave="onTouchEnd">
            
            <div 
              v-for="(step, index) in guideSteps" 
              :key="'media-'+index"
              class="absolute inset-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black overflow-hidden cursor-grab active:cursor-grabbing border border-white/10"
              :style="getMediaCardStyle(index)"
            >
              <template v-if="step.type === 'video'">
                <!-- Play video only when active -->
                <video 
                  v-if="shouldRenderVideo(index)"
                  :src="step.media" 
                  class="w-full h-full object-cover" 
                  autoplay
                  muted playsinline
                  @ended="currentStep === index ? nextStep() : null"
                ></video>
              </template>
              <template v-else>
                <img :src="step.media" :alt="step.title" class="w-full h-full object-cover pointer-events-none" />
              </template>
              
              <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-tr from-blue-900/50 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute top-5 left-5 bg-blue-600/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-blue-400/30">
                Step {{ index + 1 }} of {{ guideSteps.length }}
              </div>
            </div>
          </div>

          <!-- RIGHT: Text Tutorial (Pop up, No Card Background) -->
          <div class="w-full md:w-1/2 h-[45%] md:h-auto flex flex-col justify-center relative">
            <transition name="fade-slide-up" mode="out-in">
              <div :key="currentStep" class="flex flex-col text-left py-6">
                <div class="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 shadow-inner">
                  <span class="material-symbols-outlined text-4xl">{{ guideSteps[currentStep].icon }}</span>
                </div>
                
                <h3 class="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight drop-shadow-md">{{ guideSteps[currentStep].title }}</h3>
                <p class="text-slate-300 leading-relaxed font-medium text-base sm:text-lg mb-10 drop-shadow">
                  {{ guideSteps[currentStep].description }}
                </p>

                <!-- Navigation Buttons -->
                <div class="flex items-center gap-4">
                  <button 
                    v-if="currentStep > 0"
                    @click="prevStep"
                    class="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-sm shrink-0"
                  >
                    <span class="material-symbols-outlined">arrow_back</span>
                  </button>
                  <button 
                    @click="nextStep"
                    class="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all font-bold uppercase tracking-wide shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 max-w-[200px]"
                  >
                    {{ currentStep === guideSteps.length - 1 ? 'Finish' : 'Next' }}
                    <span class="material-symbols-outlined text-[20px]">{{ currentStep === guideSteps.length - 1 ? 'check_circle' : 'arrow_forward' }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

        </div>

        <!-- Pagination Dots -->
        <div class="absolute bottom-8 z-50 flex items-center gap-3">
          <div 
            v-for="(_, index) in guideSteps" 
            :key="'dot-'+index"
            class="h-2 rounded-full transition-all duration-500 cursor-pointer"
            :class="index === currentStep ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'"
            @click.stop="currentStep = index"
          ></div>
        </div>
        
      </div>
    </transition>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transisi fade-slide-up untuk Text (Pop up ke atas) */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

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
