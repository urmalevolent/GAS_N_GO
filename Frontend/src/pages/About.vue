<script setup>
// Script setup dikosongkan karena belum ada state management khusus yang diperlukan di halaman ini
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen antialiased flex flex-col pb-10">

    <!-- Hero Section -->
    <section class="relative w-full h-[500px] md:h-[700px] lg:h-[870px] bg-[#f2f4f6] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img class="w-full h-full object-cover opacity-80 mix-blend-multiply"
             alt="Tampilan sinematik mobil sport mewah"
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_YmFVuQ4ycF0QgmsJpm01_-XaYv8uDnL5KXKCi4xxVS8mnoujeXm8sAMzNTVTvmSt8wg8zkzGWB7TWwpFD50HhDYIlD1wbRZZQWA9H9mzhmtcwnS-PYFhUWtK6eFtiPx9EZ2jhuXeryC0S58ImDViEmDExV2JtUwmOi1daaKz30dXXhJ_SjNDxzTWd8dSXvRLSxGrVFPhT7U1uFvmjhGGbKIxlOPi1MMQqKa9Me8WvajvxYWFwx4DMi8mCCTyPyARxD4xhZj3PHaw"/>
      </div>
      <!-- Text Overlay -->
      <div class="relative z-10 text-center px-4 md:px-6 lg:px-8 max-w-5xl mx-auto pt-10 md:pt-0">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight drop-shadow-2xl">
          Mahakarya <br class="hidden md:block"/> Mobilitas
        </h1>
        <p class="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium tracking-wide drop-shadow-md">
          Mendefinisikan ulang makna perjalanan melalui presisi tingkat tinggi, keanggunan yang paripurna, dan komitmen tanpa kompromi terhadap kualitas luar biasa.
        </p>
      </div>
    </section>

    <!-- Our Philosophy -->
    <section class="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
        <!-- Text Area -->
        <div class="space-y-6 md:space-y-8 order-2 md:order-1">
          <h2 class="text-[10px] md:text-sm font-bold text-[#0050cb] uppercase tracking-[0.2em]">Filosofi Kami</h2>
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191c1e] tracking-tight leading-tight">
            Keanggunan Dinamis <br/> Bertemu Presisi.
          </h3>
          <p class="text-sm sm:text-base lg:text-lg text-[#424656] leading-relaxed">
            Kami percaya bahwa kemewahan sejati bukanlah sekadar ketiadaan hambatan, melainkan kehadiran kurasi yang matang dan bernilai. Setiap kendaraan di galeri kami, serta setiap interaksi dengan layanan pramutamu kami, dirancang khusus untuk mengangkat pengalaman berkendara menjadi sebuah bentuk seni.
          </p>
          <p class="text-sm sm:text-base lg:text-lg text-[#424656] leading-relaxed">
            GASNGO didirikan dengan satu premis utama: menghadirkan pengalaman mobilitas yang tidak terasa seperti sekadar menyewa, melainkan seperti mengendarai koleksi pribadi Anda sendiri.
          </p>
        </div>
        <!-- Image Area -->
        <div class="relative order-1 md:order-2 px-4 sm:px-0">
          <div class="aspect-[4/5] bg-[#e6e8ea] rounded-xl overflow-hidden relative z-10 shadow-lg">
            <img class="w-full h-full object-cover"
                 alt="Detail arsitektur modern dari ruang galeri"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgZCJxy9cCTEe5ZBmAICmufXHurQqJYvGa5URHb4-BclEk8TahjpOwNqWnLC0_CEXSwqxJoyn94XRpWZHrwtL3Ji8Qv0J8nO7jHV5G5MGw0DkYD3WxJ8JDKH_LJ6FgtWA9rUoC23CMTEVIME4rFuL9Wq_HTK72u3BefEH7dNTJ1--HJyBy65srDFoGHnm2qd39NDZZPEX2Y_l-qlw4sx3quHbJmehLfxwSkn2y1MJSVO454UmzghR_R_nFXj9c_RklWEc5-2QEN9aY"/>
          </div>
          <!-- Asymmetric accent -->
          <div class="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-32 h-32 md:w-48 md:h-48 bg-[#0050cb]/10 rounded-full z-0 blur-2xl"></div>
        </div>
      </div>
    </section>

    <!-- Our Story (Asymmetrical Grid) -->
    <section class="py-16 md:py-24 lg:py-32 bg-[#f2f4f6]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div class="text-center md:text-left mb-12 md:mb-20 space-y-3 md:space-y-4">
          <h2 class="text-[10px] md:text-sm font-bold text-[#0050cb] uppercase tracking-[0.2em]">Arsip Kami</h2>
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191c1e] tracking-tight">Evolusi GASNGO</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">

          <!-- Item 1 (Kiri Atas) -->
          <div class="md:col-span-5 md:mt-16 lg:mt-24 space-y-4 md:space-y-6">
            <div class="aspect-[3/2] rounded-xl overflow-hidden shadow-lg bg-[#f7f9fb]">
              <img class="w-full h-full object-cover"
                   alt="Mobil sport klasik"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRH8wiCNmI7YMd6oFntepC_wBiXAaTsAVm5rK_Ui8lEFuLi1PFNUvi0EWm9MBq7SYoqUPZx6eCFZmSj6AtfXsYlsfvvEDPBM-lXnDVGoAPbIdbOV86nTNdCBx4Pwk5AmdAfpyv6bA0vnmxG6RlzbufLrzx8azDdoVdKCIpiN9X0pkthO6HKb4Snq8Pn1L0A_PDPm4Xr1mvO60ZdSqx_4y_MuPeFGQO2uZwKge4nJ6gJztT2wSzr7hbQ9suVWG4UoV0Us5mVU06yAK0"/>
            </div>
            <div>
              <span class="text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-wider">2015</span>
              <h4 class="text-xl md:text-2xl font-bold text-[#191c1e] mt-1 md:mt-2">Awal Mula</h4>
              <p class="text-[#424656] text-sm md:text-base mt-2 md:mt-3 leading-relaxed">
                Lahir dari keinginan untuk mendobrak pasar penyewaan mobil konvensional, kami hadir dengan armada kecil berisi kendaraan performa tinggi yang dikurasi secara ketat di satu lokasi butik eksklusif.
              </p>
            </div>
          </div>

          <!-- Item 2 (Kanan Tengah) -->
          <div class="md:col-span-6 md:col-start-7 space-y-4 md:space-y-6 mt-8 md:mt-0">
            <div class="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-[#f7f9fb]">
              <img class="w-full h-full object-cover"
                   alt="Kendaraan listrik mewah modern"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs7AI_DtWMiQFgnWpdWmZG18JIIIAYShrWYhe46cGa3bgsEqJ_x_BbdXHLVw_11L3VTI6QIERSUuilGPyez8wl1CWG_dFDorkzZZZ52XLCFRihGTpK07J2dR_YqgQNiqlBRBI8JLZoqxryWc7MAC1inHpgP_ukj9WyJdiXDIZcOzyn5oWj6Sb7HxE2Tb7RPk-uQvAo6xweyL9WjtG0B3h0ePFYF7jEpLjA9IqqNPnSP3iVozOjWayDf7hLWp72TEPD4HA0rT2OP0jK"/>
            </div>
            <div>
              <span class="text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-wider">2019</span>
              <h4 class="text-xl md:text-2xl font-bold text-[#191c1e] mt-1 md:mt-2">Transisi Elektrik</h4>
              <p class="text-[#424656] text-sm md:text-base mt-2 md:mt-3 leading-relaxed">
                Mengantisipasi masa depan kemewahan, kami mengintegrasikan kendaraan listrik paling mutakhir di dunia ke dalam galeri kami, dengan mengutamakan performa senyap dan keanggunan tanpa emisi.
              </p>
            </div>
          </div>

          <!-- Item 3 (Bawah Lebar) -->
          <div class="md:col-span-9 md:col-start-2 lg:col-span-7 lg:col-start-1 mt-12 md:mt-24 lg:mt-32 space-y-4 md:space-y-6">
            <div class="aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-lg bg-[#f7f9fb]">
              <img class="w-full h-full object-cover"
                   alt="Interior mewah minimalis kendaraan kelas atas"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXRdVjYdzYUJeLDDTeaOec6iF8SeXsTXe_LBirPJznCu-Xa3ZtBIUom4KejiaxQvXCThAdBj9jntP6Fm090WQ49Q50L4qUqdA0pqwaPqhpZi6Tr4tdGWLQceiJmPKO0RXeudtlPacfFjNbCIJaJPKIzqh10oq0ATRPVlgR582bVNwuLh9vX6s2SKJjkfrGprU58x_v6gVMYBCZbInD41ayef7X0UrxIQ9lVTxY6mPm48PMdRBEU93eUgcqetuJ1QLYpNl6xoGNaajv"/>
            </div>
            <div>
              <span class="text-[10px] md:text-xs font-bold text-[#727687] uppercase tracking-wider">Masa Kini</span>
              <h4 class="text-xl md:text-2xl font-bold text-[#191c1e] mt-1 md:mt-2">GASNGO: Galeri Kinetik Anda</h4>
              <p class="text-[#424656] text-sm md:text-base mt-2 md:mt-3 leading-relaxed">
                Berkembang menjadi GASNGO, kini kami beroperasi sebagai galeri kendaraan bertaraf global. Kami tidak hanya menyediakan unit penyewaan, tetapi memberikan pengalaman mobilitas yang dikurasi dan terintegrasi sempurna dengan layanan pramutamu kelas dunia.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Leadership Team -->
    <section class="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div class="mb-10 md:mb-16 text-center md:text-left">
        <h2 class="text-[10px] md:text-sm font-bold text-[#0050cb] uppercase tracking-[0.2em]">Para Kurator</h2>
        <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191c1e] tracking-tight mt-2 md:mt-4">Jajaran Kepemimpinan</h3>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

        <!-- Exec 1 -->
        <div class="group cursor-pointer">
          <div class="aspect-[3/4] bg-[#f2f4f6] rounded-lg overflow-hidden mb-3 md:mb-6 relative shadow-sm">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 alt="Julian Vance"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaSKtVS0xhb2BscHDDoFKd7kE0WGLyLj_NW7SUZpghSjM9GJy_S0E09e0W_GjE7K7k_i0dIPZL-C8GngWWlglZa9xfYRdenmZLwyDlzubNe7QhLFuIZLb4QRumHW5qPvZpwANcQ9rApd3Infbs4pu-xkBDaPUe3hnHXXJNXhJhptYYFKiF0g57R0aAqx83rg7-8nLKMQY2ef1dP9nq7WKsDCqqPTDdDynyGbAsrzOjVGg0XPJg2nSAJEYZGNWaC7El1H8yWd1Q3_le"/>
            <div class="absolute inset-0 bg-transparent group-hover:bg-[#0050cb]/10 transition-colors duration-500"></div>
          </div>
          <h4 class="text-base sm:text-lg md:text-xl font-bold text-[#191c1e]">Julian Vance</h4>
          <p class="text-[9px] md:text-xs font-bold text-[#424656] uppercase tracking-wider mt-1">Chief Executive Officer</p>
        </div>

        <!-- Exec 2 -->
        <div class="group cursor-pointer">
          <div class="aspect-[3/4] bg-[#f2f4f6] rounded-lg overflow-hidden mb-3 md:mb-6 relative shadow-sm">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 alt="Elena Rostova"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiNHg4W2xzI-biZDU5nSLCCNkzD-BOFjMeWuZ-i1YWELSjyNvQqy03T_kbu4-XQjd2tgsGZ73ilMgVBTezZjjkEGDMH5A3outcLvu99_KVSC4_CvuooV6ghujbLqzIOkbTCtnL1UbHfrNAQ_7FXPPVPXQW2ULQCB8Qyzr8xxjK5Kkgw34XRWVtTa95EI_Mr0dIX0tsi0cRtapFzpyNQMhnniVvSflb4BUdHwsDqoTrw7RiumWB7OWLY84iNximZUfv5dTwn3AxHdvB"/>
            <div class="absolute inset-0 bg-transparent group-hover:bg-[#0050cb]/10 transition-colors duration-500"></div>
          </div>
          <h4 class="text-base sm:text-lg md:text-xl font-bold text-[#191c1e]">Elena Rostova</h4>
          <p class="text-[9px] md:text-xs font-bold text-[#424656] uppercase tracking-wider mt-1">Direktur Kurasi Armada</p>
        </div>

        <!-- Exec 3 -->
        <div class="group cursor-pointer">
          <div class="aspect-[3/4] bg-[#f2f4f6] rounded-lg overflow-hidden mb-3 md:mb-6 relative shadow-sm mt-4 lg:mt-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 alt="Marcus Thorne"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDUI59c2ztFvcm76ETmTYfOE2GsYELUUGo6Rfr_fxSqbRNMHmTyxMC9oLi6yr-KihTw2keiRV8GpnsYkRx6n6hlS-jXVT6RqYy-GfG3Kej-MNa4YKY8KGqFQ5VXUkPdRJAoxE_UC05hewTGB4c7bn6JukKCTAjcHSQ8lFylPizKDryn-Hkxh-nHE-ZYwv83cCnOOK5yB5bI8qbiBR7bM1erQX9dZyprQWOftKYK0tPg_lvW51iBDzN4Z9q5ebcnPy8-xTvzFxtAByu"/>
            <div class="absolute inset-0 bg-transparent group-hover:bg-[#0050cb]/10 transition-colors duration-500"></div>
          </div>
          <h4 class="text-base sm:text-lg md:text-xl font-bold text-[#191c1e]">Marcus Thorne</h4>
          <p class="text-[9px] md:text-xs font-bold text-[#424656] uppercase tracking-wider mt-1">Kepala Teknik Kendaraan</p>
        </div>

        <!-- Exec 4 -->
        <div class="group cursor-pointer">
          <div class="aspect-[3/4] bg-[#f2f4f6] rounded-lg overflow-hidden mb-3 md:mb-6 relative shadow-sm mt-4 lg:mt-0">
            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 alt="Sophia Chen"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi52SpVv-xgkTNdb8X05F6z-n2RWiknfPYDF17dgBcC5Q_tGjYjlFkfzanpqrS-4prOq0ZIIIywvJdhOoNgUO20P2jGzDmZrc-OnV0K3QfS8sbB03DzV7K3bB3CCNc9lQDwewspo3B19DEEiI3Eg97FUh6obb82aHGqdTw3G1qTd5sf9IORmzBREeziwCSU_hs0eUz1ths7YpTqoppln8Mgkcdlg5FA0MecTuBmQxOvuxXzJsqRYpF6hwT249PEm-tTrYuH4kNdrlD"/>
            <div class="absolute inset-0 bg-transparent group-hover:bg-[#0050cb]/10 transition-colors duration-500"></div>
          </div>
          <h4 class="text-base sm:text-lg md:text-xl font-bold text-[#191c1e]">Sophia Chen</h4>
          <p class="text-[9px] md:text-xs font-bold text-[#424656] uppercase tracking-wider mt-1">VP Pengalaman Global</p>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
/* Pengaturan base font/icons jika diperlukan di lokal component */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>
