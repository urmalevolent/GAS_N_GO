<script setup>
// 1. IMPORT KOMPONEN BOOKING (Dari folder pages)
import Booking from '@/pages/customer/Booking.vue';
import { ref } from 'vue';

const isBookingModalOpen = ref(false);

// 2. Menerima props dari komponen induk (Cars.vue)
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Data mobil yang dipilih untuk ditampilkan detailnya
  carDetail: {
    type: Object,
    default: null
  }
})

// 3. Emits untuk komunikasi kembali ke komponen induk
const emit = defineEmits(['close', 'book'])

// 4. Fungsi Aksi
const close = () => {
  emit('close')
}

// 5. Helper: Format Dolar
const formatPrice = (price) => {
  if (!price) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <!-- BUNGKUS UTAMA: Pastikan hanya ada 1 elemen terluar (seperti <div>) yang sejajar dengan transition jika diperlukan, tapi dalam hal ini kita bungkus semuanya di sini -->
  <div>

    <!-- ================= MODAL DETAIL KENDARAAN ================= -->
    <transition name="modal-fade">
      <!-- Overlay Background (Latar Hitam Transparan & Blur) -->
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div
          class="absolute inset-0 bg-[#191c1e]/60 backdrop-blur-sm transition-opacity"
          @click="close"
        ></div>

        <!-- Kotak Modal Utama -->
        <div
          class="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] transform transition-all font-['Manrope'] text-[#191c1e]"
        >

          <!-- ================= BAGIAN ATAS: HERO IMAGE ================= -->
          <div class="relative h-64 sm:h-80 bg-[#f2f4f6]">
            <!-- Gambar Utama Mobil -->
            <img
              v-if="carDetail?.image"
              :src="carDetail.image"
              alt="Foto Kendaraan"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-[#727687] italic text-sm">
              Gambar tidak tersedia
            </div>

            <!-- Gradien Hitam di Bawah Teks agar mudah dibaca -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#191c1e]/90 via-[#191c1e]/40 to-transparent"></div>

            <!-- Tombol Close (X) -->
            <button
              @click="close"
              class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-[#ba1a1a] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>

            <!-- Teks Informasi Tumpang Tindih (Overlay) -->
            <div class="absolute bottom-6 left-8 right-8">
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-[#0050cb] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {{ carDetail?.category_name || 'Seri Grand Tourer' }}
                </span>
                <span class="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Tersedia
                </span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
                {{ carDetail?.name || 'Nama Kendaraan' }}
              </h2>
              <p class="text-white/80 text-sm sm:text-base font-bold uppercase tracking-widest">
                {{ carDetail?.brand_name || 'Merek Kendaraan' }}
              </p>
            </div>
          </div>

          <!-- ================= BAGIAN TENGAH: DETAIL & SPESIFIKASI ================= -->
          <div class="p-6 sm:p-8 overflow-y-auto flex-grow bg-white custom-scrollbar">

            <div class="mb-8">
              <h3 class="text-xl font-extrabold text-[#191c1e] mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0050cb]">diamond</span>
                Ikhtisar Kendaraan
              </h3>
              <p class="text-[#424656] text-sm sm:text-base leading-relaxed">
                {{ carDetail?.description || 'Tenaga tanpa kompromi berpadu dengan kemewahan artisanal. Puncak mahakarya teknik otomotif, kini tersedia untuk perjalanan eksklusif Anda.' }}
              </p>
            </div>

            <!-- Spesifikasi Bento-Grid Style -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">calendar_today</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Tahun</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.year || '-' }}</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">settings</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Transmisi</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.transmission || '-' }}</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">airline_seat_recline_extra</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Kapasitas</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.seats || '-' }} Kursi</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">local_gas_station</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Bahan Bakar</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.fuel || '-' }}</span>
              </div>
            </div>

            <!-- Galeri Ekstra -->
            <div class="grid grid-cols-2 gap-4" v-if="carDetail?.image_2 || carDetail?.image_3">
              <div v-if="carDetail?.image_2" class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm border border-[#c2c6d8]/30">
                <img :src="carDetail.image_2" alt="Detail Eksterior" class="w-full h-full object-cover">
              </div>
              <div v-if="carDetail?.image_3" class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm border border-[#c2c6d8]/30">
                <img :src="carDetail.image_3" alt="Detail Interior" class="w-full h-full object-cover">
              </div>
            </div>

          </div>

          <!-- ================= BAGIAN BAWAH: HARGA & TOMBOL ================= -->
          <div class="p-6 bg-[#f7f9fb] border-t border-[#c2c6d8]/40 flex flex-col sm:flex-row items-center justify-between rounded-b-[2rem] gap-4 sm:gap-0">
            <div class="w-full sm:w-auto text-center sm:text-left">
              <span class="text-[#727687] text-[10px] font-bold uppercase tracking-widest block mb-1">Tarif Sewa Harian</span>

              <!-- Jika Promo -->
              <div v-if="carDetail?.is_promotion" class="flex items-center justify-center sm:justify-start gap-2">
                <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(carDetail?.discount_price) }}</span>
                <span class="text-sm text-[#ba1a1a] line-through decoration-[#ba1a1a] font-bold opacity-80">{{ formatPrice(carDetail?.price) }}</span>
              </div>

              <!-- Jika Harga Normal -->
              <div v-else class="flex items-baseline justify-center sm:justify-start gap-1">
                <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(carDetail?.price || 1250) }}</span>
                <span class="text-[#727687] text-xs font-bold uppercase tracking-widest">/Hari</span>
              </div>
            </div>

            <!-- TOMBOL MENGAKTIFKAN MODAL PRE-PAYMENT (Booking) -->
            <button
              @click="isBookingModalOpen = true"
              class="w-full sm:w-auto signature-gradient text-white px-8 py-3.5 md:py-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest shadow-lg shadow-[#0050cb]/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
            >
              Lanjut Reservasi
              <span class="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- ================= PEMANGGILAN KOMPONEN MODAL BOOKING ================= -->
    <!-- PERUBAHAN: Diletakkan di dalam <template> -->
    <Booking
      :show="isBookingModalOpen"
      @close="isBookingModalOpen = false"
      :carData="carDetail"
    />

  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Biru GASNGO */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Custom Scrollbar Modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c2c6d8;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #727687;
}

/* Animasi Fade & Scale Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
