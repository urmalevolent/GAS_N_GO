import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createBooking,
  getRetryPaymentToken,
  confirmPayment,
  handleNotification
} from '../controllers/bookingController.js';

const router = express.Router();

// 1. Endpoint Webhook Midtrans (Public, tidak terproteksi JWT)
// Jalur ini diakses secara asinkron oleh server Midtrans Sandbox
router.post('/notification', handleNotification);

// 2. Endpoint Pemesanan Baru (Terproteksi JWT)
router.post('/', requireAuth, createBooking);

// 3. Endpoint Meminta Token Pembayaran Baru / Ulang (Terproteksi JWT)
router.post('/:rentalId/pay', requireAuth, getRetryPaymentToken);

// 4. Endpoint Konfirmasi Pembayaran Selesai dari Frontend (Terproteksi JWT)
router.post('/:rentalId/confirm-payment', requireAuth, confirmPayment);

export default router;
