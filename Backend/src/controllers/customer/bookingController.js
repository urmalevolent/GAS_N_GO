import { getSupabaseClient, supabase } from '../../config/supabase.js';

/**
 * Controller untuk membuat pemesanan mobil baru dan mendapatkan Snap Token Midtrans
 */
export const createBooking = async (req, res, next) => {
  try {
    const { car_id, start_date, end_date, address, phone_number, payment_method } = req.body;

    if (!car_id || !start_date || !end_date || !address || !phone_number || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Semua bidang form (car_id, start_date, end_date, address, phone_number, payment_method) wajib diisi.'
      });
    }

    // 1. Ambil data mobil untuk verifikasi harga dan ketersediaan
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', car_id)
      .single();

    if (carError || !car) {
      return res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.'
      });
    }

    if (car.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Kendaraan ini sedang tidak tersedia untuk disewa.'
      });
    }

    // 2. Hitung jumlah hari sewa
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = end - start;
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal selesai sewa harus setelah tanggal mulai.'
      });
    }

    // 3. Kalkulasi total harga dan DP (15% jika opsi DP)
    const totalPrice = totalDays * car.price_per_day;
    const dpAmount = payment_method === 'full_transfer' ? totalPrice : Math.round(totalPrice * 0.15);

    // 4. Buat Order ID unik untuk Midtrans
    const midtransOrderId = `GNG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 5. Inisiasi transaksi ke Midtrans Snap (Dilewati, verifikasi manual KTP terlebih dahulu)
    console.log(`Booking created for order ${midtransOrderId}. Awaiting manual KTP verification.`);

    // 6. Simpan transaksi ke Supabase menggunakan JWT user (agar memenuhi RLS)
    const userSupabase = getSupabaseClient(req);

    // A. Insert ke tabel 'rentals'
    const { data: rental, error: rentalError } = await userSupabase
      .from('rentals')
      .insert({
        user_id: req.user.id,
        car_id: car.id,
        start_date,
        end_date,
        status: 'pending_dp' // Status default sebelum bayar
      })
      .select()
      .single();

    if (rentalError) {
      console.error('Error insert rentals:', rentalError);
      throw rentalError;
    }

    console.log("=== RENTAL INSERTION SUCCESS ===");
    console.log("Authenticated User ID (req.user.id):", req.user.id);
    console.log("Created Rental Object:", JSON.stringify(rental, null, 2));
    console.log("Rental Details Payload:", { rental_id: rental.id, address, phone_number });

    // B. Insert ke tabel 'rental_details'
    const { error: detailsError } = await userSupabase
      .from('rental_details')
      .insert({
        rental_id: rental.id,
        address,
        phone_number,
        ktp_url: req.body.ktp_image || null
      });

    if (detailsError) {
      console.error('Error insert rental_details:', detailsError);
      throw detailsError;
    }

    // C. Insert ke tabel 'rental_payments'
    const { error: paymentError } = await userSupabase
      .from('rental_payments')
      .insert({
        rental_id: rental.id,
        payment_method,
        total_price: totalPrice,
        dp_amount: dpAmount,
        payment_status: 'unverified', // Menggunakan status custom 'unverified'
        midtrans_order_id: midtransOrderId
      });

    if (paymentError) {
      console.error('Error insert rental_payments:', paymentError);
      throw paymentError;
    }

    // 7. Kembalikan response Sukses ke Frontend (Tanpa Snap Token)
    res.status(201).json({
      success: true,
      message: 'Pemesanan berhasil dibuat. Menunggu verifikasi KTP oleh admin.',
      data: {
        rental_id: rental.id,
        midtrans_order_id: midtransOrderId,
        snap_token: null,
        redirect_url: null,
        total_price: totalPrice,
        dp_amount: dpAmount
      }
    });

  } catch (error) {
    console.error('Terjadi kesalahan pada createBooking:', error);
    next(error);
  }
};
