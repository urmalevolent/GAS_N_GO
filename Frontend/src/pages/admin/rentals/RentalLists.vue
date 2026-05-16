<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

// --- MOCKUP STATE (Tanpa Backend) ---
const searchQuery = ref('')

// Data Dummy Pesanan Sewa Mobil GASNGO
const orders = ref([
  {
    id: 'LX-8892-TY',
    recipient_name: 'Daniel Pratama',
    recipient_phone: '081234567890',
    total_price: 1925,
    status: 'paid', // Status: paid (siap diantar)
    tracking_number: null,
    courier: null,
    shipping_address: 'Kawasan Elit Pondok Indah, Jakarta Selatan'
  },
  {
    id: 'LX-8871-FR',
    recipient_name: 'Elena Rostova',
    recipient_phone: '081987654321',
    total_price: 2450,
    status: 'shipped', // Status: shipped (sedang diantar / dibawa pelanggan)
    tracking_number: 'LX-VIP-001',
    courier: 'Pramutamu Internal',
    shipping_address: 'Bandara Internasional Soekarno-Hatta (VIP Lounge)'
  },
  {
    id: 'LX-8820-BM',
    recipient_name: 'Ahmad Wijaya',
    recipient_phone: '082211223344',
    total_price: 1900,
    status: 'pending', // Status: pending (belum dibayar)
    tracking_number: null,
    courier: null,
    shipping_address: 'Hotel Mulia Senayan, Jakarta'
  },
  {
    id: 'LX-8999-AD',
    recipient_name: 'Clara Michelle',
    recipient_phone: '081333444555',
    total_price: 6000,
    status: 'completed', // Status: completed (Sewa selesai)
    tracking_number: 'LX-VIP-099',
    courier: 'Pramutamu Internal',
    shipping_address: 'Plaza Indonesia, Jakarta Pusat'
  }
])

// --- MOCKUP FUNCTIONS ---

// Filter Pencarian Lokal
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  const query = searchQuery.value.toLowerCase()
  return orders.value.filter(order =>
    order.recipient_name.toLowerCase().includes(query) ||
    order.id.toLowerCase().includes(query) ||
    order.status.toLowerCase().includes(query)
  )
})

// Format Mata Uang USD
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Simulasi Buka Detail (Alert Sederhana)
const openDetail = (order) => {
  Swal.fire({
    title: `Detail Pesanan ${order.id}`,
    text: `Penyewa: ${order.recipient_name} | Total: ${formatPrice(order.total_price)}`,
    icon: 'info',
    confirmButtonColor: '#0050cb'
  })
}

// Simulasi Hapus Pesanan
const deleteOrder = (order) => {
  Swal.fire({
    title: 'Hapus Pesanan?',
    text: `Data pesanan ${order.id} akan dihapus secara permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#0050cb',
    confirmButtonText: 'Ya, Hapus'
  }).then((result) => {
    if(result.isConfirmed) {
      orders.value = orders.value.filter(o => o.id !== order.id)
      Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false })
    }
  })
}

// --- LOGIKA 1: INPUT RESI (Status: PAID -> SHIPPED) ---
const handleInputResi = async (order) => {
    const { value: formValues } = await Swal.fire({
        title: 'Konfirmasi Pengiriman Armada',
        html: `
            <div class="text-left font-['Manrope']">
                <label class="block mb-2 font-bold text-[#191c1e] text-sm">Metode Pengiriman:</label>
                <div class="flex gap-4 mb-5">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="courier" value="Pramutamu Internal" id="concierge" checked class="w-4 h-4 accent-[#0050cb]">
                        <span class="text-sm font-medium text-[#424656]">Pramutamu (Concierge)</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="courier" value="Ambil Sendiri" id="pickup" class="w-4 h-4 accent-[#0050cb]">
                        <span class="text-sm font-medium text-[#424656]">Ambil Sendiri (Lounge)</span>
                    </label>
                </div>
                <label class="block mb-2 font-bold text-[#191c1e] text-sm">Nomor Referensi Pengiriman:</label>
                <input id="swal-input-resi" class="w-full border border-[#c2c6d8] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0050cb]/30 text-sm" placeholder="Contoh: LX-VIP-001">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Proses & Beri Tahu Pelanggan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#0050cb',
        customClass: { popup: 'rounded-2xl' },
        preConfirm: () => {
            const resi = document.getElementById('swal-input-resi').value;
            const courier = document.querySelector('input[name="courier"]:checked').value;

            if (!resi) {
                Swal.showValidationMessage('Nomor referensi wajib diisi!');
                return false;
            }
            return { resi, courier };
        }
    });

    if (formValues) {
        const { resi, courier } = formValues;

        // Simulasi Loading Jaringan
        Swal.fire({
            title: 'Memproses...',
            text: `Menugaskan ${courier}...`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        setTimeout(() => {
          // Update UI Lokal
          const ord = orders.value.find(o => o.id === order.id)
          if(ord) {
            ord.status = 'shipped';
            ord.tracking_number = resi;
            ord.courier = courier;
          }

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Armada sedang diproses via ${courier}. Email notifikasi telah dikirim ke pelanggan.`,
            confirmButtonColor: '#0050cb'
          });
        }, 1500)
    }
};

// --- LOGIKA 2: TANDAI SELESAI (Status: SHIPPED -> COMPLETED) ---
const handleMarkDelivered = async (order) => {
    Swal.fire({
        title: 'Armada Telah Dikembalikan?',
        text: "Status pesanan akan diubah menjadi Selesai dan tidak bisa dikembalikan ke status sebelumnya.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Tandai Selesai',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#d33',
        customClass: { popup: 'rounded-2xl' }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'Memperbarui...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            setTimeout(() => {
              const ord = orders.value.find(o => o.id === order.id)
              if(ord) ord.status = 'completed';

              Swal.fire({
                icon: 'success',
                title: 'Selesai!',
                text: 'Pesanan telah berhasil diselesaikan.',
                timer: 1500,
                showConfirmButton: false
              });
            }, 1000)
        }
    });
};
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Daftar Pesanan</h1>
        <p class="text-sm text-[#727687]">Pantau dan kelola seluruh status reservasi penyewaan armada GASNGO.</p>
      </div>
    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="relative w-full md:w-1/2">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
            placeholder="Cari ID Reservasi atau Nama Pelanggan..."
          />
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[1000px]">
          <!-- Header Tabel (Navy Blue) -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4">REFERENSI</th>
              <th class="px-6 py-4">PELANGGAN</th>
              <th class="px-6 py-4 text-right">TAGIHAN</th>
              <th class="px-6 py-4 text-center">STATUS</th>
              <th class="px-6 py-4">PENGIRIMAN & ALAMAT</th>
              <th class="px-6 py-4 text-center w-40">AKSI</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">

             <!-- Empty State -->
             <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="p-12 text-center text-[#727687] font-medium">
                  <span class="material-symbols-outlined text-4xl mb-2 opacity-50 block">receipt_long</span>
                  Tidak ada data reservasi ditemukan.
                </td>
             </tr>

             <!-- Looping Order -->
             <tr v-else v-for="(order, index) in filteredOrders" :key="order.id" class="transition-colors hover:bg-blue-50/30">

                <!-- 1. Nomor -->
                <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

                <!-- 2. ID Referensi -->
                <td class="px-6 py-5">
                  <span class="font-bold text-[#0050cb] bg-[#e6eeff] px-2.5 py-1 rounded text-xs border border-[#b3c5ff]/50 uppercase tracking-widest">
                    {{ order.id }}
                  </span>
                </td>

                <!-- 3. Pelanggan -->
                <td class="px-6 py-5">
                  <div class="font-extrabold text-[#191c1e] text-sm">{{ order.recipient_name }}</div>
                  <div class="text-[11px] font-bold text-[#727687] tracking-widest mt-0.5">{{ order.recipient_phone }}</div>
                </td>

                <!-- 4. Total Tagihan -->
                <td class="px-6 py-5 text-right font-black text-[#191c1e] text-base">
                  {{ formatPrice(order.total_price) }}
                </td>

                <!-- 5. Status -->
                <td class="px-6 py-5 text-center">
                  <span
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    :class="{
                      'bg-orange-100 text-[#cc4204] border-[#cc4204]/30': order.status === 'pending',
                      'bg-green-100 text-green-700 border-green-300': order.status === 'paid',
                      'bg-blue-100 text-[#0050cb] border-[#0050cb]/30': order.status === 'shipped',
                      'bg-[#f2f4f6] text-[#424656] border-[#c2c6d8]/50': order.status === 'completed'
                    }"
                  >
                    <!-- Terjemahan Teks Status -->
                    {{
                      order.status === 'pending' ? 'MENUNGGU PEMBAYARAN' :
                      order.status === 'paid' ? 'LUNAS (SIAP ANTAR)' :
                      order.status === 'shipped' ? 'DALAM MASA SEWA' : 'SELESAI'
                    }}
                  </span>
                </td>

                <!-- 6. Pengiriman & Alamat -->
                <td class="px-6 py-5">
                  <div v-if="order.tracking_number" class="text-[#191c1e] font-extrabold text-sm flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-[#0050cb]">verified</span>
                    {{ order.tracking_number }}
                  </div>
                  <div v-else class="text-[#727687] text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">pending_actions</span>
                    Belum diproses
                  </div>
                  <div class="text-[11px] text-[#424656] font-medium mt-1 truncate max-w-[200px]" :title="order.shipping_address">
                    {{ order.shipping_address }}
                  </div>
                </td>

                <!-- 7. Aksi (Tombol Proses / Detail / Hapus) -->
                <td class="px-6 py-5">
                  <div class="flex gap-2 items-center justify-center">

                    <!-- Tombol Proses Kirim (Muncul jika status PAID) -->
                    <button v-if="order.status === 'paid'" @click="handleInputResi(order)" title="Proses Pengiriman" class="flex items-center justify-center h-8 px-3 rounded-lg bg-[#0050cb] hover:bg-[#0066ff] transition-colors text-white gap-1.5 shadow-sm shadow-blue-600/20 active:scale-95">
                       <span class="material-symbols-outlined text-[16px]">local_shipping</span>
                       <span class="text-[10px] font-bold uppercase tracking-widest">KIRIM</span>
                    </button>

                    <!-- Tombol Selesai (Muncul jika status SHIPPED) -->
                    <button v-if="order.status === 'shipped'" @click="handleMarkDelivered(order)" title="Tandai Sewa Selesai" class="flex items-center justify-center h-8 px-3 rounded-lg bg-[#16a34a] hover:bg-green-700 transition-colors text-white gap-1.5 shadow-sm active:scale-95">
                       <span class="material-symbols-outlined text-[16px]">check_circle</span>
                       <span class="text-[10px] font-bold uppercase tracking-widest">SELESAI</span>
                    </button>

                    <!-- Tombol Detail (Umum) -->
                    <button @click="openDetail(order)" title="Lihat Detail Pesanan" class="w-8 h-8 rounded-lg bg-[#295f98] hover:bg-blue-800 transition-colors text-white flex items-center justify-center shadow-sm">
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>

                    <!-- Tombol Hapus (Umum) -->
                    <button @click="deleteOrder(order)" title="Hapus Reservasi" class="w-8 h-8 rounded-lg bg-[#d32f2f] hover:bg-red-700 transition-colors text-white flex items-center justify-center shadow-sm">
                      <span class="material-symbols-outlined text-[18px]">delete</span>
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
          Menampilkan <span class="text-[#0050cb] font-black text-sm">{{ filteredOrders.length }}</span> Reservasi Aktif
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
