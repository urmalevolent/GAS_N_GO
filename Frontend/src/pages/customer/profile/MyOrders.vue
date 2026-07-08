<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import RatingModal from '@/components/customer/RatingModal.vue';
import Swal from 'sweetalert2';

const authStore = useAuthStore();

// --- STATE ---
const loading = ref(false);
const isProcessing = ref(false);
const rentals = ref([]);
const hasPromptedRating = ref(false);
const isRatingModalOpen = ref(false);
const selectedRentalForRating = ref(null);
const isSubmittingRating = ref(false);

// Fetch data pesanan real dari Supabase
const fetchOrders = async () => {
  if (!authStore.isAuthenticated) return;
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, car:cars(*), rental_details(*), rental_payments(*), reviews(*)')
      .eq('user_id', authStore.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    rentals.value = (data || []).map(r => {
      const details = r.rental_details?.[0] || {};
      const payment = r.rental_payments?.[0] || {};
      
      // Hitung fallback harga secara dinamis jika tabel rental_payments belum terisi
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      const carPrice = r.car?.price_per_day || 0;
      const calcTotalPrice = days * carPrice;
      const calcDpAmount = (payment.payment_method || 'cash_with_dp') === 'full_transfer' ? calcTotalPrice : Math.round(calcTotalPrice * 0.15);

      return {
        id: r.id,
        car_id: r.car_id,
        car: {
          name: r.car?.name || 'Car',
          brand: r.car?.brand || 'Fleet',
          image_url: r.car?.image_url || '',
          id: r.car?.id
        },
        start_date: r.start_date,
        end_date: r.end_date,
        status: r.status, // pending_dp, dp_paid, active, completed, rejected, refunded
        pickup_time: details.pickup_time || null,
        payment_method: payment.payment_method || 'cash_with_dp',
        total_price: payment.total_price || calcTotalPrice,
        dp_amount: payment.dp_amount || calcDpAmount,
        address: details.address || '',
        phone_number: details.phone_number || '',
        midtrans_order_id: payment.midtrans_order_id || '',
        payment_status: payment.payment_status || 'pending',
        has_reviewed: r.reviews ? (Array.isArray(r.reviews) ? r.reviews.length > 0 : true) : false
      };
    });

    // Auto-popup logic for unrated completed orders
    const unratedCompleted = rentals.value.find(r => getMappedStatus(r) === 'completed' && !r.has_reviewed);
    if (unratedCompleted && !hasPromptedRating.value) {
      setTimeout(() => {
        openRatingModal(unratedCompleted);
        hasPromptedRating.value = true;
      }, 1000);
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

// Debounce helper to avoid multiple rapid fetches
let fetchTimeout = null;
const debouncedFetchOrders = () => {
  if (fetchTimeout) clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    fetchOrders();
  }, 300);
};

let realtimeChannel = null;

const setupRealtime = () => {
  if (realtimeChannel) return;
  
  realtimeChannel = supabase
    .channel('customer-orders-realtime')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'rentals', 
      filter: `user_id=eq.${authStore.user.id}` 
    }, () => {
      debouncedFetchOrders();
    })
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'rental_payments' 
    }, () => {
      debouncedFetchOrders();
    })
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'rental_details' 
    }, () => {
      debouncedFetchOrders();
    })
    .subscribe();
};

onMounted(() => {
  if (authStore.initialized) {
    fetchOrders();
    setupRealtime();
  } else {
    // Tunggu auth inisialisasi selesai jika dipanggil cepat
    const unwatch = authStore.$subscribe((mutation, state) => {
      if (state.initialized) {
        fetchOrders();
        setupRealtime();
        unwatch();
      }
    });
  }
});

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }
});

// Bayar Ulang (Retry Payment) untuk transaksi pending
const retryPayment = async (rental) => {
  isProcessing.value = true;
  try {
    const token = authStore.session?.access_token;
    
    // 1. Request token baru ke backend dengan order ID yang baru
    const response = await fetch(`http://localhost:5000/api/bookings/${rental.id}/pay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Failed to retry payment.');
    }

    const snapToken = resData.data.snap_token;

    // 2. Buka popup Snap
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function(result) {
          console.log('Retry Success:', result);
          try {
            await fetch(`http://localhost:5000/api/bookings/${rental.id}/confirm-payment`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) {
            console.error('Auto confirm error:', e);
          }
          await fetchOrders();
        },
        onPending: async function(result) {
          console.log('Retry Pending:', result);
          try {
            await fetch(`http://localhost:5000/api/bookings/${rental.id}/confirm-payment`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (e) {
            console.error('Auto confirm error:', e);
          }
          await fetchOrders();
        },
        onError: function(result) {
          console.error('Retry Error:', result);
          alert('Payment failed, please try again.');
        },
        onClose: function() {
          console.log('Retry popup closed');
          fetchOrders();
        }
      });
    } else {
      throw new Error('Midtrans Snap SDK is not loaded.');
    }

  } catch (err) {
    console.error('Retry payment error:', err);
    alert(err.message || 'An error occurred while contacting the payment server.');
  } finally {
    isProcessing.value = false;
  }
};

const openRatingModal = (rental) => {
  selectedRentalForRating.value = rental;
  isRatingModalOpen.value = true;
};

const submitRating = async (payload) => {
  if (!selectedRentalForRating.value) return;
  isSubmittingRating.value = true;
  
  try {
    const token = authStore.session?.access_token;
    const response = await fetch(`http://localhost:5000/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rental_id: selectedRentalForRating.value.id,
        car_id: selectedRentalForRating.value.car?.id || selectedRentalForRating.value.car_id, // ensure we pass car_id
        rating: payload.rating,
        comment: payload.comment
      })
    });

    const resData = await response.json();
    
    // We also accept 400 with 'sudah memberikan ulasan' as success basically because they can't rate anyway.
    if (!response.ok && resData.message !== 'Anda sudah memberikan ulasan untuk penyewaan ini.') {
      throw new Error(resData.message || 'Failed to submit review');
    }

    // Mark locally as reviewed
    const idx = rentals.value.findIndex(r => r.id === selectedRentalForRating.value.id);
    if (idx !== -1) {
      rentals.value[idx].has_reviewed = true;
    }
    
    isRatingModalOpen.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Thank you for your review!',
      confirmButtonColor: '#0050cb'
    });
    debouncedFetchOrders();
  } catch (error) {
    console.error('Error submitting review:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isSubmittingRating.value = false;
  }
};

const formatPrice = (p) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);
};

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- LOGIKA PROGRESS TRACKER (HORIZONTAL TIMELINE) ---
const STEPS = [
  { key: 'pending',   label: 'Ordered' },
  { key: 'dp_paid',   label: 'DP / Full Paid' },
  { key: 'active',    label: 'On the Way' },
  { key: 'rented',    label: 'Currently Rented' },
  { key: 'completed', label: 'Completed' },
];
const FLOW = STEPS.map(s => s.key);

const getMappedStatus = (rental) => {
  const status = rental.status === 'pending_dp' ? 'pending' : rental.status;
  if (status === 'active') {
    if (rental.pickup_time) {
      const now = new Date();
      // Combine end_date with time portion of pickup_time
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
};

const getSteps = (rental) => {
  const status = getMappedStatus(rental);
  const isRejected = ['rejected', 'refunded', 'cancelled'].includes(status);
  const currentIdx = FLOW.indexOf(status);

  return STEPS.map((s, i) => {
    return {
      ...s,
      done: isRejected ? i <= 1 : (status === 'completed' ? true : i < currentIdx),
      active: !isRejected && i === currentIdx && status !== 'completed',
    };
  });
};

const progressWidth = (rental) => {
  const status = getMappedStatus(rental);
  if (['rejected', 'refunded', 'cancelled'].includes(status)) return '25%';
  if (status === 'completed') return 'calc(100% - 32px)';
  const idx = FLOW.indexOf(status);
  return `${(idx / (FLOW.length - 1)) * 100}%`;
};

// --- HELPER STATUS & WARNA ---
const statusLabel = (rental) => {
  const s = rental.status;
  if (s === 'pending' || s === 'pending_dp') {
    return 'Awaiting Payment';
  }
  
  const mapped = getMappedStatus(rental);
  return {
    dp_paid:    'Awaiting Approval',
    active:     'On the Way',
    rented:     'Currently Rented',
    completed:  'Completed',
    rejected:   'Rejected',
    refunded:   'Refunded',
    cancelled:  'Cancelled'
  }[mapped] || mapped;
};

const statusClass = (rental) => {
  const s = rental.status;
  if (s === 'pending' || s === 'pending_dp') {
    return 'bg-orange-100 text-orange-700 border-orange-200';
  }
  
  const mapped = getMappedStatus(rental);
  return {
    dp_paid:    'bg-blue-100 text-blue-700 border-blue-200',
    active:     'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50',
    rented:     'bg-indigo-100 text-indigo-700 border-indigo-200',
    completed:  'bg-green-100 text-green-700 border-green-200',
    rejected:   'bg-red-100 text-red-700 border-red-200',
    refunded:   'bg-red-100 text-red-700 border-red-200',
    cancelled:  'bg-red-100 text-red-700 border-red-200',
  }[mapped] || 'bg-gray-100 text-gray-700 border-gray-200';
};

const dotClass = (rental) => {
  const s = rental.status;
  if (s === 'pending' || s === 'pending_dp') {
    return 'bg-orange-500';
  }
  
  const mapped = getMappedStatus(rental);
  return {
    dp_paid:    'bg-blue-500',
    active:     'bg-[#0050cb]',
    rented:     'bg-indigo-500',
    completed:  'bg-green-500',
    rejected:   'bg-red-500',
    refunded:   'bg-red-500',
    cancelled:  'bg-red-500',
  }[mapped] || 'bg-gray-400';
};

// --- TABS & FILTRATION ---
const activeTab = ref('active');

const activeRentals = computed(() => {
  return rentals.value.filter(r => ['pending_dp', 'pending', 'dp_paid', 'active'].includes(r.status));
});

const historyRentals = computed(() => {
  return rentals.value.filter(r => ['completed', 'rejected', 'refunded', 'cancelled'].includes(r.status));
});

const currentTabRentals = computed(() => {
  return activeTab.value === 'active' ? activeRentals.value : historyRentals.value;
});
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] bg-white h-full w-full p-6 md:p-8">

    <!-- Header Halaman -->
    <div class="mb-8 border-b border-[#c2c6d8]/40 pb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#191c1e]">My Orders</h1>
        <p class="text-[#727687] text-xs md:text-sm mt-1">Track status and history of your vehicle reservations in *real-time*.</p>
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

    <!-- Tab Navigation -->
    <div class="flex gap-4 mb-8 overflow-x-auto border-b border-[#c2c6d8]/40">
      <button
        @click="activeTab = 'active'"
        class="px-4 py-3 text-sm font-extrabold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap flex items-center gap-2"
        :class="activeTab === 'active' ? 'border-[#0050cb] text-[#0050cb]' : 'border-transparent text-[#727687] hover:text-[#191c1e]'">
        <span class="material-symbols-outlined text-[18px]">progress_activity</span> Active Orders
      </button>
      <button
        @click="activeTab = 'history'"
        class="px-4 py-3 text-sm font-extrabold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap flex items-center gap-2"
        :class="activeTab === 'history' ? 'border-[#0050cb] text-[#0050cb]' : 'border-transparent text-[#727687] hover:text-[#191c1e]'">
        <span class="material-symbols-outlined text-[18px]">history</span> Order History
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-center">
      <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-4">sync</span>
      <h3 class="text-sm font-bold text-[#727687] uppercase tracking-widest">Loading your orders...</h3>
    </div>

    <!-- Data Kosong -->
    <div v-else-if="currentTabRentals.length === 0" class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#c2c6d8]/50 rounded-[2rem]">
      <span class="material-symbols-outlined text-6xl text-[#c2c6d8] mb-4">directions_car</span>
      <h3 class="text-xl font-bold text-[#191c1e]">
        {{ activeTab === 'active' ? 'No Active Orders' : 'Order History Empty' }}
      </h3>
      <p class="text-[#727687] mt-2 text-sm max-w-md">
        {{ activeTab === 'active' 
            ? 'You have no ongoing vehicle rentals at the moment. Start exploring our fleet!' 
            : 'You have not completed any vehicle reservations on GASNGO yet.' }}
      </p>
      <router-link v-if="activeTab === 'active'" to="/cars" class="mt-8 bg-[#0050cb] hover:bg-[#0066ff] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#0050cb]/20 uppercase tracking-widest active:scale-95">
        Explore Fleet
      </router-link>
    </div>

    <!-- Daftar Pesanan -->
    <div v-else class="space-y-6">
      <div
        v-for="rental in currentTabRentals"
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
            <span :class="statusClass(rental)" class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border">
              <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(rental)"></span>
              {{ statusLabel(rental) }}
            </span>
            <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mt-2">ID: {{ rental.id }}</p>
          </div>
        </div>

        <!-- Progress Timeline (Alur Pesanan) -->
        <div class="p-5 md:p-6">
          <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-6">Reservation Status</p>

          <div class="relative max-w-2xl mx-auto">
            <!-- Background garis abu -->
            <div class="absolute top-4 left-4 right-4 h-0.5 bg-[#e0e3e5] z-0"></div>
            <!-- Garis biru progres (Animasi CSS inline) -->
            <div class="absolute top-4 left-4 h-0.5 bg-[#0050cb] z-0 transition-all duration-700" :style="{ width: progressWidth(rental) }"></div>

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
                  <p v-if="step.active" class="text-[9px] text-[#0050cb] font-black uppercase tracking-widest animate-pulse mt-0.5">Current</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alert Khusus: Selesaikan Pembayaran -->
          <div v-if="rental.status === 'pending' || rental.status === 'pending_dp'" class="mt-8 border-t border-[#f2f4f6] pt-6">
            <button @click="retryPayment(rental)" :disabled="isProcessing" class="w-full bg-[#0050cb] hover:bg-[#0066ff] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
              <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span v-else class="material-symbols-outlined text-[18px]">credit_card</span>
              {{ isProcessing ? 'Processing...' : 'Complete Payment Now' }}
            </button>
          </div>

          <!-- Alert Khusus: Persiapkan Sisa Dana (Muncul jika Aktif/Rented dan metode bayarnya DP) -->
          <div v-if="['active', 'rented'].includes(getMappedStatus(rental)) && (rental.total_price - rental.dp_amount) > 0"
               class="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-[#0050cb] text-2xl">info</span>
            <div>
              <p class="font-bold text-[#191c1e] text-sm">Prepare Remaining Balance</p>
              <p class="text-[#424656] text-xs mt-1">Please prepare the remaining balance of <strong class="text-[#0050cb]">{{ formatPrice(rental.total_price - rental.dp_amount) }}</strong> which must be paid upon vehicle return.</p>
            </div>
          </div>

          <!-- Alert Khusus: Selesai -->
          <div v-if="getMappedStatus(rental) === 'completed'"
               class="mt-8 bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-green-600 text-2xl">task_alt</span>
              <div>
                <p class="font-bold text-green-800 text-sm">Rental Completed!</p>
                <p class="text-green-700 text-xs mt-1">Thank you for choosing GASNGO. We hope your trip was satisfying.</p>
              </div>
            </div>
            
            <div class="shrink-0">
              <button 
                v-if="!rental.has_reviewed"
                @click="openRatingModal(rental)"
                class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[16px]">star_rate</span> Rate Now
              </button>
              <div v-else class="flex items-center gap-1.5 text-green-700 bg-green-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-green-200">
                <span class="material-symbols-outlined text-[16px] fill-current" style="font-variation-settings: 'FILL' 1;">star</span> Rated
              </div>
            </div>
          </div>

          <!-- Alert Khusus: Dibatalkan / Ditolak -->
          <div v-if="['rejected', 'cancelled'].includes(rental.status)"
               class="mt-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-red-600 text-2xl">cancel</span>
            <div>
              <p class="font-bold text-red-800 text-sm">Order Cancelled/Rejected</p>
              <p class="text-red-700 text-xs mt-1">This booking status has been cancelled by us or by you.</p>
            </div>
          </div>

          <!-- Ringkasan Finansial Bawah -->
          <div class="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            <div class="bg-[#f2f4f6] rounded-xl p-3 text-center border border-[#c2c6d8]/30">
              <p class="text-[9px] md:text-[10px] text-[#727687] font-bold uppercase tracking-widest">Total Bill</p>
              <p class="text-sm md:text-base font-black text-[#191c1e] mt-1">{{ formatPrice(rental.total_price) }}</p>
            </div>
            <div class="bg-[#e6eeff] rounded-xl p-3 text-center border border-[#b3c5ff]/50">
              <p class="text-[9px] md:text-[10px] text-[#0050cb] font-bold uppercase tracking-widest">{{ rental.payment_method === 'full_transfer' ? 'Paid in Full' : 'DP Paid' }}</p>
              <p class="text-sm md:text-base font-black text-[#0050cb] mt-1">{{ formatPrice(rental.dp_amount) }}</p>
            </div>
            <div class="bg-[#f2f4f6] rounded-xl p-3 text-center border border-[#c2c6d8]/30">
              <p class="text-[9px] md:text-[10px] text-[#727687] font-bold uppercase tracking-widest">Remaining Balance</p>
              <p class="text-sm md:text-base font-black text-[#191c1e] mt-1">{{ formatPrice(rental.total_price - rental.dp_amount) }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <!-- Rating Modal -->
    <RatingModal 
      :isOpen="isRatingModalOpen"
      :rental="selectedRentalForRating"
      :isSubmitting="isSubmittingRating"
      @close="isRatingModalOpen = false"
      @submit="submitRating"
    />
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
