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
    title: 'Premium Concierge Service',
    description: 'Your luxury vehicle will be delivered right to your doorstep, hotel, or airport, and picked up again when the rental period ends.',
    badge: 'CONCIERGE'
  },
  {
    id: 2,
    icon: 'bolt',
    title: 'Instant & Fast Booking',
    description: 'Full digital booking system without complicated physical documents. Complete verification and ready to drive in less than 5 minutes.',
    badge: 'FAST PROCESS'
  },
  {
    id: 3,
    icon: 'diamond',
    title: 'Elite Choice Fleet',
    description: 'Every vehicle unit is the latest edition with routine mechanical maintenance at official manufacturer standards to ensure perfect performance.',
    badge: 'ELITE FLEET'
  },
  {
    id: 4,
    icon: 'route',
    title: 'Limitless Freedom',
    description: 'Unlimited mileage options and high flexibility for returning vehicles between metropolitan cities.',
    badge: 'FLEXIBLE'
  },
  {
    id: 5,
    icon: 'support_agent',
    title: '24/7 Standby Support',
    description: 'Highway emergency service and full standby customer assistance 24 hours a day to provide full sense of security throughout your journey.',
    badge: 'SAFE JOURNEY'
  }

])

// Data FAQ
const faqs = ref([
  {
    question: 'What are the main requirements for renting a car?',
    answer: 'Renters must upload an active ID card and driving license when booking. For foreign nationals, a passport and International Driving Permit must be attached.',
    open: false
  },
  {
    question: 'How is the vehicle delivery and pickup process?',
    answer: 'Once the booking is confirmed, our concierge team will contact you to match the coordinates of the delivery location. This service covers airport, hotel, and residential areas.',
    open: false
  },
  {
    question: 'Are the listed prices inclusive of insurance?',
    answer: 'Yes, our entire fleet is protected by comprehensive all-risk insurance. Details of self-insured costs in case of minor incidents are listed on the booking form.',
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
          Our Exclusive Services
        </div>

        <h1 class="text-4xl md:text-6xl font-black text-[#111827] mb-6 tracking-tight leading-[1.1] uppercase">
          Limitless <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0050cb] to-[#00b4d8]">Services</span>
        </h1>

        <p class="text-base md:text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed mb-6">
          We redefine luxury mobility standards through personalized comfort, well-maintained elite fleets, and high-speed integrated systems.
        </p>
      </div>
    </section>

    <!-- ==========================================
         2. MAIN SERVICES GRID
         ========================================== -->
    <div class="relative z-20 bg-white rounded-t-[3rem] sm:rounded-t-[4rem] -mt-24 pt-16 sm:pt-24 pb-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border-t border-gray-100">
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 uppercase">GASNGO Mobility <span class="text-[#0050cb]">Standard</span></h2>
          <p class="text-slate-500 mt-4 text-sm md:text-base leading-relaxed font-semibold">
            Enjoy five-star facilities that complement the comfort of your driving journey with your dream car.
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
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 uppercase">Frequently <span class="text-[#0050cb]">Asked Questions</span></h2>
          <p class="text-slate-500 mt-3 text-sm font-medium">Some answers to simplify the understanding of our service flow.</p>
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
              Experience the Sensation of Luxury Driving Comfort
            </h2>
            <p class="text-slate-400 text-xs md:text-sm mb-8 font-medium">
              Our best fleet catalog is ready to accompany you on business or leisure trips with the highest prestige.
            </p>

            <button
              @click="router.push('/cars')"
              class="bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold px-8 py-3.5 rounded-full uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              Start Renting a Car
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
