<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Show from '@/components/icons/Show.vue' 
import Trash from '@/components/icons/TrashCan.vue' 
import Edit from '@/components/icons/Edit.vue' 
import { useAuthStore } from '@/stores/auth'
import UserDetailsModal from './UserDetailsModal.vue'

const authStore = useAuthStore()
const searchQuery = ref("")
const currentUserId = computed(() => authStore.user?.id)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)

const users = ref([])
const isLoading = ref(false)

const isDetailsModalOpen = ref(false)
const selectedUser = ref(null)

const openUserDetails = (user) => {
  selectedUser.value = user
  isDetailsModalOpen.value = true
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const token = authStore.session?.access_token;
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user data');
    
    users.value = result.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    Swal.fire({ icon: 'error', title: 'Failed to Load Data', text: error.message });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUsers()
})

// Logika Searching Lokal
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => {
    return (
      (user.full_name && user.full_name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  });
});

// Ubah Role (Admin <=> Customer) Khusus Super Admin
const toggleUserRole = (user) => {
  if (!isSuperAdmin.value) {
    Swal.fire('Access Denied', 'Only Super Admins can change roles.', 'error');
    return;
  }

  const newRole = user.role === 'admin' ? 'customer' : 'admin';

  Swal.fire({
    title: 'Change Role?',
    text: `Change account ${user.full_name || user.email} to ${newRole.toUpperCase()}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0050cb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Change!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = authStore.session?.access_token;
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${user.id}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        });
        
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Failed to change role');
        
        user.role = newRole;
        Swal.fire({ icon: 'success', title: 'Updated!', text: resData.message, timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
      }
    }
  })
}

// Toggle Status Aktif/Nonaktif
const toggleUserStatus = (user) => {
  // Hanya admin/superadmin yang bisa nonaktifkan, tp krn ini admin panel sdh aman
  // Default kolom is_active jika null berarti true
  const isActive = user.is_active === false ? false : true;
  const actionText = isActive ? "Deactivate" : "Activate";
  const newStatus = !isActive;

  Swal.fire({
    title: 'Confirm Status Change',
    text: `You are about to ${actionText.toLowerCase()} account ${user.full_name || user.email}. Continue?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: isActive ? '#d33' : '#16a34a',
    cancelButtonColor: '#0050cb',
    confirmButtonText: `Yes, ${actionText}!`,
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = authStore.session?.access_token;
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${user.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ is_active: newStatus })
        });
        
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || 'Failed to change status');
        
        user.is_active = newStatus;
        Swal.fire({ icon: 'success', title: 'Status Updated', text: resData.message, timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
      }
    }
  })
}
</script>

<template>
  <div class="space-y-6 font-['Manrope'] text-[#191c1e] pb-10">

    <!-- Bagian Header Judul -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#191c1e]">Account Management</h1>
        <p class="text-sm text-[#727687]">Manage roles and status of all GASNGO customers and admins.</p>
      </div>

    </div>

    <!-- Kotak Utama Pembungkus -->
    <div class="bg-white rounded-3xl border border-[#c2c6d8]/40 shadow-sm overflow-hidden flex flex-col">

      <!-- Bagian Atas: Search Bar -->
      <div class="p-5 md:p-6 border-b border-[#f2f4f6]">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727687] text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border border-transparent rounded-full text-sm outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] focus:bg-white transition-all text-[#191c1e] font-medium"
          >
        </div>
      </div>

      <!-- Wrapper Tabel agar bisa digeser di HP (Responsive) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap min-w-[900px]">
          <!-- Header Tabel dengan warna Navy khas referensi gambar -->
          <thead class="bg-[#003161] text-white text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 w-12 text-center">NO</th>
              <th class="px-6 py-4">FULL NAME</th>
              <th class="px-6 py-4">EMAIL</th>
              <th class="px-6 py-4">PHONE NO.</th>
              <th class="px-6 py-4">ROLE</th>
              <th class="px-6 py-4 text-center">ACCOUNT STATUS</th>
              <th class="px-6 py-4 text-center">VERIF STATUS</th>
              <th class="px-6 py-4 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-if="isLoading">
              <td colspan="7" class="p-8 text-center text-[#727687]">
                <span class="material-symbols-outlined animate-spin text-3xl text-[#0050cb] mb-2">sync</span>
                <p class="text-xs font-bold uppercase tracking-widest">Loading user data...</p>
              </td>
            </tr>

            <!-- Jika tidak ada user -->
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="7" class="p-8 text-center text-[#727687] italic font-medium">No account data found.</td>
            </tr>

            <tr v-else v-for="(user, index) in filteredUsers" :key="user.id"
                class="transition-colors hover:bg-blue-50/30"
                :class="{'opacity-60 bg-gray-50': user.is_active === false}"
            >
              <!-- 1. Nomor -->
              <td class="px-6 py-5 text-center text-[#727687] font-bold text-sm">{{ index + 1 }}</td>

              <!-- 2. Nama & Inisial Avatar -->
              <td class="px-6 py-5 text-[#191c1e] font-extrabold flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#e6eeff] flex items-center justify-center text-xs font-black text-[#0050cb] uppercase border border-[#b3c5ff]/50">
                  {{ (user.full_name || user.email || 'U').substring(0,2) }}
                </div>
                {{ user.full_name || 'No Name' }}
              </td>

              <!-- 3. Email -->
              <td class="px-6 py-5 text-[#424656]">{{ user.email }}</td>

              <!-- 4. Telepon -->
              <td class="px-6 py-5 text-[#424656]">{{ user.phone_number || '-' }}</td>

              <!-- 5. Peran (Role) -->
              <td class="px-6 py-5">
                <span class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border"
                      :class="user.role === 'admin' ? 'bg-[#425ca0]/10 text-[#425ca0] border-[#425ca0]/30' : 'bg-[#e0e3e5]/50 text-[#424656] border-[#c2c6d8]'">
                  {{ user.role ? user.role : '-' }}
                </span>
              </td>

              <!-- 6. Status -->
              <td class="px-6 py-5 text-center">
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      :class="user.is_active !== false ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                  {{ user.is_active !== false ? 'ACTIVE' : 'INACTIVE' }}
                </span>
              </td>

              <!-- Verif Status -->
              <td class="px-6 py-5 text-center">
                <span v-if="user.account_status === 'pending'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-orange-100 text-orange-700 border-orange-200">
                  PENDING
                </span>
                <span v-else-if="user.account_status === 'verified'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-blue-100 text-blue-700 border-blue-200">
                  VERIFIED
                </span>
                <span v-else-if="user.account_status === 'rejected'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-red-100 text-red-700 border-red-200">
                  REJECTED
                </span>
                <span v-else class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-gray-100 text-gray-700 border-gray-200">
                  -
                </span>
              </td>

              <!-- 7. Aksi -->
              <td class="px-6 py-5">
                <div class="flex gap-2 items-center justify-center">

                  <!-- Tombol Detail (Biru) -->
                  <button @click="openUserDetails(user)" class="w-8 h-8 rounded bg-[#295f98] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Lihat Profil">
                    <Show class="size-6 text-white" />
                  </button>

                  <template v-if="user.id !== currentUserId">
                    <!-- Tombol Ubah Role (Kuning) hanya untuk Super Admin -->
                    <button v-if="isSuperAdmin" @click="toggleUserRole(user)" class="w-8 h-8 rounded bg-[#eab308] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Ubah Peran">
                      <Edit class="size-6 text-white" />
                    </button>

                    <!-- Tombol Nonaktifkan (Merah) -->
                    <button v-if="user.is_active !== false" @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Nonaktifkan Akun">
                      <Trash class="size-6 text-white" />
                    </button>

                    <!-- Tombol Aktifkan/Restore (Hijau) -->
                    <button v-else @click="toggleUserStatus(user)" class="w-8 h-8 rounded bg-[#16a34a] text-white flex items-center justify-center hover:opacity-80 transition-opacity" title="Aktifkan Kembali">
                      <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
                    </button>
                  </template>

                  <template v-else>
                    <!-- Tanda Untuk Diri Sendiri -->
                    <span class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#727687] bg-[#f2f4f6] rounded border border-[#c2c6d8]/50 select-none">
                      ME
                    </span>
                  </template>

                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Footer Tabel (Summary Status) -->
      <div class="p-5 md:p-6 border-t border-[#f2f4f6] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f7f9fb]/50">
          <p class="text-sm text-[#727687] font-medium">Showing <span class="font-black text-[#191c1e] text-base">{{ filteredUsers.length }}</span> of <span class="font-black text-[#191c1e] text-base">{{ users.length }}</span> Accounts</p>
          <div class="flex gap-6">
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#16a34a] rounded-full"></span> Active
              </span>
              <span class="flex items-center gap-2 text-xs font-bold text-[#424656] uppercase tracking-widest">
                <span class="w-2.5 h-2.5 bg-[#d32f2f] rounded-full"></span> Inactive
              </span>
          </div>
      </div>

    </div>

    <UserDetailsModal 
      :show="isDetailsModalOpen" 
      :user="selectedUser" 
      @close="isDetailsModalOpen = false" 
      @updated="fetchUsers"
    />
  </div>
</template>

<style scoped>
/* Pengaturan Base Icon Material */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
