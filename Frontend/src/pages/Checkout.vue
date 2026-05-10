<script setup>
import { ref } from 'vue'

// State untuk mengatur pilihan metode pengiriman kendaraan
const deliveryMethod = ref('concierge') // Nilai default: 'concierge' atau 'lounge'
</script>

<template>
  <!-- Wrapper utama halaman Checkout -->
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-20 pt-8 md:pt-12 antialiased selection:bg-[#0066ff]/20">

    <main class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

        <!-- ================= KOLOM KIRI: ALUR CHECKOUT ================= -->
        <div class="lg:col-span-8 space-y-10 md:space-y-12">

          <!-- Indikator Proses (Progress Bar) -->
          <div class="flex items-center justify-between max-w-md mx-auto mb-10 md:mb-16">
            <!-- Step 1: Booking (Aktif) -->
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#0050cb] text-white font-bold ring-4 ring-[#0066ff]/20 text-sm md:text-base">1</div>
              <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#0050cb]">Reservasi</span>
            </div>
            <div class="h-0.5 flex-1 bg-[#0050cb] mx-2 md:mx-4"></div>

            <!-- Step 2: Identity (Belum) -->
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#e0e3e5] text-[#424656] font-bold text-sm md:text-base">2</div>
              <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#424656]">Identitas</span>
            </div>
            <div class="h-0.5 flex-1 bg-[#e0e3e5] mx-2 md:mx-4"></div>

            <!-- Step 3: Payment (Belum) -->
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#e0e3e5] text-[#424656] font-bold text-sm md:text-base">3</div>
              <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#424656]">Pembayaran</span>
            </div>
          </div>

          <!-- Formulir 1: Informasi Pribadi -->
          <section class="bg-white rounded-xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 md:gap-4">
              <span class="material-symbols-outlined text-[#0050cb] text-2xl md:text-3xl">person_outline</span>
              <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-[#191c1e]">Informasi Pribadi</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div class="space-y-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nama Depan</label>
                <input class="w-full h-12 px-4 bg-[#f2f4f6] border border-transparent rounded-md focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Masukkan nama depan" type="text"/>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nama Belakang</label>
                <input class="w-full h-12 px-4 bg-[#f2f4f6] border border-transparent rounded-md focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Masukkan nama belakang" type="text"/>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Email</label>
                <input class="w-full h-12 px-4 bg-[#f2f4f6] border border-transparent rounded-md focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="email@eksekutif.com" type="email"/>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Address</label>
                <input class="w-full h-12 px-4 bg-[#f2f4f6] border border-transparent rounded-md focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Masukkan alamat lengkap" type="text"/>
              </div>
            </div>
          </section>

          <!-- Formulir 2: Preferensi Pengiriman -->
          <section class="bg-white rounded-xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-sm border border-gray-100">
            <div class="flex items-center gap-3 md:gap-4">
              <span class="material-symbols-outlined text-[#0050cb] text-2xl md:text-3xl">location_on</span>
              <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-[#191c1e]">Detail Pengiriman</h2>
            </div>

            <!-- Pilihan Metode (Radio Buttons) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Opsi 1: Concierge -->
              <label class="relative cursor-pointer group">
                <input v-model="deliveryMethod" value="concierge" class="peer sr-only" name="delivery" type="radio"/>
                <div class="p-5 md:p-6 bg-[#f2f4f6] rounded-lg border-2 border-transparent peer-checked:border-[#0050cb] peer-checked:bg-blue-50/50 hover:bg-gray-100 transition-all h-full">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-[#191c1e]">Layanan Antar Pramutamu</span>
                    <span v-if="deliveryMethod === 'concierge'" class="material-symbols-outlined text-[#0050cb]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span v-else class="material-symbols-outlined text-[#727687]">radio_button_unchecked</span>
                  </div>
                  <p class="text-xs md:text-sm text-[#424656] leading-relaxed">Kendaraan diantar langsung ke lokasi yang Anda tentukan di dalam kota.</p>
                </div>
              </label>

              <!-- Opsi 2: Lounge -->
              <label class="relative cursor-pointer group">
                <input v-model="deliveryMethod" value="lounge" class="peer sr-only" name="delivery" type="radio"/>
                <div class="p-5 md:p-6 bg-[#f2f4f6] rounded-lg border-2 border-transparent peer-checked:border-[#0050cb] peer-checked:bg-blue-50/50 hover:bg-gray-100 transition-all h-full">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-[#191c1e]">Ambil di Lounge Utama</span>
                    <span v-if="deliveryMethod === 'lounge'" class="material-symbols-outlined text-[#0050cb]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span v-else class="material-symbols-outlined text-[#727687]">radio_button_unchecked</span>
                  </div>
                  <p class="text-xs md:text-sm text-[#424656] leading-relaxed">Ambil kendaraan dari lounge terminal privat eksklusif kami.</p>
                </div>
              </label>
            </div>

            <!-- Input Alamat (Muncul jika Concierge dipilih) -->
            <div v-show="deliveryMethod === 'concierge'" class="space-y-2 pt-2 animate-fade-in">
              <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Alamat Pengiriman</label>
              <input class="w-full h-12 px-4 bg-[#f2f4f6] border border-transparent rounded-md focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all text-[#191c1e] outline-none" placeholder="Masukkan nama jalan atau hotel" type="text"/>
            </div>
          </section>

          <!-- Aksi / Navigasi Bawah -->
          <div class="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 gap-4 sm:gap-0">

            <!-- Tombol Kembali -->
            <button @click="$router.back()" class="flex items-center gap-2 font-bold text-[#0050cb] hover:opacity-80 transition-opacity text-sm w-full sm:w-auto justify-center sm:justify-start py-3 sm:py-0">
              <span class="material-symbols-outlined">arrow_back</span>
              Kembali
            </button>

            <!-- Tombol Lanjut Verifikasi -->
            <RouterLink
              to="/verify"
              class="signature-gradient text-white px-8 py-4 rounded-md font-bold tracking-tight shadow-lg shadow-[#0050cb]/20 hover:scale-[1.02] active:scale-95 transition-transform w-full sm:w-auto text-center text-sm md:text-base inline-block"
            >
              Lanjut Verifikasi Identitas
            </RouterLink>

          </div>

        </div>

        <!-- ================= KOLOM KANAN: RINGKASAN ORDER (STICKY) ================= -->
        <aside class="lg:col-span-4 sticky top-28 mt-8 lg:mt-0">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            <!-- Area Gambar -->
            <div class="relative h-48 md:h-56 overflow-hidden">
              <img alt="Interior mobil mewah" class="w-full h-full object-cover"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbNwblIpL83CZIN9HyQ1WtZHmoR-fKmXsqAtiOhUazm_i3v-Pe4d0nr5IFUSReU4y2DvAFHtuugxdt6NNjATQxca6k1mOhFTDiHZCeYK5Hoh9i5KnUYjCcV2i9T_5VKm7lRmpgWU18AH95YppwJCySJVdh9Xzf4L2-T6tl24ojzEclEOdIb0g6slptXeln2wN2WWLlgl8YniGFnWZmkMa2bgji6xLkwWQUlSLaqU8KeYTv-O0Jj7agLo5s6HSn0XIgJN83IoOqVkiW"/>
              <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase text-[#0050cb] shadow-sm">
                Ketersediaan Dikonfirmasi
              </div>
            </div>

            <!-- Detail Harga & Order -->
            <div class="p-6 md:p-8 space-y-6">
              <div>
                <h3 class="text-xl md:text-2xl font-extrabold tracking-tight text-[#191c1e]">Porsche 911 Carrera</h3>
                <p class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656] mt-1.5">450 HP • BENSIN</p>
              </div>

              <div class="space-y-4 pt-4">
                <div class="flex justify-between items-center text-xs md:text-sm">
                  <span class="text-[#424656]">Tarif Harian (3 Hari)</span>
                  <span class="font-medium text-[#191c1e]">$2,850.00</span>
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm">
                  <span class="text-[#424656]">Biaya Pramutamu</span>
                  <span class="font-medium text-[#191c1e]">$150.00</span>
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm">
                  <span class="text-[#424656]">Asuransi Premium</span>
                  <span class="font-medium text-[#191c1e]">$450.00</span>
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm">
                  <span class="text-[#424656]">Pajak & Biaya Admin</span>
                  <span class="font-medium text-[#191c1e]">$234.50</span>
                </div>
              </div>

              <!-- Total Harga -->
              <div class="pt-6 border-t border-[#f2f4f6]">
                <div class="flex justify-between items-end mb-2">
                  <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656] mb-1">Total Biaya</span>
                  <span class="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#191c1e]">$3,684.50</span>
                </div>
              </div>

              <!-- Lencana Keamanan -->
              <div class="bg-[#f7f9fb] border border-gray-100 p-4 rounded-lg flex items-start gap-3">
                <span class="material-symbols-outlined text-[#0050cb] text-lg mt-0.5">verified_user</span>
                <div>
                  <p class="text-[11px] md:text-xs font-bold text-[#191c1e]">Pembayaran 100% Aman</p>
                  <p class="text-[10px] leading-relaxed text-[#424656] mt-1">Data Anda dilindungi oleh enkripsi 256-bit. GASNGO tidak pernah menyimpan detail kartu kredit Anda secara penuh.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Assistance / Bantuan Bawah -->
          <div class="mt-6 p-5 md:p-6 rounded-xl border-2 border-dashed border-[#c2c6d8]/50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#0050cb]">support_agent</span>
              <div class="text-xs md:text-sm">
                <p class="font-bold text-[#191c1e]">Butuh bantuan?</p>
                <p class="text-[#424656] text-[10px] md:text-xs mt-0.5">Dukungan Prioritas 24/7</p>
              </div>
            </div>
            <button class="text-[#0050cb] font-bold text-xs md:text-sm hover:underline outline-none">Chat Kami</button>
          </div>
        </aside>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Custom sesuai tema GASNGO */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Animasi memudar masuk untuk kolom input alamat */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
