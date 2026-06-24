import { getSupabaseClient, supabase } from '../../config/supabase.js';
import midtransClient from 'midtrans-client';

// Inisialisasi Midtrans Snap SDK
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-ztzmUDJ988ubMzBo43tec_5w',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-9qtvcwElw894O85T'
});

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

/**
 * Controller untuk meminta Snap Token baru bagi reservasi tertunda (Retry Payment)
 */
export const getRetryPaymentToken = async (req, res, next) => {
  try {
    const { rentalId } = req.params;
    const userSupabase = getSupabaseClient(req);

    // 1. Ambil data sewa dan pembayaran
    const { data: rental, error: rentalError } = await userSupabase
      .from('rentals')
      .select('*, rental_payments(*), cars(*)')
      .eq('id', rentalId)
      .single();

    if (rentalError || !rental) {
      return res.status(404).json({
        success: false,
        message: 'Data reservasi tidak ditemukan.'
      });
    }

    const payment = rental.rental_payments?.[0];
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Informasi pembayaran sewa tidak ditemukan.'
      });
    }

    if (payment.payment_status === 'settlement' || payment.payment_status === 'capture') {
      return res.status(400).json({
        success: false,
        message: 'Pesanan ini sudah lunas dibayar.'
      });
    }

    if (payment.payment_status === 'unverified') {
      return res.status(400).json({
        success: false,
        message: 'KTP Anda belum diverifikasi oleh admin. Silakan tunggu verifikasi terlebih dahulu.'
      });
    }

    // Ambil nomor telepon dari detail sewa
    const { data: details } = await userSupabase
      .from('rental_details')
      .select('phone_number')
      .eq('rental_id', rentalId)
      .single();

    const phoneNumber = details?.phone_number || '';

    // 2. Buat Midtrans Order ID baru untuk mencegah bentrok/duplicate
    const newOrderId = `GNG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totalDays = Math.ceil((new Date(rental.end_date) - new Date(rental.start_date)) / (1000 * 60 * 60 * 24));

    // 3. Request ke Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: newOrderId,
        gross_amount: payment.dp_amount
      },
      item_details: [{
        id: rental.cars?.id || rental.car_id,
        price: payment.dp_amount,
        quantity: 1,
        name: `${rental.cars?.brand || ''} ${rental.cars?.name || ''} (${totalDays} Hari) [Retry]`
      }],
      customer_details: {
        first_name: req.user.user_metadata?.full_name || req.user.email.split('@')[0],
        email: req.user.email,
        phone: phoneNumber
      }
    };

    console.log(`Generating retry Midtrans snap token for order ${newOrderId}...`);
    const transaction = await snap.createTransaction(parameter);

    if (!transaction || !transaction.token) {
      throw new Error('Gagal mendapatkan Snap Token baru dari Midtrans');
    }

    // 4. Update order ID baru ke tabel rental_payments
    const { error: updateError } = await userSupabase
      .from('rental_payments')
      .update({
        midtrans_order_id: newOrderId,
        payment_status: 'pending'
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment order_id:', updateError);
      throw updateError;
    }

    res.status(200).json({
      success: true,
      message: 'Token pembayaran baru berhasil digenerate.',
      data: {
        rental_id: rentalId,
        midtrans_order_id: newOrderId,
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url
      }
    });

  } catch (error) {
    console.error('Terjadi kesalahan pada getRetryPaymentToken:', error);
    next(error);
  }
};

/**
 * Controller untuk melakukan konfirmasi status pembayaran sewa dari client/frontend.
 * Backend akan langsung menanyakan status terbaru ke API Midtrans secara aman menggunakan Order ID,
 * kemudian memperbarui database dalam context JWT user.
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const { rentalId } = req.params;
    const userSupabase = getSupabaseClient(req);

    // 1. Ambil data sewa saat ini
    const { data: rental, error: rentalError } = await userSupabase
      .from('rentals')
      .select('*, rental_payments(*)')
      .eq('id', rentalId)
      .single();

    if (rentalError || !rental) {
      return res.status(404).json({
        success: false,
        message: 'Reservasi tidak ditemukan.'
      });
    }

    const payment = rental.rental_payments?.[0];
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Data pembayaran tidak ditemukan.'
      });
    }

    // 2. Kueri status transaksi langsung ke server Midtrans
    console.log(`Checking status from Midtrans for order: ${payment.midtrans_order_id}...`);
    let statusResponse;
    try {
      statusResponse = await snap.transaction.status(payment.midtrans_order_id);
    } catch (midError) {
      console.error('Midtrans status check error:', midError);
      return res.status(400).json({
        success: false,
        message: 'Gagal memverifikasi transaksi ke server Midtrans.',
        error: midError.message
      });
    }

    const { transaction_status, fraud_status } = statusResponse;

    // 3. Tentukan status baru sewa & pembayaran
    let newRentalStatus = rental.status;
    let newPaymentStatus = payment.payment_status;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'challenge') {
        newPaymentStatus = 'challenge';
      } else if (fraud_status === 'accept') {
        newPaymentStatus = 'settlement';
        newRentalStatus = 'dp_paid'; // Pembayaran berhasil (DP / Lunas)
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newPaymentStatus = transaction_status;
      newRentalStatus = 'rejected';
    } else if (transaction_status === 'pending') {
      newPaymentStatus = 'pending';
    }

    // 4. Update data ke tabel rental_payments & rentals
    const { error: updatePayError } = await userSupabase
      .from('rental_payments')
      .update({ payment_status: newPaymentStatus })
      .eq('id', payment.id);

    if (updatePayError) throw updatePayError;

    const { error: updateRentalError } = await userSupabase
      .from('rentals')
      .update({ status: newRentalStatus })
      .eq('id', rental.id);

    if (updateRentalError) throw updateRentalError;

    res.status(200).json({
      success: true,
      message: 'Status pembayaran berhasil dikonfirmasi dan diperbarui.',
      data: {
        rental_status: newRentalStatus,
        payment_status: newPaymentStatus
      }
    });

  } catch (error) {
    console.error('Terjadi kesalahan pada confirmPayment:', error);
    next(error);
  }
};

/**
 * Webhook handler notifikasi pembayaran dari Midtrans (Asynchronous)
 */
export const handleNotification = async (req, res, next) => {
  try {
    const notificationPayload = req.body;
    console.log('Received Midtrans Notification Webhook:', JSON.stringify(notificationPayload));

    // Verifikasi keaslian notifikasi menggunakan SDK
    const statusResponse = await snap.transaction.notification(notificationPayload);
    const { order_id, transaction_status, fraud_status } = statusResponse;

    console.log(`Webhook verified for Order ID: ${order_id}. Status: ${transaction_status}`);

    // Temukan pembayaran sewa berdasarkan midtrans_order_id
    // Catatan: Karena webhook berjalan secara anonim (tidak membawa JWT user), kita menggunakan client default 'supabase' bypass RLS.
    // Jika RLS memblokir update dari anon client, operasi ini akan gagal di DB, namun proses konfirmasi client-side (confirmPayment) akan mengovernya.
    const { data: payment, error: fetchPayError } = await supabase
      .from('rental_payments')
      .select('*')
      .eq('midtrans_order_id', order_id)
      .single();

    if (fetchPayError || !payment) {
      console.warn(`[Webhook WARNING] Detail pembayaran untuk Order ID ${order_id} tidak ditemukan di DB.`, fetchPayError);
      return res.status(200).json({ success: true, message: 'Notification received, but no record found' });
    }

    let newRentalStatus = null;
    let newPaymentStatus = null;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'challenge') {
        newPaymentStatus = 'challenge';
      } else if (fraud_status === 'accept') {
        newPaymentStatus = 'settlement';
        newRentalStatus = 'dp_paid';
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newPaymentStatus = transaction_status;
      newRentalStatus = 'rejected';
    } else if (transaction_status === 'pending') {
      newPaymentStatus = 'pending';
    }

    if (newPaymentStatus) {
      const { error: updatePayError } = await supabase
        .from('rental_payments')
        .update({ payment_status: newPaymentStatus })
        .eq('id', payment.id);

      if (updatePayError) {
        console.error(`[Webhook ERROR] Gagal mengupdate rental_payments:`, updatePayError);
      }
    }

    if (newRentalStatus) {
      const { error: updateRentalError } = await supabase
        .from('rentals')
        .update({ status: newRentalStatus })
        .eq('id', payment.rental_id);

      if (updateRentalError) {
        console.error(`[Webhook ERROR] Gagal mengupdate rentals status:`, updateRentalError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Notification processed'
    });

  } catch (error) {
    console.error('Terjadi kesalahan pada handleNotification webhook:', error);
    // Tetap kembalikan 200 agar Midtrans tidak terus melakukan retrying jika ada kesalahan internal
    res.status(200).json({
      success: false,
      message: error.message
    });
  }
};
