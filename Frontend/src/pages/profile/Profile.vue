<script setup>
import { reactive, onMounted, onUpdated } from "vue";
import Swal from 'sweetalert2';
import AOS from "aos";
import "aos/dist/aos.css";

import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";

// --- DATA STATIS MURNI UNTUK DESAIN ---
const profile = reactive({
  username: "Sultan Andara",
  email: "sultan.andara@executive.com",
  phone: "081234567890",
  address: "Kawasan Elit Pondok Indah, Jakarta Selatan",
  image: defaultAvatar,
});

// Simulasi Simpan Profil
const saveProfileSettings = () => {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: 'Profil Anda telah diperbarui.',
    showConfirmButton: false,
    timer: 1500,
    iconColor: '#0050cb'
  });
};

// --- LIFECYCLE ---
onMounted(() => {
  AOS.init({ once: true, duration: 1000, easing: "ease-out-quart" });
});

onUpdated(() => {
  AOS.refresh();
});
</script>

<template>
  <div class="w-full h-full p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-4xl space-y-8">

      <!-- Judul Halaman -->
      <div class="flex items-center gap-3 border-b border-[#c2c6d8]/40 pb-4" data-aos="fade-down">
        <span class="material-symbols-outlined text-[#0050cb] text-3xl">manage_accounts</span>
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          Profil Saya
        </h1>
      </div>

      <!-- ================= AREA FOTO PROFIL ================= -->
      <section class="flex flex-col items-center" data-aos="zoom-in" data-aos-delay="100">
        <div class="relative group cursor-pointer">
          <!-- Efek Glow di belakang foto -->
          <div class="absolute -inset-2 bg-gradient-to-r from-[#0050cb] to-[#9bb4fe] rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-500"></div>

          <img
            :src="profile.image"
            alt="User Profile"
            class="relative h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-xl transform transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <!-- Overlay Hitam saat di-hover -->
          <div class="absolute inset-0 flex items-center justify-center rounded-full bg-[#191c1e]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span class="material-symbols-outlined text-white text-3xl">photo_camera</span>
          </div>

          <!-- Input File (Transparan menutupi seluruh gambar) -->
          <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>

        <p class="mt-5 text-xs md:text-sm text-[#727687] font-bold uppercase tracking-widest" data-aos="fade-up" data-aos-delay="200">
          Klik foto untuk mengganti
        </p>
      </section>

      <!-- ================= AREA FORM INFORMASI PRIBADI ================= -->
      <section
        class="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <form @submit.prevent="saveProfileSettings">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Informasi Pribadi</h2>
            <span class="bg-blue-50 text-[#0050cb] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Status Aktif</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            <!-- Email (Disabled) -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Alamat Email</label>
              <div class="relative">
                <input
                  v-model="profile.email"
                  type="email"
                  disabled
                  class="block w-full rounded-xl border border-transparent bg-[#f2f4f6] text-[#727687] px-4 py-3.5 md:py-4 transition-all duration-300 cursor-not-allowed outline-none font-medium text-sm"
                />
                <div class="absolute inset-y-0 right-4 flex items-center">
                  <span class="material-symbols-outlined text-[#727687]">lock</span>
                </div>
              </div>
              <p class="mt-1.5 text-[10px] text-[#727687]">*Email terhubung dengan identitas terverifikasi dan tidak dapat diubah secara manual.</p>
            </div>

            <!-- Full Name -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nama Lengkap</label>
              <input
                v-model="profile.username"
                type="text"
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nomor Telepon</label>
              <input
                v-model="profile.phone"
                type="tel"
                placeholder="08..."
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300"
              />
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Alamat Domisili</label>
              <textarea
                v-model="profile.address"
                rows="3"
                placeholder="Masukkan alamat lengkap..."
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Tombol Simpan -->
          <div class="mt-10 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              class="w-full sm:w-auto rounded-xl bg-white border border-gray-200 px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold text-[#424656] transition-all hover:bg-gray-50 active:scale-95 uppercase tracking-widest"
            >
              Batal
            </button>
            <button
              type="submit"
              class="w-full sm:w-auto relative overflow-hidden rounded-xl signature-gradient px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold text-white shadow-lg shadow-[#0050cb]/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Pengaturan Material Icon */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Warna tombol khusus tema GASNGO */
.signature-gradient {
  background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%);
}
</style>
