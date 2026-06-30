<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const carId = route.params.id;

const isLoading = ref(true);
const isError = ref(false);
const errorMsg = ref('');
const product = ref(null);

const fetchCarDetails = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    const response = await fetch(`http://localhost:5000/api/cars/${carId}`);
    const resData = await response.json();
    
    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Gagal memuat detail kendaraan.');
    }
    
    const data = resData.data;
    
    product.value = {
      id: data.id,
      name: data.name,
      brand_name: data.brand,
      category_name: data.category,
      transmission: data.transmission,
      seats: data.seats,
      fuel: data.fuel || 'Bensin',
      year: data.year || new Date().getFullYear(),
      condition: 5, // Default condition
      price: data.price_per_day,
      is_promotion: false,
      discount_price: null,
      description: data.description || 'Premium vehicle ready to rent. In excellent and well-maintained condition.',
      image: data.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop',
      status: data.status || 'available'
    };
  } catch (err) {
    console.error('Error fetching car details:', err);
    isError.value = true;
    errorMsg.value = err.message || 'Gagal memuat detail kendaraan.';
    Swal.fire({
      icon: 'error',
      title: 'An Error Occurred',
      text: errorMsg.value,
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCarDetails();
});

const formatPrice = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const goBack = () => {
  router.push('/admin/cars');
};
</script>

<template>
  <div class="font-['Manrope'] text-[#191c1e] min-h-screen pb-20">
    
    <!-- ================= BREADCRUMB & HEADER ================= -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c2c6d8]/40 pb-6">
      <div>
        <nav class="flex items-center gap-2 text-xs font-bold text-[#727687] uppercase tracking-widest mb-3">
          <button @click="goBack" class="hover:text-[#0050cb] transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">arrow_back</span> Back
          </button>
          <span class="w-1 h-1 rounded-full bg-[#c2c6d8]"></span>
          <span>Fleet Management</span>
        </nav>
        <h1 class="text-3xl md:text-4xl font-black tracking-tight text-[#191c1e] flex items-center gap-3">
          Vehicle Details
        </h1>
      </div>
    </div>

    <!-- ================= LOADING STATE (SKELETON) ================= -->
    <div v-if="isLoading" class="animate-pulse space-y-8">
      <div class="bg-[#f2f4f6] h-[400px] w-full rounded-[2.5rem] border border-[#c2c6d8]/30"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="col-span-2 space-y-4">
          <div class="h-10 bg-[#f2f4f6] rounded-xl w-3/4"></div>
          <div class="h-6 bg-[#f2f4f6] rounded-lg w-1/4"></div>
          <div class="grid grid-cols-2 gap-4 mt-8">
            <div class="h-24 bg-[#f2f4f6] rounded-2xl"></div>
            <div class="h-24 bg-[#f2f4f6] rounded-2xl"></div>
            <div class="h-24 bg-[#f2f4f6] rounded-2xl"></div>
            <div class="h-24 bg-[#f2f4f6] rounded-2xl"></div>
          </div>
        </div>
        <div class="col-span-1 h-[300px] bg-[#f2f4f6] rounded-[2rem]"></div>
      </div>
    </div>

    <!-- ================= ERROR STATE ================= -->
    <div v-else-if="isError || !product" class="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-[#ba1a1a]/30 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto">
      <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-4xl text-[#ba1a1a]">car_crash</span>
      </div>
      <h2 class="text-2xl font-black text-[#191c1e] mb-2">Vehicle Not Found</h2>
      <p class="text-[#727687] mb-8 max-w-md">{{ errorMsg || 'Vehicle data is unavailable. The data may have been deleted or you are accessing an invalid ID.' }}</p>
      <button @click="goBack" class="signature-gradient text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">list</span> Fleet List
      </button>
    </div>

    <!-- ================= MAIN CONTENT ================= -->
    <div v-else class="space-y-8 animate-fadeIn">
      
      <!-- HERO IMAGE BENTO -->
      <div class="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden group shadow-md border border-[#c2c6d8]/30 bg-white">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#191c1e]/90 via-[#191c1e]/20 to-transparent"></div>
        
        <!-- Badges -->
        <div class="absolute top-6 left-6 flex flex-col gap-2">
          <span class="bg-white/90 backdrop-blur-md text-[#191c1e] text-[10px] font-black px-4 py-2 rounded-2xl shadow-sm uppercase tracking-widest flex items-center gap-1.5 w-max">
            <span class="w-2 h-2 rounded-full" :class="product.status === 'available' ? 'bg-[#16a34a]' : 'bg-[#ba1a1a]'"></span>
            {{ product.status === 'available' ? 'Available' : 'Rented' }}
          </span>
          <span class="bg-[#0050cb]/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-sm uppercase tracking-widest w-max border border-white/10">
            {{ product.category_name }}
          </span>
        </div>

        <!-- Title Content -->
        <div class="absolute bottom-8 left-8 right-8">
          <p class="text-[#b3c5ff] text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-2">{{ product.brand_name }}</p>
          <h2 class="text-4xl md:text-5xl font-black text-white leading-tight">{{ product.name }}</h2>
        </div>
      </div>

      <!-- DETAILS GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Kiri: Spesifikasi & Deskripsi -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Bento Specs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-[2rem] border border-[#c2c6d8]/40 shadow-sm flex flex-col items-center text-center justify-center hover:border-[#0050cb]/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-[#0050cb] text-[20px]">calendar_today</span>
              </div>
              <span class="text-[#727687] text-[9px] font-bold uppercase tracking-widest mb-1">Year</span>
              <span class="text-[#191c1e] font-black text-sm">{{ product.year }}</span>
            </div>
            
            <div class="bg-white p-5 rounded-[2rem] border border-[#c2c6d8]/40 shadow-sm flex flex-col items-center text-center justify-center hover:border-[#0050cb]/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-[#0050cb] text-[20px]">settings</span>
              </div>
              <span class="text-[#727687] text-[9px] font-bold uppercase tracking-widest mb-1">Transmission</span>
              <span class="text-[#191c1e] font-black text-sm">{{ product.transmission }}</span>
            </div>

            <div class="bg-white p-5 rounded-[2rem] border border-[#c2c6d8]/40 shadow-sm flex flex-col items-center text-center justify-center hover:border-[#0050cb]/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-[#0050cb] text-[20px]">airline_seat_recline_extra</span>
              </div>
              <span class="text-[#727687] text-[9px] font-bold uppercase tracking-widest mb-1">Capacity</span>
              <span class="text-[#191c1e] font-black text-sm">{{ product.seats }} Seat</span>
            </div>

            <div class="bg-white p-5 rounded-[2rem] border border-[#c2c6d8]/40 shadow-sm flex flex-col items-center text-center justify-center hover:border-[#0050cb]/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center mb-3">
                <span class="material-symbols-outlined text-[#0050cb] text-[20px]">local_gas_station</span>
              </div>
              <span class="text-[#727687] text-[9px] font-bold uppercase tracking-widest mb-1">Fuel</span>
              <span class="text-[#191c1e] font-black text-sm">{{ product.fuel }}</span>
            </div>
          </div>

          <!-- Description Box -->
          <div class="bg-white rounded-[2rem] p-8 border border-[#c2c6d8]/40 shadow-sm">
            <h3 class="text-sm font-black uppercase tracking-widest text-[#191c1e] mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#0050cb]">description</span> Vehicle Description
            </h3>
            <p class="text-[#424656] leading-relaxed text-sm">
              {{ product.description }}
            </p>
          </div>
        </div>

        <!-- Kanan: Pricing & Actions -->
        <div class="lg:col-span-1">
          <div class="bg-[#f7f9fb] rounded-[2rem] p-8 border border-[#c2c6d8]/50 shadow-sm sticky top-28">
            <div class="mb-8">
              <span class="text-[#727687] text-[10px] font-bold uppercase tracking-widest block mb-2">Daily Rental Rate</span>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-[#191c1e]">{{ formatPrice(product.price) }}</span>
                <span class="text-[#727687] text-xs font-bold uppercase tracking-widest">/Day</span>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <router-link :to="`/admin/cars/edit/${product.id}`" class="w-full signature-gradient text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">edit</span> Edit Vehicle
              </router-link>
              <button @click="goBack" class="w-full bg-white text-[#191c1e] border border-[#c2c6d8]/60 font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#f2f4f6] hover:border-[#191c1e] transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">close</span> Close
              </button>
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

.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
