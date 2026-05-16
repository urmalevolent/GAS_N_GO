<script setup>
import { ref, watch } from 'vue';

// --- PROPS & EMITS ---
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Menerima data singkat dari tabel parent
  orderData: {
    type: Object,
    default: () => ({
      id: 'LX-8892-TY',
      created_at: '2024-05-10T08:30:00Z',
      recipient_name: 'Daniel Pratama',
      recipient_phone: '0812-3456-7890',
      shipping_address: 'Kawasan Elit Pondok Indah, Jakarta Selatan',
      status: 'active', // pending, active, completed, cancelled
      total_price: 1400,
    })
  }
});

const emit = defineEmits(['close']);

// --- MOCKUP STATE ---
const isLoading = ref(false);
const orderItems = ref([]); // Menyimpan detail armada yang disewa

const close = () => {
  emit('close');
  orderItems.value =[]; // Reset saat ditutup
};

// --- MOCKUP FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Logika Dummy: Mengambil item sewa ketika modal dibuka
watch(() => props.show, (isOpen) => {
  if (isOpen && props.orderData) {
    isLoading.value = true;

    // Simulasi delay API
    setTimeout(() => {
      orderItems.value =[
        {
          name: 'Porsche Taycan',
          brand: 'Porsche',
          category: 'Elektrik Mewah',
          duration: 3, // Hari
          price_per_day: 1250,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5'
        }
      ];
      isLoading.value = false;
    }, 600);
  }
});
</script>

<template>
  <transition name="modal-fade">
    <!-- Latar Belakang Gelap (Backdrop Blur) -->
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-sm"
      @click.self="close"
    >
      <!-- Kotak Modal Utama -->
      <div
        class="relative w-full max-w-2xl rounded-[24px] bg-[#f7f9fb] shadow-2xl shadow-black/20 overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
        style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <!-- HEADER MODAL (Fixed di Atas) -->
        <div class="flex justify-between items-center p-6 md:p-8 bg-white border-b border-[#f2f4f6] shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#0050cb]/10 text-[#0050cb] rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <div>
              <h2 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight leading-none">Detail Reservasi</h2>
              <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mt-1">ID: {{ orderData.id }}</p>
            </div>
          </div>
          <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-full bg-[#f2f4f6] text-[#727687] hover:bg-[#ba1a1a] hover:text-white transition-colors duration-300">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- KONTEN MODAL (Bisa di-scroll) -->
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">

          <!-- 1. Informasi Pemesan -->
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-[18px]">person</span> Data Pelanggan
            </h3>

            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Nama Pemesan</span>
                <span class="text-[#191c1e] font-extrabold text-sm">{{ orderData.recipient_name }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">No. Telepon</span>
                <span class="text-[#191c1e] font-bold text-sm">{{ orderData.recipient_phone }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Tanggal Reservasi</span>
                <span class="text-[#424656] font-medium text-sm">{{ formatDate(orderData.created_at) }}</span>
              </div>

              <div class="pt-3 border-t border-[#f2f4f6]">
                 <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687] mb-1.5 block">Alamat / Lokasi Pengantaran</span>
                 <p class="text-[#191c1e] text-sm font-medium leading-relaxed bg-[#f2f4f6] p-3 rounded-lg">{{ orderData.shipping_address }}</p>
              </div>
            </div>
          </div>

          <!-- 2. Detail Armada yang Disewa -->
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-[18px]">directions_car</span> Armada Disewa
            </h3>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-6 text-[#727687]">
              <span class="material-symbols-outlined animate-spin text-3xl text-[#0050cb] mb-2">sync</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Memuat data armada...</span>
            </div>

            <!-- List Kendaraan -->
            <div v-else class="space-y-4">
              <div v-for="(item, index) in orderItems" :key="index" class="flex flex-col sm:flex-row gap-4 p-4 border border-[#f2f4f6] bg-[#f7f9fb]/50 rounded-xl">

                <!-- Foto Kendaraan -->
                <div class="w-full sm:w-28 h-32 sm:h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-[#c2c6d8]/40">
                  <img :src="item.image" alt="Armada" class="w-full h-full object-cover">
                </div>

                <!-- Detail Kendaraan -->
                <div class="flex flex-col justify-center w-full">
                  <span class="text-[9px] font-black uppercase tracking-widest text-[#0050cb] mb-0.5">{{ item.category }} • {{ item.brand }}</span>
                  <h4 class="font-extrabold text-[#191c1e] text-base leading-tight mb-2">{{ item.name }}</h4>

                  <div class="flex flex-wrap items-center justify-between gap-2 mt-auto">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-[#424656] bg-white px-2 py-1 rounded border border-[#c2c6d8]/30">
                      <span class="material-symbols-outlined text-[14px]">event_available</span>
                      {{ item.duration }} Hari
                    </div>
                    <span class="text-sm font-black text-[#191c1e]">{{ formatPrice(item.price_per_day) }}<span class="text-[10px] text-[#727687] uppercase tracking-widest">/Hari</span></span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- 3. Status & Total Pembayaran -->
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">

             <!-- Status Reservasi -->
             <div class="flex justify-between items-center mb-5">
               <h3 class="font-extrabold text-[#191c1e] text-base flex items-center gap-2">
                 <span class="material-symbols-outlined text-[#0050cb] text-[18px]">payments</span> Status Pembayaran
               </h3>

               <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                  :class="{
                    'bg-orange-100 text-orange-700 border-orange-200': orderData.status === 'pending',
                    'bg-blue-100 text-blue-700 border-blue-200': orderData.status === 'active',
                    'bg-green-100 text-green-700 border-green-200': orderData.status === 'completed',
                    'bg-red-100 text-red-700 border-red-200': orderData.status === 'cancelled'
                  }">
                 {{
                    orderData.status === 'pending' ? 'MENUNGGU PEMBAYARAN' :
                    orderData.status === 'active' ? 'DISEWA (LUNAS)' :
                    orderData.status === 'completed' ? 'SELESAI' : 'DIBATALKAN'
                 }}
               </span>
             </div>

             <!-- Total Tagihan Akhir -->
             <div class="bg-[#f7f9fb] p-4 rounded-xl border border-[#c2c6d8]/40 flex justify-between items-center">
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Total Estimasi Tagihan</span>
                <span class="text-2xl md:text-3xl font-black tracking-tighter text-[#0050cb]">{{ formatPrice(orderData.total_price) }}</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Rotasi Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animasi Muncul Membesar Lembut (Pop-up) */
@keyframes scaleIn {
  0% { transform: scale(0.95) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
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

/* Custom Scrollbar Khusus untuk Konten Modal */
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
</style>
