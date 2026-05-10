<script setup>
// Daftar navigasi link untuk footer agar lebih rapi dan mudah diubah
import logocars from '@/assets/images/racingcar.png'
const footerLinks = [
  { name: 'Terms of Service', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Contact Support', href: '#' },
  { name: 'Fleet Directory', href: '#' },
]
</script>

<template>
  <!-- Wrapper Footer dengan warna background yang sangat terang (sedikit keabu-abuan/putih) -->
  <footer class="bg-[#fafbfc] pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- BAGIAN ATAS: Logo, Teks Deskripsi, dan Navigasi Link -->
      <!-- Menggunakan flex-col untuk HP, dan lg:flex-row untuk Laptop -->
      <div class="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-0">
        <!-- Kiri: Logo dan Deskripsi -->
        <div class="max-w-md">
          <!-- Wrapper Flex untuk mensejajarkan Logo dan Teks -->
          <div class="flex items-center space-x-3 mb-4">
            <!-- Menampilkan Gambar Logo -->
            <img :src="logocars" alt="Logo GASNGO" class="h-10 w-10 object-contain" />

            <h2 class="text-xl md:text-2xl font-black text-[#111827] italic tracking-tight">
              GASNGO
            </h2>
          </div>


          <p class="text-[15px] text-slate-500 leading-relaxed">
            The world's most exclusive mobility club.<br class="hidden sm:block" />
            Redefining how the world's leaders move.
          </p>
        </div>

        <!-- Kanan: Link Navigasi -->
        <!-- Di HP akan turun ke bawah, di Tablet/Desktop memanjang ke samping -->
        <div class="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 lg:pt-2">
          <a
            v-for="link in footerLinks"
            :key="link.name"
            :href="link.href"
            class="text-[15px] text-slate-500 hover:text-slate-900 transition-colors"
          >
            {{ link.name }}
          </a>
        </div>
      </div>

      <!-- GARIS PEMISAH (Divider) -->
      <div class="border-t border-slate-200/80 mt-12 mb-8"></div>

      <!-- BAGIAN BAWAH: Copyright dan Ikon -->
      <!-- Di HP: Hak cipta di bawah, Ikon di atas (flex-col-reverse) -->
      <div class="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 sm:gap-0">
        <!-- Kiri: Copyright -->
        <p class="text-[14px] text-slate-500">© 2024 LUXE DRIVE. All rights reserved.</p>

        <!-- Kanan: Ikon Globe dan Share -->
        <div class="flex items-center space-x-5 text-slate-500">
          <!-- Ikon Globe (Website/Bahasa) -->
          <a href="#" class="hover:text-slate-900 transition-colors" aria-label="Language options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </a>

          <!-- Ikon Share (Network) -->
          <a href="#" class="hover:text-slate-900 transition-colors" aria-label="Share options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
