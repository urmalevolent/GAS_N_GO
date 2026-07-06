import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\admin\users\UserLists.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_btn = '''                    <!-- Tombol Manual Verify (Hijau) hanya untuk Super Admin jika user belum verified -->
                    <button v-if="isSuperAdmin && user.account_status !== 'verified'" @click="forceVerifyUser(user)" class="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Verifikasi Paksa Akun">'''

new_btn = '''                    <!-- Tombol Manual Verify (Hijau) hanya untuk Super Admin jika user berstatus pending -->
                    <button v-if="isSuperAdmin && user.account_status === 'pending'" @click="forceVerifyUser(user)" class="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Verifikasi Akun">'''

content = content.replace(old_btn, new_btn)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
