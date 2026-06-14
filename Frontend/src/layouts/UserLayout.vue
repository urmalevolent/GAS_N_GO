<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Asumsi: Anda akan membuat komponen Sidebar khusus untuk halaman User (bukan admin)
import Sidebar from "@/components/Sidebar.vue";

// Pastikan letak gambar default avatar Anda benar
import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";

const authStore = useAuthStore();

// State untuk data user (dikirim ke Sidebar sebagai Props)
const userData = computed(() => {
  if (authStore.user) {
    return {
      username: authStore.user.full_name || authStore.user.email.split('@')[0],
      email: authStore.user.email,
      image: authStore.user.image_url || defaultAvatar,
    };
  }
  return {
    username: "Guest User",
    email: "guest@example.com",
    image: defaultAvatar,
  };
});
</script>

<template>
  <!-- Background utama menyesuaikan warna halaman lain agar konsisten -->
  <div class="bg-[#f7f9fb] min-h-screen">

    <!-- Wrapper Layout -->
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 gap-6 md:gap-8">

      <!-- ================= BAGIAN KIRI: SIDEBAR USER ================= -->
      <!-- PERUBAHAN DI SINI: Menambahkan "sticky top-28 self-start" -->
      <!-- sticky: Membuat elemen menempel saat discroll -->
      <!-- top-28: Memberi jarak dari atas (agar tidak tertutup navbar) -->
      <!-- self-start: Mencegah sidebar meregang/stretching mengikuti tinggi kolom kanan -->
      <div class="hidden lg:block w-72 flex-shrink-0 sticky top-28 self-start transition-all duration-300">
        <!-- Mengirim data simulasi ke komponen Sidebar -->
        <Sidebar :user="userData" />
      </div>

      <!-- ================= BAGIAN KANAN: MAIN CONTENT ================= -->
      <!-- Halaman dinamis seperti Profile.vue, MyOrder.vue akan masuk ke dalam <RouterView /> ini -->
      <main class="flex-1 bg-white rounded-2xl shadow-sm border border-[#c2c6d8]/30 min-h-[600px] overflow-hidden">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
/* Anda dapat menambahkan style spesifik khusus layout user di sini jika diperlukan */
</style>
