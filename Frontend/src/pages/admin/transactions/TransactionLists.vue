<script setup>
import { ref, computed } from 'vue'

// --- MOCKUP STATE (Tanpa Backend) ---
const isLoading = ref(false)

// Data Pesanan Dummy GASNGO
const paidOrders = ref([
  { id: 'LX-8892-TY', recipient_name: 'Daniel Pratama', status: 'dp_paid', total_price: 3750 },
  { id: 'LX-8871-FR', recipient_name: 'Elena Rostova', status: 'completed', total_price: 2450 },
  { id: 'LX-8820-BM', recipient_name: 'Ahmad Wijaya', status: 'completed', total_price: 2850 },
  { id: 'LX-8999-AD', recipient_name: 'Clara Michelle', status: 'active', total_price: 6000 }
])

// AI State Mockup
const aiResultRaw = ref('')
const isAnalyzing = ref(false)

const topCars = ref([
  { name: 'Porsche Taycan', rented: 12, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5' },
  { name: 'Ferrari F8 Tributo', rented: 8, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp' },
  { name: 'BMW M8 Gran Coupe', rented: 5, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE' }
])

// Riwayat Laporan (Arsip)
const reportHistory = ref([
  { id: 1, created_at: '2024-05-01T10:00:00Z', analysis_text: 'Pendapatan bulan ini didominasi oleh penyewaan jangka pendek pada akhir pekan. Kendaraan elektrik menduduki tingkat utilisasi tertinggi.' },
  { id: 2, created_at: '2024-04-01T10:00:00Z', analysis_text: 'Penurunan penyewaan sebesar 5% pasca musim liburan. Rekomendasi: Terapkan tarif promo pada pertengahan minggu untuk menarik pelanggan korporat.' }
])
const expandedReportId = ref(null)

// --- HELPER FUNCTIONS ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const totalRevenue = computed(() => {
  return paidOrders.value.reduce((sum, o) => sum + Number(o.total_price), 0)
})

// Logika Buka Tutup Accordion (Arsip)
const toggleHistory = (id) => {
  expandedReportId.value = expandedReportId.value === id ? null : id
}

// Simulasi AI Analysis Typewriter Effect
const analyzeSales = () => {
  isAnalyzing.value = true
  aiResultRaw.value = ''

  setTimeout(() => {
    const fakeText = "Based on the last 30 days of data, fleet rentals have surged by 15% compared to the previous month.\n\nPorsche Taycan leads in revenue. It is recommended to add more luxury electric vehicle units to meet the growing interest from premium customer segments.\n\nRental rates remain stable, but additional revenue potential can be captured through extended remote concierge services."

    let i = 0
    const typeWriter = setInterval(() => {
      aiResultRaw.value += fakeText.charAt(i)
      i++
      if (i >= fakeText.length) {
        clearInterval(typeWriter)
        isAnalyzing.value = false

        // Memasukkan otomatis ke arsip dummy
        reportHistory.value.unshift({
          id: Date.now(),
          created_at: new Date().toISOString(),
          analysis_text: fakeText
        })
      }
    }, 20) // Kecepatan ketik
  }, 1000)
}
</script>

<template>
  <div class="space-y-8 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Header Section -->
    <div class="flex flex-col gap-1 mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Rental Report & Analysis</h1>
      <p class="text-sm text-[#727687]">Review fleet revenue and leverage AI for automated business insights.</p>
    </div>

    <!-- ==========================================
         SECTION 1: AI BUSINESS INTELLIGENCE
         ========================================== -->
    <div class="flex flex-col rounded-3xl border border-[#c2c6d8]/40 bg-white shadow-sm overflow-hidden">

      <!-- Panel Atas (Area AI) -->
      <div class="p-6 md:p-8 bg-gradient-to-br from-[#f7f9fb] to-white border-b border-[#c2c6d8]/40">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 class="font-extrabold text-xl text-[#191c1e] flex items-center gap-3">
              <span class="material-symbols-outlined text-[#0050cb] text-3xl">psychology</span>
              AI Business Intelligence
            </h2>
            <p class="text-sm text-[#727687] mt-1 font-medium">Analyze performance & strategic rental recommendations *real-time*.</p>
          </div>

          <button
            @click="analyzeSales"
            :disabled="isAnalyzing"
            class="px-6 py-3 bg-[#0050cb] hover:bg-[#0066ff] text-white text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto shrink-0"
          >
            <span v-if="isAnalyzing" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
            <span v-else class="material-symbols-outlined text-[18px]">magic_button</span>
            {{ isAnalyzing ? 'Analyzing Data...' : 'Generate New Report' }}
          </button>
        </div>

        <!-- Hasil Analisis AI -->
        <div v-if="aiResultRaw || topCars.length > 0" class="flex flex-col lg:flex-row gap-8 animate-fade-in">

          <!-- Teks Hasil (Mesin Tik) -->
          <div class="flex-1 order-2 lg:order-1">
            <div class="bg-white p-6 rounded-2xl border border-[#c2c6d8]/30 shadow-sm min-h-[150px]">
              <p class="text-xs font-bold uppercase tracking-widest text-[#0050cb] mb-3">AI Summary</p>
              <p class="text-[#424656] text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {{ aiResultRaw || 'Loading rental pattern analysis...' }}
                <span v-if="isAnalyzing" class="inline-block w-1.5 h-4 bg-[#0050cb] ml-1 animate-pulse"></span>
              </p>
            </div>
          </div>

          <!-- Kendaraan Terlaris -->
          <div v-if="topCars.length > 0" class="lg:w-1/3 order-1 lg:order-2">
            <h3 class="font-bold text-[10px] uppercase tracking-widest text-[#727687] mb-3">🏆 Best Sellers</h3>
            <div class="space-y-3">
              <div v-for="(car, idx) in topCars" :key="idx" class="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#c2c6d8]/30 shadow-sm hover:border-[#0050cb]/30 transition-colors">
                <div class="relative flex-shrink-0">
                  <div class="w-16 h-12 bg-[#f2f4f6] rounded-lg overflow-hidden border border-[#c2c6d8]/20">
                    <img :src="car.image" class="w-full h-full object-cover">
                  </div>
                  <div class="absolute -top-2 -left-2 w-5 h-5 bg-[#eab308] text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {{ idx + 1 }}
                  </div>
                </div>
                <div>
                  <h4 class="font-extrabold text-[#191c1e] text-sm leading-none">{{ car.name }}</h4>
                  <p class="text-[#0050cb] text-[10px] font-bold uppercase tracking-widest mt-1.5">Rented: {{ car.rented }} Times</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- State Kosong jika belum Generate -->
        <div v-else-if="!isAnalyzing" class="text-center py-12 bg-white rounded-2xl border border-dashed border-[#c2c6d8]">
          <span class="material-symbols-outlined text-4xl text-[#c2c6d8] mb-2">auto_graph</span>
          <p class="text-[#727687] text-sm font-medium">Click "Generate New Report" to see the current analysis.</p>
        </div>
      </div>

      <!-- Panel Bawah (Tabel Transaksi Masuk) -->
      <div class="p-6 md:p-8">
        <h3 class="font-extrabold text-[#191c1e] text-lg mb-6">Completed & Active Transaction Details</h3>

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

    <!-- ==========================================
         BAGIAN 2: ARSIP RIWAYAT ANALISIS (ACCORDION)
         ========================================== -->
    <div class="flex flex-col gap-4 mt-8 pt-8 border-t border-[#c2c6d8]/40">
      <h2 class="text-xl font-extrabold text-[#191c1e] flex items-center gap-2">
        <span class="material-symbols-outlined text-[#0050cb]">folder_open</span>
        Analysis Report Archive
      </h2>

      <div v-if="reportHistory.length === 0" class="text-[#727687] text-sm font-medium italic">No saved history yet.</div>

      <div v-else class="grid gap-4 mt-2">
        <!-- Looping History -->
        <div v-for="report in reportHistory" :key="report.id" class="bg-white border border-[#c2c6d8]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

          <!-- Header Accordion -->
          <button
            @click="toggleHistory(report.id)"
            class="w-full flex justify-between items-center p-5 bg-white hover:bg-[#f7f9fb] transition-colors text-left focus:outline-none"
          >
            <div class="flex items-center gap-4">
              <div class="bg-[#f2f4f6] text-[#424656] p-2 rounded-xl border border-[#c2c6d8]/30">
                <span class="material-symbols-outlined text-xl block">calendar_month</span>
              </div>
              <div>
                <h4 class="font-extrabold text-[#191c1e] text-sm md:text-base">Business Intelligence Report</h4>
                <p class="text-[10px] text-[#727687] font-bold uppercase tracking-widest mt-0.5">{{ formatDate(report.created_at) }}</p>
              </div>
            </div>
            <!-- Ikon Panah Putar -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center bg-[#f2f4f6] text-[#424656] transition-transform duration-300"
              :class="expandedReportId === report.id ? 'rotate-180 bg-[#0050cb] text-white' : ''"
            >
              <span class="material-symbols-outlined text-[20px]">expand_more</span>
            </div>
          </button>

          <!-- Konten Teks Laporan -->
          <div v-if="expandedReportId === report.id" class="p-6 md:p-8 bg-[#f7f9fb] border-t border-[#f2f4f6] animate-fade-in">
            <!-- Render Teks Biasa dengan Spasi (Ganti v-html Markdown menjadi teks) -->
            <p class="text-[#424656] text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {{ report.analysis_text }}
            </p>
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
