<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue' // <-- 1. Import komponen Footer
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar Anda -->
    <Navbar />

    <!-- Konten Utama (Halaman Home/lainnya) -->
    <main class="grow"> 
      <slot />
    </main>

    <!-- 2. Panggil Footer Anda di sini -->
    <Footer class="mt-auto" />
  </div>
</template>