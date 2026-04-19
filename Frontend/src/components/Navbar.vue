<script setup>
import { ref } from 'vue'

// State untuk mengatur buka tutup menu di mode Mobile/HP
const isMobileMenuOpen = ref(false)

// State untuk menandai menu mana yang sedang aktif
const activeMenu = ref('Fleet')

// Daftar menu (memudahkan jika ingin menambah/mengubah menu di masa depan)
const navLinks = [
  { name: 'Fleet', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Locations', href: '#' },
  { name: 'Concierge', href: '#' },
]

// Fungsi untuk mengganti menu aktif
const setActiveMenu = (menuName) => {
  activeMenu.value = menuName
  isMobileMenuOpen.value = false // Tutup menu mobile saat link diklik
}
</script>

<template>
  <!-- Wrapper utama Navbar -->
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Kiri: Logo -->
        <div class="flex-shrink-0 flex items-center cursor-pointer">
          <span class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight">
            GASNGO
          </span>
        </div>

        <!-- Tengah: Navigasi Desktop (Disembunyikan di HP, Muncul di ukuran md ke atas) -->
        <div class="hidden md:flex items-center space-x-8 lg:space-x-12">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href"
            @click.prevent="setActiveMenu(link.name)"
            :class="[
              'text-[15px] font-medium pb-1.5 transition-all duration-200 border-b-2',
              activeMenu === link.name 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
            ]"
          >
            {{ link.name }}
          </a>
        </div>

        <!-- Kanan: Icon Sun & Tombol Reserve -->
        <div class="flex items-center space-x-4 md:space-x-6">
          
          <!-- Tombol Tema Terang/Gelap (Sun Icon) -->
          <button class="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-full focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 21v-2.25m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 18.75a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5Z" />
            </svg>
          </button>

          <!-- Tombol RESERVE NOW (Desktop & Tablet) -->
          <button class="hidden sm:block bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded shadow-sm transition-colors uppercase tracking-wide">
            Reserve Now
          </button>

          <!-- Tombol Hamburger (Hanya muncul di Mobile/HP) -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-slate-500 hover:text-slate-900 focus:outline-none"
          >
            <!-- Icon Hamburger (3 garis) jika menu tutup -->
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!-- Icon Close (X) jika menu terbuka -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Dropdown Menu Mobile (Muncul jika isMobileMenuOpen true) -->
    <div 
      v-show="isMobileMenuOpen" 
      class="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 transition-all"
    >
      <div class="px-4 pt-2 pb-6 space-y-1">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          @click.prevent="setActiveMenu(link.name)"
          :class="[
            'block px-3 py-3 rounded-md text-base font-medium',
            activeMenu === link.name 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          {{ link.name }}
        </a>
        
        <!-- Tombol Reserve untuk Mobile -->
        <div class="pt-4 px-3">
          <button class="w-full bg-[#0d6efd] text-white font-bold text-sm px-6 py-3 rounded shadow-sm hover:bg-blue-700 transition-colors uppercase tracking-wide">
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>