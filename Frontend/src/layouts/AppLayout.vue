<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Konten Utama (Halaman Home, Cars, dll akan otomatis masuk ke sini) -->
    <main class="grow">
      <!-- PERUBAHAN DI SINI: Mengganti <slot /> menjadi <router-view /> -->
      <router-view />
    </main>

    <!-- Footer -->
    <Footer class="mt-auto" />
  </div>
</template>
