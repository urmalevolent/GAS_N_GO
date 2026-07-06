import sys

def update_user_lists():
    filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\admin\users\UserLists.vue'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_status = '''                <span v-else-if="user.account_status === 'rejected'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-red-100 text-red-700 border-red-200">
                  REJECTED
                </span>
                <span v-else class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-gray-100 text-gray-700 border-gray-200">
                  -
                </span>'''
    
    new_status = '''                <span v-else-if="user.account_status === 'rejected'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-red-100 text-red-700 border-red-200">
                  REJECTED
                </span>
                <span v-else-if="user.account_status === 'unverified'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-yellow-100 text-yellow-700 border-yellow-200">
                  UNVERIFIED
                </span>
                <span v-else class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-gray-100 text-gray-700 border-gray-200">
                  -
                </span>'''
                
    content = content.replace(old_status, new_status)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


def update_user_details():
    filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\admin\users\UserDetailsModal.vue'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_banner = '''            <div v-else-if="user.account_status === 'verified'" class="bg-green-50 border border-green-200 p-3 rounded-2xl flex items-center gap-3 text-green-800">
              <span class="material-symbols-outlined text-xl">verified</span>
              <div>
                <h4 class="font-bold text-sm">Verified Account</h4>
              </div>
            </div>'''
            
    new_banner = '''            <div v-else-if="user.account_status === 'verified'" class="bg-green-50 border border-green-200 p-3 rounded-2xl flex items-center gap-3 text-green-800">
              <span class="material-symbols-outlined text-xl">verified</span>
              <div>
                <h4 class="font-bold text-sm">Verified Account</h4>
              </div>
            </div>

            <div v-else-if="user.account_status === 'unverified'" class="bg-yellow-50 border border-yellow-200 p-3 rounded-2xl flex items-center gap-3 text-yellow-800">
              <span class="material-symbols-outlined text-xl">warning</span>
              <div>
                <h4 class="font-bold text-sm">Unverified Account</h4>
                <p class="text-xs">This user has not uploaded their KTP yet.</p>
              </div>
            </div>
            
            <div v-else-if="user.account_status === 'rejected'" class="bg-red-50 border border-red-200 p-3 rounded-2xl flex items-center gap-3 text-red-800">
              <span class="material-symbols-outlined text-xl">gpp_bad</span>
              <div>
                <h4 class="font-bold text-sm">Verification Rejected</h4>
                <p class="text-xs">This user's KTP submission was rejected.</p>
              </div>
            </div>'''
            
    content = content.replace(old_banner, new_banner)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_user_lists()
update_user_details()
