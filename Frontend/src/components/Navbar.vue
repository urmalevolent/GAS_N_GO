<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute} from 'vue-router'

// Gambar Asset
import logocars from '@/assets/images/racingcar.png'
import EnvelopeIcon from '@/assets/images/icons/envelope.png'
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png' // Pastikan gambar ini ada

const route = useRoute()


// --- STATE ---
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

// State untuk User Dropdown
const isUserOpen = ref(false)
// SIMULASI LOGIN (Murni Mockup/Desain)
const isAuthenticated = ref(true)
const currentUser = ref({
  username: 'Sultan Andara',
  email: 'sultan@executive.com',
  role: 'customer', // Ubah jadi 'admin' jika ingin test menu admin
  avatar: '' // Kosongkan agar pakai defaultAvatar
})

// State untuk Notifikasi Global (Mockup)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// --- DATA NAVIGASI ---
const navLinks = [
  { name: 'Cars', path: '/cars' },
  { name: 'Search', path: '/searching' },
  { name: 'About', path: '/about' },
]

// --- FUNGSI ---
const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fungsi Buka Tutup Profil User
const toggleUserDropdown = () => {
  isUserOpen.value = !isUserOpen.value
}

// Klik di luar untuk menutup profil user
const closeOnClickOutside = (event) => {
  if (!event.target.closest('.user-dropdown-container')) {
    isUserOpen.value = false
  }
}

// Fungsi Logout (Simulasi)
const handleLogout = () => {
  isUserOpen.value = false
  triggerToast('Berhasil keluar dari akun.', 'success')
  // isAuthenticated.value = false // Uncomment jika ingin test tampilan saat belum login
  // router.push('/')
}

const triggerToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type: type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div>
    <!-- ================= NAVBAR ================= -->
    <nav
      class="fixed top-0 w-full z-50 transition-all duration-500 ease-in-out font-['Manrope']"
      :class="scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100 py-2' : 'bg-white border-b border-gray-100 py-3'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Kiri: Logo Gambar & Teks -->
          <RouterLink to="/" class="flex-shrink-0 flex items-center space-x-2 cursor-pointer group" @click="closeMobileMenu">
            <div class="relative flex items-center justify-center overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-110">
               <img :src="logocars" alt="Logo GASNGO" class="h-10 w-10 object-contain z-10" />
               <div class="absolute inset-0 bg-[#0050cb] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
            </div>

            <span class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight group-hover:text-[#0050cb] transition-colors duration-300">
              GASNGO
            </span>
          </RouterLink>

          <!-- Tengah: Navigasi Desktop -->
          <div class="hidden md:flex items-center space-x-8 lg:space-x-12">
            <RouterLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              class="relative text-[15px] font-bold py-1.5 transition-all duration-300 group"
              :class="route.path === link.path ? 'text-[#0050cb]' : 'text-[#424656] hover:text-[#191c1e]'"
            >
              {{ link.name }}
              <!-- Animasi Garis Bawah Meluncur (Hover Effect) -->
              <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-[#0050cb] rounded-full transition-all duration-300 transform origin-left"
                :class="route.path === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </RouterLink>
          </div>

          <!-- Kanan: Icon Amplop & PROFIL USER -->
          <div class="flex items-center space-x-4 md:space-x-6">

            <!-- Icon User Orders (Envelope) -->
            <RouterLink
              to="/user/orders"
              class="relative p-2 rounded-full text-[#424656] hover:text-[#0050cb] hover:bg-[#f2f4f6] transition-all duration-300 focus:outline-none group"
              title="Pesanan Saya"
            >
              <img :src="EnvelopeIcon" class="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity" />
              <!-- Titik Notifikasi Merah/Biru -->
              <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
            </RouterLink>

            <!-- ================= BAGIAN PROFIL USER (Menggantikan Reserve Now) ================= -->
            <div class="hidden sm:block relative user-dropdown-container">

              <!-- Jika Sudah Login (Tampil Profil) -->
              <div v-if="isAuthenticated && currentUser">
                <button @click="toggleUserDropdown" class="flex items-center gap-3 bg-[#f2f4f6] hover:bg-[#e6eeff] border border-[#c2c6d8]/50 hover:border-[#0050cb]/30 pl-2 pr-4 py-1.5 rounded-full transition-all duration-300 focus:outline-none group">
                  <img
                    :src="currentUser.avatar || defaultAvatar"
                    alt="User Avatar"
                    class="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div class="text-left">
                    <p class="text-[#191c1e] font-bold text-sm leading-none flex items-center gap-1">
                      {{ currentUser.username.split(' ')[0] }}
                      <span class="material-symbols-outlined text-[16px] text-[#727687] transition-transform duration-300" :class="{'rotate-180 text-[#0050cb]': isUserOpen}">expand_more</span>
                    </p>
                  </div>
                </button>

                <!-- Dropdown Menu Profil Desktop -->
                <transition name="fade-slide">
                  <div v-if="isUserOpen" class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl z-50 py-2 border border-gray-100 overflow-hidden">
                    <div class="px-5 py-3 border-b border-gray-50 mb-2 bg-[#f7f9fb]/50">
                      <p class="text-[10px] uppercase tracking-widest text-[#727687] font-bold mb-0.5">Masuk sebagai</p>
                      <p class="text-xs font-bold text-[#191c1e] truncate">{{ currentUser.email }}</p>
                    </div>

                    <RouterLink @click="isUserOpen=false" to="/user/profile" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#424656] hover:bg-[#e6eeff] hover:text-[#0050cb] transition-colors">
                      <span class="material-symbols-outlined text-[18px]">person</span> Profil Saya
                    </RouterLink>

                    <RouterLink @click="isUserOpen=false" to="/user/orders" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#424656] hover:bg-[#e6eeff] hover:text-[#0050cb] transition-colors">
                      <span class="material-symbols-outlined text-[18px]">local_shipping</span> Pesanan Saya
                    </RouterLink>

                    <!-- Muncul jika role user adalah admin -->
                    <RouterLink v-if="currentUser.role === 'customer'" @click="isUserOpen=false" to="/admin/dashboard" class="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#424656] hover:bg-[#e6eeff] hover:text-[#0050cb] transition-colors">
                      <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span> Dashboard Admin
                    </RouterLink>

                    <div class="mt-2 border-t border-gray-100 pt-2">
                      <button @click="handleLogout" class="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#ba1a1a] hover:bg-red-50 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">logout</span> Keluar Akun
                      </button>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Jika Belum Login -->
              <div v-else>
                <RouterLink to="/login" class="flex items-center gap-2 font-bold text-white bg-[#0050cb] hover:bg-[#0066ff] px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 text-sm uppercase tracking-widest">
                  Sign In
                </RouterLink>
              </div>
            </div>

            <!-- Tombol Hamburger (Mobile/HP) -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-xl border border-gray-200 text-[#424656] hover:bg-gray-50 transition-all focus:outline-none bg-white"
            >
              <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              <svg v-else class="w-6 h-6 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ================= DROPDOWN MENU MOBILE ================= -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-2xl overflow-hidden">
          <div class="px-6 pt-4 pb-8 space-y-2">

            <RouterLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              @click="closeMobileMenu"
              class="block px-4 py-4 rounded-xl text-base font-extrabold tracking-wide transition-all"
              :class="route.path === link.path ? 'bg-[#e6eeff] text-[#0050cb]' : 'text-[#424656] hover:bg-gray-50 hover:text-[#191c1e]'"
            >
              {{ link.name }}
            </RouterLink>

            <!-- Profil User di Mobile -->
            <div class="pt-6 mt-4 border-t border-gray-100">
              <template v-if="isAuthenticated && currentUser">
                <div class="flex items-center gap-3 mb-6 p-4 bg-[#f7f9fb] rounded-2xl border border-gray-100">
                  <img :src="currentUser.avatar || defaultAvatar" class="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <p class="text-sm font-extrabold text-[#191c1e]">{{ currentUser.username }}</p>
                    <p class="text-[10px] text-[#727687] font-bold uppercase tracking-widest mt-0.5">{{ currentUser.email }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-4">
                  <RouterLink @click="closeMobileMenu" to="/user/profile" class="flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-xs font-bold text-[#424656] hover:text-[#0050cb] transition-all">
                    <span class="material-symbols-outlined text-[20px]">person</span> Profil
                  </RouterLink>
                  <RouterLink @click="closeMobileMenu" to="/user/orders" class="flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 bg-gray-50 hover:bg-blue-50 rounded-xl text-xs font-bold text-[#424656] hover:text-[#0050cb] transition-all">
                    <span class="material-symbols-outlined text-[20px]">local_shipping</span> Pesanan
                  </RouterLink>
                </div>

                <RouterLink v-if="currentUser.role === 'admin'" @click="closeMobileMenu" to="/admin/dashboard" class="w-full flex items-center justify-center gap-2 mb-4 px-4 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-xs font-bold text-indigo-700 transition-all uppercase tracking-widest">
                  <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span> Dashboard Admin
                </RouterLink>

                <button @click="handleLogout(); closeMobileMenu()" class="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold text-[#ba1a1a] transition-all uppercase tracking-widest">
                  <span class="material-symbols-outlined text-[18px]">logout</span> Keluar Akun
                </button>
              </template>

              <template v-else>
                <RouterLink @click="closeMobileMenu" to="/login" class="w-full bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">login</span> Sign In
                </RouterLink>
              </template>
            </div>

          </div>
        </div>
      </transition>
    </nav>

    <!-- ================= TOAST NOTIFICATION GLOBAL ================= -->
    <transition name="slide-up">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm text-white transform transition-all duration-300"
        :class="toast.type === 'error' ? 'bg-[#ba1a1a] shadow-red-600/30' : toast.type === 'success' ? 'bg-[#16a34a] shadow-green-600/30' : 'bg-[#0050cb] shadow-blue-600/30'"
      >
        <span class="material-symbols-outlined text-[20px] shrink-0">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span>
        <p>{{ toast.message }}</p>
      </div>
    </transition>

  </div>
</template>

<style scoped>
/* Pengaturan Ikon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Transisi Dropdown Profil */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transisi Slide Up untuk Toast Notification */
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
  transform: translateY(20px) scale(0.95);
}
</style>
