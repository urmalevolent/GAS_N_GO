<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// --- DUMMY DATA ---
const stats = [
  { value: '500+', label: 'Pelanggan Setia' },
  { value: '50+', label: 'Armada Eksklusif' },
  { value: '5★', label: 'Rata-rata Penilaian' },
  { value: '24/7', label: 'Dukungan Pramutamu' },
]

const values = [
  {
    title: 'Transparansi Penuh',
    description: 'Tanpa biaya tersembunyi, tanpa kejutan. Apa yang Anda lihat adalah komitmen harga yang kami berikan—selalu.',
    icon: 'verified' // Menggunakan Material Symbols Outlined
  },
  {
    title: 'Kualitas Utama',
    description: 'Setiap armada kami melewati inspeksi ketat dan perawatan berkala demi memastikan keselamatan dan kenyamanan absolut Anda.',
    icon: 'workspace_premium'
  },
  {
    title: 'Layanan Eksekutif',
    description: 'Tim pramutamu kami senantiasa siap sedia mendampingi Anda sebelum, selama, hingga sesudah masa penyewaan berakhir.',
    icon: 'support_agent'
  }
]

const team = [
  {
    name: 'Julian Vance',
    role: 'Chief Executive Officer',
    bio: 'Berpengalaman 15+ tahun di industri hospitality mewah global, Julian mendirikan GASNGO untuk mendefinisikan ulang standar mobilitas elit.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Elena Rostova',
    role: 'Direktur Kurasi Armada',
    bio: 'Dengan insting tajamnya, Elena memastikan bahwa hanya model kendaraan terbaik dan terlangka yang layak masuk ke dalam garasi GASNGO.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Marcus Thorne',
    role: 'Kepala Teknik Kendaraan',
    bio: 'Marcus memimpin tim teknisi elit untuk menjaga performa jantung mekanis seluruh armada GASNGO selalu dalam kondisi prima.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop&facepad=2'
  },
  {
    name: 'Sophia Chen',
    role: 'VP Pengalaman Pelanggan',
    bio: 'Sophia adalah otak di balik kelancaran dan kemewahan setiap perjalanan klien. Ia menjamin kepuasan pada setiap kilometer yang ditempuh.',
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
        <p class="text-[#0050cb] font-bold text-xs uppercase tracking-[0.3em] mb-4">Mengenal Kami</p>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-[#191c1e] mb-6 tracking-tighter leading-tight uppercase">
          Kisah <span class="text-[#0050cb]">GASNGO</span>
        </h1>
        <p class="text-lg md:text-xl text-[#424656] max-w-2xl mx-auto font-medium leading-relaxed">
          Klub mobilitas eksklusif di Indonesia, dibangun atas dasar gairah untuk menciptakan perjalanan tanpa batas dan pengalaman pelanggan yang sempurna.
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
            <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">Misi Kami</p>
            <h2 class="text-4xl sm:text-5xl font-black text-[#191c1e] mb-6 leading-tight tracking-tight">
              Kebebasan Menjelajah, <span class="text-[#0050cb]">Tanpa Kompromi.</span>
            </h2>
            <p class="text-[#424656] text-base leading-relaxed mb-6 font-medium">
              Di GASNGO, kami percaya bahwa mengeksplorasi destinasi harus terasa leluasa. Sejak awal pendirian kami, kami berkomitmen penuh untuk menyediakan kendaraan kelas atas dengan tarif transparan dan nol biaya tersembunyi — agar Anda bisa fokus sepenuhnya pada perjalanan Anda.
            </p>
            <p class="text-[#424656] text-base leading-relaxed font-medium">
              Apakah Anda mencari sedan eksekutif yang elegan, SUV keluarga premium yang tangguh, atau *supercar* eksotis untuk tiba dengan penuh gaya, armada kami selalu dirawat sempurna dan siap menemani setiap petualangan Anda.
            </p>
          </div>

          <div class="relative order-1 lg:order-2">
            <div class="absolute -inset-4 bg-gradient-to-tr from-[#0050cb]/20 to-[#0066ff]/20 rounded-[3rem] blur-2xl"></div>
            <!-- Gambar Suasana/Perjalanan Elegan -->
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"
              alt="Perjalanan Mewah"
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
          <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">Prinsip Fundamental Kami</p>
          <h2 class="text-4xl font-black text-[#191c1e] tracking-tight">Nilai <span class="text-[#0050cb]">Utama</span></h2>
          <p class="text-[#727687] mt-3 text-lg font-medium">Panduan utama kami dalam menyewakan armada dan melayani setiap pelanggan VIP.</p>
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
            <p class="text-[#0050cb] font-bold text-[10px] uppercase tracking-widest mb-3">Tokoh Di Balik GASNGO</p>
            <h2 class="text-4xl font-black text-[#191c1e] tracking-tight">Jajaran <span class="text-[#0050cb]">Eksekutif</span></h2>
            <p class="text-[#727687] mt-3 text-lg font-medium">Grup profesional yang berdedikasi menciptakan standar kemewahan tiada tara.</p>
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
              Siap Mengubah <br class="hidden sm:block" />
              Perspektif Perjalanan Anda?
            </h2>
            <p class="text-slate-500 text-lg mb-10 font-medium">
              Eksplorasi langsung armada kelas satu kami dan pesan kendaraan sempurna untuk agenda Anda hari ini.
            </p>

            <button
              @click="router.push('/cars')"
              class="bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold px-10 py-4.5 rounded-full uppercase text-sm tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 inline-block text-center"
            >
              Lihat Armada Kami
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
