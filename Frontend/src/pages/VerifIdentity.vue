<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Fungsi contoh saat tombol submit ditekan
const handleSubmit = () => {
  alert('Dokumen berhasil dikirim untuk proses verifikasi!')
  // router.push('/') // Navigasi ke halaman sukses/pembayaran jika diperlukan
}
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen relative overflow-hidden pb-10">

    <!-- Elemen Dekoratif Blur (Latar Belakang) -->
    <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-[#b3c5ff]/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
    <div class="absolute top-40 -left-20 w-64 h-64 bg-[#9bb4fe]/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

    <main class="pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">

      <!-- ================= PROGRESS BAR (Indikator Proses) ================= -->
      <div class="flex items-center justify-between max-w-md mx-auto mb-10 md:mb-16">
        <!-- Step 1: Reservasi (Sudah Selesai) -->
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#0050cb] text-white font-bold ring-4 ring-transparent text-sm md:text-base">
            <!-- Icon Checklist untuk Step yang sudah selesai -->
            <span class="material-symbols-outlined text-[20px] md:text-[24px]">check</span>
          </div>
          <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#0050cb]">Reservasi</span>
        </div>
        <!-- Garis biru penanda sudah lewat -->
        <div class="h-0.5 flex-1 bg-[#0050cb] mx-2 md:mx-4"></div>

        <!-- Step 2: Identitas (Saat ini aktif) -->
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#0050cb] text-white font-bold ring-4 ring-[#0066ff]/20 text-sm md:text-base">2</div>
          <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#0050cb]">Identitas</span>
        </div>
        <!-- Garis abu-abu penanda belum lewat -->
        <div class="h-0.5 flex-1 bg-[#e0e3e5] mx-2 md:mx-4"></div>

        <!-- Step 3: Pembayaran (Belum tercapai) -->
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#e0e3e5] text-[#424656] font-bold text-sm md:text-base">3</div>
          <span class="text-[9px] md:text-xs font-bold tracking-widest uppercase text-[#424656]">Pembayaran</span>
        </div>
      </div>

      <!-- ================= HEADER SECTION ================= -->
      <section class="mb-10 md:mb-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <span class="inline-block bg-[#9bb4fe]/20 text-[#294487] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-[#9bb4fe]/30">
              Verifikasi Aman
            </span>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-[#191c1e] leading-tight mb-4 md:mb-6">
              Verifikasi identitas Anda.
            </h1>
            <p class="text-[#424656] text-base md:text-lg leading-relaxed">
              Untuk memastikan pengalaman premium yang tanpa cela, kami memerlukan pindaian resolusi tinggi dari Kartu Tanda Penduduk (KTP) dan Surat Izin Mengemudi (SIM) resmi Anda.
            </p>
          </div>
          <div class="flex flex-col items-start md:items-end bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-2.5 h-2.5 bg-[#0050cb] rounded-full animate-pulse"></span>
              <span class="text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#0050cb]">Menunggu Unggahan</span>
            </div>
            <p class="text-[10px] md:text-xs text-[#727687]">Estimasi waktu tinjau: 15 menit</p>
          </div>
        </div>
      </section>

      <!-- ================= BENTO GRID UPLOAD ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        <!-- Kolom Kiri: Panduan & Keamanan -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <!-- Panduan Unggah -->
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border-l-4 border-[#0050cb]">
            <h3 class="text-xs md:text-sm font-bold uppercase tracking-widest mb-6 text-[#191c1e]">Panduan Unggah</h3>
            <ul class="space-y-6">
              <li class="flex gap-4 items-start">
                <span class="material-symbols-outlined text-[#0050cb] text-xl mt-0.5">light_mode</span>
                <div class="text-sm">
                  <p class="font-bold text-[#191c1e]">Pencahayaan Optimal</p>
                  <p class="text-[#424656] mt-1">Hindari pantulan cahaya (silau) dan bayangan pada permukaan kartu.</p>
                </div>
              </li>
              <li class="flex gap-4 items-start">
                <span class="material-symbols-outlined text-[#0050cb] text-xl mt-0.5">crop_free</span>
                <div class="text-sm">
                  <p class="font-bold text-[#191c1e]">Terlihat Penuh</p>
                  <p class="text-[#424656] mt-1">Pastikan keempat sudut dokumen berada di dalam bingkai foto.</p>
                </div>
              </li>
              <li class="flex gap-4 items-start">
                <span class="material-symbols-outlined text-[#0050cb] text-xl mt-0.5">verified</span>
                <div class="text-sm">
                  <p class="font-bold text-[#191c1e]">Status Berlaku</p>
                  <p class="text-[#424656] mt-1">Dokumen harus asli, masih berlaku, dan belum kedaluwarsa.</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Catatan Keamanan -->
          <div class="bg-[#f2f4f6] p-5 md:p-6 rounded-xl flex items-start gap-4 border border-[#c2c6d8]/30">
            <span class="material-symbols-outlined text-[#727687] mt-0.5" style="font-variation-settings: 'FILL' 1;">lock</span>
            <p class="text-[11px] md:text-xs text-[#424656] leading-relaxed">
              Data Anda dienkripsi menggunakan standar militer AES-256 dan digunakan secara ketat hanya untuk keperluan verifikasi penyewaan.
            </p>
          </div>
        </div>

        <!-- Kolom Kanan: Zona Unggah Dokumen -->
        <div class="lg:col-span-8 flex flex-col gap-10">

          <!-- Bagian KTP -->
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-lg md:text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-[#191c1e]">
              <span class="w-8 h-[3px] bg-[#0050cb] rounded-full"></span>
              KTP (Kartu Tanda Penduduk)
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- KTP Depan -->
              <div class="group relative overflow-hidden bg-[#f2f4f6] border-2 border-dashed border-[#c2c6d8] rounded-xl aspect-[1.6/1] flex flex-col items-center justify-center cursor-pointer hover:border-[#0050cb]/60 transition-all duration-300">
                <div class="flex flex-col items-center group-hover:scale-105 transition-transform z-10">
                  <span class="material-symbols-outlined text-3xl md:text-4xl text-[#727687] mb-2 group-hover:text-[#0050cb] transition-colors">add_a_photo</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656] group-hover:text-[#0050cb]">Unggah Depan</span>
                </div>
                <div class="absolute bottom-4 right-4 opacity-5">
                  <span class="material-symbols-outlined text-7xl">badge</span>
                </div>
              </div>
              <!-- KTP Belakang -->
              <div class="group relative overflow-hidden bg-[#f2f4f6] border-2 border-dashed border-[#c2c6d8] rounded-xl aspect-[1.6/1] flex flex-col items-center justify-center cursor-pointer hover:border-[#0050cb]/60 transition-all duration-300">
                <div class="flex flex-col items-center group-hover:scale-105 transition-transform z-10">
                  <span class="material-symbols-outlined text-3xl md:text-4xl text-[#727687] mb-2 group-hover:text-[#0050cb] transition-colors">add_a_photo</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656] group-hover:text-[#0050cb]">Unggah Belakang</span>
                </div>
                <div class="absolute top-4 left-4 opacity-5">
                  <span class="material-symbols-outlined text-7xl">credit_card</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bagian SIM -->
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-lg md:text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-[#191c1e]">
              <span class="w-8 h-[3px] bg-[#0050cb] rounded-full"></span>
              SIM (Surat Izin Mengemudi)
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- SIM Depan -->
              <div class="group relative overflow-hidden bg-[#f2f4f6] border-2 border-dashed border-[#c2c6d8] rounded-xl aspect-[1.6/1] flex flex-col items-center justify-center cursor-pointer hover:border-[#0050cb]/60 transition-all duration-300">
                <div class="flex flex-col items-center group-hover:scale-105 transition-transform z-10">
                  <span class="material-symbols-outlined text-3xl md:text-4xl text-[#727687] mb-2 group-hover:text-[#0050cb] transition-colors">file_upload</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656] group-hover:text-[#0050cb]">Unggah Depan</span>
                </div>
                <div class="absolute bottom-4 right-4 opacity-5">
                  <span class="material-symbols-outlined text-7xl">directions_car</span>
                </div>
              </div>
              <!-- SIM Belakang -->
              <div class="group relative overflow-hidden bg-[#f2f4f6] border-2 border-dashed border-[#c2c6d8] rounded-xl aspect-[1.6/1] flex flex-col items-center justify-center cursor-pointer hover:border-[#0050cb]/60 transition-all duration-300">
                <div class="flex flex-col items-center group-hover:scale-105 transition-transform z-10">
                  <span class="material-symbols-outlined text-3xl md:text-4xl text-[#727687] mb-2 group-hover:text-[#0050cb] transition-colors">file_upload</span>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656] group-hover:text-[#0050cb]">Unggah Belakang</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ================= ACTION BAR BAWAH ================= -->
      <div class="mt-12 md:mt-16 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">

          <!-- Status Enkripsi -->
          <div class="flex items-center gap-4 w-full sm:w-auto bg-[#f7f9fb] p-3 rounded-xl border border-gray-100">
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[#0050cb]" style="font-variation-settings: 'FILL' 1;">security</span>
            </div>
            <div>
              <p class="text-xs md:text-sm font-bold text-[#191c1e]">Proteksi Data Aktif</p>
              <p class="text-[9px] md:text-[10px] text-[#727687] uppercase tracking-widest mt-0.5">Enkripsi End-to-End</p>
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex flex-col-reverse sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto">
            <button @click="router.go(-1)" class="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest text-[#424656] hover:bg-[#f2f4f6] rounded-xl transition-all">
              Simpan Draf
            </button>
            <RouterLink :to="{ name: 'payment' }" @click="handleSubmit" class="signature-gradient w-full sm:w-auto px-6 md:px-10 py-3.5 md:py-4 text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#0050cb]/20 hover:scale-[1.02] active:scale-95 transition-all text-center">
              Kirim Verifikasi
            </RouterLink>
          </div>

        </div>
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
</style>
