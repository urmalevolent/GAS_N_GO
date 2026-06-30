<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import AOS from 'aos'
import 'aos/dist/aos.css'

const authStore = useAuthStore()
const isLoading = ref(true)

// --- DATA STATISTIK AWAL ---
const stats = ref([
  { label1: 'Registered', label2: 'Accounts', value: 0, icon: 'group', colorClass: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' },
  { label1: 'Total', label2: "Transactions", value: 0, icon: 'shopping_cart', colorClass: 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/30' },
  { label1: 'Total', label2: "Cars", value: 0, icon: 'directions_car', colorClass: 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/30' },
  { label1: 'Total', label2: 'Revenue', value: 'Rp 0', icon: 'payments', colorClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30' }
])

// --- KONFIGURASI GRAFIK ---
const chartCanvas = ref(null)
let revenueChart = null

const renderChart = (labels = ['DAY 01', 'DAY 07', 'DAY 14', 'DAY 21', 'DAY 30'], data = [0, 0, 0, 0, 0]) => {
  if (!chartCanvas.value) return
  if (revenueChart) revenueChart.destroy()

  const ctx = chartCanvas.value.getContext('2d')
  
  // Create gradient for bars
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 1)'); // Indigo 600
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0.2)');

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets:[{
        label: 'Revenue',
        data: data,
        backgroundColor: gradient,
        hoverBackgroundColor: '#4338ca',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            font: { family: 'Inter, sans-serif', size: 11, weight: '600' },
            color: '#9ca3af'
          }
        },
        y: {
          display: true,
          grid: {
            color: '#f3f4f6',
            drawBorder: false,
            borderDash: [5, 5]
          },
          beginAtZero: true,
          ticks: {
            font: { family: 'Inter, sans-serif', size: 11, weight: '500' },
            color: '#9ca3af',
            callback: function(value) {
              if (value >= 1000000) {
                return 'Rp ' + (value / 1000000) + 'M';
              } else if (value >= 1000) {
                return 'Rp ' + (value / 1000) + 'k';
              }
              return 'Rp ' + value;
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#1f2937',
          padding: 12,
          titleFont: { family: 'Inter', size: 13 },
          bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    }
  })
}

const fetchDashboardData = async () => {
  try {
    const token = (await authStore.session)?.access_token || '';
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (result.success) {
      const { stats: fetchedStats, chart } = result.data;
      
      const formattedRevenue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(fetchedStats.revenue);

      stats.value[0].value = fetchedStats.accounts;
      stats.value[1].value = fetchedStats.transactions;
      stats.value[2].value = fetchedStats.cars;
      stats.value[3].value = formattedRevenue;

      if (chart && chart.labels && chart.data) {
        renderChart(chart.labels, chart.data);
      }
    } else {
      throw new Error(result.message || 'Failed to load dashboard data');
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
      confirmButtonColor: '#4f46e5'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  AOS.init({ once: true, duration: 800, easing: 'ease-out-quart' });
  nextTick(() => {
    renderChart();
    fetchDashboardData();
  })
})
</script>

<template>
  <div class="space-y-8 font-sans text-gray-900 pb-10">

    <!-- ================= WELCOME BANNER ================= -->
    <div class="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-600 rounded-2xl p-8 md:p-10 text-white shadow-xl flex justify-between items-center" data-aos="fade-down">
      <!-- Decorator Patterns -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-24 right-10 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
      
      <div class="relative z-10">
        <h1 class="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
          Welcome back, {{ authStore.user?.full_name || 'Administrator' }}! 👋
        </h1>
        <p class="text-indigo-200 text-sm md:text-base font-medium max-w-lg leading-relaxed">
          Here’s a quick overview of what’s happening with your rental business today. Keep up the great work!
        </p>
      </div>
      <div class="hidden md:block relative z-10 opacity-20 transform rotate-12 transition-transform duration-700 hover:rotate-0">
        <span class="material-symbols-outlined text-[100px]">monitoring</span>
      </div>
    </div>

    <!-- ================= STATISTIK CARDS ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group cursor-default"
        data-aos="fade-up"
        :data-aos-delay="index * 100"
      >
        <!-- Background Icon -->
        <div class="absolute -right-6 -bottom-6 text-gray-50 opacity-40 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 z-0">
          <span class="material-symbols-outlined text-[120px]">{{ stat.icon }}</span>
        </div>

        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" :class="stat.colorClass">
              <span class="material-symbols-outlined text-white text-2xl">{{ stat.icon }}</span>
            </div>
            <div>
              <p class="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{{ stat.label1 }}</p>
              <p class="text-sm text-gray-700 font-bold">{{ stat.label2 }}</p>
            </div>
          </div>
          <div class="mt-auto pt-2">
            <!-- Gunakan text-2xl untuk Revenue agar tidak terlalu besar dan terpotong -->
            <h3 class="font-black text-gray-900 truncate" :class="stat.label2 === 'Revenue' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'">
              {{ stat.value }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= CHART SECTION ================= -->
    <div class="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm" data-aos="fade-up" data-aos-delay="400">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 class="font-bold text-xl md:text-2xl tracking-tight text-gray-900 mb-1">Revenue Stream</h2>
          <p class="text-sm text-gray-500 font-medium">Financial performance for the last 7 days</p>
        </div>

        <!-- Toggle Indicator -->
        <div class="flex items-center bg-gray-50 rounded-lg p-1.5 border border-gray-100">
          <div class="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-md shadow-sm">Last 7 Days</div>
        </div>
      </div>

      <!-- Canvas Grafik -->
      <div class="h-[300px] w-full relative">
        <canvas ref="chartCanvas"></canvas>
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
