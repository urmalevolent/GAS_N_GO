<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Show from '@/components/icons/Show.vue' // Komponen untuk menampilkan data detail transaksi (opsional)
import Trash from '@/components/icons/TrashCan.vue' // Komponen untuk menghapus data transaksi (opsional)
import Edit from '@/components/icons/Edit.vue' // Komponen untuk mengedit data transaksi (opsional)

const authStore = useAuthStore()
const searchQuery = ref("")
const products = ref([])
const isLoading = ref(true)

const normalizeCarForList = (car) => {
  return {
    id: car.id,
    name: car.name,
    brand_name: car.brand,
    category_name: car.category,
    status: car.status === 'inactive' ? 'inactive' : 'active',
    is_promotion: 0,
    price: car.price_per_day,
    discount_price: null,
    image: car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop'
  }
}

const fetchCars = async () => {
  isLoading.value = true
  try {
    const token = authStore.session?.access_token
    const response = await fetch('http://localhost:5000/api/admin/cars', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const resData = await response.json()
    if (!response.ok || !resData.success) throw new Error(resData.message || 'Gagal memuat data armada.')
    products.value = (resData.data || []).map(normalizeCarForList)
  } catch (err) {
    console.error('Error fetching cars:', err)
    Swal.fire('Error', err.message || 'Failed to load fleet data.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCars()
})

const filterProducts = async () => {
  isLoading.value = true
  try {
    const token = authStore.session?.access_token
    const response = await fetch('http://localhost:5000/api/admin/cars', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const resData = await response.json()
    if (!response.ok || !resData.success) throw new Error(resData.message || 'Failed to filter data.')
    
    let list = resData.data || []
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      list = list.filter(c => 
        (c.name || '').toLowerCase().includes(query) || 
        (c.brand || '').toLowerCase().includes(query)
      )
    }
    products.value = list.map(normalizeCarForList)
  } catch (err) {
    console.error('Error filtering cars:', err)
    Swal.fire('Error', err.message || 'Failed to filter data.', 'error')
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = (id, name) => {
  Swal.fire({
    title: `Deactivate ${name}?`,
    text: "The vehicle will be hidden from the customer catalog, but the data will remain.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Deactivate!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = authStore.session?.access_token
        const response = await fetch(`http://localhost:5000/api/admin/cars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const resData = await response.json()
        if (!response.ok || !resData.success) throw new Error(resData.message || 'Failed to deactivate vehicle.')
        
        const prod = products.value.find(p => p.id === id)
        if (prod) prod.status = 'inactive'
        
        Swal.fire('Success!', 'Vehicle has been deactivated.', 'success')
      } catch (err) {
        console.error('Error deactivating car:', err)
        Swal.fire('Error', err.message || 'Failed to deactivate vehicle.', 'error')
      }
    }
  })
}

const restoreProduct = (id, name) => {
  Swal.fire({
    title: `Activate ${name}?`,
    text: "The vehicle will reappear in the customer catalog.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Activate!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = authStore.session?.access_token
        const response = await fetch(`http://localhost:5000/api/admin/cars/${id}/restore`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const resData = await response.json()
        if (!response.ok || !resData.success) throw new Error(resData.message || 'Failed to activate vehicle.')
        
        const prod = products.value.find(p => p.id === id)
        if (prod) prod.status = 'active'
        
        Swal.fire('Success!', 'Vehicle is now active again.', 'success')
      } catch (err) {
        console.error('Error activating car:', err)
        Swal.fire('Error', err.message || 'Failed to activate vehicle.', 'error')
      }
    }
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Fleet List</h1>
        <p class="text-sm text-[#727687]">Manage all vehicles available for rental.</p>
      </div>

      <!-- Tombol Tambah Produk (Akan ke /admin/cars/create) -->
      <router-link
        to="/admin/cars/add"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-[#0050cb] hover:bg-[#0066ff] text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
      >
        <span class="material-symbols-outlined text-lg">add</span> Add Vehicle
      </router-link>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="filterProducts"
            type="text"
            placeholder="Search vehicle name or brand..."
            class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
          >
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[900px]">
          <!-- Header Tabel dengan warna Navy khas referensi gambar -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4 w-28">PHOTO</th>
              <th class="px-6 py-4">VEHICLE DETAIL</th>
              <th class="px-6 py-4">STATUS</th>
              <th class="px-6 py-4 text-right">RENTAL RATE</th>
              <th class="px-6 py-4 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Jika tidak ada produk -->
            <tr v-if="products.length === 0">
              <td colspan="6" class="p-8 text-center text-[#727687] italic font-medium">No vehicles found.</td>
            </tr>

            <!-- Looping Data Produk -->
            <tr v-else v-for="(product, index) in products" :key="product.id"
                class="transition-colors hover:bg-blue-50/30"
                :class="{'opacity-50 bg-gray-50': product.status === 'inactive'}"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Foto Kendaraan -->
              <td class="px-6 py-5">
                 <img :src="product.image" class="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm" />
              </td>

              <!-- 3. Detail Kendaraan -->
              <td class="px-6 py-5">
                 <div class="flex flex-col gap-1.5">
                   <span class="font-extrabold text-[#191c1e] text-base" :class="{'line-through text-[#727687]': product.status === 'inactive'}">
                      {{ product.name }}
                   </span>
                   <div class="flex gap-2 items-center">
                      <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e6eeff] text-[#0050cb] uppercase tracking-widest border border-[#b3c5ff]/50">{{ product.category_name }}</span>
                      <span class="text-[10px] text-[#727687] font-bold uppercase tracking-widest">{{ product.brand_name }}</span>
                   </div>
                 </div>
              </td>

              <!-- 4. Status Produk -->
              <td class="px-6 py-5">
                <div class="flex flex-col gap-2 items-start">
                  <span v-if="product.status === 'active'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                      ACTIVE
                  </span>
                  <span v-else class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200">
                      INACTIVE
                  </span>

                  <span v-if="product.is_promotion === 1 && product.status === 'active'"
                        class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#cc4204]/10 text-[#cc4204] border border-[#cc4204]/30 animate-pulse">
                      🔥 PROMO
                  </span>
                </div>
              </td>

              <!-- 5. Harga / Tarif -->
              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-1">
                  <!-- Tampilan Promo -->
                  <template v-if="product.is_promotion === 1 && product.status === 'active'">
                    <span class="text-[11px] text-[#ba1a1a] font-bold line-through decoration-[#ba1a1a] opacity-80">
                      {{ formatPrice(product.price) }}/hari
                    </span>
                    <span class="font-black text-[#191c1e] text-lg leading-none">
                      {{ formatPrice(product.discount_price) }}
                    </span>
                  </template>

                  <!-- Tampilan Normal -->
                  <template v-else>
                    <span class="font-black text-[#191c1e] text-lg leading-none">
                      {{ formatPrice(product.price) }}
                    </span>
                    <span class="text-[10px] text-[#727687] font-bold uppercase tracking-widest">/Day</span>
                  </template>
                </div>
              </td>

              <!-- 6. Aksi (Edit/Hapus/Restore) -->
              <td class="px-6 py-5">
                  <div class="flex gap-2 items-center justify-center">
                      <!-- Tombol Detail (Biru) -->
                      <router-link :to="{ name: 'admin-car-detail', params: { id: product.id } }" class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Lihat Detail">
                          <Show class="size-6 text-white" />
                      </router-link>

                      <template v-if="product.status === 'active'">
                          <!-- Tombol Edit (Kuning/Oren) -->
                          <router-link :to="{ name: 'admin-car-edit', params: { id: product.id } }" class="w-8 h-8 rounded bg-[#eab308] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Edit Data">
                              <Edit class="size-6 text-white" />
                          </router-link>

                          <!-- Tombol Hapus/Nonaktifkan (Merah) -->
                          <button @click="deleteProduct(product.id, product.name)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan">
                              <Trash class="size-6 text-white" />
                          </button>
                      </template>

                      <template v-else>
                          <!-- Tombol Restore/Aktifkan (Hijau) -->
                          <button @click="restoreProduct(product.id, product.name)"
                                  class="h-8 px-3 rounded bg-[#16a34a] text-white flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity" title="Aktifkan Kembali">
                              <span class="material-symbols-outlined text-[18px]">restore</span>
                              <span class="text-[10px] font-black uppercase tracking-widest">RESTORE</span>
                          </button>
                      </template>
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Tabel (Summary Status) -->
      <div class="p-5 md:p-6 border-t border-[#f2f4f6] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f7f9fb]/50">
          <p class="text-sm text-[#727687] font-medium">Total Vehicles: <span class="font-black text-[#191c1e] text-base">{{ products.length }}</span></p>
          <div class="flex gap-6">
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></span> Active
              </span>
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#d32f2f] rounded-full"></span> Inactive (Hidden)
              </span>
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
