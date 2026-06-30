<script setup>
import { reactive, ref, onMounted, onUpdated, watch } from "vue";
import Swal from 'sweetalert2';
import AOS from "aos";
import "aos/dist/aos.css";

import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/lib/supabase";
import defaultAvatar from "@/assets/images/user_profile/default-avatar.png";

const authStore = useAuthStore();
const isLoading = ref(false);

const profile = reactive({
  username: "",
  email: "",
  phone: "",
  image: defaultAvatar,
});

const loadUserProfile = () => {
  if (authStore.user) {
    profile.username = authStore.user.full_name || authStore.user.email.split('@')[0];
    profile.email = authStore.user.email || '';
    profile.phone = authStore.user.phone_number || '';
    profile.image = authStore.user.avatar_url || authStore.user.user_metadata?.avatar_url || authStore.user.image_url || defaultAvatar;
  }
};

// Helper to compress and resize image to Base64 (max 150x150px)
const compressAndResizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Handlers for avatar upload
const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const originalImage = profile.image;
  isLoading.value = true;

  try {
    // Compress image to Base64
    const base64Image = await compressAndResizeImage(file);
    profile.image = base64Image;

    // Update user_metadata in Supabase Auth directly
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        avatar_url: base64Image
      }
    });
    if (authError) throw authError;

    // Refresh Pinia store
    await authStore.fetchUserProfile(authStore.user.id, authStore.user.email);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your profile photo has been updated.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    profile.image = originalImage;
    Swal.fire({
      icon: 'error',
      title: 'Failed to update profile photo',
      text: err.message,
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isLoading.value = false;
  }
};

const saveProfileSettings = async () => {
  if (!profile.username || !profile.username.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete data',
      text: 'Full Name is required.',
      confirmButtonColor: '#0050cb'
    });
    return;
  }

  isLoading.value = true;
  try {
    const userId = authStore.user.id;

    // 1. Update profiles table (full_name, phone_number)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.username,
        phone_number: profile.phone
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // 2. Update user_metadata in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: profile.username,
        phone_number: profile.phone
      }
    });

    if (authError) throw authError;

    // 3. Refresh user profile in Pinia store
    await authStore.fetchUserProfile(userId, authStore.user.email);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your profile has been updated.',
      showConfirmButton: false,
      timer: 1500,
      iconColor: '#0050cb'
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    Swal.fire({
      icon: 'error',
      title: 'Failed to update profile',
      text: err.message,
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isLoading.value = false;
  }
};

const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
});
const isChangingPassword = ref(false);

const updatePassword = async () => {
  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete data',
      text: 'All password fields are required.',
      confirmButtonColor: '#0050cb'
    });
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Weak password',
      text: 'Password must be at least 6 characters.',
      confirmButtonColor: '#0050cb'
    });
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Confirmation Error',
      text: 'New password confirmation does not match.',
      confirmButtonColor: '#0050cb'
    });
    return;
  }

  isChangingPassword.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword
    });

    if (error) throw error;

    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your password has been updated.',
      showConfirmButton: false,
      timer: 1500,
      iconColor: '#0050cb'
    });
  } catch (err) {
    console.error('Error updating password:', err);
    Swal.fire({
      icon: 'error',
      title: 'Failed to update password',
      text: err.message,
      confirmButtonColor: '#0050cb'
    });
  } finally {
    isChangingPassword.value = false;
  }
};

// --- LIFECYCLE ---
onMounted(async () => {
  AOS.init({ once: true, duration: 1000, easing: "ease-out-quart" });
  if (!authStore.initialized) {
    await authStore.initialize();
  }
  loadUserProfile();
});

watch(() => authStore.user, () => {
  loadUserProfile();
}, { deep: true });

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
          My Profile
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
          <input
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            :disabled="isLoading"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        <p class="mt-5 text-xs md:text-sm text-[#727687] font-bold uppercase tracking-widest" data-aos="fade-up" data-aos-delay="200">
          Click photo to change
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
            <h2 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Personal Information</h2>
            <span class="bg-blue-50 text-[#0050cb] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Active Status</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            <!-- Email (Disabled) -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Email Address</label>
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
              <p class="mt-1.5 text-[10px] text-[#727687]">*Email is linked to a verified identity and cannot be changed manually.</p>
            </div>

            <!-- Full Name -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Full Name</label>
              <input
                v-model="profile.username"
                type="text"
                :disabled="isLoading"
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Phone Number</label>
              <input
                v-model="profile.phone"
                type="tel"
                placeholder="08..."
                :disabled="isLoading"
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>
          </div>

          <!-- Tombol Simpan -->
          <div class="mt-10 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              @click="loadUserProfile"
              :disabled="isLoading"
              class="w-full sm:w-auto rounded-xl bg-white border border-gray-200 px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold text-[#424656] transition-all hover:bg-gray-50 active:scale-95 uppercase tracking-widest disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full sm:w-auto relative overflow-hidden rounded-xl signature-gradient px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold text-white shadow-lg shadow-[#0050cb]/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </section>

      <!-- ================= AREA UBAH KATA SANDI ================= -->
      <section
        class="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <form @submit.prevent="updatePassword">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 class="text-lg md:text-xl font-extrabold text-[#191c1e]">Change Password</h2>
            <span class="bg-[#ba1a1a]/10 text-[#ba1a1a] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#ba1a1a]/20">Security</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <!-- Password Baru -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="••••••••"
                :disabled="isChangingPassword"
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <!-- Konfirmasi Password -->
            <div>
              <label class="block mb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#424656]">Confirm New Password</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="••••••••"
                :disabled="isChangingPassword"
                class="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 md:py-4 focus:ring-2 focus:ring-[#0050cb]/30 focus:border-[#0050cb] outline-none transition-all duration-300 font-medium text-[#191c1e] text-sm hover:border-gray-300 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>
          </div>

          <!-- Tombol Simpan -->
          <div class="mt-10 flex justify-end">
            <button
              type="submit"
              :disabled="isChangingPassword"
              class="w-full sm:w-auto relative overflow-hidden rounded-xl signature-gradient px-8 py-3.5 md:py-4 text-xs md:text-sm font-bold text-white shadow-lg shadow-[#0050cb]/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isChangingPassword" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
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
