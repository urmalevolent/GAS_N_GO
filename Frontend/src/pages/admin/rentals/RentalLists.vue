<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import { supabase } from '@/lib/supabase'
import RentalDetails from './RentalDetails.vue'

const activeTab = ref('transactions') 
const statusFilter = ref('all')       
const rentals = ref([])
const isLoading = ref(false)
const showDetail = ref(false)
const selectedRental = ref(null)

// Pilihan Filter Berdasarkan Status
const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'pending_dp', label: 'Waiting DP' },
  { value: 'dp_paid', label: 'DP Paid' },
  { value: 'active', label: 'On the Way' },
  { value: 'rented', label: 'Currently Rented' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected/Cancelled' },
]

// Fetch data sewa riil dari Supabase
const fetchRentals = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, car:cars(*), profile:profiles(*), rental_details(*), rental_payments(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    rentals.value = (data || []).map(r => {
      const details = r.rental_details?.[0] || {}
      const payment = r.rental_payments?.[0] || {}
      
      // Hitung durasi hari secara dinamis
      const start = new Date(r.start_date)
      const end = new Date(r.end_date)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1
      const carPrice = r.car?.price_per_day || 0
      const calcTotalPrice = days * carPrice
      const calcDpAmount = (payment.payment_method || 'cash_with_dp') === 'full_transfer' ? calcTotalPrice : Math.round(calcTotalPrice * 0.15)

      return {
        id: r.id,
        created_at: r.created_at,
        recipient_name: r.profile?.full_name || 'Pelanggan',
        recipient_phone: details.phone_number || r.profile?.phone_number || '-',
        shipping_address: details.address || '-',
        car_name: r.car?.name || 'Mobil',
        car_brand: r.car?.brand || 'Armada',
        car: r.car,
        start_date: r.start_date,
        end_date: r.end_date,
        status: r.status, 
        pickup_time: details.pickup_time || null,
        payment_method: payment.payment_method || 'cash_with_dp',
        total_price: payment.total_price || calcTotalPrice,
        dp_amount: payment.dp_amount || calcDpAmount,
        midtrans_order_id: payment.midtrans_order_id || '',
        payment_status: payment.payment_status || 'pending'
      }
    })
  } catch (err) {
    console.error('Error fetching rentals:', err)
    Swal.fire({ icon: 'error', title: 'Failed to load data', text: err.message })
  } finally {
    isLoading.value = false
  }
}

// Debounce helper to avoid multiple rapid fetches
let fetchTimeout = null
const debouncedFetchRentals = () => {
  if (fetchTimeout) clearTimeout(fetchTimeout)
  fetchTimeout = setTimeout(() => {
    fetchRentals()
  }, 300)
}

let realtimeChannel = null

onMounted(() => {
  fetchRentals()

  // Setup realtime subscription
  realtimeChannel = supabase
    .channel('admin-rentals-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, () => {
      debouncedFetchRentals()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rental_payments' }, () => {
      debouncedFetchRentals()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rental_details' }, () => {
      debouncedFetchRentals()
    })
    .subscribe()
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})

const getMappedStatus = (rental) => {
  const status = rental.status === 'pending_dp' ? 'pending' : rental.status;
  if (status === 'active') {
    if (rental.pickup_time) {
      const now = new Date();
      const timePart = rental.pickup_time.split('T')[1];
      const returnDate = new Date(`${rental.end_date}T${timePart}`);
      
      if (now >= returnDate) {
        return 'completed';
      }
      return 'rented';
    }
    return 'active';
  }
  return status;
}

// Filter Table Berdasarkan Status Pill (menangani pending & pending_dp, serta rejected & cancelled bersamaan)
const filteredRentals = computed(() => {
  if (statusFilter.value === 'all') return rentals.value
  if (statusFilter.value === 'pending_dp') {
    return rentals.value.filter(r => r.status === 'pending_dp' || r.status === 'pending')
  }
  if (statusFilter.value === 'rejected') {
    return rentals.value.filter(r => r.status === 'rejected' || r.status === 'cancelled')
  }
  return rentals.value.filter(r => getMappedStatus(r) === statusFilter.value)
})

// Menghitung jumlah per status (Untuk badge di Pill Filter)
const rentalCountByStatus = (val) => {
  if (val === 'all') return rentals.value.length
  if (val === 'pending_dp') {
    return rentals.value.filter(r => r.status === 'pending_dp' || r.status === 'pending').length
  }
  if (val === 'rejected') {
    return rentals.value.filter(r => r.status === 'rejected' || r.status === 'cancelled').length
  }
  return rentals.value.filter(r => getMappedStatus(r) === val).length
}

// Menghitung Total Pendapatan
const totalRevenue = computed(() => {
  return rentals.value
    .filter(r => ['dp_paid', 'active', 'completed'].includes(r.status) || getMappedStatus(r) === 'rented')
    .reduce((sum, r) => sum + r.dp_amount, 0)
})

// Formatting Harga Rupiah (IDR)
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

// Terjemahan & Warna Badge Status
const getStatusLabel = (rental) => {
  if (rental.status === 'pending' || rental.status === 'pending_dp') {
    return 'Awaiting Payment'
  }
  const mapped = getMappedStatus(rental);
  const labels = {
    'dp_paid': 'Awaiting Approval (DP)',
    'active': 'On the Way',
    'rented': 'Currently Rented',
    'completed': 'Completed',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled'
  }
  return labels[mapped] || mapped
}

const statusClass = (rental) => {
  const status = rental.status
  if (status === 'pending' || status === 'pending_dp') {
    return 'bg-orange-100 text-[#cc4204] border-[#cc4204]/30'
  }
  const mapped = getMappedStatus(rental);
  return {
    'dp_paid': 'bg-blue-100 text-[#0050cb] border-[#0050cb]/30',
    'active': 'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50',
    'rented': 'bg-indigo-100 text-indigo-750 border-indigo-300',
    'completed': 'bg-green-100 text-green-700 border-green-300',
    'rejected': 'bg-red-100 text-[#ba1a1a] border-[#ba1a1a]/30',
    'cancelled': 'bg-red-100 text-[#ba1a1a] border-[#ba1a1a]/30',
  }[mapped] || 'bg-gray-100 text-gray-600 border-gray-200'
}

// --- AKSI BUTTONS DENGAN UPDATE SUPABASE ---

// Approve Rental (ACC & Antar)
const handleApproveRental = (id) => {
  Swal.fire({
    title: 'Approve & Deliver Car?',
    text: "Status will be changed to 'On the Way'.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Approve & Deliver',
    cancelButtonText: 'Cancel'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const { error } = await supabase
          .from('rentals')
          .update({ status: 'active' })
          .eq('id', id)

        if (error) throw error

        const ord = rentals.value.find(o => o.id === id)
        if (ord) ord.status = 'active'
        Swal.fire({ icon: 'success', title: 'Approved!', text: 'Status changed to On the Way.', showConfirmButton: false, timer: 1500 })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to update status', text: err.message })
      }
    }
  })
}

// Start Rental (Serahkan Mobil / Sedang Disewa)
const handleStartRental = (rental) => {
  Swal.fire({
    title: 'Hand Over Car?',
    text: "Status will be changed to 'Currently Rented'.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Hand Over',
    cancelButtonText: 'Cancel'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const nowStr = new Date().toISOString()
        const { error } = await supabase
          .from('rental_details')
          .update({ pickup_time: nowStr })
          .eq('rental_id', rental.id)

        if (error) throw error

        rental.pickup_time = nowStr
        Swal.fire({ icon: 'success', title: 'Car Handed Over!', text: 'Status changed to Currently Rented.', showConfirmButton: false, timer: 1500 })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to update status', text: err.message })
      }
    }
  })
}

// Complete Rental
const handleCompleteRental = (id) => {
  Swal.fire({
    title: 'Vehicle Returned?',
    text: "Mark this reservation as completed.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Complete',
    cancelButtonText: 'Cancel'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const { error } = await supabase
          .from('rentals')
          .update({ status: 'completed' })
          .eq('id', id)

        if (error) throw error

        const ord = rentals.value.find(o => o.id === id)
        if (ord) ord.status = 'completed'
        Swal.fire({ icon: 'success', title: 'Completed!', showConfirmButton: false, timer: 1500 })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to update status', text: err.message })
      }
    }
  })
}

// Reject Rental
const handleRejectRental = (id) => {
  Swal.fire({
    title: 'Reject & Cancel Order?',
    text: "Status will be changed to 'Rejected'.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Reject',
    cancelButtonText: 'Cancel'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const { error } = await supabase
          .from('rentals')
          .update({ status: 'rejected' })
          .eq('id', id)

        if (error) throw error

        const ord = rentals.value.find(o => o.id === id)
        if (ord) ord.status = 'rejected'
        Swal.fire({ icon: 'success', title: 'Rejected!', text: 'Reservation has been rejected.', showConfirmButton: false, timer: 1500 })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to update status', text: err.message })
      }
    }
  })
}

// Cancel Rental (Pembatalan Pesanan oleh Admin)
const handleCancelRental = (id) => {
  Swal.fire({
    title: 'Cancel Reservation?',
    text: "Status will be changed to 'Cancelled'.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Cancel',
    cancelButtonText: 'Back'
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const { error } = await supabase
          .from('rentals')
          .update({ status: 'cancelled' })
          .eq('id', id)

        if (error) throw error

        const ord = rentals.value.find(o => o.id === id)
        if (ord) ord.status = 'cancelled'
        Swal.fire({ icon: 'success', title: 'Cancelled!', text: 'Reservation has been cancelled.', showConfirmButton: false, timer: 1500 })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed to cancel reservation', text: err.message })
      }
    }
  })
}



const openRentalDetail = (rental) => {
  selectedRental.value = rental
  showDetail.value = true
}
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] pb-24">

    <!-- ================= HEADER OVERVIEW ================= -->
    <div class="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-[#c2c6d8]/40 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Rental Overview</h1>
        <p class="text-[#727687] mt-1 text-sm">Manage your fleet and monitor incoming rental transactions.</p>
      </div>

      <!-- Stats Summary (Highlight Pendapatan) -->
      <div class="flex gap-4">
        <div class="bg-gradient-to-br from-[#003161] to-[#0050cb] text-white px-6 py-4 rounded-2xl shadow-md flex items-center gap-4 border border-[#0066ff]/20">
          <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/20">
            <span class="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-[#b3c5ff] mb-0.5">Total Revenue</p>
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
        <span class="material-symbols-outlined text-[18px]">receipt_long</span> Reservations
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
            <span class="material-symbols-outlined text-[#0050cb]">list_alt</span> Reservation Transaction List
          </h2>
          <!-- Refresh Button -->
          <button @click="fetchRentals" class="text-xs font-bold text-[#0050cb] hover:text-white bg-[#e6eeff] hover:bg-[#0050cb] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-widest border border-[#b3c5ff]/50 active:scale-95">
            <span class="material-symbols-outlined text-[16px]" :class="{ 'animate-spin': isLoading }">sync</span> Refresh
          </button>
        </div>

        <!-- Area Tabel (Responsive Scroll X) -->
        <div class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap min-w-[900px]">
            <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th class="py-4 px-6">CUSTOMER</th>
                <th class="py-4 px-6">VEHICLE</th>
                <th class="py-4 px-6">STATUS & ACTIONS</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="3" class="py-16 px-6 text-center text-[#727687]">
                  <span class="material-symbols-outlined animate-spin text-4xl block mb-2 text-[#0050cb]">sync</span>
                  <p class="mt-1 text-xs font-bold uppercase tracking-widest">Loading transaction data from database...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredRentals.length === 0">
                <td colspan="3" class="py-16 px-6 text-center text-[#727687]">
                  <span class="material-symbols-outlined text-4xl block mb-2 opacity-50">receipt_long</span>
                  <h3 class="text-base font-bold text-[#191c1e]">No Reservations</h3>
                  <p class="mt-1 text-xs">No orders match the selected status filter.</p>
                </td>
              </tr>

               <!-- Looping Data Rental -->
              <tr v-else v-for="rental in filteredRentals" :key="rental.id" class="hover:bg-blue-50/30 transition-colors">

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
                    <span :class="statusClass(rental)" class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border whitespace-nowrap">
                      {{ getStatusLabel(rental) }}
                    </span>

                    <!-- Lencana Metode Pembayaran -->
                    <span class="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border"
                      :class="rental.payment_method === 'cash_with_dp' ? 'bg-[#f2f4f6] text-[#424656] border-[#c2c6d8]/50' : 'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50'">
                      {{ rental.payment_method === 'cash_with_dp' ? 'PAY DP' : 'PAID (TRANSFER)' }}
                    </span>

                    <div class="w-px h-5 bg-[#c2c6d8]/50 mx-1"></div> <!-- Pembatas Garis -->

                    <!-- Tombol Detail (Biru Laut) -->
                    <button @click="openRentalDetail(rental)" title="Lihat Rincian"
                      class="px-3 py-1.5 bg-[#f2f4f6] text-[#424656] hover:bg-[#e6eeff] hover:text-[#0050cb] hover:border-[#0050cb] font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors border border-transparent flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">visibility</span> DETAIL
                    </button>


                    <!-- Tombol Approve (Hijau) -->
                    <button v-if="rental.status === 'dp_paid'" @click="handleApproveRental(rental.id)" title="ACC & Antar Mobil"
                      class="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400 border border-green-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">check</span> APPROVE & DELIVER
                    </button>

                    <!-- Tombol Serahkan Mobil (Mulai Sewa) -->
                    <button v-if="getMappedStatus(rental) === 'active'" @click="handleStartRental(rental)" title="Serahkan Mobil ke Pelanggan"
                      class="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 border border-indigo-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">handshake</span> HAND OVER
                    </button>

                    <!-- Tombol Selesai (Biru Tua) -->
                    <button v-if="getMappedStatus(rental) === 'rented'" @click="handleCompleteRental(rental.id)" title="Tandai Dikembalikan"
                      class="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 border border-blue-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">done_all</span> COMPLETE
                    </button>

                    <!-- Tombol Reject/Tolak (Merah) -->
                    <button v-if="rental.status === 'dp_paid'" @click="handleRejectRental(rental.id)" title="Tolak Pesanan"
                      class="px-3 py-1.5 bg-red-50 text-[#ba1a1a] hover:bg-red-100 hover:border-red-400 border border-red-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">close</span> REJECT
                    </button>

                    <!-- Tombol Cancel/Batalkan (Merah) -->
                    <button v-if="['pending', 'pending_dp', 'active'].includes(rental.status)" @click="handleCancelRental(rental.id)" title="Batalkan Pesanan"
                      class="px-3 py-1.5 bg-red-50 text-[#ba1a1a] hover:bg-red-100 hover:border-red-400 border border-red-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">close</span> CANCEL
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Detail Reservasi -->
    <RentalDetails
      :show="showDetail"
      :order-data="selectedRental"
      @close="showDetail = false"
    />

  </div>
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
</style>
