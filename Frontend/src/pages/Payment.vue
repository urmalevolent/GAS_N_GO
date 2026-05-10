<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State untuk mengatur metode pembayaran
const paymentMethod = ref('credit_card') // Default ke Kartu Kredit

// State untuk mengatur kemunculan pop-up (modal) sukses
const showSuccessModal = ref(false)

const handlePayment = () => {
  // Memunculkan pop up saat tombol bayar diklik
  showSuccessModal.value = true
}
</script>

<template>
  <div class="bg-[#f7f9fb] font-['Manrope'] text-[#191c1e] min-h-screen antialiased pb-20 pt-8 md:pt-12 relative">

    <main class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

      <!-- ================= KOLOM KIRI: FORM PEMBAYARAN ================= -->
      <div class="lg:col-span-8 space-y-8 md:space-y-12">

        <!-- Progress Stepper -->
        <section class="bg-[#f2f4f6] rounded-xl p-6 border border-[#c2c6d8]/30">
          <div class="flex items-center justify-between relative max-w-md mx-auto">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#c2c6d8]/50 z-0"></div>

            <div class="relative z-10 flex flex-col items-center gap-2 bg-[#f2f4f6] px-2 md:px-4">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0050cb] text-white flex items-center justify-center font-bold text-sm shadow-md">
                <span class="material-symbols-outlined text-base md:text-lg">check</span>
              </div>
              <span class="font-bold text-[9px] md:text-xs uppercase tracking-widest text-[#424656]">Reservasi</span>
            </div>

            <div class="relative z-10 flex flex-col items-center gap-2 bg-[#f2f4f6] px-2 md:px-4">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0050cb] text-white flex items-center justify-center font-bold text-sm shadow-md">
                <span class="material-symbols-outlined text-base md:text-lg">check</span>
              </div>
              <span class="font-bold text-[9px] md:text-xs uppercase tracking-widest text-[#424656]">Identitas</span>
            </div>

            <div class="relative z-10 flex flex-col items-center gap-2 bg-[#f2f4f6] px-2 md:px-4">
              <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-sm md:text-base shadow-[0_0_20px_rgba(0,102,255,0.4)]">
                3
              </div>
              <span class="font-bold text-[9px] md:text-xs uppercase tracking-widest text-[#0050cb]">Pembayaran</span>
            </div>
          </div>
        </section>

        <!-- Pilihan Metode Pembayaran -->
        <section class="space-y-6">
          <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-[#191c1e]">Pilih Metode Pembayaran</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <label class="cursor-pointer relative group">
              <input v-model="paymentMethod" value="credit_card" class="peer sr-only" name="payment_method" type="radio"/>
              <div class="bg-white p-5 md:p-6 rounded-xl border-2 border-transparent shadow-sm peer-checked:bg-blue-50/50 peer-checked:border-[#0050cb] hover:border-[#0050cb]/30 transition-all flex flex-col items-center gap-3 md:gap-4 text-center">
                <span :class="paymentMethod === 'credit_card' ? 'text-[#0050cb]' : 'text-[#424656]'" class="material-symbols-outlined text-3xl transition-colors">credit_card</span>
                <span :class="paymentMethod === 'credit_card' ? 'text-[#191c1e]' : 'text-[#424656]'" class="text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors">Kartu Kredit</span>
              </div>
            </label>

            <label class="cursor-pointer relative group">
              <input v-model="paymentMethod" value="virtual_account" class="peer sr-only" name="payment_method" type="radio"/>
              <div class="bg-white p-5 md:p-6 rounded-xl border-2 border-transparent shadow-sm peer-checked:bg-blue-50/50 peer-checked:border-[#0050cb] hover:border-[#0050cb]/30 transition-all flex flex-col items-center gap-3 md:gap-4 text-center">
                <span :class="paymentMethod === 'virtual_account' ? 'text-[#0050cb]' : 'text-[#424656]'" class="material-symbols-outlined text-3xl transition-colors">account_balance</span>
                <span :class="paymentMethod === 'virtual_account' ? 'text-[#191c1e]' : 'text-[#424656]'" class="text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors">Virtual Account</span>
              </div>
            </label>

            <label class="cursor-pointer relative group">
              <input v-model="paymentMethod" value="ewallet" class="peer sr-only" name="payment_method" type="radio"/>
              <div class="bg-white p-5 md:p-6 rounded-xl border-2 border-transparent shadow-sm peer-checked:bg-blue-50/50 peer-checked:border-[#0050cb] hover:border-[#0050cb]/30 transition-all flex flex-col items-center gap-3 md:gap-4 text-center">
                <span :class="paymentMethod === 'ewallet' ? 'text-[#0050cb]' : 'text-[#424656]'" class="material-symbols-outlined text-3xl transition-colors">account_balance_wallet</span>
                <span :class="paymentMethod === 'ewallet' ? 'text-[#191c1e]' : 'text-[#424656]'" class="text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors">E-Wallet</span>
              </div>
            </label>

          </div>
        </section>

        <!-- Form Kartu Kredit -->
        <section v-show="paymentMethod === 'credit_card'" class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 md:space-y-8 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Detail Kartu</h3>
            <div class="flex gap-2 text-[#424656]">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">lock</span>
            </div>
          </div>

          <div class="space-y-5 md:space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nomor Kartu</label>
              <div class="relative">
                <input class="w-full bg-[#f2f4f6] border border-transparent rounded-lg py-3.5 md:py-4 pl-12 pr-4 text-[#191c1e] font-medium focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all outline-none" placeholder="0000 0000 0000 0000" type="text"/>
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687]">credit_card</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 md:gap-6">
              <div class="space-y-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Masa Berlaku</label>
                <input class="w-full bg-[#f2f4f6] border border-transparent rounded-lg py-3.5 md:py-4 px-4 text-[#191c1e] font-medium focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all outline-none" placeholder="BB/TT" type="text"/>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">CVV</label>
                <div class="relative">
                  <input class="w-full bg-[#f2f4f6] border border-transparent rounded-lg py-3.5 md:py-4 px-4 text-[#191c1e] font-medium focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all outline-none" placeholder="123" type="password"/>
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#727687] text-sm md:text-base cursor-help">help</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Nama Pemegang Kartu</label>
              <input class="w-full bg-[#f2f4f6] border border-transparent rounded-lg py-3.5 md:py-4 px-4 text-[#191c1e] font-medium uppercase focus:ring-2 focus:ring-[#0050cb]/30 focus:bg-white transition-all outline-none" placeholder="JOHN DOE" type="text"/>
            </div>
          </div>
        </section>

        <!-- Placeholder VA / E-Wallet -->
        <section v-show="paymentMethod !== 'credit_card'" class="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center animate-fade-in">
          <span class="material-symbols-outlined text-5xl text-[#0050cb] mb-4">qr_code_scanner</span>
          <h3 class="text-lg md:text-xl font-extrabold text-[#191c1e] mb-2">Instruksi Pembayaran Tersedia di Halaman Berikutnya</h3>
          <p class="text-sm text-[#424656]">Anda akan diarahkan ke halaman pembayaran {{ paymentMethod === 'virtual_account' ? 'Virtual Account' : 'E-Wallet' }} setelah mengonfirmasi pesanan di bawah ini.</p>
        </section>

      </div>

      <!-- ================= KOLOM KANAN: RINGKASAN TAGIHAN ================= -->
      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-28 space-y-8">

          <!-- Mini Preview Kendaraan -->
          <div class="flex gap-4 items-center">
            <div class="w-20 h-20 rounded-lg bg-[#e0e3e5] overflow-hidden relative shrink-0">
              <img alt="Porsche Taycan" class="object-cover w-full h-full"
                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvD6TQs93A1RrjIH7Rv96GLKfynEZps_hQ-uFhsmuMgmyndxwQJmhDHdy-7M3Hd2995hl9oVrkv4OzRgXF-MDId7BFkbcr2xw3TlJFjgucg5DAW_cpdTpO4fucwfuZm8KirYn3H7rC6A_K7aNiVlOzCpU5TFoiRRIqrjDlSAQgryccot_v9aCsXP4Ro5oMpxgeS37JSIUpW1_syxsr-UfVjthj3LyupQpBMsaBRo_OtQnu53uSNznRtPDkhvKLfrvJD8J8hklnJ6P8"/>
            </div>
            <div>
              <h4 class="text-lg font-extrabold text-[#191c1e]">Porsche 911 Carrera</h4>
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#424656]">Elektrik • 2024</span>
            </div>
          </div>

          <!-- Rincian Biaya -->
          <div class="space-y-4">
            <h3 class="text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-[#c2c6d8]/40 pb-2 text-[#424656]">Rincian Biaya</h3>
            <div class="flex justify-between text-sm">
              <span class="text-[#424656]">Tarif Harian (3 Hari)</span>
              <span class="text-[#191c1e] font-medium">$1,450.00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#424656]">Asuransi Premium</span>
              <span class="text-[#191c1e] font-medium">$250.00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#424656]">Biaya Pengiriman</span>
              <span class="text-[#191c1e] font-medium">$50.00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#424656]">Pajak (PPN)</span>
              <span class="text-[#191c1e] font-medium">$175.00</span>
            </div>
          </div>

          <!-- Total Keseluruhan -->
          <div class="pt-4 border-t border-[#c2c6d8]/40 flex justify-between items-end">
            <span class="text-sm md:text-base font-extrabold text-[#191c1e]">Total Tagihan</span>
            <span class="text-2xl md:text-3xl font-black tracking-tighter text-[#0050cb]">$1,925.00</span>
          </div>

          <!-- Tombol CTA -->
          <div class="pt-2">
            <button @click="handlePayment" class="w-full signature-gradient text-white text-[11px] md:text-xs font-bold uppercase tracking-widest py-4 md:py-5 rounded-xl shadow-lg shadow-[#0050cb]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg">lock</span>
              Bayar & Selesaikan Reservasi
            </button>
            <p class="text-center text-[10px] md:text-xs text-[#727687] mt-4 px-2">
              Dengan menekan bayar, Anda menyetujui <a class="text-[#0050cb] hover:underline font-bold" href="#">Syarat & Ketentuan</a> kami.
            </p>
          </div>

        </div>

        <!-- Bantuan -->
        <div class="flex justify-center mb-6 lg:mb-0">
          <button @click="router.go(-1)" class="flex items-center gap-2 text-[#424656] hover:text-[#0050cb] text-sm font-bold transition-colors">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            Kembali ke Verifikasi
          </button>
        </div>

      </aside>

    </main>

    <!-- ================= POP UP PEMBAYARAN BERHASIL (MODAL) ================= -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
      <!-- Latar Belakang Gelap (Backdrop Blur) -->
      <div class="absolute inset-0 bg-[#191c1e]/60 backdrop-blur-sm transition-opacity duration-300" @click="showSuccessModal = false"></div>

      <!-- Konten Modal (Animasi masuk dari bawah ke atas) -->
      <div class="relative bg-[#f7f9fb] w-full max-w-2xl rounded-2xl md:rounded-[32px] p-6 md:p-12 shadow-2xl animate-fade-in-up border border-white/20">

        <!-- Icon Centang -->
        <div class="w-16 h-16 md:w-20 md:h-20 bg-[#e6eeff] rounded-[20px] flex items-center justify-center mx-auto mb-6 md:mb-8">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-[#0066ff] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span class="material-symbols-outlined font-bold text-white text-xl md:text-2xl">check</span>
          </div>
        </div>

        <!-- Teks Sukses -->
        <div class="text-center mb-8 md:mb-10">
          <h2 class="text-3xl md:text-[40px] font-extrabold text-[#191c1e] tracking-tight mb-3 md:mb-4">Pembayaran Berhasil</h2>
          <p class="text-[#424656] text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Reservasi Anda telah dikonfirmasi. Kendaraan akan disiapkan dan menunggu kedatangan Anda.
          </p>
        </div>

        <!-- Kartu Detail Kendaraan & Biaya -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center mb-10">
          <!-- Gambar Mobil -->
          <div class="w-full md:w-1/2 aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shrink-0">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvD6TQs93A1RrjIH7Rv96GLKfynEZps_hQ-uFhsmuMgmyndxwQJmhDHdy-7M3Hd2995hl9oVrkv4OzRgXF-MDId7BFkbcr2xw3TlJFjgucg5DAW_cpdTpO4fucwfuZm8KirYn3H7rC6A_K7aNiVlOzCpU5TFoiRRIqrjDlSAQgryccot_v9aCsXP4Ro5oMpxgeS37JSIUpW1_syxsr-UfVjthj3LyupQpBMsaBRo_OtQnu53uSNznRtPDkhvKLfrvJD8J8hklnJ6P8"
                 alt="Porsche Taycan" class="w-full h-full object-cover" />
          </div>
          <!-- Rincian -->
          <div class="w-full md:w-1/2 space-y-4">
            <div>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#0066ff] mb-1 block">Kendaraan</span>
              <h3 class="text-xl md:text-2xl font-extrabold text-[#191c1e] tracking-tight">Porsche 911 Carrera</h3>
              <p class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#727687] mt-1.5">450 HP • Elektrik</p>
            </div>
            <div class="space-y-3 pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center text-xs md:text-sm">
                <span class="text-[#727687]">No. Referensi</span>
                <span class="font-bold text-[#191c1e]">LX-8892-TY</span>
              </div>
              <div class="flex justify-between items-center text-xs md:text-sm">
                <span class="text-[#727687]">Total Dibayar</span>
                <span class="font-extrabold text-[#191c1e] text-base md:text-lg">$1,925.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi di Modal -->
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <button @click="$router.push('/')" class="bg-[#0066ff] hover:bg-[#0050cb] text-white px-8 py-3.5 md:py-4 rounded-lg font-bold text-xs md:text-sm uppercase tracking-widest transition-all text-center w-full sm:w-auto shadow-lg shadow-blue-500/20 active:scale-95">
            Kembali ke Beranda
          </button>
          <button @click="showSuccessModal = false" class="bg-white border border-gray-200 text-[#0066ff] hover:bg-blue-50 hover:border-blue-200 px-8 py-3.5 md:py-4 rounded-lg font-bold text-xs md:text-sm uppercase tracking-widest transition-all text-center w-full sm:w-auto active:scale-95">
            Lihat Detail Pesanan
          </button>
        </div>

      </div>
    </div>
    <!-- ========================================================================= -->

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

/* Animasi Fade In Form Biasa */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Animasi Pop-up Sukses dari Bawah */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
