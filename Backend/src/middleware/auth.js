import { supabase } from '../config/supabase.js';

/**
 * Middleware untuk memverifikasi autentikasi user menggunakan Supabase Auth Token
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token autentikasi tidak disediakan atau format salah.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verifikasi token menggunakan Supabase Auth API
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Sesi kedaluwarsa atau token tidak valid.',
        error: error ? error.message : null
      });
    }

    // Sematkan informasi user ke object request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk validasi hak akses admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autentikasi diperlukan.'
    });
  }

  // Supabase user metadata biasanya menyimpan data tambahan
  const role = req.user.user_metadata?.role || 'customer';
  
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Endpoint ini memerlukan hak akses Administrator.'
    });
  }

  next();
};
