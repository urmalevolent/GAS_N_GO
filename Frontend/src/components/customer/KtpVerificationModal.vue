<script setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()

const ktpForm = reactive({
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

const ktpFile = ref(null)
const ktpPreview = ref(null)
const errorMessage = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'Maximum file size is 2MB.'
      return
    }
    ktpFile.value = file
    ktpPreview.value = URL.createObjectURL(file)
    errorMessage.value = ''
  }
}

const removeFile = () => {
  ktpFile.value = null
  ktpPreview.value = null
}

const closeModal = () => {
  errorMessage.value = ''
  emit('close')
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!ktpForm.nik || !ktpForm.tempatLahir || !ktpForm.tanggalLahir || !ktpForm.jenisKelamin ||
      !ktpForm.alamat || !ktpForm.rtRw || !ktpForm.kecamatan || !ktpForm.agama || !ktpFile.value) {
    errorMessage.value = 'Please complete all required fields and upload your original ID card photo.'
    return
  }

  const ktpData = {
    nik: ktpForm.nik,
    tempat_lahir: ktpForm.tempatLahir,
    tanggal_lahir: ktpForm.tanggalLahir,
    jenis_kelamin: ktpForm.jenisKelamin,
    alamat: ktpForm.alamat,
    rt_rw: ktpForm.rtRw,
    kecamatan: ktpForm.kecamatan,
    agama: ktpForm.agama,
    status_perkawinan: ktpForm.statusPerkawinan || null,
    pekerjaan: ktpForm.pekerjaan || null,
    kewarganegaraan: ktpForm.kewarganegaraan || null
  }

  const { error } = await authStore.submitKtpVerification(ktpData, ktpFile.value)

  if (error) {
    errorMessage.value = error.message || 'Failed to submit KTP verification.'
  } else {
    emit('success')
    closeModal()
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

    <div 
      class="relative w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar transition-all"
      :class="ktpFile ? 'max-w-3xl' : 'max-w-md'"
      style="animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);"
    >
      <button @click="closeModal" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full backdrop-blur-sm z-10">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>

      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">ID Verification</h2>
        <p class="text-slate-400 text-sm">Verify your KTP to unlock all features.</p>
      </div>

      <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 mb-6" style="animation: fade-in 0.3s ease;">
        <span class="material-symbols-outlined text-[16px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <div class="space-y-4">
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
            <h4 class="text-white text-xs font-bold border-b border-slate-800 pb-2">ID Information (KTP)</h4>
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">NIK *</label>
              <input v-model="ktpForm.nik" type="text" placeholder="16 Digit NIK" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Place of Birth *</label>
                <input v-model="ktpForm.tempatLahir" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Birth *</label>
                <input v-model="ktpForm.tanggalLahir" type="date" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb] invert-[0.8]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender *</label>
                <select v-model="ktpForm.jenisKelamin" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
                  <option value="">Select</option>
                  <option value="Laki-Laki">Male</option>
                  <option value="Perempuan">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Religion *</label>
                <select v-model="ktpForm.agama" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
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
              <input v-model="ktpForm.alamat" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">RT/RW *</label>
                <input v-model="ktpForm.rtRw" type="text" placeholder="001/002" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">District *</label>
                <input v-model="ktpForm.kecamatan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
              </div>
            </div>
          </div>

          <!-- Kanan: Tambahan & Foto KTP -->
          <div class="space-y-4">
            <h4 class="text-white text-xs font-bold border-b border-slate-800 pb-2 invisible md:visible">.</h4>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Marital Status</label>
                <select v-model="ktpForm.statusPerkawinan" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]">
                  <option value="">Select</option>
                  <option value="Belum Kawin">Single</option>
                  <option value="Kawin">Married</option>
                  <option value="Cerai Hidup">Divorced</option>
                  <option value="Cerai Mati">Widowed</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Occupation</label>
                <input v-model="ktpForm.pekerjaan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nationality</label>
              <input v-model="ktpForm.kewarganegaraan" type="text" class="w-full bg-slate-950 border border-slate-800 focus:border-[#0050cb] text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0050cb]" />
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
              <div v-if="ktpFile" class="text-right mt-1">
                 <button @click="removeFile" type="button" class="text-[10px] text-red-400 hover:text-red-300 font-bold tracking-wide transition-colors">
                   Remove Photo
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="ktpFile" class="mt-6 flex gap-3 border-t border-slate-800/50 pt-4">
          <button 
            @click="handleSubmit"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
          >
            <template v-if="authStore.loading">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </template>
            <template v-else>
              <span>Submit Verification</span>
              <span class="material-symbols-outlined text-[16px]">verified</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(51, 65, 85, 0.8);
}
</style>
