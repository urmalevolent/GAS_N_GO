<script setup>
// 1. IMPORT KOMPONEN BOOKING (Dari folder pages)
import Booking from '@/pages/customer/Booking.vue';
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const isBookingModalOpen = ref(false);
const showReviewForm = ref(false);
const ratingValue = ref(0);
const reviewComment = ref('');
const isSubmittingRating = ref(false);
const reviews = ref([]);
const isLoadingReviews = ref(false);

const authStore = useAuthStore();
const router = useRouter();

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

const handleReservation = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
    return
  }
  
  if (authStore.user?.account_status === 'unverified') {
    Swal.fire({
      icon: 'warning',
      title: 'Verification Required',
      text: 'You must verify your ID card (KTP) before you can book a rental.',
      confirmButtonText: 'Go to Profile',
      confirmButtonColor: '#0050cb',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        close()
        router.push('/profile')
      }
    })
    return
  }

  if (authStore.user?.account_status === 'rejected') {
    Swal.fire({
      icon: 'error',
      title: 'Verification Rejected',
      text: 'Your previous KTP verification was rejected. Please re-upload your KTP in your profile.',
      confirmButtonText: 'Go to Profile',
      confirmButtonColor: '#ba1a1a',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        close()
        router.push('/profile')
      }
    })
    return
  }

  if (authStore.user?.account_status === 'pending') {
    Swal.fire({
      icon: 'info',
      title: 'Verification Pending',
      text: 'Your KTP verification is currently being reviewed by our admin. Please try again later.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0050cb'
    })
    return
  }

  isBookingModalOpen.value = true
}

const openRatingModal = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal();
    return;
  }
  showReviewForm.value = !showReviewForm.value;
};

const submitRating = async () => {
  if (ratingValue.value === 0) {
    alert('Silakan berikan rating (bintang) terlebih dahulu.');
    return;
  }
  if (!reviewComment.value.trim()) {
    alert('Ulasan teks (review) wajib diisi.');
    return;
  }

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
        car_id: props.carDetail?.id,
        rating: ratingValue.value,
        comment: reviewComment.value
      })
    });

    const resData = await response.json();
    
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to submit review');
    }

    showReviewForm.value = false;
    ratingValue.value = 0;
    reviewComment.value = '';
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Thank you for reviewing this car.',
      confirmButtonColor: '#0050cb'
    });
    fetchReviews(); // Refresh reviews
  } catch (error) {
    console.error('Error submitting review:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'An error occurred.',
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isSubmittingRating.value = false;
  }
};

const fetchReviews = async () => {
  if (!props.carDetail?.id) return;
  isLoadingReviews.value = true;
  try {
    const res = await fetch(`http://localhost:5000/api/reviews/car/${props.carDetail.id}`);
    const data = await res.json();
    if (data.success) {
      reviews.value = data.data || [];
    }
  } catch (err) {
    console.error('Error fetching reviews:', err);
  } finally {
    isLoadingReviews.value = false;
  }
};

watch(() => props.show, (newVal) => {
  if (newVal && props.carDetail?.id) {
    fetchReviews();
  }
});

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
              Image not available
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
                  {{ carDetail?.category_name || 'Grand Tourer Series' }}
                </span>
                <span class="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Available
                </span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
                {{ carDetail?.name || 'Vehicle Name' }}
              </h2>
              <p class="text-white/80 text-sm sm:text-base font-bold uppercase tracking-widest">
                {{ carDetail?.brand_name || 'VehicleBrand' }}
              </p>
            </div>
          </div>

          <!-- ================= BAGIAN TENGAH: DETAIL & SPESIFIKASI ================= -->
          <div class="p-6 sm:p-8 overflow-y-auto flex-grow bg-white custom-scrollbar">

            <div class="mb-8">
              <h3 class="text-xl font-extrabold text-[#191c1e] mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-[#0050cb]">diamond</span>
                Vehicle Overview
              </h3>
              <p class="text-[#424656] text-sm sm:text-base leading-relaxed">
                {{ carDetail?.description || 'Uncompromising power meets artisanal luxury. The pinnacle of automotive engineering masterpieces, now available for your exclusive journey.' }}
              </p>
            </div>

            <!-- Spesifikasi Bento-Grid Style -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">calendar_today</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Year</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.year || '-' }}</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">settings</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Transmission</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.transmission || '-' }}</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">airline_seat_recline_extra</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Capacity</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.seats || '-' }} Seats</span>
              </div>

              <div class="bg-[#f7f9fb] rounded-2xl p-4 border border-[#c2c6d8]/40 shadow-sm flex flex-col justify-center">
                <span class="material-symbols-outlined text-[#0050cb] mb-2 text-[20px]">local_gas_station</span>
                <span class="block text-[#727687] text-[10px] font-bold uppercase tracking-widest mb-1">Fuel</span>
                <span class="block text-[#191c1e] font-extrabold text-sm truncate">{{ carDetail?.fuel || '-' }}</span>
              </div>
            </div>

            <!-- Galeri Ekstra -->
            <div class="grid grid-cols-2 gap-4" v-if="carDetail?.image_2 || carDetail?.image_3">
              <div v-if="carDetail?.image_2" class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm border border-[#c2c6d8]/30">
                <img :src="carDetail.image_2" alt="Exterior Detail" class="w-full h-full object-cover">
              </div>
              <div v-if="carDetail?.image_3" class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm border border-[#c2c6d8]/30">
                <img :src="carDetail.image_3" alt="Interior Detail" class="w-full h-full object-cover">
              </div>
            </div>

            <!-- ================= USER REVIEWS SECTION ================= -->
            <div class="mt-12 pt-8 border-t border-[#c2c6d8]/40">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-extrabold text-[#191c1e] flex items-center gap-2">
                  <span class="material-symbols-outlined text-yellow-500" style="font-variation-settings: 'FILL' 1;">star</span>
                  Customer Reviews
                </h3>
                <button 
                  @click="openRatingModal"
                  :class="showReviewForm ? 'bg-[#ba1a1a] hover:bg-red-700' : 'bg-[#0050cb] hover:bg-[#0066ff]'"
                  class="text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                  {{ showReviewForm ? 'Cancel Review' : 'Rate this Car' }}
                </button>
              </div>

              <!-- Form Review Inline -->
              <div v-if="showReviewForm" class="bg-[#f7f9fb] p-6 rounded-2xl border border-[#0050cb]/30 mb-8 shadow-sm">
                <h4 class="text-sm font-extrabold text-[#191c1e] mb-4 uppercase tracking-widest">Write a Review</h4>
                
                <!-- Bintang -->
                <div class="mb-5 flex flex-col gap-2">
                  <label class="text-xs font-bold text-[#727687] uppercase tracking-widest">Select Rating <span class="text-red-500">*</span></label>
                  <div class="flex gap-2 text-3xl text-yellow-400">
                    <button 
                      v-for="i in 5" 
                      :key="i"
                      @click="ratingValue = i"
                      class="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <span class="material-symbols-outlined text-[32px]" :style="i <= ratingValue ? 'font-variation-settings: \'FILL\' 1' : 'font-variation-settings: \'FILL\' 0'">star</span>
                    </button>
                  </div>
                </div>

                <!-- Textarea -->
                <div class="mb-5">
                  <label class="block text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Leave a Comment <span class="text-red-500">*</span></label>
                  <textarea 
                    v-model="reviewComment"
                    rows="3"
                    placeholder="Tell us what you loved or what could be better..."
                    class="w-full bg-white border border-[#c2c6d8]/50 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all resize-none text-[#191c1e]"
                    :disabled="isSubmittingRating"
                    required
                  ></textarea>
                </div>

                <button 
                  @click="submitRating"
                  :disabled="isSubmittingRating || ratingValue === 0 || !reviewComment.trim()"
                  class="bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <span v-if="isSubmittingRating" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  <span v-else class="material-symbols-outlined text-[18px]">send</span>
                  Submit Review
                </button>
              </div>

              <!-- Loading State Reviews -->
              <div v-if="isLoadingReviews" class="text-center py-8">
                <span class="material-symbols-outlined animate-spin text-[#0050cb] text-3xl">sync</span>
              </div>
              
              <!-- Empty Reviews -->
              <div v-else-if="reviews.length === 0" class="text-center py-10 bg-[#f7f9fb] rounded-2xl border border-dashed border-[#c2c6d8]/50">
                <span class="material-symbols-outlined text-[#c2c6d8] text-4xl mb-2">forum</span>
                <p class="text-[#727687] text-sm font-bold">No reviews yet.</p>
                <p class="text-[#727687] text-xs mt-1">Be the first to review this car after renting!</p>
              </div>

              <!-- Review List -->
              <div v-else class="space-y-4">
                <div v-for="review in reviews" :key="review.id" class="bg-[#f7f9fb] p-5 rounded-2xl border border-[#c2c6d8]/30">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        <img v-if="review.profiles?.avatar_url" :src="review.profiles.avatar_url" class="w-full h-full object-cover" />
                        <span v-else class="material-symbols-outlined text-slate-400 w-full h-full flex items-center justify-center">person</span>
                      </div>
                      <div>
                        <p class="text-sm font-extrabold text-[#191c1e]">{{ review.profiles?.full_name || 'Verified User' }}</p>
                        <p class="text-[10px] text-[#727687] uppercase tracking-widest font-bold">
                          {{ new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex gap-0.5 text-yellow-400">
                      <span v-for="i in 5" :key="i" class="material-symbols-outlined text-[16px]" :style="i <= review.rating ? 'font-variation-settings: \'FILL\' 1' : 'font-variation-settings: \'FILL\' 0'">star</span>
                    </div>
                  </div>
                  <p class="text-[#424656] text-sm mt-3 leading-relaxed">"{{ review.comment }}"</p>
                </div>
              </div>
            </div>

          </div>

          <!-- ================= BAGIAN BAWAH: HARGA & TOMBOL ================= -->
          <div class="p-6 bg-[#f7f9fb] border-t border-[#c2c6d8]/40 flex flex-col sm:flex-row items-center justify-between rounded-b-[2rem] gap-4 sm:gap-0">
            <div class="w-full sm:w-auto text-center sm:text-left">
              <span class="text-[#727687] text-[10px] font-bold uppercase tracking-widest block mb-1">Daily Rental Rate</span>

              <!-- Jika Promo -->
              <div v-if="carDetail?.is_promotion" class="flex items-center justify-center sm:justify-start gap-2">
                <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(carDetail?.discount_price) }}</span>
                <span class="text-sm text-[#ba1a1a] line-through decoration-[#ba1a1a] font-bold opacity-80">{{ formatPrice(carDetail?.price) }}</span>
              </div>

              <!-- Jika Harga Normal -->
              <div v-else class="flex items-baseline justify-center sm:justify-start gap-1">
                <span class="text-2xl sm:text-3xl font-black text-[#191c1e]">{{ formatPrice(carDetail?.price || 1250) }}</span>
                <span class="text-[#727687] text-xs font-bold uppercase tracking-widest">/Day</span>
              </div>
            </div>

            <!-- TOMBOL MENGAKTIFKAN MODAL PRE-PAYMENT (Booking) -->
            <button
              @click="handleReservation"
              class="w-full sm:w-auto signature-gradient text-white px-8 py-3.5 md:py-4 rounded-xl transition-all font-bold text-sm uppercase tracking-widest shadow-lg shadow-[#0050cb]/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
            >
              Continue Reservation
              <span class="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- KOMPONEN MODAL BOOKING -->
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
