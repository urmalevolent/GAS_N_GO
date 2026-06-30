<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const isProcessing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleReset = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Silakan isi kedua kolom password.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Password dan Konfirmasi Password tidak cocok.'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password harus minimal 6 karakter.'
    return
  }

  isProcessing.value = true

  const { error } = await authStore.updatePassword(newPassword.value)

  if (error) {
    errorMessage.value = error.message
    isProcessing.value = false
    return
  }

  successMessage.value = 'Password Anda berhasil diperbarui! Mengalihkan ke Beranda...'
  
  setTimeout(() => {
    isProcessing.value = false
    router.push('/')
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f2f4f6] px-4">
    <div class="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-[#c2c6d8]/30">
      
      <div class="text-center mb-8">
        <h2 class="text-2xl font-extrabold text-[#191c1e] tracking-tight">Set Password Baru</h2>
        <p class="text-xs text-[#727687] font-medium mt-2">Silakan masukkan password baru Anda.</p>
      </div>

      <!-- Alerts -->
      <transition name="fade">
        <div v-if="errorMessage" class="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-xs font-semibold">
          <span class="material-symbols-outlined text-[18px]">error</span>
          <p>{{ errorMessage }}</p>
        </div>
      </transition>
      
      <transition name="fade">
        <div v-if="successMessage" class="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700 text-xs font-semibold">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          <p>{{ successMessage }}</p>
        </div>
      </transition>

      <div class="space-y-5">
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-[#727687] mb-1.5">Password Baru</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c6d8] text-[18px]">lock</span>
            <input 
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Minimal 6 karakter"
              class="w-full bg-[#f7f9fb] border border-[#e0e3e5] focus:border-[#0050cb] text-[#191c1e] pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-sm font-medium"
            />
            <button 
              @click="togglePassword"
              type="button" 
              class="absolute right-4 top-1/2 -translate-y-1/2 text-[#727687] hover:text-[#191c1e] transition-colors focus:outline-none"
            >
              <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-[#727687] mb-1.5">Konfirmasi Password Baru</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c6d8] text-[18px]">lock_reset</span>
            <input 
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Ulangi password baru"
              class="w-full bg-[#f7f9fb] border border-[#e0e3e5] focus:border-[#0050cb] text-[#191c1e] pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-sm font-medium"
            />
          </div>
        </div>

        <button 
          @click="handleReset"
          :disabled="isProcessing"
          class="w-full bg-[#0050cb] hover:bg-[#0066ff] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
        >
          <template v-if="isProcessing">
            <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
            <span>Menyimpan...</span>
          </template>
          <template v-else>
            <span>Simpan Password Baru</span>
            <span class="material-symbols-outlined text-[18px]">save</span>
          </template>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
