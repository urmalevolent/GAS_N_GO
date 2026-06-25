<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const authStore = useAuthStore();

// --- PROPS & EMITS ---
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  carData: {
    type: Object,
    default: () => ({
      id: '',
      name: 'Porsche 911 Carrera',
      brand_name: 'Porsche',
      price: 1250,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl'
    })
  }
});

const emit = defineEmits(['close']);

// --- STATE ---
const isProcessing = ref(false);

const bookingForm = ref({
  startDate: '',
  endDate: '',
  address: '',
  paymentMethod: 'cash_with_dp'
});


// --- COMPUTED (Logika Visual) ---
const totalDays = computed(() => {
  if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 0;
  const start = new Date(bookingForm.value.startDate);
  const end = new Date(bookingForm.value.endDate);
  const diffTime = end - start;
  if (diffTime < 0) return 0;

  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
});

const totalPrice = computed(() => {
  return totalDays.value * (props.carData?.price || props.carData?.price_per_day || 0);
});

const dpAmount = computed(() => {
  return totalPrice.value * 0.15; // DP 15%
});

// --- FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const close = () => {
  emit('close');
  // Reset Form
  bookingForm.value = { startDate: '', endDate: '', address: '', paymentMethod: 'cash_with_dp' };
};


const processPayment = async () => {
  if (totalDays.value <= 0) return;
  if (!bookingForm.value.address.trim()) {
    alert('Mohon isi alamat pengiriman/penjemputan kendaraan terlebih dahulu.');
    return;
  }

  // 1. Pastikan pengguna sudah terautentikasi
  if (!authStore.isAuthenticated) {
    alert('Silakan masuk (login) terlebih dahulu untuk melanjutkan pemesanan.');
    close();
    authStore.openAuthModal();
    return;
  }

  isProcessing.value = true;

  try {
    const token = authStore.session?.access_token;
    const phone = authStore.user?.phone_number || authStore.user?.user_metadata?.phone_number || authStore.user?.profile?.phone_number || '081234567890';
    
    // Resolusi UUID mobil dari database jika yang diteruskan adalah ID mockup (integer atau string pendek)
    let finalCarId = props.carData?.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!finalCarId || !uuidRegex.test(String(finalCarId))) {
      console.log(`Resolving mockup car ID '${finalCarId}' by matching name '${props.carData?.name}'...`);
      const { data: realCars, error: lookupError } = await supabase
        .from('cars')
        .select('id')
        .ilike('name', `%${props.carData?.name}%`)
        .limit(1);

      if (lookupError) {
        console.error('Error looking up car UUID:', lookupError);
      } else if (realCars && realCars.length > 0) {
        finalCarId = realCars[0].id;
        console.log(`Resolved mockup car ID to UUID: ${finalCarId}`);
      } else {
        console.warn('No matching car found in database for name:', props.carData?.name);
      }
    }

    // 2. Hubungi Backend untuk membuat booking
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        car_id: finalCarId,
        start_date: bookingForm.value.startDate,
        end_date: bookingForm.value.endDate,
        address: bookingForm.value.address,
        phone_number: phone,
        payment_method: bookingForm.value.paymentMethod
      })
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Gagal memproses pemesanan.');
    }

    // 3. Berhasil membuat pemesanan, langsung arahkan ke pesanan saya (pembayaran setelah verifikasi KTP)
    isProcessing.value = false;
    close();
    router.push('/user/orders');

  } catch (error) {
    console.error('Booking Error:', error);
    alert(error.message || 'Terjadi kesalahan sistem saat menghubungi backend.');
    isProcessing.value = false;
  }
};
</script>

<template>
  <transition name="modal-fade">
    <!-- Latar Belakang Blur -->
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-[#191c1e]/60 backdrop-blur-sm" @click.self="close">

      <!-- Kotak Utama Modal -->
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[95vh] font-['Manrope'] text-[#191c1e] border border-white/20" style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)">

        <!-- ================= HEADER MODAL (GAMBAR MOBIL) ================= -->
        <div class="relative h-48 bg-[#f2f4f6]">
          <img v-if="carData?.image" :src="carData.image" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#191c1e]/90 to-transparent"></div>

          <!-- Tombol Close (X) -->
          <button @click="close" class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-[#ba1a1a] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>

          <!-- Teks Kendaraan -->
          <div class="absolute bottom-5 left-6">
            <p class="text-white/80 text-xs font-bold uppercase tracking-widest">{{ carData?.brand_name || 'Merek' }}</p>
            <h2 class="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-1">{{ carData?.name || 'Nama Kendaraan' }}</h2>
          </div>
        </div>

        <!-- ================= KONTEN FORM (SCROLLABLE) ================= -->
        <div class="p-6 sm:p-8 overflow-y-auto flex-grow bg-white custom-scrollbar">
          <div class="space-y-6">

            <!-- Input Tanggal -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  v-model="bookingForm.startDate"
                  class="w-full bg-[#f2f4f6] border border-transparent focus:border-[#0050cb] focus:bg-white focus:ring-1 focus:ring-[#0050cb] rounded-xl px-4 py-3.5 text-sm font-bold text-[#191c1e] transition-all outline-none"
                />
              </div>
              <div>
                <label class="block text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Tanggal Selesai</label>
                <input
                  type="date"
                  v-model="bookingForm.endDate"
                  class="w-full bg-[#f2f4f6] border border-transparent focus:border-[#0050cb] focus:bg-white focus:ring-1 focus:ring-[#0050cb] rounded-xl px-4 py-3.5 text-sm font-bold text-[#191c1e] transition-all outline-none"
                />
              </div>
            </div>

            <!-- Input Alamat -->
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Alamat Pengantaran / Penjemputan</label>
              <textarea
                v-model="bookingForm.address"
                rows="2"
                class="w-full bg-[#f2f4f6] border border-transparent focus:border-[#0050cb] focus:bg-white focus:ring-1 focus:ring-[#0050cb] rounded-xl px-4 py-3.5 text-sm font-medium text-[#191c1e] transition-all outline-none resize-none"
                placeholder="Masukkan alamat lengkap (cth: Hotel, Villa, dll)..."
              ></textarea>
            </div>

            <!-- Input Metode Pembayaran -->
            <div>
              <label class="block text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Opsi Pembayaran Muka</label>
              <div class="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  @click="bookingForm.paymentMethod = 'cash_with_dp'"
                  class="flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border-2 transition-all font-bold text-sm"
                  :class="bookingForm.paymentMethod === 'cash_with_dp' ? 'border-[#0050cb] bg-[#e6eeff] text-[#0050cb]' : 'border-[#c2c6d8]/40 bg-[#f7f9fb] text-[#424656] hover:border-[#c2c6d8]'"
                >
                  <span class="text-sm">Bayar DP (15%)</span>
                  <span class="text-[9px] uppercase tracking-widest opacity-80">Sisa Saat Serah Terima</span>
                </button>

                <button
                  type="button"
                  @click="bookingForm.paymentMethod = 'full_transfer'"
                  class="flex flex-col items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border-2 transition-all font-bold text-sm"
                  :class="bookingForm.paymentMethod === 'full_transfer' ? 'border-[#0050cb] bg-[#e6eeff] text-[#0050cb]' : 'border-[#c2c6d8]/40 bg-[#f7f9fb] text-[#424656] hover:border-[#c2c6d8]'"
                >
                  <span class="text-sm">Bayar Penuh</span>
                  <span class="text-[9px] uppercase tracking-widest opacity-80">Lunas 100% Sekarang</span>
                </button>

              </div>
            </div>


            <!-- Kalkulasi Harga (Muncul hanya jika durasi > 0) -->
            <transition name="modal-fade">
              <div v-if="totalDays > 0" class="bg-[#191c1e] rounded-2xl p-5 border border-gray-800 mt-6 relative overflow-hidden text-white shadow-lg">
                <!-- Elemen Cahaya Dekoratif -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-[#0050cb] rounded-full blur-[50px] opacity-40 -mr-10 -mt-10 pointer-events-none"></div>

                <div class="relative z-10">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-[#c2c6d8] text-sm font-medium">Durasi Sewa</span>
                    <span class="bg-[#0050cb] px-3 py-1 rounded-lg text-white font-bold text-xs uppercase tracking-widest">{{ totalDays }} Hari</span>
                  </div>

                  <div class="flex justify-between items-center mb-5">
                    <span class="text-[#c2c6d8] text-sm font-medium">Estimasi Biaya Total</span>
                    <span class="text-white font-bold text-lg">{{ formatPrice(totalPrice) }}</span>
                  </div>

                  <div class="pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div>
                      <span class="block text-white font-bold text-sm">
                        {{ bookingForm.paymentMethod === 'full_transfer' ? 'Total Pembayaran' : 'Uang Muka (DP 15%)' }}
                      </span>
                      <span class="block text-[#c2c6d8] text-[10px] uppercase tracking-widest mt-1">Harus Dibayar Sekarang</span>
                    </div>
                    <span class="font-black text-[#0066ff] text-3xl">{{ formatPrice(bookingForm.paymentMethod === 'full_transfer' ? totalPrice : dpAmount) }}</span>
                  </div>

                  <!-- Teks Info Sisa Pembayaran (Muncul jika opsi DP) -->
                  <div v-if="bookingForm.paymentMethod === 'cash_with_dp'" class="mt-4 pt-4 border-t border-gray-700/50">
                    <p class="text-[10px] text-[#c2c6d8] leading-relaxed">
                      Sisa pembayaran sebesar <strong class="text-white">{{ formatPrice(totalPrice - dpAmount) }}</strong> wajib dilunasi saat serah terima kendaraan.
                    </p>
                  </div>
                </div>
              </div>
            </transition>

          </div>
        </div>

        <!-- ================= BAGIAN BAWAH: ACTION BUTTONS ================= -->
        <div class="p-6 bg-[#f7f9fb] border-t border-[#c2c6d8]/40 flex flex-col sm:flex-row justify-end gap-3 rounded-b-[2rem]">
          <button @click="close" class="px-6 py-3.5 text-[#424656] hover:bg-[#e0e3e5] rounded-xl transition-colors font-bold text-xs uppercase tracking-widest border border-transparent">
            Batal
          </button>
          <button @click="processPayment" :disabled="isProcessing || totalDays <= 0" class="signature-gradient text-white px-8 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#0050cb]/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group active:scale-95">
            <!-- Spinner -->
            <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
            <!-- Ikon Biasa -->
            <span v-else class="material-symbols-outlined text-[18px]">send</span>

            <span>{{ isProcessing ? 'Memproses...' : 'Kirim Pemesanan' }}</span>

            <!-- Ikon Panah (Muncul jika tidak loading) -->
            <span v-if="!isProcessing" class="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
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

/* Gradient Custom sesuai desain */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Menghilangkan icon kalender default di input date agar bersih */
input[type='date']::-webkit-inner-spin-button,
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
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

/* Animasi Rotasi Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
