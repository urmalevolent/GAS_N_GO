<script setup>
import { computed } from 'vue';

// Props menerima data dari halaman daftar rating
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  commentData: {
    type: Object,
    default: () => ({
      username: 'Nama Pelanggan',
      avatar: null,
      rating: 5,
      text: 'Isi komentar pelanggan...',
      date: '2026-05-12'
    })
  }
});

const emit = defineEmits(['close']);
const close = () => emit('close');

// Fungsi untuk membuat inisial jika foto profil tidak ada
const userInitials = computed(() => {
  if (!props.commentData.username) return 'U';
  return props.commentData.username.substring(0, 2).toUpperCase();
});
</script>

<template>
  <transition name="modal-fade">
    <!-- Latar Belakang Gelap (Backdrop Blur) -->
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-sm" @click.self="close">

      <!-- Kotak Modal Utama -->
      <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl shadow-black/20 overflow-hidden border border-white/20" style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)">

        <!-- Header Modal -->
        <div class="flex justify-between items-center mb-6 border-b border-[#f2f4f6] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#0050cb]/10 text-[#0050cb] rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">reviews</span>
            </div>
            <h2 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight">
              Detail Ulasan
            </h2>
          </div>
          <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-full bg-[#f2f4f6] text-[#727687] hover:bg-[#ba1a1a] hover:text-white transition-colors duration-300">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Konten Detail -->
        <div class="space-y-6">

          <!-- Info Pengguna & Avatar -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#0050cb] font-black text-xl border-2 border-[#b3c5ff]/50 overflow-hidden shrink-0 shadow-sm">
              <img
                v-if="commentData.avatar"
                :src="commentData.avatar"
                alt="Profile"
                class="w-full h-full object-cover"
                @error="(e) => e.target.style.display = 'none'"
              >
              <span v-else>{{ userInitials }}</span>
            </div>

            <div class="flex flex-col justify-center">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687] mb-0.5">Akun Pelanggan</span>
              <h3 class="text-lg md:text-xl font-black text-[#191c1e] leading-none">{{ commentData.username }}</h3>
              <p class="text-[10px] font-bold text-[#424656] mt-1.5">{{ commentData.date || 'Tanggal tidak dicantumkan' }}</p>
            </div>
          </div>

          <!-- Rating Bar -->
          <div class="bg-[#f7f9fb] p-4 rounded-xl border border-[#c2c6d8]/40 flex justify-between items-center shadow-inner">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656]">Penilaian Diberikan</span>
            <div class="flex gap-1">
              <span
                v-for="i in 5"
                :key="i"
                class="material-symbols-outlined text-[22px] transition-colors"
                :class="i <= commentData.rating ? 'text-[#eab308]' : 'text-[#c2c6d8]/50'"
                :style="i <= commentData.rating ? 'font-variation-settings: \'FILL\' 1;' : 'font-variation-settings: \'FILL\' 0;'"
              >
                star
              </span>
            </div>
          </div>

          <!-- Pesan / Komentar -->
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687] block mb-2 px-1">Pesan Ulasan</span>
            <div class="bg-white border border-[#c2c6d8]/60 p-5 md:p-6 rounded-2xl shadow-sm relative">
              <!-- Ikon kutipan dekoratif -->
              <span class="material-symbols-outlined absolute top-3 left-3 text-4xl text-[#c2c6d8]/20 rotate-180" style="font-variation-settings: 'FILL' 1;">format_quote</span>

              <p class="text-[#191c1e] text-sm md:text-base leading-relaxed italic relative z-10 font-medium">
                "{{ commentData.text }}"
              </p>
            </div>
          </div>

        </div>

        <!-- Watermark Bawah -->
        <div class="mt-8 pt-4 border-t border-[#f2f4f6] text-center">
          <p class="text-[9px] font-black uppercase text-[#c2c6d8] tracking-widest">
            Sistem Ulasan Terpadu GASNGO
          </p>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Muncul Membesar Lembut (Pop-up modern) */
@keyframes scaleIn {
  0% {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Transisi Fade Bawaan Vue */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
