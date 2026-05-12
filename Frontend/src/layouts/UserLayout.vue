<script setup>
import { ref, onMounted } from "vue";
import { RouterView } from "vue-router";

// Asumsi: Anda akan membuat komponen Sidebar khusus untuk halaman User (bukan admin)
import Sidebar from "@/components/Sidebar.vue";

// Pastikan letak gambar default avatar Anda benar
import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";

// 1. State untuk data user (dikirim ke Sidebar sebagai Props)
// Menggunakan data dummy sementara karena belum ada backend
const userData = ref({
  username: "Memuat...",
  email: "",
  image: defaultAvatar,
});

// 2. Fungsi Fetch Data Simulasi (Tanpa Backend)
const fetchUserData = () => {
  // Simulasi loading/delay sesaat (opsional, bisa dihapus)
  setTimeout(() => {
    userData.value = {
      username: "Member GASNGO",
      email: "member@gasngo.com",
      image: defaultAvatar, // Nanti akan diganti foto dari database
    };
  }, 500); // delay 0.5 detik
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <!-- Background utama menyesuaikan warna halaman lain agar konsisten -->
  <div class="bg-[#f7f9fb] min-h-screen">

    <!-- Wrapper Layout (Atas ke Bawah di HP, Kiri ke Kanan di Laptop) -->
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row pt-6 md:pt-10 pb-16 px-4 sm:px-6 lg:px-8 gap-6 md:gap-8">

      <!-- ================= BAGIAN KIRI: SIDEBAR USER ================= -->
      <!-- Di HP disembunyikan (bisa diganti dengan menu dropdown/burger menu nanti), di Laptop muncul (w-72) -->
      <div class="hidden lg:block w-72 flex-shrink-0">
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
