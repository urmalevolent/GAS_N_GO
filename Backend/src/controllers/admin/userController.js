import { supabase, supabaseAdmin } from '../../config/supabase.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*') // asumsikan profile punya email atau didapat dari tabel users
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Jika profiles tidak punya email, kita mungkin perlu ambil list user dari auth admin jika supabaseAdmin tersedia
    let result = profiles;
    if (supabaseAdmin) {
      const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!authErr && authUsers && authUsers.users) {
         result = profiles.map(p => {
           const authData = authUsers.users.find(u => u.id === p.id);
           return {
             ...p,
             email: authData ? authData.email : '-'
           };
         });
      }
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body; 

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Fitur membutuhkan Service Role Key.' });
    }

    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role tidak valid.' });
    }

    const { error: dbError } = await supabaseAdmin.from('profiles').update({ role }).eq('id', id);
    if (dbError) throw dbError;

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { user_metadata: { role } });
    if (authError) throw authError;

    res.status(200).json({ success: true, message: `Role berhasil diubah menjadi ${role}.` });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Fitur membutuhkan Service Role Key.' });
    }

    const { error: dbError } = await supabaseAdmin.from('profiles').update({ is_active }).eq('id', id);
    if (dbError) throw dbError;

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      ban_duration: is_active ? 'none' : '87600h' 
    });
    if (authError) throw authError;

    res.status(200).json({ success: true, message: `Status berhasil diperbarui.` });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Fitur membutuhkan Service Role Key.' });
    }

    const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || email.split('@')[0],
        phone_number: phone || '',
        role: 'admin'
      }
    });

    if (authError) throw authError;

    await new Promise(r => setTimeout(r, 1000)); 

    const { error: dbError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin', is_active: true })
      .eq('id', userAuth.user.id);

    if (dbError) console.warn('Gagal update profile (mungkin trigger tidak ada/telat):', dbError);

    res.status(201).json({ success: true, message: 'Admin baru berhasil dibuat.', data: userAuth.user });
  } catch (error) {
    next(error);
  }
};
