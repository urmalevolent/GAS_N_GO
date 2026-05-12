<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Avatar default
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png';

const router = useRouter();
const route = useRoute();

// ✅ 1. Data user FULL frontend (tidak dari props/backend)
const user = ref({
  username: 'Guest User',
  email: 'guest@example.com',
  image: defaultAvatar
});

// Handle gambar error
const handleImageError = (e) => {
  e.target.src = defaultAvatar;
};

// ✅ 2. Logout frontend-only (reset state + redirect)
const handleLogout = () => {
  alert('Logout berhasil (Frontend Only)');

  // Reset user ke default
  user.value = {
    username: 'Guest',
    email: '',
    image: defaultAvatar
  };

  // Redirect ke halaman utama (opsional)
  router.push('/');
};
</script>

<template>
  <!-- Sidebar Container -->
  <aside class="flex flex-col w-full bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 min-h-[600px] shadow-sm">

    <!-- Area Profil Header -->
    <div class="flex items-center gap-4 mb-8 pb-8 border-b border-[#c2c6d8]/40">
      <div class="shrink-0 rounded-full border-2 border-[#0050cb] p-0.5">
        <img
          :src="user.image || defaultAvatar"
          alt="Profile Avatar"
          class="w-12 h-12 rounded-full object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="overflow-hidden">
        <p class="font-extrabold text-[#191c1e] truncate text-base" :title="user.username">
          {{ user.username }}
        </p>
        <p class="text-xs text-[#727687] truncate mt-0.5" :title="user.email">
          {{ user.email || 'Belum ada email' }}
        </p>
      </div>
    </div>

    <!-- Navigasi Menu Profil -->
    <nav class="space-y-2 flex-1">

      <RouterLink
        to="/user/profile"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm"
        :class="route.path.includes('/user/profile') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
      >
        <span class="material-symbols-outlined text-[20px]" :class="route.path.includes('/user/profile') ? 'text-[#0050cb]' : 'text-[#727687]'">person</span>
        <span>Profil Saya</span>
      </RouterLink>

      <RouterLink
        to="/user/cart"
        class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm"
        :class="route.path.includes('/user/cart') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[20px]" :class="route.path.includes('/user/cart') ? 'text-[#0050cb]' : 'text-[#727687]'">local_shipping</span>
          <span>Pesanan Aktif</span>
        </div>
        <span class="bg-[#0050cb] text-white text-[9px] px-2 py-0.5 rounded-full">1</span>
      </RouterLink>


      <RouterLink
        to="/user/review"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm"
        :class="route.path.includes('/user/review') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
      >
        <span class="material-symbols-outlined text-[20px]" :class="route.path.includes('/user/review') ? 'text-[#0050cb]' : 'text-[#727687]'">star</span>
        <span>Ulasan Saya</span>
      </RouterLink>

    </nav>

    <!-- Tombol Keluar -->
    <div class="mt-auto pt-6 border-t border-[#c2c6d8]/40">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#ba1a1a] hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-bold text-sm"
      >
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span>Keluar Akun</span>
      </button>
    </div>

  </aside>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
