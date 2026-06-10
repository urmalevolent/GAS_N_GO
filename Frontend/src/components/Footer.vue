<script setup>
// Pastikan path logo ini sesuai dengan lokasi penyimpanan gambar Anda
import logocars from '@/assets/images/racingcar.png'

// Daftar navigasi link (Quick Links)
const footerLinks = [
  { name: 'Terms of Service', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Contact Support', href: '#' },
  { name: 'Fleet Directory', href: '#' },
]
</script>

<template>
  <!-- Wrapper Footer dengan warna background abu-abu sangat muda -->
  <footer class="bg-[#f7f9fb] border-t border-[#c2c6d8]/40 pt-16 pb-8 font-['Manrope']">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- ================= BAGIAN ATAS: GRID KONTEN ================= -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 mb-12">

        <!-- Kolom 1: Logo & Deskripsi Utama (Lebar: 4 Kolom) -->
        <div class="md:col-span-4">
          <!-- Logo & Teks GASNGO -->
          <div class="flex items-center space-x-3 mb-6">
            <img :src="logocars" alt="Logo GASNGO" class="h-10 w-10 object-contain" />
            <h2 class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight">
              GASNGO
            </h2>
          </div>
          <p class="text-[14px] text-slate-500 leading-relaxed pr-4">
            The world's most exclusive mobility club. <br class="hidden sm:block" />
            Redefining how the world's leaders move with premium fleet and impeccable service.
          </p>
        </div>

        <!-- Kolom 2: Quick Links (Lebar: 3 Kolom) -->
        <div class="md:col-span-3">
          <h4 class="text-[#111827] font-bold mb-6 tracking-widest uppercase text-xs">Quick Links</h4>
          <ul class="flex flex-col space-y-3">
            <li v-for="link in footerLinks" :key="link.name">
              <a
                :href="link.href"
                class="text-[14px] text-slate-500 hover:text-[#0050cb] transition-colors font-medium"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: Contact Us (Lebar: 3 Kolom) -->
        <div class="md:col-span-3">
          <h4 class="text-[#111827] font-bold mb-6 tracking-widest uppercase text-xs">Contact Us</h4>
          <ul class="space-y-4 text-[14px]">
            <!-- WhatsApp -->
            <li class="flex items-start gap-3 text-slate-500">
              <svg class="w-5 h-5 text-[#0050cb] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <a href="https://wa.me/6281234567890" target="_blank" class="hover:text-[#0050cb] transition-colors font-medium">
                WhatsApp: <br/>+62 812 3456 7890
              </a>
            </li>
            <!-- Email -->
            <li class="flex items-center gap-3 text-slate-500">
              <svg class="w-5 h-5 text-[#0050cb] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:hello@gasngo.com" class="hover:text-[#0050cb] transition-colors font-medium">
                hello@gasngo.com
              </a>
            </li>
          </ul>
        </div>

        <!-- Kolom 4: Location (Lebar: 2 Kolom) -->
        <div class="md:col-span-2">
          <h4 class="text-[#111827] font-bold mb-6 tracking-widest uppercase text-xs">Location</h4>
          <ul class="text-[14px]">
            <li class="flex items-start gap-3 text-slate-500 font-medium">
              <svg class="w-5 h-5 text-[#0050cb] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="leading-relaxed">
                Jl. Raya Kuta No. 123,<br>
                Badung Regency,<br>
                Bali 80361, Indonesia
              </span>
            </li>
          </ul>
        </div>

      </div>

      <!-- ================= GARIS PEMISAH (Divider) ================= -->
      <div class="border-t border-[#c2c6d8]/40 mb-8"></div>

      <!-- ================= BAGIAN BAWAH: Hak Cipta & Ikon Sosial ================= -->
      <div class="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 sm:gap-0">

        <!-- Kiri: Copyright -->
        <p class="text-[13px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; 2026 GASNGO. All rights reserved.
        </p>

        <!-- Kanan: Ikon Globe dan Share -->
        <div class="flex items-center space-x-5 text-slate-400">

          <!-- Ikon Globe (Website/Bahasa) -->
          <a href="#" class="hover:text-[#0050cb] transition-colors" aria-label="Language options">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </a>

          <!-- Ikon Share (Network) -->
          <a href="#" class="hover:text-[#0050cb] transition-colors" aria-label="Share options">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" />
            </svg>
          </a>

        </div>
      </div>

    </div>
  </footer>
</template>
