<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// --- DUMMY DATA ---
const stats = [
  { value: '500+', label: 'Loyal Customers' },
  { value: '50+', label: 'Exclusive Fleet' },
  { value: '5★', label: 'Average Rating' },
  { value: '24/7', label: 'Concierge Support' },
]

const values = [
  {
    title: 'Full Transparency',
    description: 'No hidden fees, no surprises. What you see is the price commitment we provide—always.',
    icon: 'verified' // Menggunakan Material Symbols Outlined
  },
  {
    title: 'Top Quality',
    description: 'Each of our fleets undergoes strict inspection and regular maintenance to ensure your absolute safety and comfort.',
    icon: 'workspace_premium'
  },
  {
    title: 'Executive Service',
    description: 'Our concierge team is always ready to assist you before, during, and after the rental period.',
    icon: 'support_agent'
  }
]

const team = [
  {
    name: 'Julian Vance',
    role: 'Chief Executive Officer',
    bio: 'With 15+ years of experience in the global luxury hospitality industry, Julian founded GASNGO to redefine the standards of elite mobility.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Elena Rostova',
    role: 'Fleet Curation Director',
    bio: 'With her sharp instinct, Elena ensures that only the best and rarest vehicle models deserve to enter the GASNGO garage.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Vehicle Engineering',
    bio: 'Marcus leads an elite team of technicians to keep the mechanical heart performance of the entire GASNGO fleet always in prime condition.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Sophia Chen',
    role: 'VP of Customer Experience',
    bio: 'Sophia is the brain behind the smoothness and luxury of every client journey. She guarantees satisfaction on every kilometer traveled.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&facepad=2'
  }
]
</script>

<template>
  <div class="pb-24 font-['Manrope'] bg-[#f7f9fb] min-h-screen">

    <!-- ==========================================
         1. HERO SECTION
         ========================================== -->
    <section class="relative pt-32 pb-48 overflow-hidden bg-[#f7f9fb]">
      <!-- Efek Cahaya Halus -->
      <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#0050cb] blur-[128px] opacity-20 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#0066ff] blur-[128px] opacity-20 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mt-10">
        <p class="text-[#0050cb] font-bold text-xs uppercase tracking-[0.3em] mb-4">Get to Know Us</p>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-[#191c1e] mb-6 tracking-tighter leading-tight uppercase">
          The Story of <span class="text-[#0050cb]">GASNGO</span>
        </h1>
        <p class="text-lg md:text-xl text-[#424656] max-w-2xl mx-auto font-medium leading-relaxed">
          An exclusive mobility club in Indonesia, built on the passion to create boundless journeys and perfect customer experiences.
        </p>
      </div>
    </section>

    <!-- ==========================================
         2. CONTENT WRAPPER (Rounded Top)
         ========================================== -->
    <div class="relative z-20 bg-white rounded-t-[3rem] sm:rounded-t-[4rem] -mt-24 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-[#c2c6d8]/30">

      <!-- Misi Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="order-2 lg:order-1">
            <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">Our Mission</p>
            <h2 class="text-4xl sm:text-5xl font-black text-[#191c1e] mb-6 leading-tight tracking-tight">
              Freedom to Explore, <span class="text-[#0050cb]">Without Compromise.</span>
            </h2>
            <p class="text-[#424656] text-base leading-relaxed mb-6 font-medium">
              At GASNGO, we believe that exploring destinations should feel free. Since our inception, we have been fully committed to providing high-end vehicles with transparent rates and zero hidden fees — so you can focus entirely on your journey.
            </p>
            <p class="text-[#424656] text-base leading-relaxed font-medium">
              Whether you are looking for an elegant executive sedan, a tough premium family SUV, or an exotic supercar to arrive in style, our fleet is always perfectly maintained and ready to accompany your every adventure.
            </p>
          </div>

          <div class="relative order-1 lg:order-2">
            <div class="absolute -inset-4 bg-gradient-to-tr from-[#0050cb]/20 to-[#0066ff]/20 rounded-[3rem] blur-2xl"></div>
            <!-- Gambar Suasana/Perjalanan Elegan -->
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"
              alt="Luxury Journey"
              class="relative w-full h-80 sm:h-96 object-cover rounded-[2.5rem] shadow-2xl shadow-[#191c1e]/10 border border-[#c2c6d8]/20"
            />
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-[#f7f9fb] py-20 border-y border-[#c2c6d8]/40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div v-for="stat in stats" :key="stat.label" class="group">
              <div class="text-4xl md:text-5xl font-black text-[#191c1e] mb-2 group-hover:text-[#0050cb] transition-colors duration-300">
                {{ stat.value }}
              </div>
              <div class="text-[#727687] text-[10px] sm:text-xs font-bold uppercase tracking-widest">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Nilai (Values) Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center mb-16">
          <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">Our Fundamental Principles</p>
          <h2 class="text-4xl font-black text-[#191c1e] tracking-tight">Core <span class="text-[#0050cb]">Values</span></h2>
          <p class="text-[#727687] mt-3 text-lg font-medium">Our main guide in renting the fleet and serving every VIP customer.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="value in values"
            :key="value.title"
            class="bg-white rounded-[2rem] p-8 border border-[#c2c6d8]/40 shadow-sm hover:shadow-2xl hover:shadow-[#0050cb]/10 transition-all duration-500 hover:-translate-y-2 group"
          >
            <!-- Ikon Material Symbols Outlined -->
            <div class="w-14 h-14 bg-[#e6eeff] group-hover:bg-[#0050cb] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 border border-[#b3c5ff]/50 group-hover:border-[#0050cb]">
              <span class="material-symbols-outlined text-[28px] text-[#0050cb] group-hover:text-white transition-colors duration-300">
                {{ value.icon }}
              </span>
            </div>
            <h3 class="text-xl font-extrabold text-[#191c1e] mb-3">{{ value.title }}</h3>
            <p class="text-[#424656] font-medium leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </section>

      <!-- Profil Tim (Team) Section -->
      <section class="bg-[#f2f4f6] py-24 border-t border-[#c2c6d8]/40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">The Figures Behind GASNGO</p>
            <h2 class="text-4xl font-black text-[#191c1e] tracking-tight">Executive <span class="text-[#0050cb]">Board</span></h2>
            <p class="text-[#727687] mt-3 text-lg font-medium">A dedicated group of professionals creating unparalleled standards of luxury.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              v-for="member in team"
              :key="member.name"
              class="group text-center bg-white p-8 rounded-[2rem] border border-[#c2c6d8]/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div class="relative mb-6 mx-auto w-28 h-28">
                <!-- Efek Glow Belakang Avatar saat dihover -->
                <div class="absolute inset-0 bg-gradient-to-br from-[#0050cb] to-[#0066ff] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-110"></div>
                <img
                  :src="member.avatar"
                  :alt="member.name"
                  class="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300 grayscale group-hover:grayscale-0"
                />
              </div>
              <h3 class="text-lg font-extrabold text-[#191c1e]">{{ member.name }}</h3>
              <p class="text-[#0050cb] text-[10px] font-bold uppercase tracking-widest mt-1 mb-4">{{ member.role }}</p>
              <p class="text-[#727687] text-sm font-medium leading-relaxed">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           CALL TO ACTION (Disamakan dengan halaman Home/Cars)
           ========================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
        <div class="bg-white rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100">

          <div class="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
          <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-100 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

          <div class="relative z-10 max-w-3xl mx-auto">
            <h2 class="text-3xl md:text-5xl font-black text-[#111827] uppercase leading-tight mb-6 tracking-tight">
              Ready to Change <br class="hidden sm:block" />
              Your Travel Perspective?
            </h2>
            <p class="text-slate-500 text-lg mb-10 font-medium">
              Explore our first-class fleet firsthand and book the perfect vehicle for your agenda today.
            </p>

            <button
              @click="router.push('/cars')"
              class="bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold px-10 py-4.5 rounded-full uppercase text-sm tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 inline-block text-center"
            >
              See Our Fleet
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Ikon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
