<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import Trash from '@/components/icons/TrashCan.vue' // Komponen untuk menghapus data transaksi (opsional)
import Edit from '@/components/icons/Edit.vue' // Komponen untuk mengedit data transaksi (opsional)

// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref("")
const isLoading = ref(false)

// Dummy Data Kategori GASNGO
const categories = ref([
  { id: 1, name: 'Sedan Eksekutif', car_count: 12 },
  { id: 2, name: 'SUV Premium', car_count: 8 },
  { id: 3, name: 'Mobil Sport', car_count: 15 },
  { id: 4, name: 'Elektrik Mewah', car_count: 6 },
  { id: 5, name: 'Hypercar', car_count: 3 },
])

// --- MOCKUP FUNCTIONS ---

// Logika Filter Pencarian
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(cat =>
    cat.name.toLowerCase().includes(query)
  );
})

// Simulasi Tambah Kategori (Menggunakan SweetAlert Input)
const handleNewCategory = async () => {
  const { value: categoryName } = await Swal.fire({
    title: 'Kategori Baru',
    input: 'text',
    inputLabel: 'Masukkan nama kategori armada',
    inputPlaceholder: 'Contoh: Convertible...',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value) return 'Nama kategori tidak boleh kosong!'
    }
  });

  if (categoryName) {
    // Tambah ke data lokal (dummy)
    categories.value.unshift({
      id: Date.now(),
      name: categoryName,
      car_count: 0
    });

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan!',
      text: `Kategori "${categoryName}" berhasil ditambahkan.`,
      showConfirmButton: false,
      timer: 1500
    });
  }
}

// Simulasi Edit Kategori
const openEditModal = async (category) => {
  const { value: newName } = await Swal.fire({
    title: 'Edit Kategori',
    input: 'text',
    inputValue: category.name,
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Perbarui',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value) return 'Nama kategori tidak boleh kosong!'
    }
  });

  if (newName && newName !== category.name) {
    const catIndex = categories.value.findIndex(c => c.id === category.id);
    if (catIndex !== -1) {
      categories.value[catIndex].name = newName;
    }

    Swal.fire({
      icon: 'success',
      title: 'Diperbarui!',
      text: 'Nama kategori berhasil diubah.',
      showConfirmButton: false,
      timer: 1500
    });
  }
}

// Simulasi Hapus Kategori
const deleteCategory = (id, name) => {
  Swal.fire({
    title: `Hapus Kategori?`,
    text: `Anda akan menghapus kategori "${name}". Tindakan ini tidak dapat dibatalkan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus data lokal (dummy)
      categories.value = categories.value.filter(c => c.id !== id);

      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Kategori berhasil dihapus.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  })
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Kategori Armada</h1>
        <p class="text-sm text-[#727687]">Kelola tipe dan klasifikasi armada untuk mempermudah pencarian pelanggan.</p>
      </div>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar & Tombol Tambah -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

          <!-- Search Input -->
          <div class="relative w-full sm:w-1/2 md:w-1/3 order-2 sm:order-1">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari kategori..."
              class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
            >
          </div>

          <!-- Tombol Tambah -->
          <button
            @click="handleNewCategory"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-[#0050cb] hover:bg-[#0066ff] text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-blue-600/20 active:scale-95 order-1 sm:order-2 w-full sm:w-auto"
          >
            <span class="material-symbols-outlined text-lg">add</span> Kategori Baru
          </button>

        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[600px]">
          <!-- Header Tabel (Navy Blue) -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-16 text-center">NO</th>
              <th class="px-6 py-4">NAMA KATEGORI</th>
              <th class="px-6 py-4 text-center">TOTAL ARMADA</th>
              <th class="px-6 py-4 text-center w-32">AKSI</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <!-- Loading State (Jika diaktifkan) -->
            <tr v-if="isLoading">
              <td colspan="4" class="p-12 text-center text-[#727687] font-medium">
                <span class="material-symbols-outlined animate-spin text-3xl text-[#0050cb] block mb-2">sync</span>
                Memuat data...
              </td>
            </tr>

            <!-- Jika Data Kosong -->
            <tr v-else-if="filteredCategories.length === 0">
              <td colspan="4" class="p-12 text-center text-[#727687] font-medium">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50 block">category</span>
                Kategori tidak ditemukan.
              </td>
            </tr>

            <!-- Looping Data Kategori -->
            <tr v-else v-for="(category, index) in filteredCategories" :key="category.id"
                class="transition-colors hover:bg-blue-50/30"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Nama Kategori -->
              <td class="px-6 py-5 text-[#191c1e] font-extrabold text-base tracking-wide uppercase">
                {{ category.name }}
              </td>

              <!-- 3. Total Armada (Mockup Badge) -->
              <td class="px-6 py-5 text-center">
                <span class="inline-flex items-center justify-center px-3 py-1 bg-[#f2f4f6] border border-[#c2c6d8]/50 rounded-full text-xs font-black text-[#424656]">
                  {{ category.car_count }} Unit
                </span>
              </td>

              <!-- 4. Aksi -->
              <td class="px-6 py-5">
                <div class="flex gap-2 items-center justify-center">
                  <!-- Tombol Edit (Kuning) -->
                  <button @click="openEditModal(category)" class="w-8 h-8 rounded bg-[#eab308] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Edit Kategori">
                    <Edit class="size-6 text-white" />
                  </button>

                  <!-- Tombol Hapus (Merah) -->
                  <button @click="deleteCategory(category.id, category.name)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Hapus Kategori">
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
        <p class="font-medium">Menampilkan <span class="font-black text-[#191c1e]">{{ filteredCategories.length }}</span> kategori</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animasi Rotasi Loading (Jika Dibutuhkan) */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
