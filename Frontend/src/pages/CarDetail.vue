<script setup>
// Script setup untuk logika halaman detail mobil.
// Nantinya Anda bisa menambahkan fungsi pemanggilan API berdasarkan ID mobil di sini.
const handleBooking = () => {
  // Logika ketika tombol confirm ditekan
  alert('Reservasi Berhasil Dikonfirmasi!')
}
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-20">

    <!-- ================= KINETIC GALLERY HERO ================= -->
    <!-- PERUBAHAN: Tinggi fixed yang berlebihan dihapus, diganti dengan padding (py-16 lg:py-24) agar rapi mengikuti ukuran mobil -->
    <section class="relative overflow-hidden bg-[#f2f4f6] flex items-center px-4 sm:px-8 py-16 lg:py-24">
      <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

        <!-- Kiri: Teks & Harga -->
        <div class="lg:col-span-5 z-10">
          <span class="text-xs md:text-sm uppercase tracking-[0.2em] text-[#0050cb] font-bold mb-3 md:mb-4 block">
            Seri Grand Tourer
          </span>
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#191c1e] mb-4 md:mb-6 leading-none">
            Porsche 911 <br /><span class="text-[#0066ff]">Carrera</span>
          </h1>
          <p class="text-[#424656] text-base md:text-lg max-w-md font-medium leading-relaxed mb-6 md:mb-8">
            Tenaga tanpa kompromi berpadu dengan kemewahan artisanal. Puncak mahakarya teknik otomotif, kini tersedia untuk perjalanan eksklusif Anda.
          </p>
          <div class="flex gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#0050cb]">
              <span class="block text-[10px] md:text-xs uppercase tracking-widest text-[#424656] mb-1 font-bold">
                Mulai Dari
              </span>
              <span class="text-xl md:text-2xl font-extrabold text-[#191c1e]">
                $1,250<span class="text-xs md:text-sm font-medium text-[#424656]">/hari</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Kanan: Gambar Mobil -->
        <!-- PERUBAHAN: Menghapus absolute yang melebar, membuat gambar responsif dan berada persis di tengah kolomnya -->
        <div class="lg:col-span-7 relative flex justify-center items-center mt-8 lg:mt-0">
          <div class="w-full max-w-2xl mx-auto">
            <img
              alt="Model Mobil Mewah"
              class="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5"
            />
          </div>
        </div>

      </div>
    </section>

    <!-- ================= TECHNICAL SPEC & BOOKING ================= -->
    <section class="bg-white py-16 lg:py-24 px-4 sm:px-8 relative">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <!-- Kiri & Tengah: Spesifikasi & Galeri -->
          <div class="lg:col-span-2">
            <!-- Judul Spesifikasi -->
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 lg:mb-12 gap-2">
              <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-[#191c1e]">
                Keunggulan Teknis
              </h2>
              <span class="text-[#727687] font-mono text-xs md:text-sm">KODE_SPEK: BT-992-GT</span>
            </div>

            <!-- Technical Blueprint Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#c2c6d8]/30 rounded-xl overflow-hidden border border-[#c2c6d8]/30">
              <!-- Spec Card 1 -->
              <div class="bg-white p-6 md:p-8 flex flex-col gap-3 md:gap-4 relative pt-10">
                <span class="material-symbols-outlined text-[#0050cb] text-3xl absolute top-4 right-4 bg-blue-50 p-2 rounded-full shadow-sm">speed</span>
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#727687]">Akselerasi</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl md:text-4xl font-extrabold text-[#191c1e]">3.4</span>
                  <span class="text-[#424656] font-medium text-sm md:text-base">0-100 KM/JAM</span>
                </div>
                <p class="text-xs md:text-sm text-[#424656] leading-relaxed">
                  Mesin V12 Twin-turbocharged yang memberikan akselerasi murni dan resonansi suara yang melodis.
                </p>
              </div>

              <!-- Spec Card 2 -->
              <div class="bg-white p-6 md:p-8 flex flex-col gap-3 md:gap-4 relative pt-10">
                <span class="material-symbols-outlined text-[#0050cb] text-3xl absolute top-4 right-4 bg-blue-50 p-2 rounded-full shadow-sm">electric_car</span>
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#727687]">Transmisi</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl md:text-4xl font-extrabold text-[#191c1e]">8-SPD</span>
                  <span class="text-[#424656] font-medium text-sm md:text-base">SHIFT-BY-WIRE</span>
                </div>
                <p class="text-xs md:text-sm text-[#424656] leading-relaxed">
                  Perpindahan gigi mulus dengan rasio presisi tinggi, sempurna untuk jalanan kota maupun penjelajahan antar-kota.
                </p>
              </div>

              <!-- Spec Card 3 -->
              <div class="bg-white p-6 md:p-8 flex flex-col gap-3 md:gap-4 relative pt-10">
                <span class="material-symbols-outlined text-[#0050cb] text-3xl absolute top-4 right-4 bg-blue-50 p-2 rounded-full shadow-sm">settings_input_component</span>
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#727687]">Sistem Penggerak</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl md:text-4xl font-extrabold text-[#191c1e]">RWD</span>
                  <span class="text-[#424656] font-medium text-sm md:text-base">DYNAMIC LOCK</span>
                </div>
                <p class="text-xs md:text-sm text-[#424656] leading-relaxed">
                  Penggerak roda belakang (RWD) dengan vektor torsi aktif untuk kelincahan menikung yang superior.
                </p>
              </div>

              <!-- Spec Card 4 -->
              <div class="bg-white p-6 md:p-8 flex flex-col gap-3 md:gap-4 relative pt-10">
                <span class="material-symbols-outlined text-[#0050cb] text-3xl absolute top-4 right-4 bg-blue-50 p-2 rounded-full shadow-sm">bolt</span>
                <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#727687]">Output Tenaga</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl md:text-4xl font-extrabold text-[#191c1e]">715</span>
                  <span class="text-[#424656] font-medium text-sm md:text-base">TENAGA KUDA (HP)</span>
                </div>
                <p class="text-xs md:text-sm text-[#424656] leading-relaxed">
                  Torsi maksimum 900Nm yang tersedia mulai dari 1.800 RPM untuk penyaluran tenaga yang mudah tanpa henti.
                </p>
              </div>
            </div>

            <!-- Gallery Tease -->
            <div class="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <div class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm">
                <img
                  alt="Detail Interior"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5"
                />
              </div>
              <div class="aspect-video bg-[#f2f4f6] rounded-xl overflow-hidden shadow-sm">
                <img
                  alt="Detail Eksterior"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzGLHrTayzvLUSWS00F4_f8dgUwU_YxkDuVUXzx-W_Vf0mAVXvW3ngeMNZKezLL2HlkiM61rsL_aeotsre8vA2pKx0s5zwIKzmgYXU1jaIcxu-kKPv99_QyPDBJUhh_cgxC2spgQFvySwYJY9lZRRkN4bGihv-6ESETKVQJmc-CIA9cjx07PJ61xZxtsv8nx0YCC670KiiS4G_n5sAR6BOei_wl34rPEh6RZVkBA7Y0wuXwUBrleBlBmFxSrJgiO7DKQRTCN82OYi5"
                />
              </div>
            </div>
          </div>

          <!-- Kanan: Booking Sidebar (Sticky di Desktop) -->
          <div class="lg:col-span-1 mt-8 lg:mt-0">
            <div class="sticky top-28 bg-[#f2f4f6] p-6 md:p-8 rounded-2xl shadow-sm border border-[#c2c6d8]/20">
              <h3 class="text-xl md:text-2xl font-extrabold tracking-tight mb-6 md:mb-8 text-[#191c1e]">
                Amankan Perjalanan Anda
              </h3>

              <form @submit.prevent="handleBooking" class="space-y-5 md:space-y-6">
                <!-- Location -->
                <div>
                  <label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656] mb-2">Lokasi Pengambilan</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0050cb]">location_on</span>
                    <select class="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 md:py-4 rounded-xl text-[#191c1e] text-sm font-medium focus:ring-2 focus:ring-[#0050cb]/30 outline-none appearance-none">
                      <option>Bali, Indonesia</option>
                      <option>Jakarta Selatan, Indonesia</option>
                      <option>Surabaya, Indonesia</option>
                    </select>
                  </div>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656] mb-2">Tanggal Mulai</label>
                    <input class="w-full bg-white border border-gray-200 px-3 md:px-4 py-3 md:py-4 rounded-xl text-xs md:text-sm font-medium focus:ring-2 focus:ring-[#0050cb]/30 outline-none" type="date"/>
                  </div>
                  <div>
                    <label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656] mb-2">Tanggal Selesai</label>
                    <input class="w-full bg-white border border-gray-200 px-3 md:px-4 py-3 md:py-4 rounded-xl text-xs md:text-sm font-medium focus:ring-2 focus:ring-[#0050cb]/30 outline-none" type="date"/>
                  </div>
                </div>

                <!-- Price Breakdown -->
                <div class="bg-[#e6e8ea]/50 p-4 rounded-xl space-y-3 border border-gray-200/50">
                  <div class="flex justify-between text-xs md:text-sm">
                    <span class="text-[#424656]">Tarif Harian</span>
                    <span class="font-bold text-[#191c1e]">$1,250.00</span>
                  </div>
                  <div class="flex justify-between text-xs md:text-sm">
                    <span class="text-[#424656]">Layanan Pramutamu</span>
                    <span class="font-bold text-[#191c1e]">$150.00</span>
                  </div>
                  <div class="border-t border-[#c2c6d8]/40 pt-3 flex items-center justify-between">
                    <span class="font-bold text-[#191c1e] text-sm">Estimasi Total</span>
                    <span class="text-lg md:text-xl font-extrabold text-[#0050cb]">$1,400.00</span>
                  </div>
                </div>

                <RouterLink
                  to="/checkout"
                  class="signature-gradient w-full py-4 md:py-5 rounded-xl text-white font-bold text-base md:text-lg shadow-lg shadow-[#0050cb]/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-block text-center"
                >
                  Konfirmasi Reservasi
                </RouterLink>

                <p class="text-center text-[10px] md:text-xs text-[#424656] font-medium px-2">
                  Tidak perlu pembayaran di awal. Pembatalan gratis hingga 24 jam sebelumnya.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Icon Material Setting */
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

/* Gradient Custom sesuai desain */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Menghilangkan panah spinner bawaan input date di beberapa browser */
input[type='date']::-webkit-inner-spin-button,
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}
</style>
