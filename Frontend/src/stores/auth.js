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
  const isAdmin = computed(() => userRole.value === 'admin')

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
  async function fetchUserProfile(userId, email, metadata = {}) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Jika data profil belum ada di public.profiles (PGRST116: no rows returned)
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: metadata?.full_name || email.split('@')[0],
              phone_number: metadata?.phone_number || '',
              role: metadata?.role || 'customer'
            })
            .select()
            .single()

          if (!insertError) {
            user.value = { id: userId, email, ...newProfile }
          } else {
            console.error('Gagal menyisipkan profil baru:', insertError)
            user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0] }
          }
        } else {
          console.error('Gagal mengambil profil:', error)
          user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0] }
        }
      } else {
        user.value = { id: userId, email, ...profile }
      }
    } catch (e) {
      console.error('Terjadi kesalahan tak terduga saat memuat profil:', e)
      user.value = { id: userId, email, role: 'customer', full_name: email.split('@')[0] }
    }
  }

  // Masuk (Sign In)
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

  // Daftar (Sign Up)
  async function signUp(email, password, fullName, phone) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phone,
            role: 'customer'
          }
        }
      })
      if (error) throw error
      
      if (data?.user) {
        await fetchUserProfile(data.user.id, data.user.email, {
          full_name: fullName,
          phone_number: phone,
          role: 'customer'
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

  return {
    user,
    session,
    loading,
    initialized,
    isAuthenticated,
    userRole,
    isAdmin,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    initialize,
    fetchUserProfile,
    signIn,
    signUp,
    signOut
  }
})
