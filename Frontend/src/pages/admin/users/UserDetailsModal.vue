<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const isLoading = ref(false);
const stats = ref({
  total_orders: 0,
  total_spent: 0
});
const orders = ref([]);

const fetchUserDetails = async () => {
  if (!props.user?.id) return;
  isLoading.value = true;
  try {
    const token = authStore.session?.access_token;
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${props.user.id}/details`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user details');
    
    stats.value = result.data.stats || { total_orders: 0, total_spent: 0 };
    orders.value = result.data.orders || [];
  } catch (error) {
    console.error('Error fetching user details:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) fetchUserDetails();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-6 md:p-8 border-b border-[#f2f4f6] flex justify-between items-center bg-[#f7f9fb]/50 shrink-0">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[#0050cb] text-3xl">account_circle</span>
            <div>
              <h2 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight">Customer Details</h2>
              <p class="text-xs text-[#727687] font-medium mt-1">Profile summary and vehicle rental history</p>
            </div>
          </div>
          <button @click="emit('close')" class="w-10 h-10 bg-white hover:bg-[#ba1a1a] border border-[#c2c6d8]/50 rounded-full flex items-center justify-center hover:text-white transition-colors group">
            <span class="material-symbols-outlined text-[#424656] group-hover:text-white transition-colors">close</span>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow bg-[#f8fafa]">
          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <span class="material-symbols-outlined animate-spin text-4xl text-[#0050cb] mb-4">sync</span>
            <p class="text-xs font-bold uppercase tracking-widest text-[#727687]">Loading user details...</p>
          </div>

          <div v-else-if="user" class="space-y-8">
            
            <!-- Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <!-- Total Revenue -->
              <div class="bg-gradient-to-br from-[#003161] to-[#0050cb] text-white p-5 rounded-2xl shadow-md flex flex-col justify-center relative overflow-hidden group">
                <div class="relative z-10">
                  <p class="text-[#b3c5ff] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5">Total Revenue</p>
                  <h3 class="text-2xl md:text-3xl font-black tracking-tighter">{{ formatPrice(stats.total_spent || 0) }}</h3>
                </div>
                <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl text-white opacity-10 group-hover:scale-110 transition-transform duration-500">payments</span>
              </div>

              <!-- Total Rentals -->
              <div class="bg-white border border-[#c2c6d8]/40 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
                <p class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5">Total Rentals</p>
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center">
                    <span class="material-symbols-outlined text-[#0050cb] text-[18px]">car_rental</span>
                  </span>
                  <h3 class="text-2xl font-black text-[#191c1e] tracking-tighter">{{ stats.total_orders || 0 }}</h3>
                </div>
              </div>

              <!-- Member Since -->
              <div class="bg-white border border-[#c2c6d8]/40 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
                <p class="text-[#727687] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5">Member Since</p>
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center">
                    <span class="material-symbols-outlined text-[#0050cb] text-[18px]">calendar_today</span>
                  </span>
                  <h3 class="text-lg md:text-xl font-extrabold text-[#191c1e] tracking-tight">{{ formatDate(user.created_at) }}</h3>
                </div>
              </div>
            </div>

            <!-- Profile Details -->
            <div class="bg-white rounded-2xl border border-[#c2c6d8]/40 p-6">
              <h3 class="text-lg font-bold text-[#191c1e] mb-4 border-b border-[#f2f4f6] pb-2">Profile Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Full Name</label>
                  <p class="text-[#191c1e] font-extrabold text-sm">{{ user.full_name || '-' }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Email</label>
                  <p class="text-[#191c1e] font-bold text-sm">{{ user.email }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Phone No.</label>
                  <p class="text-[#191c1e] font-bold text-sm">{{ user.phone_number || '-' }}</p>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1.5">Address</label>
                  <p class="text-[#191c1e] font-bold text-sm truncate" :title="user.address">{{ user.address || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Rental History -->
            <div class="bg-white rounded-2xl border border-[#c2c6d8]/40 p-6">
              <h3 class="text-lg font-bold text-[#191c1e] mb-4 border-b border-[#f2f4f6] pb-2">Rental History</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left whitespace-nowrap">
                  <thead class="bg-[#f2f4f6] text-[#727687] uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th class="px-4 py-3 rounded-l-lg">Reference</th>
                      <th class="px-4 py-3">Vehicle & Date</th>
                      <th class="px-4 py-3 text-center">Duration</th>
                      <th class="px-4 py-3 text-right">Bill</th>
                      <th class="px-4 py-3 text-center rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-if="orders.length === 0">
                      <td colspan="5" class="px-4 py-6 text-center text-[#727687] font-medium italic">No transaction history yet.</td>
                    </tr>
                    <tr v-for="order in orders" :key="order.id" class="hover:bg-blue-50/30 transition-colors">
                      <td class="px-4 py-4">
                        <span class="font-bold text-[#0050cb] bg-[#e6eeff] px-2 py-1 rounded text-xs border border-[#b3c5ff]/50">
                          {{ order.id }}
                        </span>
                      </td>
                      <td class="px-4 py-4">
                        <div class="flex flex-col gap-0.5">
                          <span class="font-extrabold text-[#191c1e] text-sm">{{ order.car_name }}</span>
                          <span class="text-[10px] text-[#727687] font-medium flex items-center gap-1">
                            <span class="material-symbols-outlined text-[12px]">event</span> {{ formatDate(order.created_at) }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-center text-[#424656] font-bold text-sm">
                        {{ order.duration }} Day(s)
                      </td>
                      <td class="px-4 py-4 text-right">
                        <span class="font-black text-[#191c1e] text-sm">{{ formatPrice(order.total_price) }}</span>
                      </td>
                      <td class="px-4 py-4 text-center">
                        <span
                          class="px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border"
                          :class="{
                            'bg-green-100 text-green-700 border-green-200': order.status === 'completed',
                            'bg-orange-100 text-orange-700 border-orange-200': order.status === 'pending',
                            'bg-red-100 text-red-700 border-red-200': order.status === 'cancelled',
                            'bg-blue-100 text-blue-700 border-blue-200': order.status === 'active'
                          }"
                        >
                          {{ order.status.toUpperCase() }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

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

/* Transisi Fade Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
