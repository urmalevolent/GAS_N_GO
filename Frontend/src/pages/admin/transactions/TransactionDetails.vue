<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const transaction = ref(null)

const fetchTransactionDetails = () => {
  isLoading.value = true
  
  // Simulasi fetch data transaksi berdasarkan ID rute
  setTimeout(() => {
    transaction.value = {
      id: route.params.id || 'TX-8892-TY',
      created_at: '2026-06-10T08:30:00Z',
      rental_id: 'RNT-9981-XX',
      customer: {
        name: 'Daniel Pratama',
        email: 'daniel@example.com',
        phone: '0812-3456-7890'
      },
      car: {
        name: 'Porsche Taycan',
        brand: 'Porsche',
        plate_number: 'B 1234 ABC',
        price_per_day: 1250
      },
      payment: {
        total_price: 3750,
        dp_amount: 1000,
        method: 'Midtrans (Virtual Account)',
        status: 'SUCCESS',
        transaction_id: 'MID-TX-7761928'
      },
      rental_period: {
        start: '2026-06-12',
        end: '2026-06-15',
        duration: 3
      }
    }
    isLoading.value = false
  }, 500)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchTransactionDetails()
})
</script>

<template>
  <div class="space-y-6 pb-10">
    <div class="flex items-center gap-3">
      <button 
        @click="router.back()" 
        class="w-10 h-10 rounded-xl bg-white border border-[#c2c6d8]/40 hover:bg-[#0050cb] hover:text-white flex items-center justify-center transition-all shadow-sm"
      >
        <span class="material-symbols-outlined text-xl">arrow_back</span>
      </button>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-[#191c1e]">Detail Transaksi</h1>
        <p class="text-xs text-[#727687]">Informasi lengkap pembayaran dan detail rental.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#c2c6d8]/40">
      <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-3">sync</span>
      <span class="text-xs font-bold uppercase tracking-widest text-[#727687]">Memuat detail transaksi...</span>
    </div>

    <!-- Main Details -->
    <div v-else-if="transaction" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left side: Customer & Car Details -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Pelanggan & Kendaraan -->
        <div class="bg-white p-6 rounded-3xl border border-[#c2c6d8]/40 shadow-sm space-y-6">
          <div>
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-lg">person</span>
              Informasi Pelanggan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Nama Lengkap</p>
                <p class="text-sm font-extrabold text-[#191c1e] mt-1">{{ transaction.customer.name }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">No. Telepon</p>
                <p class="text-sm font-bold text-[#191c1e] mt-1">{{ transaction.customer.phone }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Email Address</p>
                <p class="text-sm font-medium text-[#191c1e] mt-1">{{ transaction.customer.email }}</p>
              </div>
            </div>
          </div>

          <hr class="border-[#f2f4f6]" />

          <div>
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-lg">directions_car</span>
              Detail Kendaraan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Nama Mobil / Brand</p>
                <p class="text-sm font-extrabold text-[#191c1e] mt-1">{{ transaction.car.brand }} {{ transaction.car.name }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Nomor Plat</p>
                <p class="text-sm font-bold text-[#191c1e] mt-1">{{ transaction.car.plate_number }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Biaya Sewa / Hari</p>
                <p class="text-sm font-extrabold text-[#0050cb] mt-1">{{ formatPrice(transaction.car.price_per_day) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Rental -->
        <div class="bg-white p-6 rounded-3xl border border-[#c2c6d8]/40 shadow-sm">
          <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-[#0050cb] text-lg">calendar_today</span>
            Periode Penyewaan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Tanggal Mulai</p>
              <p class="text-sm font-bold text-[#191c1e] mt-1">{{ transaction.rental_period.start }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Tanggal Selesai</p>
              <p class="text-sm font-bold text-[#191c1e] mt-1">{{ transaction.rental_period.end }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Total Durasi</p>
              <p class="text-sm font-extrabold text-[#191c1e] mt-1">{{ transaction.rental_period.duration }} Hari</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Right side: Payment Status & Summary -->
      <div class="space-y-6">
        
        <!-- Status & Rincian Pembayaran -->
        <div class="bg-white p-6 rounded-3xl border border-[#c2c6d8]/40 shadow-sm space-y-6">
          <div>
            <h3 class="font-extrabold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb] text-lg">credit_card</span>
              Status Pembayaran
            </h3>
            
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Status</span>
              <span 
                class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-green-100 text-green-700 border-green-200"
              >
                {{ transaction.payment.status }}
              </span>
            </div>
          </div>

          <hr class="border-[#f2f4f6]" />

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Metode</span>
              <span class="text-xs font-bold text-[#191c1e]">{{ transaction.payment.method }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">ID Transaksi</span>
              <span class="text-xs font-bold text-[#191c1e]">{{ transaction.payment.transaction_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Tanggal Bayar</span>
              <span class="text-xs font-bold text-[#191c1e]">{{ formatDate(transaction.created_at) }}</span>
            </div>
          </div>

          <hr class="border-[#f2f4f6]" />

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="font-bold text-[#727687]">DP Terbayar:</span>
              <span class="font-bold text-[#191c1e]">{{ formatPrice(transaction.payment.dp_amount) }}</span>
            </div>
            <div class="bg-[#f7f9fb] p-4 rounded-2xl border border-[#c2c6d8]/40 flex justify-between items-center">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#727687]">Total Biaya</span>
              <span class="text-xl font-black text-[#0050cb]">{{ formatPrice(transaction.payment.total_price) }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
