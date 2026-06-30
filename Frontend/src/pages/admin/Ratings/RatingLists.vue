<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import Show from '@/components/icons/Show.vue' // Komponen untuk menampilkan data detail transaksi (opsional)
import Trash from '@/components/icons/TrashCan.vue' // Komponen untuk menghapus data transaksi (opsional)

// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref("")
const isLoading = ref(false)

// Dummy Data Ulasan Pelanggan GASNGO
const reviews = ref([
  {
    id: 1,
    username: 'Daniel Pratama',
    avatar: null,
    comment: 'Layanan yang luar biasa. Porsche Taycan yang saya sewa dalam kondisi sempurna dan sangat bersih. Layanan antar-jemputnya sangat tepat waktu.',
    rating: 5,
    createdAt: '2024-05-10'
  },
  {
    id: 2,
    username: 'Elena Rostova',
    avatar: 'https://i.pravatar.cc/150?img=5',
    comment: 'Mobilnya fantastis, tapi proses serah terima dokumen memakan waktu sedikit lebih lama dari perkiraan. Selebihnya sangat memuaskan.',
    rating: 4,
    createdAt: '2024-05-08'
  },
  {
    id: 3,
    username: 'Ahmad Wijaya',
    avatar: null,
    comment: 'Pengalaman mobilitas premium yang tak terlupakan. Sangat merekomendasikan GASNGO untuk tamu VIP.',
    rating: 5,
    createdAt: '2024-05-05'
  },
  {
    id: 4,
    username: 'Clara Michelle',
    avatar: 'https://i.pravatar.cc/150?img=9',
    comment: 'Harga sepadan dengan kualitas. Fitur pemesanan tanpa lag benar-benar terbukti.',
    rating: 5,
    createdAt: '2024-05-01'
  }
])

// --- MOCKUP FUNCTIONS ---

// Logika Pencarian Lokal (Frontend)
const filteredReviews = computed(() => {
  if (!searchQuery.value) return reviews.value
  const query = searchQuery.value.toLowerCase()
  return reviews.value.filter(item =>
    (item.username && item.username.toLowerCase().includes(query)) ||
    (item.comment && item.comment.toLowerCase().includes(query))
  )
})

// Simulasi Membuka Detail Ulasan menggunakan SweetAlert2
const openDetail = (item) => {
  // Membuat string bintang
  const stars = '⭐'.repeat(item.rating)

  Swal.fire({
    title: `Customer Review`,
    html: `
      <div class="text-left mt-4 space-y-4">
        <div class="flex items-center gap-3 pb-4 border-b border-[#c2c6d8]/40">
          <div class="w-12 h-12 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#0050cb] font-black uppercase border border-[#b3c5ff]/50 overflow-hidden shrink-0">
             ${item.avatar ? `<img src="${item.avatar}" class="w-full h-full object-cover"/>` : item.username.substring(0,2)}
          </div>
          <div>
            <p class="font-bold text-[#191c1e] text-lg leading-none">${item.username}</p>
            <p class="text-[10px] text-[#727687] font-bold uppercase tracking-widest mt-1">${item.createdAt}</p>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1">Rating</p>
          <p class="text-xl">${stars}</p>
        </div>
        <div>
          <p class="text-[10px] font-bold text-[#727687] uppercase tracking-widest mb-1">Comment</p>
          <p class="text-[#424656] text-sm bg-[#f2f4f6] p-4 rounded-xl border border-[#c2c6d8]/40 italic leading-relaxed">
            "${item.comment}"
          </p>
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonColor: '#0050cb',
    confirmButtonText: 'Close Detail',
    customClass: {
      popup: 'rounded-3xl'
    }
  })
}

// Simulasi Hapus Ulasan
const deleteReview = (id) => {
  Swal.fire({
    title: 'Delete Review?',
    text: "This review will be permanently removed from the system.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Yes, Delete!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      reviews.value = reviews.value.filter(r => r.id !== id)
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Review has been deleted.',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Customer Reviews</h1>
        <p class="text-sm text-[#727687]">Manage GASNGO customer feedback, ratings, and experiences.</p>
      </div>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="relative w-full md:w-1/2 lg:w-1/3">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
            placeholder="Search name or review content..."
          />
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[800px]">
          <!-- Header Tabel (Navy Blue) -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4 w-64">CUSTOMER</th>
              <th class="px-6 py-4">REVIEW SNIPPET</th>
              <th class="px-6 py-4 w-32 text-center">RATING</th>
              <th class="px-6 py-4 w-28 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="p-10 text-center text-[#727687] font-medium animate-pulse">Loading reviews...</td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredReviews.length === 0">
              <td colspan="5" class="p-12 text-center text-[#727687] font-medium">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50 block">comments_disabled</span>
                No reviews found.
              </td>
            </tr>

            <!-- Looping Data Ulasan -->
            <tr v-for="(item, index) in filteredReviews" :key="item.id" class="transition-colors hover:bg-blue-50/30">
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Info Pelanggan -->
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-[#0050cb] font-black uppercase border border-[#b3c5ff]/50 overflow-hidden shrink-0">
                    <img
                      v-if="item.avatar"
                      :src="item.avatar"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-xs">{{ item.username.substring(0,2) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-extrabold text-[#191c1e] text-sm">{{ item.username }}</span>
                    <span class="text-[9px] font-bold uppercase tracking-widest text-[#727687] mt-0.5">{{ item.createdAt }}</span>
                  </div>
                </div>
              </td>

              <!-- 3. Cuplikan Ulasan -->
              <td class="px-6 py-5 text-[#424656] text-sm font-medium">
                <p class="truncate max-w-[250px] lg:max-w-sm italic">
                  "{{ item.comment }}"
                </p>
              </td>

              <!-- 4. Rating Bintang -->
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-0.5">
                  <span
                    v-for="s in item.rating"
                    :key="s"
                    class="material-symbols-outlined text-[#eab308] text-[18px]"
                    style="font-variation-settings: 'FILL' 1;"
                  >
                    star
                  </span>
                </div>
              </td>

              <!-- 5. Aksi (Detail & Hapus) -->
              <td class="px-6 py-5">
                <div class="flex gap-2 items-center justify-center">
                  <!-- Tombol Detail (Biru) -->
                  <button @click="openDetail(item)" class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Lihat Detail Ulasan">
                    <Show class="size-6 text-white" />
                  </button>

                  <!-- Tombol Hapus (Merah) -->
                  <button @click="deleteReview(item.id)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Hapus Ulasan">
                    <Trash class="size-6 text-white" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Tabel (Summary) -->
      <div class="p-5 md:p-6 border-t border-[#f2f4f6] bg-[#f7f9fb]/50 flex justify-between items-center text-sm text-[#727687]">
        <div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">
          Total System Reviews: <span class="text-[#0050cb] font-black text-sm">{{ reviews.length }}</span>
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
