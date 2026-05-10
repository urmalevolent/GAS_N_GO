<script setup>
// Bagian script untuk fungsi / logika halaman Service
</script>

<template>
  <!-- Wrapper utama halaman Service dengan warna background bawaan desain -->
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen selection:bg-[#0066ff] selection:text-[#f8f7ff] pb-20">

    <!-- Hero Section -->
    <section class="px-4 sm:px-6 md:px-12 pt-12 md:pt-20 lg:pt-24 mb-24 max-w-screen-2xl mx-auto overflow-hidden">
      <!-- PERUBAHAN 1: Mengganti items-end menjadi items-center agar teks sejajar presisi di tengah pada Desktop -->
      <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

        <div class="lg:col-span-7 pb-8 lg:pb-0">
          <span class="text-sm uppercase tracking-[0.2em] text-[#0050cb] font-bold mb-4 block">Mobilitas Personal</span>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[1.1] md:leading-[0.95] text-[#191c1e] mb-6 lg:mb-8">
            Presisi <br/>Performa <br/>
            <span class="text-[#c2c6d8] opacity-60">Kesempurnaan.</span>
          </h1>
          <p class="text-lg text-[#424656] max-w-xl leading-relaxed">
            Lebih dari sekadar memutar kunci. Rasakan spektrum keunggulan otomotif yang dirancang khusus untuk memenuhi setiap aspek gaya hidup dan bisnis kelas atas.
          </p>
        </div>

        <div class="lg:col-span-5 relative mt-6 lg:mt-0">
          <div class="aspect-[4/5] lg:aspect-[3/4] xl:aspect-square w-full max-h-[600px] bg-[#f2f4f6] rounded-2xl overflow-hidden relative z-10 editorial-shadow">
            <img
              alt="Mobil sport mewah warna abu-abu"
              class="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHWhh0CLpkg5CFHCaFQucgBZVFWOIjjXR8_SfKLWiAhieczH0y2jRPfJMH6BjcnmUETGXxSs0sgTTQICBZUPbC8zl7-bN1nX8PAAv_ZKc7pZ6g0TgvSZK0u6xgaVp9aavEwfafXijNdHb-6m3Gph97eGJm2Jf6LTFHE1KRaVO1CDUIpsYgf9yJTcKthwUW_TePWAXM4pxOklgi00Ura0SieBD2N-9UE19m9UxtxPNKLxvusCyH4Xiv0zfh9ApAENrtkWjaFdR6JqjZ"
            />
          </div>
          <!-- Overlapping Decorative Element -->
          <div class="absolute -bottom-10 -left-10 md:-left-16 w-48 lg:w-64 h-48 lg:h-64 bg-[#0050cb]/10 rounded-full blur-3xl -z-10"></div>
        </div>

      </div>
    </section>

    <!-- Service Categories: Bento-Style Grid -->
    <section class="px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-[#f2f4f6]">
      <div class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-[#191c1e]">Ekosistem Layanan</h2>
            <p class="text-[#424656] max-w-xl text-lg">Mengkurasi momen perjalanan melalui solusi khusus bagi individu dan perusahaan dengan selera tinggi.</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="h-[1px] w-16 md:w-32 bg-[#c2c6d8]/50 hidden sm:block"></div>
            <span class="text-xs md:text-sm font-black uppercase tracking-widest text-[#727687]">03 Pilar Utama</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- Daily Rental -->
          <div class="group relative flex flex-col bg-white p-8 md:p-10 rounded-xl editorial-shadow hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-transparent hover:border-blue-50">
            <div class="mb-12 relative z-10">
              <span class="material-symbols-outlined text-4xl text-[#0050cb] mb-6 block">auto_awesome</span>
              <h3 class="text-2xl font-bold mb-4 text-[#191c1e]">Sewa Harian</h3>
              <p class="text-[#424656] leading-relaxed">Perjalanan spontan bertemu dengan mahakarya teknis. Akses armada terbaik kami untuk liburan akhir pekan atau penjelajahan urban Anda.</p>
            </div>
            <div class="mt-auto flex items-center justify-between z-10">
              <span class="text-[11px] font-black uppercase tracking-tighter text-[#727687]">Keunggulan Personal</span>
              <button class="w-12 h-12 rounded-full border border-[#c2c6d8] flex items-center justify-center group-hover:bg-[#0050cb] group-hover:border-[#0050cb] transition-all duration-300">
                <span class="material-symbols-outlined text-xl text-[#727687] group-hover:text-white">north_east</span>
              </button>
            </div>
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#0050cb]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          <!-- Corporate Solutions -->
          <div class="group relative flex flex-col bg-white p-8 md:p-10 rounded-xl editorial-shadow hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-transparent hover:border-blue-50">
            <div class="mb-12 relative z-10">
              <span class="material-symbols-outlined text-4xl text-[#0050cb] mb-6 block">business_center</span>
              <h3 class="text-2xl font-bold mb-4 text-[#191c1e]">Solusi Korporat</h3>
              <p class="text-[#424656] leading-relaxed">Mendefinisikan ulang mobilitas eksekutif. Manajemen armada khusus dan layanan pramudi (chauffeur) yang dirancang untuk perusahaan modern.</p>
            </div>
            <div class="mt-auto flex items-center justify-between z-10">
              <span class="text-[11px] font-black uppercase tracking-tighter text-[#727687]">Manajemen Armada</span>
              <button class="w-12 h-12 rounded-full border border-[#c2c6d8] flex items-center justify-center group-hover:bg-[#0050cb] group-hover:border-[#0050cb] transition-all duration-300">
                <span class="material-symbols-outlined text-xl text-[#727687] group-hover:text-white">north_east</span>
              </button>
            </div>
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#425ca0]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          <!-- Special Events -->
          <div class="group relative flex flex-col bg-white p-8 md:p-10 rounded-xl editorial-shadow hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-transparent hover:border-blue-50">
            <div class="mb-12 relative z-10">
              <span class="material-symbols-outlined text-4xl text-[#0050cb] mb-6 block">celebration</span>
              <h3 class="text-2xl font-bold mb-4 text-[#191c1e]">Acara Spesial</h3>
              <p class="text-[#424656] leading-relaxed">Menyempurnakan momen penting dalam hidup Anda. Dari pernikahan megah hingga acara karpet merah, pastikan kedatangan Anda sama tak terlupakannya dengan acara tersebut.</p>
            </div>
            <div class="mt-auto flex items-center justify-between z-10">
              <span class="text-[11px] font-black uppercase tracking-tighter text-[#727687]">Layanan Gala Eksklusif</span>
              <button class="w-12 h-12 rounded-full border border-[#c2c6d8] flex items-center justify-center group-hover:bg-[#0050cb] group-hover:border-[#0050cb] transition-all duration-300">
                <span class="material-symbols-outlined text-xl text-[#727687] group-hover:text-white">north_east</span>
              </button>
            </div>
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-[#a33200]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Detail Section: Asymmetric Editorial -->
    <section class="py-20 md:py-32 px-4 sm:px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">

        <div class="relative mt-8 md:mt-0">
          <div class="aspect-[4/3] md:aspect-video bg-[#eceef0] overflow-hidden rounded-xl shadow-lg">
            <img
              alt="Interior sedan mewah"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOmIo36z589jqr6hAPPHRSKhqebfaghWs-9TO8kGcqmnSCLHXGR8nuU2yTn-y-bwQlLEDaErWfbgl8uJ-W0y1e1Svlo_e51LsbrU47kD6fnidFTZp2SqPtFcBE2OY72cQo6yFB7J_NSvPx8QpOUf2RNWwlzWq9OZyogEZH9xo75Zg42JcmlQ50gZToJ0LY9XHFxlj0dWTSeBZDn-pZoVp9I8dUHaempKx0njZb8bN4l22ei2FTU_MbO-_IZC92mCL2OpjEwUzOeVOj"
            />
          </div>
          <!-- Floating Feature Card (Disetel agar aman di layar HP) -->
          <div class="absolute -bottom-10 left-4 right-4 md:left-auto md:-right-8 bg-white p-6 md:p-8 rounded-xl editorial-shadow md:max-w-xs border-l-4 border-[#0050cb]">
            <span class="material-symbols-outlined text-[#0050cb] text-3xl mb-3 md:mb-4">verified</span>
            <h4 class="font-bold text-lg md:text-xl mb-2 text-[#191c1e]">Protokol Pramutamu</h4>
            <p class="text-sm text-[#424656]">Setiap penyewaan mencakup dukungan teknis 24/7 dan layanan antar kendaraan eksklusif langsung ke pintu Anda.</p>
          </div>
        </div>

        <div class="space-y-6 md:space-y-8 mt-12 md:mt-0">
          <h2 class="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] md:leading-tight text-[#191c1e]">
            Standar <br/><span class="text-[#0050cb]">Eksekutif.</span>
          </h2>
          <p class="text-base md:text-lg text-[#424656] leading-relaxed">
            Bagi mitra korporat kami, GASNGO menyediakan lebih dari sekadar kendaraan. Kami menawarkan perpanjangan dari prestise merek Anda. Armada kami dirawat dengan standar presisi tinggi, memastikan eksekutif dan klien Anda bepergian dalam ketenangan, kenyamanan, dan keamanan absolut.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#0050cb]">check_circle</span>
              <span class="font-medium text-[#191c1e]">Prioritas Reservasi Armada</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#0050cb]">check_circle</span>
              <span class="font-medium text-[#191c1e]">Manajemen Akun Khusus</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[#0050cb]">check_circle</span>
              <span class="font-medium text-[#191c1e]">Layanan Pramudi Rahasia & Privat</span>
            </li>
          </ul>
          <button class="signature-gradient text-white px-8 md:px-10 py-3 md:py-4 rounded-md font-bold tracking-tight shadow-lg shadow-blue-600/30 w-full sm:w-auto transition-transform hover:-translate-y-0.5">
            Ajukan Layanan Korporat
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Canvas -->
    <section class="px-4 sm:px-6 md:px-12 py-16 md:py-32">
      <div class="max-w-screen-2xl mx-auto rounded-[2rem] bg-[#0f172a] p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
        <div class="relative z-10 max-w-2xl">
          <h2 class="text-white text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">Siap menentukan arah perjalanan Anda?</h2>
          <p class="text-slate-400 text-lg md:text-xl mb-10 md:mb-12">Tim pramutamu kami siap membantu merancang pengalaman mobilitas yang selaras dengan ambisi Anda.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <button class="bg-white text-slate-950 px-8 py-4 rounded-md font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto">Hubungi Pramutamu</button>
            <button class="border border-slate-700 text-white px-8 py-4 rounded-md font-bold hover:bg-slate-800 transition-colors w-full sm:w-auto">Lihat Semua Layanan</button>
          </div>
        </div>
        <!-- Background texture/light -->
        <div class="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 blur-[80px] md:blur-[120px] -mr-20 md:-mr-40 -mt-20 md:-mt-40"></div>
        <div class="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-800/10 blur-[60px] md:blur-[100px] -ml-10 md:-ml-20 -mb-10 md:-mb-20"></div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Pengaturan Material Icon agar terlihat sesuai standar desain Anda */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Gradient Khusus untuk Tombol */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Shadow Editorial Khusus untuk Kotak Service */
.editorial-shadow {
  box-shadow: 0 10px 30px -10px rgba(25, 28, 30, 0.08);
}
</style>
