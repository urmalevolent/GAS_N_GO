import { getSupabaseClient } from '../../config/supabase.js';

/**
 * Controller untuk menangani ulasan pelanggan
 */

// 1. Simpan Review Baru
export const createReview = async (req, res, next) => {
  try {
    let { rental_id, car_id, rating, comment } = req.body;

    if (!car_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'car_id, rating, dan comment wajib diisi.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating harus antara 1 sampai 5.'
      });
    }

    const userSupabase = getSupabaseClient(req);

    // Jika rental_id tidak dikirim (misal review dari halaman detail mobil),
    // kita cari pesanan 'completed' terakhir untuk mobil ini yang belum direview.
    if (!rental_id) {
      const { data: pastRentals, error: pastRentalsError } = await userSupabase
        .from('rentals')
        .select('id, reviews(id)')
        .eq('user_id', req.user.id)
        .eq('car_id', car_id)
        .order('created_at', { ascending: false });
        
      if (pastRentalsError) throw pastRentalsError;

      // Cari rental yang belum ada review-nya (reviews.length === 0)
      // Karena jika filter dari status completed sulit jika status aslinya berbeda, kita biarkan cek semua yang belum direview,
      // asalkan user pernah sewa. Idealnya dicek status = completed.
      const unratedRental = pastRentals?.find(r => !r.reviews || r.reviews.length === 0);

      if (!unratedRental) {
         return res.status(403).json({
           success: false,
           message: 'Anda harus menyelesaikan penyewaan mobil ini terlebih dahulu sebelum dapat memberikan ulasan, atau Anda sudah me-review semua riwayat sewa mobil ini.'
         });
      }
      rental_id = unratedRental.id;
    } else {
      // Pastikan rental ini milik user yang sedang login jika dikirim rental_id
      const { data: rental, error: rentalError } = await userSupabase
        .from('rentals')
        .select('id, status, user_id')
        .eq('id', rental_id)
        .single();

      if (rentalError || !rental) {
        return res.status(404).json({
          success: false,
          message: 'Data penyewaan tidak ditemukan.'
        });
      }

      if (rental.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak.'
        });
      }
    }

    // Insert ke tabel reviews
    const { data: review, error: reviewError } = await userSupabase
      .from('reviews')
      .insert({
        rental_id,
        user_id: req.user.id,
        car_id,
        rating,
        comment: comment || null
      })
      .select()
      .single();

    if (reviewError) {
      if (reviewError.code === '23505') {
         return res.status(400).json({
           success: false,
           message: 'Anda sudah memberikan ulasan untuk penyewaan ini.'
         });
      }
      console.error('Error insert review:', reviewError);
      throw reviewError;
    }

    res.status(201).json({
      success: true,
      message: 'Ulasan berhasil disimpan.',
      data: review
    });

  } catch (error) {
    console.error('Terjadi kesalahan pada createReview:', error);
    next(error);
  }
};

// 2. Cek apakah rental sudah direview
export const checkReview = async (req, res, next) => {
  try {
    const { rentalId } = req.params;
    const userSupabase = getSupabaseClient(req);

    const { data: review, error } = await userSupabase
      .from('reviews')
      .select('id, rating, comment, created_at')
      .eq('rental_id', rentalId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (review) {
      return res.status(200).json({
        success: true,
        has_reviewed: true,
        data: review
      });
    } else {
      return res.status(200).json({
        success: true,
        has_reviewed: false,
        data: null
      });
    }

  } catch (error) {
    console.error('Terjadi kesalahan pada checkReview:', error);
    next(error);
  }
};

// 3. Ambil daftar ulasan untuk sebuah mobil
export const getReviewsByCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const userSupabase = getSupabaseClient(req);

    const { data, error } = await userSupabase
      .from('reviews')
      // Jika Anda memiliki tabel profiles, bisa query seperti ini: .select('id, rating, comment, created_at, profiles(full_name, avatar_url)')
      // Sementara kita asumsikan default saja
      .select('*, profiles(full_name, avatar_url)')
      .eq('car_id', carId)
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback jika profiles tidak berelasi langsung dengan reviews
      if (error.code === 'PGRST200') {
        const { data: fallbackData, error: fallbackError } = await userSupabase
          .from('reviews')
          .select('*')
          .eq('car_id', carId)
          .order('created_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        
        return res.status(200).json({
          success: true,
          data: fallbackData
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Terjadi kesalahan pada getReviewsByCar:', error);
    next(error);
  }
};

// 4. Ambil semua ulasan (Admin)
export const getAllReviews = async (req, res, next) => {
  try {
    const userSupabase = getSupabaseClient(req);

    const { data, error } = await userSupabase
      .from('reviews')
      .select('*, rental:rentals(car:cars(name, brand), profile:profiles(full_name))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Terjadi kesalahan pada getAllReviews:', error);
    next(error);
  }
};

// 5. Hapus ulasan (Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userSupabase = getSupabaseClient(req);

    const { error } = await userSupabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Ulasan berhasil dihapus.'
    });
  } catch (error) {
    console.error('Terjadi kesalahan pada deleteReview:', error);
    next(error);
  }
};
