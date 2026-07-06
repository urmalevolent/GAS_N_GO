import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\components\customer\AuthModal.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add handleGoogleLogin method
old_script = '''// Handle Login
const handleLogin = async () => {'''
new_script = '''// Handle Google Login
const handleGoogleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  const { error } = await authStore.signInWithGoogle()
  if (error) {
    errorMessage.value = error.message
  }
}

// Handle Login
const handleLogin = async () => {'''
content = content.replace(old_script, new_script)

# 2. Add Google button to Login Form
old_login_btn = '''            <template v-else>
              <span>Login</span>
              <span class="material-symbols-outlined text-[16px]">login</span>
            </template>
          </button>
        </div>'''
new_login_btn = '''            <template v-else>
              <span>Login</span>
              <span class="material-symbols-outlined text-[16px]">login</span>
            </template>
          </button>

          <div class="relative flex py-5 items-center">
            <div class="flex-grow border-t border-slate-800"></div>
            <span class="flex-shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">ATAU</span>
            <div class="flex-grow border-t border-slate-800"></div>
          </div>
          
          <button 
            @click="handleGoogleLogin"
            :disabled="authStore.loading"
            class="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 text-xs tracking-wide active:scale-[0.99] shadow-md"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
            <span>Lanjutkan dengan Google</span>
          </button>
        </div>'''
content = content.replace(old_login_btn, new_login_btn)

# 3. Add Google button to Register Form
old_register_btn = '''              <button 
                @click="nextStep"
                class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <span>Proceed to ID Verification</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>'''
new_register_btn = '''              <button 
                @click="nextStep"
                class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <span>Proceed to ID Verification</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <div class="relative flex py-5 items-center">
                <div class="flex-grow border-t border-slate-800"></div>
                <span class="flex-shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">ATAU DAFTAR INSTAN</span>
                <div class="flex-grow border-t border-slate-800"></div>
              </div>
              
              <button 
                @click="handleGoogleLogin"
                :disabled="authStore.loading"
                class="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 text-xs tracking-wide active:scale-[0.99] shadow-md"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>
          </div>'''
content = content.replace(old_register_btn, new_register_btn)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
