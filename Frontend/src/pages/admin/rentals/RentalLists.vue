<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

// --- MOCKUP STATE ---

const activeTab = ref('transactions') // Untuk simulasi Tab Navigasi atas (dari referensi May 26)
const statusFilter = ref('all')       // Untuk Filter Pill

// Dummy Data Pesanan (Sesuai Konteks Sewa Mobil)
const rentals = ref([
  {
    id: 'LX-8892-TY',
    recipient_name: 'Daniel Pratama',
    recipient_phone: '0812-3456-7890',
    car_name: 'Porsche Taycan',
    car_brand: 'Porsche',
    total_price: 1925,
    dp_amount: 562,
    status: 'dp_paid',
    payment_method: 'cash_with_dp'
  },
  {
    id: 'LX-8871-FR',
    recipient_name: 'Elena Rostova',
    recipient_phone: '0819-8765-4321',
    car_name: 'Ferrari F8 Tributo',
    car_brand: 'Ferrari',
    total_price: 2450,
    dp_amount: 2450,
    status: 'active',
    payment_method: 'full_transfer'
  },
  {
    id: 'LX-8820-BM',
    recipient_name: 'Ahmad Wijaya',
    recipient_phone: '0822-1122-3344',
    car_name: 'BMW M8 Gran Coupe',
    car_brand: 'BMW',
    total_price: 1900,
    dp_amount: 1900,
    status: 'pending',
    payment_method: 'full_transfer'
  },
  {
    id: 'LX-8999-AD',
    recipient_name: 'Clara Michelle',
    recipient_phone: '0813-3344-4555',
    car_name: 'Audi RS7 Performance',
    car_brand: 'Audi',
    total_price: 6000,
    dp_amount: 6000,
    status: 'completed',
    payment_method: 'full_transfer'
  }
])

// Pilihan Filter Berdasarkan Status
const statusFilters = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu Bayar' },
  { value: 'dp_paid', label: 'DP Dibayar' },
  { value: 'active', label: 'Aktif Disewa' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak/Batal' },
]

// --- MOCKUP FUNCTIONS ---

// Filter Table Berdasarkan Status Pill
const filteredRentals = computed(() => {
  if (statusFilter.value === 'all') return rentals.value
  return rentals.value.filter(r => r.status === statusFilter.value)
})

// Menghitung jumlah per status (Untuk badge di Pill Filter)
const rentalCountByStatus = (val) => {
  if (val === 'all') return rentals.value.length
  return rentals.value.filter(r => r.status === val).length
}

// Menghitung Total Pendapatan
const totalRevenue = computed(() => {
  // Hanya hitung yang aktif/selesai/dp dibayar
  return rentals.value
    .filter(r => ['dp_paid', 'active', 'completed'].includes(r.status))
    .reduce((sum, r) => sum + r.dp_amount, 0)
})

// Formatting Harga
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
}

// Terjemahan & Warna Badge Status
const getStatusLabel = (rental) => {
  const labels = {
    'pending': 'Menunggu Bayar',
    'dp_paid': 'Menunggu Persetujuan (DP)',
    'active': 'Sedang Disewa (Lunas)',
    'completed': 'Selesai',
    'rejected': 'Ditolak / Batal'
  }
  return labels[rental.status] || rental.status
}

const statusClass = (status) => {
  return {
    'bg-orange-100 text-[#cc4204] border-[#cc4204]/30': status === 'pending',
    'bg-blue-100 text-[#0050cb] border-[#0050cb]/30': status === 'dp_paid',
    'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50': status === 'active',
    'bg-green-100 text-green-700 border-green-300': status === 'completed',
    'bg-red-100 text-[#ba1a1a] border-[#ba1a1a]/30': status === 'rejected',
  }[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

// --- AKSI BUTTONS DENGAN SWEETALERT MOCKUP ---

// Approve Rental
const handleApproveRental = (id) => {
  Swal.fire({
    title: 'Setujui Reservasi?',
    text: "Status akan diubah menjadi 'Aktif Disewa'.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Setujui',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      const ord = rentals.value.find(o => o.id === id)
      if (ord) ord.status = 'active'
      Swal.fire({ icon: 'success', title: 'Disetujui!', showConfirmButton: false, timer: 1500 })
    }
  })
}

// Complete Rental
const handleCompleteRental = (id) => {
  Swal.fire({
    title: 'Kendaraan Dikembalikan?',
    text: "Tandai reservasi ini sebagai selesai.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Selesai',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      const ord = rentals.value.find(o => o.id === id)
      if (ord) ord.status = 'completed'
      Swal.fire({ icon: 'success', title: 'Selesai!', showConfirmButton: false, timer: 1500 })
    }
  })
}

// Reject Rental
const handleRejectRental = (id) => {
  Swal.fire({
    title: 'Tolak & Kembalikan Dana?',
    text: "Dana pelanggan akan dikembalikan secara sistem.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Ya, Tolak',
    cancelButtonText: 'Batal'
  }).then((res) => {
    if (res.isConfirmed) {
      const ord = rentals.value.find(o => o.id === id)
      if (ord) ord.status = 'rejected'
      Swal.fire({ icon: 'success', title: 'Ditolak!', text: 'Dana (DP) sedang dikembalikan.', showConfirmButton: false, timer: 2000 })
    }
  })
}

// Simulasi Detail Modal menggunakan SweetAlert
const openRentalDetail = (rental) => {
  Swal.fire({
    title: `Detail Pesanan ${rental.id}`,
    html: `
      <div class="text-left font-['Manrope'] text-sm space-y-3 mt-4">
        <p><strong>Pelanggan:</strong> ${rental.recipient_name} (${rental.recipient_phone})</p>
        <p><strong>Kendaraan:</strong> ${rental.car_name} (${rental.car_brand})</p>
        <p><strong>Metode Pembayaran:</strong> ${rental.payment_method === 'cash_with_dp' ? 'Cash (Bayar DP)' : 'Transfer Penuh'}</p>
        <p><strong>Total Tagihan:</strong> ${formatPrice(rental.total_price)}</p>
        <p><strong>Sudah Dibayar:</strong> <span class="text-[#0050cb] font-bold">${formatPrice(rental.dp_amount)}</span></p>
      </div>
    `,
    confirmButtonColor: '#0050cb',
    confirmButtonText: 'Tutup'
  })
}
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] pb-24">

    <!-- ================= HEADER OVERVIEW ================= -->
    <div class="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-[#c2c6d8]/40 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Ringkasan Dashboard</h1>
        <p class="text-[#727687] mt-1 text-sm">Kelola armada dan pantau laporan transaksi masuk Anda.</p>
      </div>

      <!-- Stats Summary (Highlight Pendapatan) -->
      <div class="flex gap-4">
        <div class="bg-gradient-to-br from-[#003161] to-[#0050cb] text-white px-6 py-4 rounded-2xl shadow-md flex items-center gap-4 border border-[#0066ff]/20">
          <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/20">
            <span class="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-[#b3c5ff] mb-0.5">Total Pendapatan</p>
            <p class="text-2xl font-black tracking-tighter leading-none">{{ formatPrice(totalRevenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= TABS NAVIGATION ================= -->
    <!-- Simulasi Tab ala "May 26", namun disesuaikan warna biru GASNGO -->
    <div class="flex gap-4 mb-8 overflow-x-auto border-b border-[#c2c6d8]/40">
      <button
        @click="activeTab = 'transactions'"
        class="px-4 py-3 text-sm font-extrabold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap flex items-center gap-2"
        :class="activeTab === 'transactions' ? 'border-[#0050cb] text-[#0050cb]' : 'border-transparent text-[#727687] hover:text-[#191c1e]'">
        <span class="material-symbols-outlined text-[18px]">receipt_long</span> Reservasi
      </button>
    </div>

    <!-- ================= TRANSACTIONS TAB (ISI UTAMA) ================= -->
    <div v-if="activeTab === 'transactions'" class="space-y-6">

      <!-- Status Filter Pills -->
      <div class="flex gap-2.5 flex-wrap">
        <button v-for="f in statusFilters" :key="f.value"
          @click="statusFilter = f.value"
          class="px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border"
          :class="statusFilter === f.value ? 'bg-[#0050cb] text-white border-[#0050cb] shadow-md shadow-blue-600/20' : 'bg-white text-[#424656] border-[#c2c6d8]/60 hover:border-[#0050cb] hover:text-[#0050cb]'">
          {{ f.label }} <span class="ml-1 opacity-70">({{ rentalCountByStatus(f.value) }})</span>
        </button>
      </div>

      <!-- Kotak Tabel -->
      <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col mt-4">

        <!-- Header Tabel Box -->
        <div class="px-6 py-5 border-b border-[#f2f4f6] flex justify-between items-center bg-[#f7f9fb]/50">
          <h2 class="text-lg font-extrabold text-[#191c1e] flex items-center gap-2">
            <span class="material-symbols-outlined text-[#0050cb]">list_alt</span> Daftar Transaksi Reservasi
          </h2>
          <!-- Refresh Mockup Button -->
          <button class="text-xs font-bold text-[#0050cb] hover:text-white bg-[#e6eeff] hover:bg-[#0050cb] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-widest border border-[#b3c5ff]/50 active:scale-95">
            <span class="material-symbols-outlined text-[16px]">sync</span> Segarkan
          </button>
        </div>

        <!-- Area Tabel (Responsive Scroll X) -->
        <div class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap min-w-[900px]">
            <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th class="py-4 px-6">PELANGGAN</th>
                <th class="py-4 px-6">KENDARAAN</th>
                <th class="py-4 px-6">STATUS & AKSI</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <!-- Empty State -->
              <tr v-if="filteredRentals.length === 0">
                <td colspan="3" class="py-16 px-6 text-center text-[#727687]">
                  <span class="material-symbols-outlined text-4xl block mb-2 opacity-50">receipt_long</span>
                  <h3 class="text-base font-bold text-[#191c1e]">Tidak Ada Reservasi</h3>
                  <p class="mt-1 text-xs">Belum ada pesanan yang cocok dengan filter status tersebut.</p>
                </td>
              </tr>

               <!-- Looping Data Rental -->
              <tr v-for="rental in filteredRentals" :key="rental.id" class="hover:bg-blue-50/30 transition-colors">

                <!-- 1. Pelanggan -->
                <td class="py-5 px-6">
                  <div class="flex items-center gap-4">
                    <!-- Avatar Inisial Bulat -->
                    <div class="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#0050cb] font-black text-sm uppercase shrink-0 border border-[#b3c5ff]/50">
                      {{ (rental.recipient_name || 'U').substring(0,2) }}
                    </div>
                    <div>
                      <div class="font-extrabold text-[#191c1e] text-sm">{{ rental.recipient_name }}</div>
                      <div class="text-[10px] font-bold text-[#727687] tracking-widest uppercase mt-0.5">{{ rental.recipient_phone }}</div>
                    </div>
                  </div>
                </td>

                <!-- 2. Kendaraan -->
                <td class="py-5 px-6">
                  <div class="font-bold text-[#191c1e] text-sm">{{ rental.car_name }}</div>
                  <div class="text-[10px] font-black text-[#0050cb] uppercase tracking-widest mt-0.5">{{ rental.car_brand }}</div>
                </td>

                <!-- 3. Status & Aksi -->
                <td class="py-5 px-6">
                  <div class="flex items-center gap-2 flex-wrap">

                    <!-- Status Lencana -->
                    <span :class="statusClass(rental.status)" class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border whitespace-nowrap">
                      {{ getStatusLabel(rental) }}
                    </span>

                    <!-- Lencana Metode Pembayaran -->
                    <span class="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border"
                      :class="rental.payment_method === 'cash_with_dp' ? 'bg-[#f2f4f6] text-[#424656] border-[#c2c6d8]/50' : 'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50'">
                      {{ rental.payment_method === 'cash_with_dp' ? 'BAYAR DP' : 'LUNAS (TRANSFER)' }}
                    </span>

                    <div class="w-px h-5 bg-[#c2c6d8]/50 mx-1"></div> <!-- Pembatas Garis -->

                    <!-- Tombol Detail (Biru Laut) -->
                    <button @click="openRentalDetail(rental)" title="Lihat Rincian"
                      class="px-3 py-1.5 bg-[#f2f4f6] text-[#424656] hover:bg-[#e6eeff] hover:text-[#0050cb] hover:border-[#0050cb] font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors border border-transparent flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">visibility</span> DETAIL
                    </button>

                    <!-- Tombol Approve (Hijau) -->
                    <button v-if="rental.status === 'dp_paid'" @click="handleApproveRental(rental.id)" title="Setujui Reservasi"
                      class="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400 border border-green-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">check</span> SETUJUI
                    </button>

                    <!-- Tombol Selesai (Biru Tua) -->
                    <button v-if="rental.status === 'active'" @click="handleCompleteRental(rental.id)" title="Tandai Dikembalikan"
                      class="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 border border-blue-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">done_all</span> SELESAI
                    </button>

                    <!-- Tombol Reject/Tolak (Merah) -->
                    <button v-if="rental.status === 'dp_paid'" @click="handleRejectRental(rental.id)" title="Tolak Pesanan"
                      class="px-3 py-1.5 bg-red-50 text-[#ba1a1a] hover:bg-red-100 hover:border-red-400 border border-red-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">close</span> TOLAK
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
