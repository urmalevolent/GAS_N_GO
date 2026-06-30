<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

// Avatar default
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png';

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeOrdersCount = ref(0);

// Gunakan profile user dari authStore (Pinia) yang riil
const currentUser = computed(() => {
  if (authStore.user) {
    return {
      username: authStore.user.full_name || authStore.user.email.split('@')[0],
      email: authStore.user.email,
      image: authStore.user.image_url || defaultAvatar
    };
  }
  return props.user || {
    username: 'Guest User',
    email: 'guest@example.com',
    image: defaultAvatar
  };
});

const handleImageError = (e) => {
  e.target.src = defaultAvatar;
};

// Hitung jumlah pesanan aktif dari database secara dinamis
const fetchActiveOrdersCount = async () => {
  if (!authStore.isAuthenticated) return;
  try {
    const { count, error } = await supabase
      .from('rentals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id)
      .in('status', ['pending_dp', 'pending', 'dp_paid', 'active']);

    if (!error) {
      activeOrdersCount.value = count || 0;
    }
  } catch (err) {
    console.error('Failed to fetch active orders count:', err);
  }
};

// Debounce helper to avoid multiple rapid fetches
let fetchTimeout = null;
const debouncedFetchCount = () => {
  if (fetchTimeout) clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    fetchActiveOrdersCount();
  }, 300);
};

let realtimeChannel = null;

const setupRealtime = () => {
  if (realtimeChannel) return;
  
  realtimeChannel = supabase
    .channel('sidebar-orders-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'rentals',
      filter: `user_id=eq.${authStore.user.id}`
    }, () => {
      debouncedFetchCount();
    })
    .subscribe();
};

onMounted(() => {
  if (authStore.initialized) {
    fetchActiveOrdersCount();
    setupRealtime();
  } else {
    const unwatch = authStore.$subscribe((mutation, state) => {
      if (state.initialized) {
        fetchActiveOrdersCount();
        setupRealtime();
        unwatch();
      }
    });
  }
});

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }
});

// Aksi keluar akun riil dengan konfirmasi SweetAlert
const handleLogout = () => {
  Swal.fire({
    title: 'Logout?',
    text: 'You must log in again to track and rent vehicles.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await authStore.signOut();
      Swal.fire({
        icon: 'success',
        title: 'Successfully Logged Out!',
        showConfirmButton: false,
        timer: 1500
      });
      router.push('/');
    }
  });
};
</script>

<template>
  <!-- Sidebar Container -->
  <aside class="flex flex-col w-full bg-white border border-[#c2c6d8]/30 rounded-2xl p-6 min-h-[600px] shadow-sm">

    <!-- Area Profil Header -->
    <div class="flex items-center gap-4 mb-8 pb-8 border-b border-[#c2c6d8]/40">
      <div class="shrink-0 rounded-full border-2 border-[#0050cb] p-0.5">
        <img
          :src="currentUser.image || defaultAvatar"
          alt="Profile Avatar"
          class="w-12 h-12 rounded-full object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="overflow-hidden">
        <p class="font-extrabold text-[#191c1e] truncate text-base" :title="currentUser.username">
          {{ currentUser.username }}
        </p>
        <p class="text-xs text-[#727687] truncate mt-0.5" :title="currentUser.email">
          {{ currentUser.email || 'No email provided' }}
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
        <span>My Profile</span>
      </RouterLink>

      <!-- PERUBAHAN: Link menuju /user/orders dan nama diubah menjadi My Orders -->
      <RouterLink
        to="/user/orders"
        class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm"
        :class="route.path.includes('/user/orders') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[20px]" :class="route.path.includes('/user/orders') ? 'text-[#0050cb]' : 'text-[#727687]'">local_shipping</span>
          <span>My Orders</span>
        </div>
        <span v-if="activeOrdersCount > 0" class="bg-[#0050cb] text-white text-[9px] px-2 py-0.5 rounded-full">{{ activeOrdersCount }}</span>
      </RouterLink>

      <RouterLink
        to="/user/review"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold text-sm"
        :class="route.path.includes('/user/review') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
      >
        <span class="material-symbols-outlined text-[20px]" :class="route.path.includes('/user/review') ? 'text-[#0050cb]' : 'text-[#727687]'">star</span>
        <span>My Reviews</span>
      </RouterLink>

    </nav>

    <!-- Tombol Keluar -->
    <div class="mt-auto pt-6 border-t border-[#c2c6d8]/40">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#ba1a1a] hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-bold text-sm"
      >
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span>Logout</span>
      </button>
    </div>

  </aside>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
