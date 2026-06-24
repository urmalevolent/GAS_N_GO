import { supabase } from '../../config/supabase.js';

/**
 * Mengambil daftar mobil aktif (available) dengan filter opsional (category, brand, max_price)
 */
export const getCars = async (req, res, next) => {
  try {
    const { category, brand, max_price } = req.query;
    let query = supabase.from('cars').select('*');

    // Pelanggan hanya bisa melihat mobil yang aktif / available
    query = query.eq('status', 'available');

    if (category) {
      query = query.eq('category', category);
    }
    if (brand) {
      query = query.eq('brand', brand);
    }
    if (max_price) {
      query = query.lte('price_per_day', parseInt(max_price));
    }

    const { data, error } = await query.order('created_at', { ascending: false });
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
 * Mengambil satu data detail mobil
 */
export const getCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.'
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil seluruh kategori dari database
 */
export const getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('car_categories')
      .select('*');
    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
