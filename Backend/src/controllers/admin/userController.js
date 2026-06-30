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

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Fitur membutuhkan Service Role Key.' });
    }

    // Ambil rentals dan gabungkan dengan tabel cars dan rental_payments
    const { data: rentals, error: rentalsError } = await supabaseAdmin
      .from('rentals')
      .select(`
        id,
        start_date,
        end_date,
        status,
        cars ( id, name ),
        rental_payments ( total_price, payment_status )
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (rentalsError) throw rentalsError;

    // Hitung stats dan map orders
    let total_orders = 0;
    let total_spent = 0;
    const orders = [];

    if (rentals && rentals.length > 0) {
      total_orders = rentals.length;
      rentals.forEach(r => {
        // Karena rental_payments bisa array (jika one-to-many) atau object tunggal
        // Biasanya one-to-many, jadi kita ambil index 0
        const payment = Array.isArray(r.rental_payments) ? r.rental_payments[0] : r.rental_payments;
        const price = payment?.total_price || 0;
        
        // Status completed (selesai) atau active (sedang jalan) kita hitung spent-nya
        if (r.status === 'completed' || r.status === 'active' || r.status === 'pending_dp' || r.status === 'paid') {
          total_spent += price;
        }
        
        const start = new Date(r.start_date);
        const end = new Date(r.end_date);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

        orders.push({
          id: `GNG-${r.id.substring(0, 8).toUpperCase()}`,
          car_name: r.cars?.name || 'Unknown Car',
          created_at: r.start_date,
          duration: duration,
          total_price: price,
          status: r.status // 'completed', 'active', 'pending_dp', 'cancelled' dst
        });
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        stats: { total_orders, total_spent },
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};
