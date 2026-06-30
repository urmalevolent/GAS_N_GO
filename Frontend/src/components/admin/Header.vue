<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

// Default Avatar jika user tidak memiliki foto profil
import defaultAvatar from '@/assets/images/user_profile/default-avatar.png'

// -- STATE --
const isUserOpen = ref(false)
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => {
  if (!authStore.user) return null
  return {
    username: authStore.user.full_name || authStore.user.email.split('@')[0],
    role: authStore.isSuperAdmin ? 'Super Admin' : (authStore.isAdmin ? 'Administrator' : 'Customer'),
    email: authStore.user.email,
    avatar: authStore.user.avatar_url || ''
  }
})

// -- EVENT & PROPS --
const emit = defineEmits(['sidebar-open'])

defineProps({
  isSidebarOpen: Boolean
})

// -- DYNAMIC TITLE & SUBTITLE BASED ON ROUTE --
const pageTitle = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/dashboard')) return 'Main Dashboard'
  if (path.startsWith('/admin/users')) return 'Manage Users'
  if (path.startsWith('/admin/cars')) return 'Car Fleet'
  if (path.startsWith('/admin/rentals')) return 'Rental Management'
  if (path.startsWith('/admin/category')) return 'Car Categories'
  if (path.startsWith('/admin/transactions')) return 'Financial Transactions'
  if (path.startsWith('/admin/ratings')) return 'Reviews & Ratings'
  return 'Admin Panel'
})

const pageSubtitle = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/dashboard')) return 'GASNGO System Overview'
  if (path.startsWith('/admin/users')) return 'Manage Accounts & User Roles'
  if (path.startsWith('/admin/cars')) return 'Manage Car Data & Availability'
  if (path.startsWith('/admin/rentals')) return 'Incoming Vehicle Rental Orders'
  if (path.startsWith('/admin/category')) return 'Manage Car Class Categories'
  if (path.startsWith('/admin/transactions')) return 'Financial Transaction & Payment History'
  if (path.startsWith('/admin/ratings')) return 'Customer Ratings & Testimonials'
  return 'GASNGO Information System'
})

// -- METHODS --
// Toggle sidebar on mobile
const handleSidebar = () => {
  emit('sidebar-open')
}

// Toggle user profile dropdown
const toggleUserDropdown = () => {
  isUserOpen.value = !isUserOpen.value
}

// Logout with SweetAlert2 confirmation
const handleLogout = () => {
  isUserOpen.value = false
  Swal.fire({
    title: 'Sign Out?',
    text: 'Are you sure you want to sign out of the admin portal?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor: '#727687',
    confirmButtonText: 'Yes, Sign Out',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await authStore.signOut()
      if (!error) {
        Swal.fire({
          title: 'Signed Out',
          text: 'You have been successfully signed out.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        router.push('/')
      } else {
        Swal.fire({
          title: 'Failed',
          text: 'Sign out failed: ' + error.message,
          icon: 'error',
          confirmButtonColor: '#0050cb'
        })
      }
    }
  })
}

// Close dropdown when clicking outside
const closeOnClickOutside = (event) => {
  if (!event.target.closest('.user-dropdown-container')) {
    isUserOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <header class="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-[#c2c6d8]/30 h-20 px-4 md:px-8 flex items-center justify-between transition-all duration-300 shadow-sm shadow-[#191c1e]/5">

    <!-- Bagian Kiri: Tombol Hamburger (Mobile) & Judul (Desktop) -->
    <div class="flex items-center gap-4">
      <!-- Tombol Hamburger (Hanya muncul di layar HP/Tablet) -->
      <button
        @click="handleSidebar"
        class="lg:hidden p-2 rounded-lg text-[#424656] hover:bg-[#f2f4f6] transition-colors focus:outline-none active:scale-95"
      >
        <span v-if="!isSidebarOpen" class="material-symbols-outlined text-2xl">menu</span>
        <span v-else class="material-symbols-outlined text-2xl">close</span>
      </button>

      <!-- Judul Dinamis -->
      <div class="hidden md:flex flex-col animate-fadeIn">
        <h1 class="text-xl font-black tracking-tight text-[#191c1e] leading-none">{{ pageTitle }}</h1>
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687] mt-1.5">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Bagian Kanan: Profil User / Tombol Login -->
    <div class="relative ml-auto user-dropdown-container">

      <!-- Tampilan Jika User Login -->
      <div v-if="isAuthenticated && currentUser">
        <button @click="toggleUserDropdown" class="flex items-center gap-3 focus:outline-none group px-3 py-2 rounded-xl hover:bg-[#f2f4f6]/60 transition-all border border-transparent hover:border-[#c2c6d8]/20">
          <!-- Teks Nama & Role (Disembunyikan di layar sangat kecil) -->
          <div class="text-right hidden sm:block">
            <p class="text-[#191c1e] font-extrabold text-sm leading-none group-hover:text-[#0050cb] transition-colors">
              {{ currentUser.username }}
            </p>
            <p class="text-[9px] text-[#727687] font-black uppercase tracking-widest mt-1.5">
              {{ currentUser.role }}
            </p>
          </div>

          <!-- Avatar & Panah -->
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#f2f4f6] group-hover:border-[#0050cb]/60 transition-all shadow-sm">
              <img
                :src="currentUser.avatar || defaultAvatar"
                alt="User Avatar"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="material-symbols-outlined text-[#727687] text-[18px] transition-transform duration-300 group-hover:text-[#0050cb]" :class="{'rotate-180': isUserOpen}">
              expand_more
            </span>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <transition name="fade-slide">
          <div v-if="isUserOpen" class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 z-50 py-2 border border-[#c2c6d8]/30 overflow-hidden">

            <!-- Info Email Detail -->
            <div class="px-5 py-3 border-b border-[#f2f4f6] mb-1 bg-[#f7f9fb]/60 backdrop-blur-sm">
              <p class="text-[10px] uppercase tracking-widest text-[#727687] font-bold mb-0.5">Signed in as</p>
              <p class="text-xs font-bold text-[#191c1e] truncate">{{ currentUser.email }}</p>
            </div>

            <!-- List Menu Dropdown -->
            <RouterLink to="/" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#424656] hover:bg-[#0050cb]/5 hover:text-[#0050cb] transition-colors">
              <span class="material-symbols-outlined text-lg">language</span> Back to Website
            </RouterLink>

            <RouterLink to="/user/profile" class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#424656] hover:bg-[#0050cb]/5 hover:text-[#0050cb] transition-colors">
              <span class="material-symbols-outlined text-lg">person</span> My Profile
            </RouterLink>

            <hr class="my-1 border-[#f2f4f6]" />

            <button @click="handleLogout" class="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-[#ba1a1a] hover:bg-red-50 transition-colors">
              <span class="material-symbols-outlined text-lg">logout</span> Sign Out
            </button>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* Icon Settings */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Halus Dropdown */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
