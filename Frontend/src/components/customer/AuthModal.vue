<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const activeTab = ref('login') // 'login' | 'register' | 'forgot-password'
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const forgotPasswordForm = reactive({
  email: ''
})

const registerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  alamat: '',
  rtRw: '',
  kecamatan: '',
  agama: '',
  statusPerkawinan: '',
  pekerjaan: '',
  kewarganegaraan: 'WNI'
})

const registerStep = ref(1)
const ktpFile = ref(null)
const ktpPreview = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    ktpFile.value = file
    ktpPreview.value = URL.createObjectURL(file)
  }
}

// Check if open
const isOpen = computed(() => authStore.isAuthModalOpen)

// Close Modal
const closeModal = () => {
  authStore.closeAuthModal()
  errorMessage.value = ''
  successMessage.value = ''
}

// Reset forms when tab changes
watch(activeTab, () => {
  errorMessage.value = ''
  successMessage.value = ''
  registerStep.value = 1
})

// Reset forms when modal closes/opens
watch(isOpen, (newVal) => {
  if (!newVal) {
    loginForm.email = ''
    loginForm.password = ''
    registerForm.fullName = ''
    registerForm.email = ''
    registerForm.phone = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.nik = ''
    registerForm.tempatLahir = ''
    registerForm.tanggalLahir = ''
    registerForm.jenisKelamin = ''
    registerForm.alamat = ''
    registerForm.rtRw = ''
    registerForm.kecamatan = ''
    registerForm.agama = ''
    registerForm.statusPerkawinan = ''
    registerForm.pekerjaan = ''
    registerForm.kewarganegaraan = 'WNI'
    ktpFile.value = null
    ktpPreview.value = null
    forgotPasswordForm.email = ''
    errorMessage.value = ''
    successMessage.value = ''
    registerStep.value = 1
  }
})

// Toggle Password Visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Handle Login
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Harap isi semua kolom login!'
    return
  }

  const { data, error } = await authStore.signIn(loginForm.email, loginForm.password)

  if (error) {
    errorMessage.value = error.message === 'Invalid login credentials' 
      ? 'Incorrect email or password. Please try again.' 
      : error.message
    return
  }

  successMessage.value = 'Login successful!'
  
  setTimeout(() => {
    closeModal()
    
    // Redirect logic
    const redirectTo = route.query.redirect
    if (redirectTo) {
      router.push(redirectTo)
    } else if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    }
  }, 1000)
}

// Form Steps
const nextStep = () => {
  errorMessage.value = ''
  if (!registerForm.email || !registerForm.password || !registerForm.fullName || !registerForm.phone) {
    errorMessage.value = 'Please fill in all account fields (Name, Email, Phone, Password)!'
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = 'Passwords do not match!'
    return
  }
  if (registerForm.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters!'
    return
  }
  registerStep.value = 2
}

const prevStep = () => {
  errorMessage.value = ''
  registerStep.value = 1
}

// Handle Register
const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!registerForm.nik || !registerForm.tempatLahir || !registerForm.tanggalLahir || !registerForm.jenisKelamin ||
      !registerForm.alamat || !registerForm.rtRw || !registerForm.kecamatan || !registerForm.agama || !ktpFile.value) {
    errorMessage.value = 'Please complete all ID fields and upload your ID photo!'
    return
  }

  const ktpData = {
    nik: registerForm.nik,
    tempat_lahir: registerForm.tempatLahir,
    tanggal_lahir: registerForm.tanggalLahir,
    jenis_kelamin: registerForm.jenisKelamin,
    alamat: registerForm.alamat,
    rt_rw: registerForm.rtRw,
    kecamatan: registerForm.kecamatan,
    agama: registerForm.agama,
    status_perkawinan: registerForm.statusPerkawinan,
    pekerjaan: registerForm.pekerjaan,
    kewarganegaraan: registerForm.kewarganegaraan
  }

  const { data, error } = await authStore.signUp(
    registerForm.email,
    registerForm.password,
    registerForm.fullName,
    registerForm.phone,
    ktpData,
    ktpFile.value
  )

  if (error) {
    errorMessage.value = error.message
    return
  }

  successMessage.value = 'Pendaftaran berhasil! Akun Anda telah siap.'
  
  setTimeout(() => {
    // Switch to login tab and fill email
    activeTab.value = 'login'
    loginForm.email = registerForm.email
    loginForm.password = ''
    successMessage.value = ''
  }, 1500)
}

// Handle Forgot Password
const handleForgotPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!forgotPasswordForm.email) {
    errorMessage.value = 'Harap isi alamat email Anda!'
    return
  }

  const { error } = await authStore.resetPassword(forgotPasswordForm.email)

  if (error) {
    errorMessage.value = error.message
    return
  }

  successMessage.value = 'Link reset password telah dikirim ke email Anda. Silakan cek Inbox atau folder Spam.'
  
  // Optionally reset after a few seconds
  setTimeout(() => {
    activeTab.value = 'login'
    forgotPasswordForm.email = ''
    successMessage.value = ''
  }, 4000)
}
</script>

<template>
  <transition name="modal-fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      @click.self="closeModal"
    >
      <!-- Card Modal Utama -->
      <div 
        :class="['relative w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar', (activeTab === 'register' && registerStep === 2 && ktpFile) ? 'max-w-3xl' : 'max-w-md']"
        style="animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      >
        <!-- Tombol Tutup Silang (X) -->
        <button 
          @click="closeModal" 
          class="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white transition-all focus:outline-none"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <!-- Logo & Nama Aplikasi -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0050cb] to-blue-400 text-white font-black italic text-lg shadow-lg shadow-blue-500/20 mb-2 active:scale-95 transition-transform duration-300">
            GNG
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight italic">GAS<span class="text-[#0050cb]">N</span>GO</h2>
          <p class="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-bold">Premium Car Rental Portal</p>
        </div>

        <!-- Tab Buttons (Hanya tampil jika bukan di mode forgot password) -->
        <div v-if="activeTab !== 'forgot-password'" class="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800/50">
          <button 
            @click="activeTab = 'login'"
            :class="activeTab === 'login' ? 'bg-gradient-to-r from-[#0050cb] to-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:text-white'"
            class="flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all duration-300 active:scale-98"
          >
            Login (Sign In)
          </button>
          <button 
            @click="activeTab = 'register'"
            :class="activeTab === 'register' ? 'bg-gradient-to-r from-[#0050cb] to-blue-600 text-white shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:text-white'"
            class="flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all duration-300 active:scale-98"
          >
            Daftar (Sign Up)
          </button>
        </div>

        <!-- Alert Notifikasi -->
        <transition name="fade-slide">
          <div v-if="errorMessage" class="mb-4 p-3.5 bg-red-950/40 border border-red-800/55 rounded-xl flex items-center gap-2.5 text-red-200 text-xs font-semibold">
            <span class="material-symbols-outlined text-[18px] text-red-400 shrink-0">error</span>
            <p class="leading-normal">{{ errorMessage }}</p>
          </div>
        </transition>

        <transition name="fade-slide">
          <div v-if="successMessage" class="mb-4 p-3.5 bg-green-950/40 border border-green-800/55 rounded-xl flex items-center gap-2.5 text-green-200 text-xs font-semibold">
            <span class="material-symbols-outlined text-[18px] text-green-400 shrink-0">check_circle</span>
            <p class="leading-normal">{{ successMessage }}</p>
          </div>
        </transition>

        <!-- FORM LOGIN -->
        <div v-if="activeTab === 'login'" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">mail</span>
              <input 
                v-model="loginForm.email"
                type="email" 
                placeholder="nama@email.com"
                class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs"
                @keyup.enter="handleLogin"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">lock</span>
              <input 
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••"
                class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-11 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs"
                @keyup.enter="handleLogin"
              />
              <button 
                @click="togglePassword"
                type="button" 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              >
                <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="text-right mt-2">
              <button @click="activeTab = 'forgot-password'" type="button" class="text-[10px] text-blue-400 hover:text-blue-300 font-bold tracking-wide transition-colors">
                Lupa Password?
              </button>
            </div>
          </div>

          <button 
            @click="handleLogin"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
          >
            <template v-if="authStore.loading">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </template>
            <template v-else>
              <span>Login</span>
              <span class="material-symbols-outlined text-[16px]">login</span>
            </template>
          </button>
        </div>

        <!-- FORM REGISTER -->
        <div v-else-if="activeTab === 'register'" class="space-y-4">
          <!-- STEP 1: Akun Dasar -->
          <div v-if="registerStep === 1" class="space-y-4" style="animation: fade-in 0.3s ease;">
            <h4 class="text-white text-xs font-bold border-b border-slate-800 pb-2">Step 1: Account Information</h4>
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name *</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">person</span>
                <input v-model="registerForm.fullName" type="text" placeholder="John Doe" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs" />
              </div>
            </div>
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address *</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">mail</span>
                <input v-model="registerForm.email" type="email" placeholder="nama@email.com" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs" />
              </div>
            </div>
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number *</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">phone</span>
                <input v-model="registerForm.phone" type="tel" placeholder="08123456789" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Password *</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">lock</span>
                <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Minimum 6 characters" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-11 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs" />
                <button @click="togglePassword" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none">
                  <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Confirm Password *</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">lock</span>
                <input v-model="registerForm.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Repeat password" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-11 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs" />
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-800/50">
              <button 
                @click="nextStep"
                class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <span>Proceed to ID Verification</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- STEP 2: Verifikasi KTP -->
          <div v-if="registerStep === 2" style="animation: fade-in 0.3s ease;">
            
            <!-- Upload KTP First -->
            <div v-if="!ktpFile" class="flex flex-col items-center justify-center p-8 bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl space-y-4 hover:border-[#0050cb] transition-colors relative h-64 mb-6" style="animation: fade-in 0.3s ease;">
              <input type="file" accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <span class="material-symbols-outlined text-[64px] text-[#0050cb]">id_card</span>
              <div class="text-center">
                <h3 class="text-white font-bold text-sm mb-1">Upload Original ID Card (KTP) *</h3>
                <p class="text-slate-500 text-xs">Please upload your KTP photo first to unlock the remaining fields. Ensure it is clearly visible (Max 2MB).</p>
              </div>
            </div>

            <!-- KTP Form Fields (Hidden until KTP is uploaded) -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6" style="animation: fade-in 0.3s ease;">
              <!-- Kiri: Data KTP -->
              <div class="space-y-4">
                <h4 class="text-white text-xs font-bold border-b border-slate-800 pb-2">Step 2: ID Information (KTP)</h4>
                
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">NIK *</label>
                  <input v-model="registerForm.nik" type="text" placeholder="16 Digit NIK" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Place of Birth *</label>
                    <input v-model="registerForm.tempatLahir" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Birth *</label>
                    <input v-model="registerForm.tanggalLahir" type="date" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb] invert-[0.8]" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender *</label>
                    <select v-model="registerForm.jenisKelamin" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
                      <option value="">Select</option>
                      <option value="Laki-Laki">Male</option>
                      <option value="Perempuan">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Religion *</label>
                    <select v-model="registerForm.agama" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
                      <option value="">Select</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address (Street/Village) *</label>
                  <input v-model="registerForm.alamat" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">RT/RW *</label>
                    <input v-model="registerForm.rtRw" type="text" placeholder="001/002" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">District *</label>
                    <input v-model="registerForm.kecamatan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                  </div>
                </div>
              </div>

              <!-- Kanan: Tambahan & Foto KTP -->
              <div class="space-y-4">
                <h4 class="text-white text-xs font-bold border-b border-slate-800 pb-2 invisible md:visible">.</h4>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Marital Status</label>
                    <select v-model="registerForm.statusPerkawinan" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
                      <option value="">Select</option>
                      <option value="Belum Kawin">Single</option>
                      <option value="Kawin">Married</option>
                      <option value="Cerai Hidup">Divorced</option>
                      <option value="Cerai Mati">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Occupation</label>
                    <input v-model="registerForm.pekerjaan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nationality</label>
                  <input v-model="registerForm.kewarganegaraan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
                </div>

                <!-- Upload KTP -->
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Upload Original ID Card (KTP) *</label>
                  <div class="relative w-full border-2 border-dashed border-slate-700 hover:border-[#0050cb] transition-colors rounded-xl bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden h-36">
                    <input type="file" accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div v-if="!ktpPreview" class="text-center text-slate-500 pointer-events-none flex flex-col items-center gap-1">
                      <span class="material-symbols-outlined text-[24px]">cloud_upload</span>
                      <span class="text-[10px] font-semibold">Select or Drag ID Photo</span>
                      <span class="text-[9px]">Ensure it is clearly visible (Max 2MB)</span>
                    </div>
                    <img v-else :src="ktpPreview" class="absolute inset-0 w-full h-full object-cover opacity-80" />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex gap-3 border-t border-slate-800/50 pt-4">
              <button 
                @click="prevStep"
                type="button"
                class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>

              <button 
                @click="handleRegister"
                :disabled="authStore.loading || !ktpFile"
                class="flex-[2] bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
                :class="{ 'opacity-50 cursor-not-allowed': !ktpFile }"
              >
                <template v-if="authStore.loading">
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </template>
                <template v-else>
                  <span>Register Account</span>
                  <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                </template>
              </button>
            </div>
          </div>
        </div>

        <!-- FORM FORGOT PASSWORD -->
        <div v-else-if="activeTab === 'forgot-password'" class="space-y-4">
          <div class="text-center mb-2">
            <h3 class="text-white font-bold text-lg">Lupa Password</h3>
            <p class="text-slate-400 text-[10px] mt-1">Loginkan email Anda untuk menerima tautan reset password.</p>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">mail</span>
              <input 
                v-model="forgotPasswordForm.email"
                type="email" 
                placeholder="nama@email.com"
                class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0050cb] transition-all text-xs"
                @keyup.enter="handleForgotPassword"
              />
            </div>
          </div>

          <div class="flex flex-col gap-3 mt-6">
            <button 
              @click="handleForgotPassword"
              :disabled="authStore.loading"
              class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
            >
              <template v-if="authStore.loading">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mengirim...</span>
              </template>
              <template v-else>
                <span>Kirim Link Reset</span>
                <span class="material-symbols-outlined text-[16px]">send</span>
              </template>
            </button>
            <button 
              @click="activeTab = 'login'" 
              type="button" 
              class="w-full text-slate-400 hover:text-white font-bold py-2 text-xs transition-colors"
            >
              Back ke Login
            </button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Transisi Fade untuk Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Animasi Muncul Membesar (Pop-in) */
@keyframes popIn {
  from { transform: scale(0.9) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

/* Spinner Loading */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Scrollbar Custom */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 99px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
