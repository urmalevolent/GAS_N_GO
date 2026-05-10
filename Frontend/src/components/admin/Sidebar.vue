<script setup>
import { useRoute } from 'vue-router'

// Pastikan file gambar ini ada di folder Anda
import logocars from "@/assets/images/racingcar.png"

const route = useRoute()

// Menerima props dari AdminLayout untuk kontrol buka-tutup di HP
defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: false
  }
})

// Mendefinisikan event untuk menutup sidebar saat link diklik (di HP)
const emit = defineEmits(['close'])

const closeSidebar = () => {
  emit('close')
}
</script>

<template>
  <!-- Sidebar Container -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#c2c6d8]/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col h-screen"
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo & Brand Header -->
    <div class="h-20 flex items-center px-6 border-b border-[#c2c6d8]/40 shrink-0">
      <RouterLink to="/" class="flex-shrink-0 flex items-center space-x-2 cursor-pointer group" @click="closeSidebar">
        <!-- Menampilkan Gambar Logo (Ukuran disamakan jadi h-10 w-10 + ada efek hover) -->
        <img :src="logocars" alt="Logo GASNGO" class="h-10 w-10 object-contain transition-transform group-hover:scale-110" />

        <!-- Teks Judul (Ketebalan dan warna font disamakan persis dengan Navbar) -->
        <span class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight">
          GASNGO
        </span>
      </RouterLink>
    </div>

    <!-- Menu Scrollable Area -->
    <div class="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">

      <!-- Section: DASHBOARD -->
      <div class="space-y-2">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#727687] px-3 mb-3">Utama</h3>

        <RouterLink
          to="/admin/dashboard"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path === '/admin/dashboard' ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path === '/admin/dashboard' ? 'text-[#0050cb]' : 'text-[#727687]'">dashboard</span>
          Dashboard
        </RouterLink>
      </div>

      <!-- Section: ACCOUNTS -->
      <div class="space-y-2">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#727687] px-3 mb-3">Pengguna</h3>

        <RouterLink
          to="/admin/accounts"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/accounts') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/accounts') ? 'text-[#0050cb]' : 'text-[#727687]'">manage_accounts</span>
          Users
        </RouterLink>
      </div>

      <!-- Section: PRODUCT & TRANSACTION -->
      <div class="space-y-2">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#727687] px-3 mb-3">Armada & Transaksi</h3>

        <RouterLink
          to="/admin/products"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/products') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/products') ? 'text-[#0050cb]' : 'text-[#727687]'">directions_car</span>
          Cars List
        </RouterLink>

        <RouterLink
          to="/admin/categories"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/categories') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/categories') ? 'text-[#0050cb]' : 'text-[#727687]'">category</span>
          Rentals
        </RouterLink>

        <RouterLink
          to="/admin/brands"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/brands') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/brands') ? 'text-[#0050cb]' : 'text-[#727687]'">workspace_premium</span>
          Category
        </RouterLink>

        <RouterLink
          to="/admin/transactions"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/transactions') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/transactions') ? 'text-[#0050cb]' : 'text-[#727687]'">receipt_long</span>
          Transactions
        </RouterLink>

        <RouterLink
          to="/admin/status"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all justify-between"
          :class="route.path.startsWith('/admin/status') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/status') ? 'text-[#0050cb]' : 'text-[#727687]'">local_shipping</span>
            Pesanan Aktif
          </div>
          <!-- Badge Notifikasi Dummy -->
          <span class="bg-[#0050cb] text-white text-[10px] font-black px-2 py-0.5 rounded-full">3</span>
        </RouterLink>
      </div>

      <!-- Section: TESTIMONIALS -->
      <div class="space-y-2">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#727687] px-3 mb-3">Tanggapan</h3>

        <RouterLink
          to="/admin/comments"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
          :class="route.path.startsWith('/admin/comments') ? 'bg-[#0050cb]/10 text-[#0050cb]' : 'text-[#424656] hover:bg-[#f2f4f6] hover:text-[#191c1e]'"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="route.path.startsWith('/admin/comments') ? 'text-[#0050cb]' : 'text-[#727687]'">reviews</span>
          Ulasan & Penilaian
        </RouterLink>
      </div>

    </div>
  </aside>
</template>

<style scoped>
/* Pengaturan Ikon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom Scrollbar agar tidak terlihat kaku */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e0e3e5;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #c2c6d8;
}
</style>
