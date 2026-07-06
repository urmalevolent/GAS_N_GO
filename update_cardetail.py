import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\customer\CarDetail.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Imports and Setup
old_imports = '''import Booking from '@/pages/customer/Booking.vue';
import { ref } from 'vue';

const isBookingModalOpen = ref(false);'''
new_imports = '''import Booking from '@/pages/customer/Booking.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const isBookingModalOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();'''
content = content.replace(old_imports, new_imports)

# Adding handleReservation method
old_close = '''// 4. Fungsi Aksi
const close = () => {
  emit('close')
}'''
new_close = '''// 4. Fungsi Aksi
const close = () => {
  emit('close')
}

const handleReservation = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal()
    return
  }
  
  if (authStore.user?.account_status === 'unverified') {
    Swal.fire({
      icon: 'warning',
      title: 'Verification Required',
      text: 'You must verify your ID card (KTP) before you can book a rental.',
      confirmButtonText: 'Go to Profile',
      confirmButtonColor: '#0050cb',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        close()
        router.push('/profile')
      }
    })
    return
  }

  if (authStore.user?.account_status === 'rejected') {
    Swal.fire({
      icon: 'error',
      title: 'Verification Rejected',
      text: 'Your previous KTP verification was rejected. Please re-upload your KTP in your profile.',
      confirmButtonText: 'Go to Profile',
      confirmButtonColor: '#ba1a1a',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        close()
        router.push('/profile')
      }
    })
    return
  }

  isBookingModalOpen.value = true
}'''
content = content.replace(old_close, new_close)

# Replace @click="isBookingModalOpen = true" with @click="handleReservation"
content = content.replace('@click="isBookingModalOpen = true"', '@click="handleReservation"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
