import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'customer')
  const isAdmin = computed(() => userRole.value === 'admin' || userRole.value === 'super_admin')
  const isSuperAdmin = computed(() => userRole.value === 'super_admin')

  const isAuthModalOpen = ref(false)

  function openAuthModal() {
    isAuthModalOpen.value = true
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false
  }

  // Inisialisasi sesi autentikasi dan listener perubahan status
  async function initialize() {
    if (initialized.value) return
    loading.value = true
    
    try {
      // Ambil sesi saat ini
      const { data: { session: initialSession }, error } = await supabase.auth.getSession()
      if (error) throw error

      session.value = initialSession
      if (initialSession?.user) {
        await fetchUserProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata)
      }
    } catch (err) {
      console.error('Error saat inisialisasi session:', err)
    }

    // Dengarkan perubahan status autentikasi
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      session.value = newSession
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata)
      } else {
        user.value = null
      }
    })

    initialized.value = true
    loading.value = false
  }


  // Mengambil atau membuat profil pengguna di tabel public.profiles
  async function fetchUserProfile(userId, email, metadata = null) {
    try {
      let userMetadata = metadata;
      if (!userMetadata || Object.keys(userMetadata).length === 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        userMetadata = currentUser?.user_metadata || {};
      }

      const avatar = userMetadata?.avatar_url || userMetadata?.image_url || null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: userMetadata?.full_name || email.split('@')[0],
              phone_number: userMetadata?.phone_number || '',
              role: userMetadata?.role || 'customer',
              ktp_photo_url: userMetadata?.ktp_photo_url || null,
              nik: userMetadata?.nik || null,
              tempat_lahir: userMetadata?.tempat_lahir || null,
              tanggal_lahir: userMetadata?.tanggal_lahir || null,
              jenis_kelamin: userMetadata?.jenis_kelamin || null,
              alamat: userMetadata?.alamat || null,
              rt_rw: userMetadata?.rt_rw || null,
              kecamatan: userMetadata?.kecamatan || null,
              agama: userMetadata?.agama || null,
              status_perkawinan: userMetadata?.status_perkawinan || null,
              pekerjaan: userMetadata?.pekerjaan || null,
              kewarganegaraan: userMetadata?.kewarganegaraan || null,
              account_status: 'unverified'
            })
            .select()
            .single()

          if (!insertError) {
            user.value = { id: userId, email, avatar_url: avatar, image_url: avatar, ...newProfile }
          } else {
            console.error('Gagal menyisipkan profil baru:', insertError)
            user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0], avatar_url: avatar, image_url: avatar }
          }
        } else {
          console.error('Gagal mengambil profil:', error)
          user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0], avatar_url: avatar, image_url: avatar }
        }
      } else {
        user.value = { id: userId, email, avatar_url: avatar, image_url: avatar, ...profile }
      }
    } catch (e) {
      console.error('Terjadi kesalahan tak terduga saat memuat profil:', e)
      user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0] }
    }
  }

  async function signIn(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      if (data?.user) {
        await fetchUserProfile(data.user.id, data.user.email, data.user.user_metadata)
      }
      return { data, error: null }
    } catch (error) {
      console.error('Gagal login:', error.message)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  async function signInWithGoogle() {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Gagal login Google:', error.message)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Daftar (Sign Up)
  async function signUp(email, password, fullName, phone, ktpData = {}, ktpFile = null) {
    loading.value = true
    try {
      let ktpPhotoUrl = null;

      // 1. Upload file KTP ke Supabase Storage (bucket: ktp_documents)
      if (ktpFile) {
        const fileExt = ktpFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ktp_documents')
          .upload(filePath, ktpFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('ktp_documents')
          .getPublicUrl(filePath);

        ktpPhotoUrl = publicUrlData.publicUrl;
      }

      // 2. Sign up di Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phone,
            role: 'customer',
            ktp_photo_url: ktpPhotoUrl,
            ...ktpData
          }
        }
      })
      if (error) throw error
      
      if (data?.user) {
        await fetchUserProfile(data.user.id, data.user.email, {
          full_name: fullName,
          phone_number: phone,
          role: 'customer',
          ktp_photo_url: ktpPhotoUrl,
          ...ktpData
        })
      }
      return { data, error: null }
    } catch (error) {
      console.error('Gagal mendaftar:', error.message)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Verifikasi KTP untuk pengguna yang sudah ada
  async function submitKtpVerification(ktpData, ktpFile) {
    loading.value = true
    try {
      if (!user.value) throw new Error("User not logged in");

      let ktpPhotoUrl = null;

      // 1. Upload KTP file
      if (ktpFile) {
        const fileExt = ktpFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ktp_documents')
          .upload(filePath, ktpFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('ktp_documents')
          .getPublicUrl(filePath);

        ktpPhotoUrl = publicUrlData.publicUrl;
      }

      // 2. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ktp_photo_url: ktpPhotoUrl,
          account_status: 'pending',
          ...ktpData
        })
        .eq('id', user.value.id);

      if (profileError) throw profileError;

      // 3. Update Auth Metadata
      await supabase.auth.updateUser({
        data: {
          ktp_photo_url: ktpPhotoUrl,
          ...ktpData
        }
      });

      // 4. Refresh local user state
      await fetchUserProfile(user.value.id, user.value.email);

      return { error: null }
    } catch (error) {
      console.error('Failed to submit KTP verification:', error.message)
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Keluar (Sign Out)
  async function signOut() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      session.value = null
      return { error: null }
    } catch (error) {
      console.error('Gagal logout:', error.message)
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Lupa Password (Kirim Email Reset)
  async function resetPassword(email) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Gagal mengirim link reset password:', error.message)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Update Password Baru (Setelah klik link email)
  async function updatePassword(newPassword) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Gagal mengupdate password:', error.message)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    initialized,
    isAuthenticated,
    userRole,
    isAdmin,
    isSuperAdmin,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    initialize,
    fetchUserProfile,
    signIn,
    signInWithGoogle,
    signUp,
    submitKtpVerification,
    signOut,
    resetPassword,
    updatePassword
  }
})
