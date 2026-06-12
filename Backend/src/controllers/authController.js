import { supabase } from '../config/supabase.js';

/**
 * Controller Registrasi User Baru
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          phone_number: phone || '',
          role: 'customer'
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil dilakukan.',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller Login User
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller Pengambilan Profil User Terproteksi
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user didapatkan dari middleware requireAuth
    const userId = req.user.id;
    
    // Ambil data profil publik tambahan dari tabel public.profiles (jika ada)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(400).json({
        success: false,
        message: 'Gagal memuat profil tambahan.',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil berhasil dimuat.',
      data: {
        id: req.user.id,
        email: req.user.email,
        email_confirmed_at: req.user.email_confirmed_at,
        user_metadata: req.user.user_metadata,
        profile: profile || null
      }
    });
  } catch (error) {
    next(error);
  }
};
