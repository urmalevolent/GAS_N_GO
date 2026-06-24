import { supabase } from '../../config/supabase.js';

/**
 * Mengambil semua daftar mobil (baik yang aktif maupun nonaktif) untuk keperluan admin
 */
export const adminGetCars = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Menambahkan armada kendaraan baru ke database
 */
export const adminCreateCar = async (req, res, next) => {
  try {
    const { name, brand, category, transmission, seats, price_per_day, description, image_url } = req.body;

    if (!name || !brand || !category || !price_per_day || !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Nama, merek, kategori, tarif sewa harian, dan foto utama wajib diisi.'
      });
    }

    const { data, error } = await supabase
      .from('cars')
      .insert({
        name,
        brand,
        category,
        transmission: transmission || 'Matic (PDK)',
        seats: parseInt(seats) || 4,
        price_per_day: parseInt(price_per_day),
        description: description || '',
        image_url,
        status: 'available', // Status default saat dibuat
        year: new Date().getFullYear(),
        fuel: 'Gasoline'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Kendaraan berhasil ditambahkan ke katalog.',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Memperbarui data armada kendaraan
 */
export const adminUpdateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, brand, category, transmission, seats, price_per_day, description, image_url } = req.body;

    const { data, error } = await supabase
      .from('cars')
      .update({
        name,
        brand,
        category,
        transmission,
        seats: parseInt(seats) || 4,
        price_per_day: parseInt(price_per_day),
        description: description || '',
        image_url
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Data kendaraan berhasil diperbarui.',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Menonaktifkan kendaraan (soft-delete dengan merubah status ke inactive)
 */
export const adminDeleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cars')
      .update({ status: 'inactive' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Kendaraan berhasil dinonaktifkan dari katalog pelanggan.',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengaktifkan kembali kendaraan (mengubah status ke available)
 */
export const adminRestoreCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cars')
      .update({ status: 'available' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Kendaraan berhasil diaktifkan kembali.',
      data
    });
  } catch (error) {
    next(error);
  }
};
