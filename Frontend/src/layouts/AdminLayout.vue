<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

// Import komponen-komponen Admin
import Header from '@/components/admin/Header.vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import Footer from '@/components/admin/Footer.vue'

// State untuk mengatur buka/tutup Sidebar di mode Mobile
const isSidebarOpen = ref(false)
</script>

<template>
  <!-- Wrapper utama dengan font Manrope dan warna background abu-abu terang khas GASNGO -->
  <div class="min-h-screen bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] flex">

    <!-- ================= BACKDROP (Hanya muncul di Mobile/Tablet saat Sidebar terbuka) ================= -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-[#191c1e]/60 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
        @click="isSidebarOpen = false"
      ></div>
    </transition>

    <!-- ================= SIDEBAR COMPONENT ================= -->
    <!-- Sidebar dipanggil di sini. Lebar sidebar diasumsikan 64 (16rem / 256px) -->
    <Sidebar :is-sidebar-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- ================= MAIN CONTENT WRAPPER ================= -->
    <!-- Margin Kiri (lg:ml-64) memberikan ruang untuk Sidebar di mode Desktop -->
    <div class="flex-1 flex flex-col transition-all duration-300 ease-in-out lg:ml-64 min-w-0">

      <!-- HEADER COMPONENT -->
      <!-- Mengirimkan event untuk memicu isSidebarOpen -->
      <Header @sidebar-open="isSidebarOpen = !isSidebarOpen" :is-sidebar-open="isSidebarOpen" />

      <!-- MAIN PAGE CONTENT (Tempat halaman dashboard dirender) -->
      <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <!-- RouterView memanggil halaman dari router (cth: Dashboard, List Mobil, dll) -->
        <RouterView :key="$route.fullPath" />
      </main>

      <!-- FOOTER COMPONENT -->
      <Footer />

    </div>
  </div>
</template>

<style scoped>
/* Animasi halus saat backdrop mobile muncul/hilang */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
