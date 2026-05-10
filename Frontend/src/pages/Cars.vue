<script setup>
// Bagian script ini bisa Anda gunakan nanti untuk logika filter, search, atau memanggil API.
</script>

<template>
  <!-- Wrapper utama halaman Fleet/Cars -->
  <div
    class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen pb-20 pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto antialiased"
  >
    <!-- ================= EDITORIAL HEADER ================= -->
    <div class="mb-8 md:mb-12 pb-8 border-b border-[#c2c6d8]/40">
      <h1
        class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#191c1e] mb-3 md:mb-4"
      >
        The Kinetic <span class="text-[#0050cb]">Collection</span>
      </h1>
      <p class="text-[#424656] text-base md:text-lg max-w-2xl leading-relaxed">
        Kendaraan performa tinggi yang dikurasi khusus bagi pengemudi berselera tinggi. Rasakan
        puncak mahakarya teknik otomotif dan kemewahan.
      </p>
    </div>

    <!-- Layout Flex (Filter Kiri & Grid Kanan) -->
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      <!-- ================= SIDEBAR FILTER ================= -->
      <aside
        class="w-full lg:w-72 flex-shrink-0 space-y-8 md:space-y-10 lg:border-r lg:border-[#c2c6d8]/40 lg:pr-10 pb-8 lg:pb-0 border-b border-[#c2c6d8]/40 lg:border-b-0 sticky top-28"
      >
        <!-- Category Filter -->
        <section>
          <h3
            class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase"
          >
            Kategori
          </h3>
          <div class="space-y-3 md:space-y-4">
            <label class="flex items-center cursor-pointer group">
              <input
                checked
                class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]"
                type="checkbox"
              />
              <span
                class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors"
                >Sedan Eksekutif</span
              >
            </label>
            <label class="flex items-center cursor-pointer group">
              <input
                class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]"
                type="checkbox"
              />
              <span
                class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors"
                >SUV Performa</span
              >
            </label>
            <label class="flex items-center cursor-pointer group">
              <input
                class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]"
                type="checkbox"
              />
              <span
                class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors"
                >Hypercar</span
              >
            </label>
            <label class="flex items-center cursor-pointer group">
              <input
                class="w-5 h-5 rounded border-[#c2c6d8] text-[#0050cb] focus:ring-[#0066ff] bg-[#f2f4f6]"
                type="checkbox"
              />
              <span
                class="ml-3 text-sm font-medium text-[#424656] group-hover:text-[#0050cb] transition-colors"
                >Elektrik Mewah</span
              >
            </label>
          </div>
        </section>

        <!-- Daily Rate Range -->
        <section>
          <h3
            class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase"
          >
            Tarif Harian
          </h3>
          <div class="px-2">
            <input
              class="w-full h-1.5 bg-[#c2c6d8]/50 rounded-lg appearance-none cursor-pointer accent-[#0050cb]"
              type="range"
            />
            <div class="flex justify-between mt-4 text-xs font-bold text-[#424656]">
              <span>$250</span>
              <span>$5,000+</span>
            </div>
          </div>
        </section>

        <!-- Manufacturer Filter -->
        <section>
          <h3
            class="text-xs md:text-sm font-bold tracking-widest text-[#191c1e] mb-4 md:mb-6 uppercase"
          >
            Merek
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              class="bg-[#0050cb] text-white py-2.5 px-4 rounded-md text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              Porsche
            </button>
            <button
              class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]"
            >
              Tesla
            </button>
            <button
              class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]"
            >
              Ferrari
            </button>
            <button
              class="bg-white border border-[#c2c6d8]/50 text-[#424656] py-2.5 px-4 rounded-md text-xs font-bold transition-all hover:bg-gray-50 hover:border-[#0050cb] hover:text-[#0050cb]"
            >
              BMW
            </button>
          </div>
        </section>
      </aside>

      <!-- ================= CATALOG GRID ================= -->
      <div class="flex-grow w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <!-- Car Card 1 -->
          <div
            class="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 border border-gray-100/80"
          >
            <div class="relative h-56 sm:h-64 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Porsche 911 Carrera"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxHzsdBc2hzH_IJw-SBKJxjepSqbQO3o7PrzVULEL-UjF-Ldq3Fza8v3i0RPbmVFCLO-E_O5rQN5hEvDWcwbN10bz_4eCetDgr5taJU7ukqJ-HavuTLstjR6aADHy8TYqcP6P6nxW6WOTEAwcT3WsHIFRzWUUkcPP74Y3qu7Y0JYQYvLCvDDp37OpoY15JmaPbNBEWnyLo53hvE07ntZX1hTS0Es9qIl72meFCANR0CeyzQABsSXU3smVwh3F93g4Xen63kW1Dtydl"
              />
              <div
                class="absolute top-4 left-4 signature-gradient text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded uppercase shadow-sm"
              >
                Tersedia
              </div>
              <div
                class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm"
              >
                <span class="text-[#191c1e] font-extrabold text-lg">$850</span>
                <span class="text-[#424656] text-xs font-medium">/HARI</span>
              </div>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight mb-1">
                    Porsche 911 Carrera
                  </h3>
                  <span
                    class="text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#0050cb] uppercase"
                    >450 HP • BENSIN</span
                  >
                </div>
                <button class="text-slate-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">speed</span> 3.4s
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5"
                    >airline_seat_recline_extra</span
                  >
                  2
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">settings</span> PDK
                </div>
              </div>
              <RouterLink
                to="/cars/:id"
                class="block w-full py-3 md:py-4 border border-[#c2c6d8]/40 font-bold text-xs md:text-sm tracking-widest text-[#191c1e] text-center hover:bg-[#0050cb] hover:text-white hover:border-[#0050cb] transition-all duration-300 rounded-lg"
              >
                LIHAT DETAIL
              </RouterLink>
            </div>
          </div>

          <!-- Car Card 2 -->
          <div
            class="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 border border-gray-100/80"
          >
            <div class="relative h-56 sm:h-64 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Audi RS7 Performance"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8SNbMs3riBVFAKFnRL7sMK4rzp30K8474Iy0A-_328VW4EoOqUZxG9pmbiJM1NlrMULQeTNuOttjSe-rtrOqa-fhMy__teQnEL5JUqzi2OmC7ct9FjHBA59CU4thiV3M_sryU_xM9lpVIaedp9kaheNORDUEhXATlJoJ8JEhGeyAGDqCIKTWjgDShiEgA1PAVbjZQWTboT0ZZsIT8Xwn5OyVbPBlA2_TvE_qw4bw95zhV3hhRWYTYQeuGPi07pzVpl7ZS7w9PTZ4H"
              />
              <div
                class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm"
              >
                <span class="text-[#191c1e] font-extrabold text-lg">$1,200</span>
                <span class="text-[#424656] text-xs font-medium">/HARI</span>
              </div>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight mb-1">
                    Audi RS7 Performance
                  </h3>
                  <span
                    class="text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#0050cb] uppercase"
                    >621 HP • BI-TURBO</span
                  >
                </div>
                <button class="text-slate-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">speed</span> 3.3s
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5"
                    >airline_seat_recline_extra</span
                  >
                  4
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">settings</span> QUATTRO
                </div>
              </div>
              <RouterLink
                to="/cars/:id"
                class="block w-full py-3 md:py-4 border border-[#c2c6d8]/40 font-bold text-xs md:text-sm tracking-widest text-[#191c1e] text-center hover:bg-[#0050cb] hover:text-white hover:border-[#0050cb] transition-all duration-300 rounded-lg"
              >
                LIHAT DETAIL
              </RouterLink>
            </div>
          </div>

          <!-- Car Card 3 -->
          <div
            class="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 border border-gray-100/80"
          >
            <div class="relative h-56 sm:h-64 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Ferrari F8 Tributo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Yg-HFikLc4fIGMo9LhR3Dlcrv2E2E7kK7G8iXkf6ondHJctGaQrghKTSRmRyWqctizXdge_WSSg582vCKVOfH-d6CVLLK0oz6KhN-EdHRQ-qYfu4DEL548SX0vllYAEwqbtlaYgwJYFdRTZbdWG_zfsDNR7FM_udGDsOWf7IVkMk9vRzitHRuVQ99sOq8JsCJfNdF1swj4Ms7cO0zT4qs55rM3Dm49HyozAaCOoWQCNvf0a8RJGhqnjn1dZkncyIHLezvPx1BgBp"
              />
              <div
                class="absolute top-4 left-4 bg-[#a33200] text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded uppercase shadow-sm"
              >
                Koleksi Langka
              </div>
              <div
                class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm"
              >
                <span class="text-[#191c1e] font-extrabold text-lg">$2,450</span>
                <span class="text-[#424656] text-xs font-medium">/HARI</span>
              </div>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight mb-1">
                    Ferrari F8 Tributo
                  </h3>
                  <span
                    class="text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#0050cb] uppercase"
                    >710 HP • V8 MID-ENGINE</span
                  >
                </div>
                <button class="text-slate-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">speed</span> 2.9s
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5"
                    >airline_seat_recline_extra</span
                  >
                  2
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">settings</span> RWD
                </div>
              </div>
              <RouterLink
                to="/cars/:id"
                class="block w-full py-3 md:py-4 border border-[#c2c6d8]/40 font-bold text-xs md:text-sm tracking-widest text-[#191c1e] text-center hover:bg-[#0050cb] hover:text-white hover:border-[#0050cb] transition-all duration-300 rounded-lg"
              >
                LIHAT DETAIL
              </RouterLink>
            </div>
          </div>

          <!-- Car Card 4 -->
          <div
            class="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 border border-gray-100/80"
          >
            <div class="relative h-56 sm:h-64 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Model X Plaid"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVmS9a62zCS7ZFtaRjBN4fhlnzPinTcotpFsDSLzJNiYk8Q1ZyOUKSQgP3D_LD7tir_9aEqf0gEbcOXwCYTwP4b6kv7jrhsHMnrirpmXjUXpdtfUM0RGEFsnIUoYl4hSQhv3yXK1vqUKcchGqEVwIUQjw3oRU5anW_4Nh5tf0A0kAGEWbAEsLmOqwFMKqOxIzV2C6p45vhMJK7Rg5VZNkZ4eElGc6UlNrMGAepvXdAfXBfhxjo55fyc0jnkk6_KqJkz9BVfL--77rE"
              />
              <div
                class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm"
              >
                <span class="text-[#191c1e] font-extrabold text-lg">$450</span>
                <span class="text-[#424656] text-xs font-medium">/HARI</span>
              </div>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight mb-1">
                    Model X Plaid
                  </h3>
                  <span
                    class="text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#0050cb] uppercase"
                    >1020 HP • LISTRIK</span
                  >
                </div>
                <button class="text-slate-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">speed</span> 2.5s
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5"
                    >airline_seat_recline_extra</span
                  >
                  6
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">settings</span> AWD
                </div>
              </div>
              <RouterLink
                to="/cars/:id"
                class="block w-full py-3 md:py-4 border border-[#c2c6d8]/40 font-bold text-xs md:text-sm tracking-widest text-[#191c1e] text-center hover:bg-[#0050cb] hover:text-white hover:border-[#0050cb] transition-all duration-300 rounded-lg"
              >
                LIHAT DETAIL
              </RouterLink>
            </div>
          </div>

          <!-- Car Card 5 -->
          <div
            class="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-500 border border-gray-100/80"
          >
            <div class="relative h-56 sm:h-64 overflow-hidden">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="M8 Gran Coupe"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_jVTIWNSaDewjSAufpsFJsaOQyxLkSYGZxzZmvLAmd7rb2aB8I8HDODy2WLv4xZDiJjfmnCu5m6wk1tBydiotdjSPz8dGV6qiJs0l2SD9xXK8knrmHqZuizk0MSigRJ7YIXqwCwNsA6J0mPTNr0v_SgwiEWDF1bj1K3cnNC5015_G3tIFpctGTp9TLOUlmEEBZPVHG82U6MJ6WWeS9ARdJPEo7oHi2mcOB9HcTq2UKMUKUya8HszSvH1kyWHwQsRn0_YVwMdHKafE"
              />
              <div
                class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm"
              >
                <span class="text-[#191c1e] font-extrabold text-lg">$950</span>
                <span class="text-[#424656] text-xs font-medium">/HARI</span>
              </div>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight mb-1">
                    M8 Gran Coupe
                  </h3>
                  <span
                    class="text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#0050cb] uppercase"
                    >617 HP • V8 TURBO</span
                  >
                </div>
                <button class="text-slate-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">speed</span> 3.0s
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5"
                    >airline_seat_recline_extra</span
                  >
                  4
                </div>
                <div class="flex items-center text-[#424656] text-xs md:text-sm">
                  <span class="material-symbols-outlined text-sm mr-1.5">settings</span> XDRIVE
                </div>
              </div>
              <RouterLink
                to="/cars/:id"
                class="block w-full py-3 md:py-4 border border-[#c2c6d8]/40 font-bold text-xs md:text-sm tracking-widest text-[#191c1e] text-center hover:bg-[#0050cb] hover:text-white hover:border-[#0050cb] transition-all duration-300 rounded-lg"
              >
                LIHAT DETAIL
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- ================= PAGINATION ================= -->
        <div
          class="mt-12 md:mt-16 pt-8 border-t border-[#c2c6d8]/40 flex justify-center items-center gap-3 md:gap-5"
        >
          <!-- Prev Button -->
          <button
            class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>

          <!-- Numbers -->
          <div class="flex gap-2">
            <button
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl signature-gradient text-white font-bold shadow-lg shadow-[#0050cb]/30 transform hover:-translate-y-0.5 transition-all"
            >
              1
            </button>
            <button
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all"
            >
              2
            </button>
            <button
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all hidden sm:flex"
            >
              3
            </button>
            <!-- Tanda Titik-titik (Ellipsis) -->
            <span
              class="w-10 h-10 md:w-12 md:h-12 items-center justify-center text-[#424656] font-bold tracking-widest hidden sm:flex"
              >...</span
            >
            <button
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/40 hover:border-[#0050cb] hover:text-[#0050cb] font-bold text-[#424656] hover:shadow-sm transition-all hidden sm:flex"
            >
              8
            </button>
          </div>

          <!-- Next Button -->
          <button
            class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-[#c2c6d8]/50 hover:border-[#0050cb] hover:text-[#0050cb] transition-all text-[#424656] hover:shadow-md"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Material Icons */
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

/* Gradient Biru Kustom untuk Label 'In Stock' dan Promo Card */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}

/* Checkbox styling */
input[type='checkbox'] {
  accent-color: #0050cb;
}

/* Custom Range Input (Slider) Styling agar terlihat rapi */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #0050cb;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 80, 203, 0.4);
}
</style>
