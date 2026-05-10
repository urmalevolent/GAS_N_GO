<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

// Pastikan file gambar ini benar-benar ada di dalam folder src/asset/images/
import logocars from '@/assets/images/racingcar.png'
import EnvelopeIcon from '@/assets/images/icons/envelope.png'

// Memanggil useRoute untuk mengecek URL/Halaman mana yang sedang aktif
const route = useRoute()

// State untuk mengatur buka tutup menu di mode Mobile/HP
const isMobileMenuOpen = ref(false)

// Daftar menu: Ganti bagian 'path' sesuai dengan route di router/index.js Anda
const navLinks = [
  { name: 'Cars', path: '/cars' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
]
</script>

<template>

  <!-- Wrapper utama Navbar -->
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Kiri: Logo Gambar & Teks (Bisa di-klik untuk kembali ke Home) -->
        <RouterLink to="/" class="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
          <!-- Menampilkan Gambar Logo -->
          <img :src="logocars" alt="Logo GASNGO" class="h-10 w-10 object-contain" />

          <!-- Teks Judul -->
          <span class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight">
            GASNGO
          </span>
        </RouterLink>

        <!-- Tengah: Navigasi Desktop -->
        <div class="hidden md:flex items-center space-x-8 lg:space-x-12">
          <!-- Menggunakan RouterLink dari Vue Router -->
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            :class="[
              'text-[15px] font-medium pb-1.5 transition-all duration-200 border-b-2',
              route.path === link.path
                ? 'text-blue-600 border-blue-600' // Jika URL sama dengan path, warna biru (aktif)
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300',
            ]"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Kanan: Icon Sun & Tombol Reserve -->
        <div class="flex items-center space-x-4 md:space-x-6">
          <!-- Tombol Tema Terang/Gelap (Sun Icon) -->
          <button
            class="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-full focus:outline-none"
          >
            <img :src="EnvelopeIcon" class="h-6 w-6" />
          </button>

          <!-- Tombol RESERVE NOW -->
          <button
            class="hidden sm:block bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded shadow-sm transition-colors uppercase tracking-wide"
          >
            Reserve Now
          </button>

          <!-- Tombol Hamburger (Mobile/HP) -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-slate-500 hover:text-slate-900 focus:outline-none"
          >
            <svg
              v-if="!isMobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Dropdown Menu Mobile -->
    <div
      v-show="isMobileMenuOpen"
      class="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 transition-all"
    >
      <div class="px-4 pt-2 pb-6 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          :class="[
            'block px-3 py-3 rounded-md text-base font-medium',
            route.path === link.path
              ? 'bg-blue-50 text-blue-600' // Jika aktif
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          ]"
        >
          {{ link.name }}
        </RouterLink>

        <div class="pt-4 px-3">
          <button
            class="w-full bg-[#0d6efd] text-white font-bold text-sm px-6 py-3 rounded shadow-sm hover:bg-blue-700 transition-colors uppercase tracking-wide"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
