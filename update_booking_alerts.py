import sys

filepath = r'c:\Users\Allan\CODE\GAS_N_GO\Frontend\src\pages\customer\Booking.vue'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import Swal
old_import = "import { supabase } from '@/lib/supabase';"
new_import = "import { supabase } from '@/lib/supabase';\nimport Swal from 'sweetalert2';"
content = content.replace(old_import, new_import)

# 2. Replace address alert
old_alert_1 = "alert('Please enter the vehicle delivery/pickup address first.');"
new_alert_1 = "Swal.fire({ icon: 'warning', title: 'Address Required', text: 'Please enter the vehicle delivery/pickup address first.' });"
content = content.replace(old_alert_1, new_alert_1)

# 3. Replace login alert
old_alert_2 = "alert('Please log in first to continue with your booking.');"
new_alert_2 = "Swal.fire({ icon: 'info', title: 'Please Log In', text: 'Please log in first to continue with your booking.', confirmButtonColor: '#0050cb' }).then(() => { close(); authStore.openAuthModal(); });"
content = content.replace(old_alert_2, new_alert_2)
# Remove the old close() and authStore.openAuthModal() since it's now in the promise
old_login_block = '''  if (!authStore.isAuthenticated) {
    Swal.fire({ icon: 'info', title: 'Please Log In', text: 'Please log in first to continue with your booking.', confirmButtonColor: '#0050cb' }).then(() => { close(); authStore.openAuthModal(); });
    close();
    authStore.openAuthModal();
    return;
  }'''
new_login_block = '''  if (!authStore.isAuthenticated) {
    Swal.fire({ icon: 'info', title: 'Please Log In', text: 'Please log in first to continue with your booking.', confirmButtonColor: '#0050cb' }).then(() => { close(); authStore.openAuthModal(); });
    return;
  }'''
content = content.replace(old_login_block, new_login_block)

# 4. Replace unverified alert
old_alert_3 = "alert('You must verify your ID card (KTP) before you can book a rental. Please go to your Profile page.');"
new_alert_3 = "Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'You must verify your ID card (KTP) before you can book a rental. Please go to your Profile page.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });"
content = content.replace(old_alert_3, new_alert_3)
old_unverified_block = '''  if (authStore.user?.account_status === 'unverified') {
    Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'You must verify your ID card (KTP) before you can book a rental. Please go to your Profile page.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });
    close();
    router.push('/profile');
    return;
  }'''
new_unverified_block = '''  if (authStore.user?.account_status === 'unverified') {
    Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'You must verify your ID card (KTP) before you can book a rental. Please go to your Profile page.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });
    return;
  }'''
content = content.replace(old_unverified_block, new_unverified_block)

# 5. Replace rejected alert
old_alert_4 = "alert('Your previous KTP verification was rejected. Please re-upload your KTP in your profile.');"
new_alert_4 = "Swal.fire({ icon: 'error', title: 'Verification Rejected', text: 'Your previous KTP verification was rejected. Please re-upload your KTP in your profile.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });"
content = content.replace(old_alert_4, new_alert_4)
old_rejected_block = '''  if (authStore.user?.account_status === 'rejected') {
    Swal.fire({ icon: 'error', title: 'Verification Rejected', text: 'Your previous KTP verification was rejected. Please re-upload your KTP in your profile.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });
    close();
    router.push('/profile');
    return;
  }'''
new_rejected_block = '''  if (authStore.user?.account_status === 'rejected') {
    Swal.fire({ icon: 'error', title: 'Verification Rejected', text: 'Your previous KTP verification was rejected. Please re-upload your KTP in your profile.', confirmButtonColor: '#0050cb' }).then(() => { close(); router.push('/profile'); });
    return;
  }'''
content = content.replace(old_rejected_block, new_rejected_block)

# 6. Replace pending alert
old_alert_5 = "alert('Your KTP verification is still pending. Please wait for admin approval.');"
new_alert_5 = "Swal.fire({ icon: 'info', title: 'Verification Pending', text: 'Your KTP verification is still pending. Please wait for admin approval.', confirmButtonColor: '#0050cb' });"
content = content.replace(old_alert_5, new_alert_5)
old_pending_block = '''  if (authStore.user?.account_status === 'pending') {
    Swal.fire({ icon: 'info', title: 'Verification Pending', text: 'Your KTP verification is still pending. Please wait for admin approval.', confirmButtonColor: '#0050cb' });
    close();
    return;
  }'''
new_pending_block = '''  if (authStore.user?.account_status === 'pending') {
    Swal.fire({ icon: 'info', title: 'Verification Pending', text: 'Your KTP verification is still pending. Please wait for admin approval.', confirmButtonColor: '#0050cb' }).then(() => { close(); });
    return;
  }'''
content = content.replace(old_pending_block, new_pending_block)

# 7. Replace error alert
old_alert_6 = "alert(error.message || 'A system error occurred while contacting the backend.');"
new_alert_6 = "Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'A system error occurred while contacting the backend.' });"
content = content.replace(old_alert_6, new_alert_6)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
