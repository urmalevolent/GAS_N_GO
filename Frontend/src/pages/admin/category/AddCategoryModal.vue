<script setup>
import { ref } from 'vue';

// 1. Props untuk mengontrol visibilitas modal dari komponen Induk (CategoryLists.vue)
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// 2. Emits untuk menutup modal atau mengirim data ke Induk
const emit = defineEmits(['close', 'create']);

const categoryName = ref('');
const categoryDesc = ref(''); // (Opsional) Saya tambahkan deskripsi agar UI tidak terlalu kosong

const close = () => {
  emit('close');
  // Reset form saat modal ditutup
  categoryName.value = '';
  categoryDesc.value = '';
};

const handleCreate = () => {
  if (!categoryName.value) {
    // Alert sederhana jika nama kategori kosong (Murni UI)
    alert("Nama kategori tidak boleh kosong!");
    return;
  }

  // Kirim data ke induk
  emit('create', categoryName.value);
  close();
};
</script>

<template>
  <transition name="modal-fade">
    <!-- Overlay Background -->
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center modal-blur-overlay px-4"
      @click.self="close"
    >
      <!-- Modal Content Box -->
      <div
        class="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-10 shadow-2xl shadow-[#0050cb]/10"
        style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <!-- Tombol Close (X) di pojok kanan atas -->
        <button
          @click="close"
          class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#f2f4f6] text-[#727687] hover:bg-[#ba1a1a] hover:text-white transition-colors duration-300"
          aria-label="Close"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <!-- Header Modal -->
        <div class="mb-8">
          <div class="w-12 h-12 bg-[#0050cb]/10 text-[#0050cb] rounded-2xl flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-2xl">category</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">Kategori Baru</h2>
          <p class="text-[11px] md:text-xs font-bold text-[#727687] uppercase tracking-widest mt-2">
            Tambahkan tipe klasifikasi armada GASNGO.
          </p>
        </div>

        <!-- Form Container (Bordered Box) -->
        <div class="border border-[#c2c6d8]/40 bg-[#f7f9fb]/50 rounded-[24px] p-6 md:p-8 mb-8 space-y-6">

          <!-- Input Nama Kategori -->
          <div>
            <label class="block text-[10px] md:text-xs font-black uppercase tracking-widest text-[#191c1e] mb-2">
              Nama Kategori <span class="text-[#ba1a1a]">*</span>
            </label>
            <div class="relative">
              <input
                v-model="categoryName"
                type="text"
                placeholder="Contoh: SUV Premium, Hypercar..."
                class="w-full px-5 py-3.5 bg-white border border-[#c2c6d8]/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] focus:border-[#0050cb] text-[#191c1e] text-sm font-bold placeholder-[#c2c6d8] transition-all"
              >
            </div>
          </div>

          <!-- Input Deskripsi (Opsional, untuk melengkapi estetika desain) -->
          <div>
            <label class="block text-[10px] md:text-xs font-black uppercase tracking-widest text-[#191c1e] mb-2">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              v-model="categoryDesc"
              rows="2"
              placeholder="Jelaskan karakteristik tipe armada ini..."
              class="w-full px-5 py-3 border border-[#c2c6d8]/60 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] focus:border-[#0050cb] text-[#424656] text-xs md:text-sm font-medium transition-all resize-none"
            ></textarea>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <button
            @click="handleCreate"
            class="w-full sm:w-auto flex-1 bg-gradient-to-br from-[#0050cb] to-[#0066ff] text-white text-xs md:text-sm font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-600/20 text-center"
          >
            Buat Kategori
          </button>

          <button
            @click="close"
            class="w-full sm:w-auto flex-1 bg-white text-[#424656] text-xs md:text-sm font-bold uppercase tracking-widest px-8 py-3.5 border border-[#c2c6d8] rounded-xl hover:bg-[#f2f4f6] transition duration-300 text-center"
          >
            Batal
          </button>
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

/* Animasi Muncul Membesar Lembut */
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
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Custom Glassmorphism Backdrop Overlay */
.modal-blur-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(25, 28, 30, 0.4); /* Gelap transparan agar elegan */
}
</style>
