<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// --- DATA STATISTIK DUMMY ---
const stats = ref([
  { label1: 'Registered', label2: 'Accounts', value: 30, icon: 'group' },
  { label1: 'Total', label2: "Transaction's", value: 30, icon: 'shopping_cart' },
  { label1: 'Total', label2: "Car's", value: 30, icon: 'directions_car' },
  { label1: 'Total', label2: 'Testimonials', value: 30, icon: 'chat_bubble_outline' }
])

// --- DATA TABEL DUMMY ---
const recentTransactions = ref([
  { id: '#LX-99201', user: 'Daniel Widhi', car: 'Avanza Veloz', category: 'LGCG', status: 'Pending', address: 'Nusa Dua Jimbaran' },
  { id: '#LX-99198', user: 'Moh fiky Ard', car: 'BMW M4', category: 'Sport', status: 'Rented', address: 'Pulau KW Denpasar' },
])

// --- KONFIGURASI GRAFIK ---
const chartCanvas = ref(null)
let revenueChart = null

const renderChart = () => {
  if (!chartCanvas.value) return
  if (revenueChart) revenueChart.destroy()

  const ctx = chartCanvas.value.getContext('2d')
  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:['DAY 01', 'DAY 07', 'DAY 14', 'DAY 21', 'DAY 30'],
      datasets:[{
        label: 'Revenue',
        data: [20, 50, 30, 40, 60],
        // Warna batang grafik mengikuti desain (Abu-abu & Biru)
        backgroundColor:['#f2f4f6', '#0066ff', '#f2f4f6', '#f2f4f6', '#0066ff'],
        borderSkipped: false,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            font: { family: 'Manrope', size: 10, weight: 'bold' },
            color: '#727687'
          }
        },
        y: {
          display: false, // Menyembunyikan sumbu Y sesuai desain
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  })
}

onMounted(() => {
  nextTick(() => {
    renderChart()
  })
})
</script>

<template>
  <div class="space-y-8 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- ================= HEADER TITLE & BREADCRUMB ================= -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
      <div class="flex items-center text-sm text-[#727687] font-medium">
        <span>Master</span>
        <span class="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
        <span>Dashboard</span>
      </div>
    </div>

    <!-- ================= STATISTIK CARDS ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 duration-300"
      >
        <div class="flex flex-col">
          <span class="material-symbols-outlined text-3xl text-[#191c1e] mb-3">{{ stat.icon }}</span>
          <p class="text-[11px] text-[#727687] font-medium leading-tight">
            {{ stat.label1 }} <br /> {{ stat.label2 }}
          </p>
        </div>
        <h3 class="text-[40px] font-black text-[#191c1e] leading-none">{{ stat.value }}</h3>
      </div>
    </div>

    <!-- ================= CHART SECTION ================= -->
    <div class="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 class="font-bold text-xl tracking-tight text-[#191c1e]">Revenue Stream</h2>
          <p class="text-sm text-[#727687]">Last 30 days financial performance</p>
        </div>

        <!-- Toggle Buttons -->
        <div class="flex items-center bg-[#f2f4f6] rounded-md p-1">
          <button class="px-4 py-1.5 text-xs font-bold text-[#727687] rounded bg-transparent">Weekly</button>
          <button class="px-4 py-1.5 text-xs font-bold text-white bg-[#0066ff] rounded shadow-sm">Monthly</button>
        </div>
      </div>

      <!-- Canvas Grafik -->
      <div class="h-[250px] w-full">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- ================= DATA TABLE SECTION ================= -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

      <!-- Search Bar -->
      <div class="p-6 border-b border-gray-100">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search something..."
            class="w-full pl-11 pr-4 py-2.5 bg-white border border-[#c2c6d8] rounded-full text-sm outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-all"
          >
        </div>
      </div>

      <!-- Table Wrapper (Responsive X-Scroll) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap">
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">TRANSACTION ID</th>
              <th class="px-6 py-4">USERS</th>
              <th class="px-6 py-4">CARS</th>
              <th class="px-6 py-4">CATEGORY</th>
              <th class="px-6 py-4">STATUS RENT</th>
              <th class="px-6 py-4">ADDRESS</th>
              <th class="px-6 py-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody class="text-sm font-medium text-[#424656] divide-y divide-gray-100">
            <tr v-for="item in recentTransactions" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-5">{{ item.id }}</td>
              <td class="px-6 py-5 font-bold text-[#191c1e]">{{ item.user }}</td>
              <td class="px-6 py-5 text-[#727687]">{{ item.car }}</td>
              <td class="px-6 py-5 text-[#727687]">{{ item.category }}</td>
              <td class="px-6 py-5 text-[#727687]">{{ item.status }}</td>
              <td class="px-6 py-5 text-[#727687]">{{ item.address }}</td>
              <td class="px-6 py-5 flex items-center justify-center gap-3">
                <button class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span class="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-[#727687] font-medium">
          Showing <span class="font-bold text-[#191c1e]">1</span> to <span class="font-bold text-[#191c1e]">1</span> of <span class="font-bold text-[#191c1e]">10</span> Entries
        </p>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1 px-4 py-2 text-sm font-bold text-[#727687] bg-[#f2f4f6] rounded hover:bg-gray-200 transition-colors disabled:opacity-50">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span> Prev
          </button>
          <button class="flex items-center gap-1 px-4 py-2 text-sm font-bold text-[#191c1e] bg-[#e0e3e5] rounded hover:bg-gray-300 transition-colors">
            Next <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
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
