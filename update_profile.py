import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\customer\profile\Profile.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
import_old = '''import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";'''
import_new = '''import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";
import KtpVerificationModal from "@/components/customer/KtpVerificationModal.vue";'''
content = content.replace(import_old, import_new)

# 2. State & Handlers
state_old = '''const isLoading = ref(false);'''
state_new = '''const isLoading = ref(false);
const isKtpModalOpen = ref(false);

const handleKtpSuccess = () => {
  Swal.fire({
    icon: 'success',
    title: 'Submitted!',
    text: 'Your KTP has been submitted and is pending verification by our admin.',
    confirmButtonColor: '#0050cb'
  });
};
'''
content = content.replace(state_old, state_new)

# 3. Header & Banner in Template
header_old = '''      <!-- Judul Halaman -->
      <div class="flex items-center gap-3 border-b border-[#c2c6d8]/40 pb-4" data-aos="fade-down">
        <span class="material-symbols-outlined text-[#0050cb] text-3xl">manage_accounts</span>
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
          My Profile
        </h1>
      </div>'''
header_new = '''      <!-- Judul Halaman -->
      <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-[#c2c6d8]/40 pb-4 gap-4" data-aos="fade-down">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[#0050cb] text-3xl">manage_accounts</span>
          <h1 class="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            My Profile
          </h1>
        </div>
        <!-- Status Badge -->
        <div v-if="authStore.user" class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto shadow-sm"
             :class="{
               'bg-yellow-100 text-yellow-700 border border-yellow-200': authStore.user.account_status === 'unverified',
               'bg-blue-100 text-blue-700 border border-blue-200': authStore.user.account_status === 'pending',
               'bg-green-100 text-green-700 border border-green-200': authStore.user.account_status === 'verified',
               'bg-red-100 text-red-700 border border-red-200': authStore.user.account_status === 'rejected'
             }">
           <span class="material-symbols-outlined text-[16px]">
             {{ authStore.user.account_status === 'verified' ? 'verified' : 
                authStore.user.account_status === 'rejected' ? 'cancel' : 
                authStore.user.account_status === 'pending' ? 'pending_actions' : 'warning' }}
           </span>
           <span>{{ authStore.user.account_status }}</span>
        </div>
      </div>

      <!-- KTP Verification Banner -->
      <div v-if="authStore.user && (authStore.user.account_status === 'unverified' || authStore.user.account_status === 'rejected')" class="bg-red-50 border border-red-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" data-aos="fade-down">
        <div>
          <h3 class="text-red-800 font-bold mb-1 flex items-center gap-2">
            <span class="material-symbols-outlined">gpp_bad</span>
            Action Required: Verify Your Identity
          </h3>
          <p class="text-red-700 text-sm">
            {{ authStore.user.account_status === 'rejected' ? 'Your previous KTP submission was rejected. Please re-upload a valid KTP to continue booking.' : 'You must verify your ID card (KTP) before you can book any rentals.' }}
          </p>
        </div>
        <button @click="isKtpModalOpen = true" class="whitespace-nowrap px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm uppercase tracking-wide">
          Verify KTP Now
        </button>
      </div>'''
content = content.replace(header_old, header_new)

# 4. Add component tag at bottom
footer_old = '''  </div>
</template>'''
footer_new = '''  </div>

  <KtpVerificationModal 
    :isOpen="isKtpModalOpen" 
    @close="isKtpModalOpen = false" 
    @success="handleKtpSuccess" 
  />
</template>'''
content = content.replace(footer_old, footer_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
