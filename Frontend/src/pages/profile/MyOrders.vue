<script setup>
import { ref, computed } from 'vue';

// --- MOCKUP STATE (Tanpa Backend) ---
const loading = ref(false);
const isProcessing = ref(false);

// Dummy Data Pesanan (Mirip struktur data di referensi Anda)
const rentals = ref([
  {
    id: 'LX-8892-TY',
    car: {
      name: 'Porsche Taycan',
      brand: 'Porsche',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5'
    },
    start_date: '2024-05-15',
    end_date: '2024-05-18',
    status: 'pending_dp', // Menunggu Pembayaran
    payment_method: 'cash_with_dp',
    total_price: 3750,
    dp_amount: 562.5
  },
  {
    id: 'LX-8871-FR',
    car: {
      name: 'Ferrari F8 Tributo',
      brand: 'Ferrari',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp'
    },
    start_date: '2024-05-10',
    end_date: '2024-05-11',
    status: 'active', // Sedang Disewa
    payment_method: 'full_transfer',
    total_price: 2450,
    dp_amount: 2450
  },
  {
    id: 'LX-8820-BM',
    car: {
      name: 'BMW M8 Gran Coupe',
      brand: 'BMW',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE'
    },
    start_date: '2024-04-01',
    end_date: '2024-04-03',
    status: 'completed', // Selesai
    payment_method: 'cash_with_dp',
    total_price: 2850,
    dp_amount: 427.5
  }
]);

// --- MOCKUP FUNCTIONS ---

const retryPayment = (rental) => {
  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    alert(`Simulasi pembayaran untuk Order #${rental.id} berhasil!`);
    rental.status = 'dp_paid';
  }, 1500);
};

const formatPrice = (p) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  }).format(p);
};

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- LOGIKA PROGRESS TRACKER (HORIZONTAL TIMELINE) ---
const STEPS = [
  { key: 'pending_dp', label: 'Dipesan' },
  { key: 'dp_paid',    label: 'Uang Muka/Lunas' },
  { key: 'active',     label: 'Aktif Disewa' },
  { key: 'completed',  label: 'Selesai' },
];
const FLOW = STEPS.map(s => s.key);

const getSteps = (rental) => {
  const status = rental.status;
  const isRejected = ['rejected', 'refunded'].includes(status);
  const currentIdx = FLOW.indexOf(status);

  return STEPS.map((s, i) => {
    return {
      ...s,
      done: isRejected ? i <= 1 : (status === 'completed' ? true : i < currentIdx),
      active: !isRejected && i === currentIdx && status !== 'completed',
    };
  });
};

const progressWidth = (status) => {
  if (['rejected', 'refunded'].includes(status)) return '33%';
  if (status === 'completed') return 'calc(100% - 32px)';
  const idx = FLOW.indexOf(status);
  return `${(idx / (FLOW.length - 1)) * 100}%`;
};

// --- HELPER STATUS & WARNA ---
const statusLabel = (s) => ({
  pending_dp: 'Menunggu Pembayaran',
  dp_paid:    'Menunggu Persetujuan',
  active:     'Sedang Digunakan',
  completed:  'Selesai',
  rejected:   'Ditolak',
  refunded:   'Dikembalikan',
}[s] || s);

const statusClass = (s) => ({
  pending_dp: 'bg-orange-100 text-orange-700 border-orange-200',
  dp_paid:    'bg-blue-100 text-blue-700 border-blue-200',
  active:     'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50',
  completed:  'bg-green-100 text-green-700 border-green-200',
  rejected:   'bg-red-100 text-red-700 border-red-200',
  refunded:   'bg-red-100 text-red-700 border-red-200',
}[s] || 'bg-gray-100 text-gray-700 border-gray-200');

const dotClass = (s) => ({
  pending_dp: 'bg-orange-500',
  dp_paid:    'bg-blue-500',
  active:     'bg-[#0050cb]',
  completed:  'bg-green-500',
  rejected:   'bg-red-500',
  refunded:   'bg-red-500',
}[s] || 'bg-gray-400');
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] bg-white h-full w-full p-6 md:p-8">

    <!-- Header Halaman -->
    <div class="mb-8 border-b border-[#c2c6d8]/40 pb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#191c1e]">Pesanan Aktif Saya</h1>
        <p class="text-[#727687] text-xs md:text-sm mt-1">Lacak status dan riwayat reservasi kendaraan Anda secara *real-time*.</p>
      </div>

      <!-- Lencana Live Tracking -->
      <div class="hidden md:flex items-center gap-2 bg-[#f2f4f6] px-4 py-2 rounded-full border border-[#c2c6d8]/30">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span class="text-[#424656] font-bold text-xs uppercase tracking-widest">Live Tracking</span>
      </div>
    </div>

    <!-- Data Kosong -->
    <div v-if="rentals.length === 0" class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#c2c6d8]/50 rounded-[2rem]">
      <span class="material-symbols-outlined text-6xl text-[#c2c6d8] mb-4">directions_car</span>
      <h3 class="text-xl font-bold text-[#191c1e]">Belum Ada Pesanan</h3>
      <p class="text-[#727687] mt-2 text-sm">Anda belum melakukan reservasi kendaraan apa pun. Mulai jelajahi armada kami!</p>
      <router-link to="/cars" class="mt-8 bg-[#0050cb] hover:bg-[#0066ff] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#0050cb]/20 uppercase tracking-widest active:scale-95">
        Jelajahi Armada
      </router-link>
    </div>

    <!-- Daftar Pesanan -->
    <div v-else class="space-y-6">
      <div
        v-for="rental in rentals"
        :key="rental.id"
        class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden hover:shadow-lg hover:border-[#0050cb]/30 transition-all duration-300"
      >
        <!-- Card Header (Info Singkat) -->
        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 p-5 md:p-6 bg-[#f7f9fb] border-b border-[#c2c6d8]/40">

          <!-- Foto Mobil -->
          <div class="w-full md:w-28 h-32 md:h-20 rounded-2xl bg-white border border-[#c2c6d8]/30 overflow-hidden shrink-0">
            <img v-if="rental.car?.image_url" :src="rental.car.image_url" :alt="rental.car?.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-[#727687]">
              <span class="material-symbols-outlined">image_not_supported</span>
            </div>
          </div>

          <!-- Info Mobil & Tanggal -->
          <div class="flex-grow min-w-0">
            <p class="text-[10px] font-black text-[#0050cb] uppercase tracking-widest mb-1">{{ rental.car?.brand }}</p>
            <h3 class="font-extrabold text-[#191c1e] text-lg leading-tight">{{ rental.car?.name }}</h3>
            <div class="flex items-center gap-2 mt-2 text-xs font-bold text-[#727687]">
              <span class="material-symbols-outlined text-[16px]">calendar_month</span>
              {{ formatDate(rental.start_date) }} &nbsp;<span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>&nbsp; {{ formatDate(rental.end_date) }}
            </div>
          </div>

          <!-- Badge Status & ID -->
          <div class="shrink-0 text-left md:text-right mt-2 md:mt-0">
            <span :class="statusClass(rental.status)" class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border">
              <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(rental.status)"></span>
              {{ statusLabel(rental.status) }}
            </span>
            <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mt-2">ID: {{ rental.id }}</p>
          </div>
        </div>

        <!-- Progress Timeline (Alur Pesanan) -->
        <div class="p-5 md:p-6">
          <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-6">Status Reservasi</p>

          <div class="relative max-w-2xl mx-auto">
            <!-- Background garis abu -->
            <div class="absolute top-4 left-4 right-4 h-0.5 bg-[#e0e3e5] z-0"></div>
            <!-- Garis biru progres (Animasi CSS inline) -->
            <div class="absolute top-4 left-4 h-0.5 bg-[#0050cb] z-0 transition-all duration-700" :style="{ width: progressWidth(rental.status) }"></div>

            <!-- Titik (Steps) -->
            <div class="relative z-10 flex justify-between">
              <div v-for="(step, idx) in getSteps(rental)" :key="idx" class="flex flex-col items-center gap-2 flex-1">

                <!-- Lingkaran Penanda -->
                <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white"
                     :class="step.done
                        ? 'bg-[#0050cb] border-[#0050cb] text-white shadow-md shadow-blue-500/20'
                        : step.active
                          ? 'border-[#0050cb] text-[#0050cb]'
                          : 'border-[#c2c6d8] text-[#c2c6d8]'">

                  <span v-if="step.done" class="material-symbols-outlined text-[16px]">check</span>
                  <span v-else-if="step.active" class="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  <span v-else class="w-2 h-2 rounded-full bg-[#c2c6d8]"></span>
                </div>

                <!-- Label Teks Bawah -->
                <div class="text-center px-1">
                  <p class="text-[10px] font-bold uppercase tracking-widest leading-tight"
                     :class="step.done || step.active ? 'text-[#191c1e]' : 'text-[#727687]'">
                    {{ step.label }}
                  </p>
                  <p v-if="step.active" class="text-[9px] text-[#0050cb] font-black uppercase tracking-widest animate-pulse mt-0.5">Saat Ini</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alert Khusus: Selesaikan Pembayaran (Hanya muncul jika Pending DP) -->
          <div v-if="rental.status === 'pending_dp'" class="mt-8 border-t border-[#f2f4f6] pt-6">
            <button @click="retryPayment(rental)" :disabled="isProcessing" class="w-full bg-[#0050cb] hover:bg-[#0066ff] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
              <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span v-else class="material-symbols-outlined text-[18px]">credit_card</span>
              {{ isProcessing ? 'Memproses...' : 'Selesaikan Pembayaran Sekarang' }}
            </button>
          </div>

          <!-- Alert Khusus: Persiapkan Sisa Dana (Muncul jika Aktif dan metode bayarnya DP) -->
          <div v-if="rental.status === 'active' && (rental.total_price - rental.dp_amount) > 0"
               class="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-[#0050cb] text-2xl">info</span>
            <div>
              <p class="font-bold text-[#191c1e] text-sm">Persiapkan Sisa Tagihan</p>
              <p class="text-[#424656] text-xs mt-1">Harap persiapkan sisa pelunasan sebesar <strong class="text-[#0050cb]">{{ formatPrice(rental.total_price - rental.dp_amount) }}</strong> yang wajib dibayarkan saat pengembalian kendaraan.</p>
            </div>
          </div>

          <!-- Alert Khusus: Selesai -->
          <div v-if="rental.status === 'completed'"
               class="mt-8 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-green-600 text-2xl">task_alt</span>
            <div>
              <p class="font-bold text-green-800 text-sm">Penyewaan Selesai!</p>
              <p class="text-green-700 text-xs mt-1">Terima kasih telah memilih GASNGO. Kami harap perjalanan Anda memuaskan.</p>
            </div>
          </div>

          <!-- Ringkasan Finansial Bawah -->
          <div class="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            <div class="bg-[#f2f4f6] rounded-xl p-3 text-center border border-[#c2c6d8]/30">
              <p class="text-[9px] md:text-[10px] text-[#727687] font-bold uppercase tracking-widest">Total Tagihan</p>
              <p class="text-sm md:text-base font-black text-[#191c1e] mt-1">{{ formatPrice(rental.total_price) }}</p>
            </div>
            <div class="bg-[#e6eeff] rounded-xl p-3 text-center border border-[#b3c5ff]/50">
              <p class="text-[9px] md:text-[10px] text-[#0050cb] font-bold uppercase tracking-widest">{{ rental.payment_method === 'full_transfer' ? 'Lunas' : 'DP Dibayar' }}</p>
              <p class="text-sm md:text-base font-black text-[#0050cb] mt-1">{{ formatPrice(rental.dp_amount) }}</p>
            </div>
            <div class="bg-[#f2f4f6] rounded-xl p-3 text-center border border-[#c2c6d8]/30">
              <p class="text-[9px] md:text-[10px] text-[#727687] font-bold uppercase tracking-widest">Sisa Hutang</p>
              <p class="text-sm md:text-base font-black text-[#191c1e] mt-1">{{ formatPrice(rental.total_price - rental.dp_amount) }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Material Icons */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Spin Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animasi Pulse untuk teks "Saat Ini" */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
