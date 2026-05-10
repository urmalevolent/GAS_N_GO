<script setup>
// ASSETS
// import Allantak from '@/assets/images/allan_tak.png'
import carhome1 from '@/assets/images/gambar_mobil_home.png'
import Taycan from '@/assets/images/Taycan_TurboS.png'
</script>

<template>
  <!-- Wrapper utama halaman Home dengan background abu-abu sangat muda -->
  <div class="bg-[#f8fafa] min-h-screen pb-20">

    <!-- ==========================================
         1. HERO SECTION (Bagian Paling Atas)
         ========================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-16">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Kiri: Teks & Tombol -->
        <div class="space-y-8">
          <!-- Badge -->
          <div class="inline-block bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-wider">
            Tingkatkan Pengalaman Anda
          </div>

          <!-- Headline -->
          <h1 class="text-[3rem] sm:text-[4rem] lg:text-[5rem] font-black leading-[1.1] text-[#111827] tracking-tight uppercase">
            Kendarai <br />
            <span class="text-[#0d6efd]">Kemewahan Sempurna</span>
          </h1>

          <!-- Deskripsi -->
          <p class="text-slate-600 text-lg sm:text-xl max-w-lg leading-relaxed">
            Rasakan puncak mahakarya otomotif melalui koleksi eksklusif supercar kelas dunia dan sedan mewah kami.
          </p>

          <!-- Tombol -->
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink
              to="/cars"
              class="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wide text-sm text-center inline-block"
            >
              Jelajahi Armada
            </RouterLink>
            <RouterLink
              to="/services"
              class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-8 py-3.5 rounded transition-all uppercase tracking-wide text-sm text-center inline-block"
            >
              Lihat Layanan
            </RouterLink>
          </div>
        </div>

        <!-- Kanan: Gambar Mobil & Floating Card -->
        <div class="relative mt-10 lg:mt-0">
          <!-- Background Shape Abu-abu -->
          <div class="absolute inset-0 bg-slate-200 rounded-[40px] translate-x-4 -translate-y-4 sm:translate-x-8 sm:-translate-y-8 -z-10"></div>

          <!-- Gambar Mobil Utama -->
          <img
            :src="Taycan"
            alt="Porsche Mewah"
            class="rounded-[30px] shadow-2xl w-full object-cover h-[300px] sm:h-[400px] lg:h-[500px]"
          />

          <!-- Floating Card (New Arrival) -->
          <div class="absolute -bottom-6 -left-2 sm:-left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow">
            <div class="bg-blue-600 p-3 rounded-lg text-white">
              <!-- Icon Mobil Kecil -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Unit Baru
              </p>
              <p class="text-sm font-black text-slate-800">Taycan Turbo S</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         2. SEARCH BAR (Kotak Pencarian Tersedia)
         ========================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
      <div class="bg-white rounded-xl shadow-xl p-2 sm:p-4 flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

        <!-- Tanggal Rental -->
        <div class="w-full lg:w-1/3 p-4 flex flex-col justify-center">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Tanggal Rental
          </label>
          <div class="flex items-center gap-3 text-slate-800 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="blue" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <input type="text" placeholder="hh / bb / tttt" class="w-full outline-none bg-transparent placeholder-slate-800" />
          </div>
        </div>

        <!-- Tanggal Pengembalian -->
        <div class="w-full lg:w-1/3 p-4 flex flex-col justify-center">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Tanggal Pengembalian
          </label>
          <div class="flex items-center gap-3 text-slate-800 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="blue" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <input type="text" placeholder="hh / bb / tttt" class="w-full outline-none bg-transparent placeholder-slate-800" />
          </div>
        </div>

        <!-- Tipe Mobil & Tombol -->
        <div class="w-full lg:w-1/3 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="w-full">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tipe Mobil
            </label>
            <div class="flex items-center justify-between text-slate-800 font-medium cursor-pointer">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="blue" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>Supercar Eksotis</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3 p-4 flex flex-col">
          <button class="w-full sm:w-auto bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-center py-3.5 px-6 rounded whitespace-nowrap uppercase text-xs tracking-wider transition-colors">
            Cari Ketersediaan
          </button>
        </div>

      </div>
    </section>

    <!-- ==========================================
         3. FEATURES HEADER (Judul Fitur)
         ========================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-10">
      <div class="max-w-2xl">
        <h2 class="text-3xl md:text-4xl lg:text-[40px] font-black text-[#111827] uppercase leading-none mb-4">
          Mendefinisikan Ulang Standar Mobilitas Mewah.
        </h2>
        <p class="text-slate-600 text-lg leading-relaxed">
          Kami tidak sekadar menyewakan mobil; kami menghadirkan pengalaman sempurna yang dirancang khusus bagi pengemudi dengan selera tinggi.
        </p>
      </div>
    </section>

    <!-- ==========================================
         4. BENTO GRID FEATURES (Kotak-kotak Layanan)
         ========================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Kotak 1 (Kiri Atas, Lebar) -->
        <div class="lg:col-span-2 bg-[#f0f2f5] rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 group">
          <div class="flex-1 space-y-4">
            <div class="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900">Layanan Pramutamu Premium</h3>
            <p class="text-slate-600 leading-relaxed">
              Tim ahli kami memastikan kendaraan Anda diantar dan dijemput sesuai kenyamanan Anda, di mana pun dalam area metropolitan.
            </p>
          </div>
          <div class="w-full md:w-1/2 overflow-hidden rounded-2xl">
            <img :src="carhome1" alt="Penyerahan kunci mobil" class="w-full h-48 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500 grayscale" />
          </div>
        </div>

        <!-- Kotak 2 (Kanan Atas, Biru) -->
        <div class="bg-[#0d6efd] rounded-3xl p-8 lg:p-10 flex flex-col justify-center text-white">
          <div class="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">Pemesanan Instan</h3>
          <p class="text-blue-100 leading-relaxed">
            Pendekatan digital kami memastikan Anda berada di balik kemudi dalam waktu kurang dari 5 menit. Tanpa dokumen rumit, langsung nikmati perjalanan.
          </p>
        </div>

        <!-- Kotak 3 (Kiri Bawah, Putih) -->
        <div class="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div class="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-4">Armada Pilihan Elit</h3>
          <p class="text-slate-600 leading-relaxed">
            Hanya menyediakan model keluaran terbaru dengan spesifikasi khusus. Kami menjaga standar kesempurnaan tertinggi pada setiap kendaraan.
          </p>
        </div>

        <!-- Kotak 4 (Kanan Bawah, Lebar) -->
        <div class="lg:col-span-2 bg-[#f0f2f5] rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 group">
          <div class="flex-1 space-y-4">
            <div class="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900">Kebebasan Tanpa Batas</h3>
            <p class="text-slate-600 leading-relaxed">
              Jarak tempuh tanpa batas untuk model mewah pilihan serta opsi pengembalian antar-kota demi melengkapi perjalanan jauh Anda.
            </p>
          </div>
          <div class="w-full md:w-1/2 overflow-hidden rounded-2xl">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop" alt="Jalan pesisir pantai" class="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         5. CALL TO ACTION (Form Email)
         ========================================== -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div class="bg-white rounded-[40px] shadow-sm py-16 px-6 sm:px-12 text-center border border-gray-100">
        <h2 class="text-3xl md:text-4xl lg:text-[42px] font-black text-[#111827] uppercase leading-tight mb-4">
          Siap Mengubah <br class="hidden sm:block" />
          Perspektif Perjalanan Anda?
        </h2>
        <p class="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
          Bergabunglah dengan klub eksklusif GASNGO untuk mendapatkan akses prioritas ke unit terbaru dan penawaran khusus member.
        </p>

        <!-- Form Input & Button -->
        <form @submit.prevent class="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Alamat email Anda"
            required
            class="w-full sm:flex-1 bg-[#f0f2f5] px-6 py-4 rounded-md outline-none text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600/50 transition-all"
          />
          <button
            type="submit"
            class="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-md uppercase text-sm tracking-wide transition-colors"
          >
            Gabung Sekarang
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style>
/* Animasi kecil untuk floating card (naik turun pelan) */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}
</style>
