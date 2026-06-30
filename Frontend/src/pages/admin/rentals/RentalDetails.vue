<script setup>
import { ref, watch, computed } from 'vue';

// --- PROPS & EMITS ---
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // Menerima data singkat dari tabel parent
  orderData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

// --- STATE ---
const isLoading = ref(false);
const orderItems = ref([]); // Menyimpan detail armada yang disewa

const close = () => {
  emit('close');
  orderItems.value = []; // Reset saat ditutup
};

// --- FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const mappedStatus = computed(() => {
  if (!props.orderData) return '';
  const status = props.orderData.status === 'pending_dp' ? 'pending' : props.orderData.status;
  if (status === 'active') {
    if (props.orderData.pickup_time) {
      const now = new Date();
      const timePart = props.orderData.pickup_time.split('T')[1];
      const returnDate = new Date(`${props.orderData.end_date}T${timePart}`);
      
      if (now >= returnDate) {
        return 'completed';
      }
      return 'rented';
    }
    return 'active';
  }
  return status;
});

// Logika Mengambil item sewa ketika modal dibuka
watch(() => props.show, (isOpen) => {
  if (isOpen && props.orderData) {
    isLoading.value = true;

    // Simulasi delay singkat agar transisi loading terasa halus dan premium
    setTimeout(() => {
      // Hitung durasi hari secara dinamis
      const start = new Date(props.orderData.start_date);
      const end = new Date(props.orderData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

      orderItems.value = [
        {
          name: props.orderData.car_name || props.orderData.car?.name || 'Mobil',
          brand: props.orderData.car_brand || props.orderData.car?.brand || 'Armada',
          category: props.orderData.car?.category || 'Mobil Kota',
          duration: days,
          price_per_day: props.orderData.car?.price_per_day || 0,
          image: props.orderData.car?.image_url || ''
        }
      ];
      isLoading.value = false;
    }, 300);
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
              <h2 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight leading-none">Reservation Detail</h2>
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
              <span class="material-symbols-outlined text-[#0050cb] text-[18px]">person</span> Customer Data
            </h3>

            <div class="space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Customer Name</span>
                <span class="text-[#191c1e] font-extrabold text-sm">{{ orderData.recipient_name }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Phone Number</span>
                <span class="text-[#191c1e] font-bold text-sm">{{ orderData.recipient_phone }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Reservation Date</span>
                <span class="text-[#424656] font-medium text-sm">{{ formatDate(orderData.created_at) }}</span>
              </div>

              <div class="pt-3 border-t border-[#f2f4f6]">
                 <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687] mb-1.5 block">Delivery Address</span>
                 <p class="text-[#191c1e] text-sm font-medium leading-relaxed bg-[#f2f4f6] p-3 rounded-lg">{{ orderData.shipping_address }}</p>
              </div>
            </div>
          </div>


          <!-- 2. Detail Armada yang Disewa -->
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-[18px]">directions_car</span> Rented Vehicle
            </h3>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-6 text-[#727687]">
              <span class="material-symbols-outlined animate-spin text-3xl text-[#0050cb] mb-2">sync</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Loading fleet data...</span>
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
                      {{ item.duration }} Day(s)
                    </div>
                    <span class="text-sm font-black text-[#191c1e]">{{ formatPrice(item.price_per_day) }}<span class="text-[10px] text-[#727687] uppercase tracking-widest">/Day</span></span>
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
                 <span class="material-symbols-outlined text-[#0050cb] text-[18px]">payments</span> Payment Status
               </h3>

               <span v-if="orderData" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                  :class="{
                    'bg-orange-100 text-orange-700 border-orange-200': mappedStatus === 'pending',
                    'bg-blue-100 text-blue-700 border-blue-200': mappedStatus === 'dp_paid',
                    'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50': mappedStatus === 'active',
                    'bg-indigo-100 text-indigo-700 border-indigo-200': mappedStatus === 'rented',
                    'bg-green-100 text-green-700 border-green-200': mappedStatus === 'completed',
                    'bg-red-100 text-red-700 border-red-200': ['rejected', 'cancelled'].includes(mappedStatus)
                  }">
                 {{
                    mappedStatus === 'pending' ? 'AWAITING PAYMENT' :
                    mappedStatus === 'dp_paid' ? 'DP PAID (AWAITING APPROVAL)' :
                    mappedStatus === 'active' ? 'ON THE WAY' :
                    mappedStatus === 'rented' ? 'CURRENTLY RENTED' :
                    mappedStatus === 'completed' ? 'COMPLETED' : 'CANCELLED / REJECTED'
                 }}
               </span>
             </div>

             <!-- Total Bill -->
             <div class="bg-[#f7f9fb] p-4 rounded-xl border border-[#c2c6d8]/40 flex justify-between items-center">
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Estimated Total Bill</span>
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
