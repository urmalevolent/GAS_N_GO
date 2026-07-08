<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Swal from 'sweetalert2'

const isLoading = ref(false)
const paidOrders = ref([])

// Fetch transactions data from Supabase
const fetchTransactions = async () => {
  isLoading.value = true
  try {
    // Fetch rentals that have payments
    const { data, error } = await supabase
      .from('rentals')
      .select('*, profile:profiles(*), rental_payments(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    paidOrders.value = (data || []).map(r => {
      const payment = r.rental_payments?.[0] || {}
      
      return {
        id: r.id,
        recipient_name: r.profile?.full_name || 'Pelanggan',
        status: r.status,
        total_price: payment.total_price || 0,
        payment_status: payment.payment_status || 'pending',
        created_at: r.created_at
      }
    })
  } catch (err) {
    console.error('Error fetching transactions:', err)
    Swal.fire({ icon: 'error', title: 'Failed to load data', text: err.message })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const totalRevenue = computed(() => {
  return paidOrders.value
    .filter(o => o.payment_status === 'verified' || o.payment_status === 'settlement' || o.payment_status === 'capture' || o.status === 'completed' || o.status === 'active' || o.status === 'rented' || o.status === 'dp_paid')
    .reduce((sum, o) => sum + Number(o.total_price), 0)
})
</script>

<template>
  <div class="space-y-8 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Header Section -->
    <div class="flex flex-col gap-1 mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Rental Report & Analysis</h1>
      <p class="text-sm text-[#727687]">Review fleet revenue and leverage AI for automated business insights.</p>
    </div>

    <div class="flex flex-col rounded-3xl border border-[#c2c6d8]/40 bg-white shadow-sm overflow-hidden mt-8">

      <!-- Panel (Tabel Transaksi Masuk) -->
      <div class="p-6 md:p-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-extrabold text-[#191c1e] text-lg">Transaction Details</h3>
          <button @click="fetchTransactions" class="text-xs font-bold text-[#0050cb] hover:text-white bg-[#e6eeff] hover:bg-[#0050cb] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-widest border border-[#b3c5ff]/50 active:scale-95">
            <span class="material-symbols-outlined text-[16px]" :class="{ 'animate-spin': isLoading }">sync</span> Refresh
          </button>
        </div>

        <div class="overflow-hidden border border-[#c2c6d8]/40 rounded-2xl">
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-[600px] w-full text-left whitespace-nowrap">
              <thead class="bg-[#003161] text-[10px] text-white uppercase tracking-widest font-bold">
                <tr>
                  <th class="px-6 py-4 w-12 text-center">NO</th>
                  <th class="px-6 py-4">RESERVATION INFO</th>
                  <th class="px-6 py-4 text-center">STATUS</th>
                  <th class="px-6 py-4 text-right">TOTAL BILL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paidOrders.length === 0">
                  <td colspan="4" class="px-6 py-10 text-center text-[#727687] italic font-medium">No validated transactions yet.</td>
                </tr>
                <tr v-for="(order, index) in paidOrders" :key="order.id" class="border-b border-[#f2f4f6] hover:bg-blue-50/30 transition-colors text-sm">
                  <td class="px-6 py-5 text-center text-[#727687] font-bold">{{ index + 1 }}</td>
                  <td class="px-6 py-5">
                    <div class="font-extrabold text-[#191c1e] text-sm">{{ order.id }}</div>
                    <div class="text-[10px] text-[#727687] font-bold uppercase tracking-widest mt-0.5">{{ order.recipient_name }}</div>
                  </td>
                  <td class="px-6 py-5 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      :class="{
                        'bg-blue-100 text-blue-700 border-blue-200': order.status === 'dp_paid',
                        'bg-green-100 text-green-700 border-green-200': order.status === 'completed',
                        'bg-[#e6eeff] text-[#0050cb] border-[#b3c5ff]/50': order.status === 'active'
                      }"
                    >
                      {{
                        order.status === 'dp_paid' ? 'DP PAID' :
                        order.status === 'completed' ? 'COMPLETED' : 'RENTED (FULL PAID)'
                      }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right font-black text-[#191c1e] text-base">{{ formatPrice(order.total_price) }}</td>
                </tr>
              </tbody>
              <tfoot v-if="paidOrders.length > 0" class="bg-[#f7f9fb] border-t-2 border-[#c2c6d8]/40">
                <tr>
                  <td colspan="3" class="px-6 py-5 text-right font-bold text-[#727687] uppercase tracking-widest text-[10px]">Confirmed Total Revenue:</td>
                  <td class="px-6 py-5 text-right font-black text-2xl text-[#0050cb]">{{ formatPrice(totalRevenue) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
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

/* Animasi Spinner Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animasi Pulse Cursor AI */
.animate-pulse {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Animasi Fade In Cepat untuk Accordion & Teks AI */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
