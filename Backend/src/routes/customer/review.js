import express from 'express';
import { createReview, checkReview, getReviewsByCar, getAllReviews, deleteReview } from '../../controllers/customer/reviewController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Ambil semua ulasan untuk mobil tertentu (Public)
router.get('/car/:carId', getReviewsByCar);

// Ambil semua ulasan (Admin)
router.get('/', requireAuth, requireAdmin, getAllReviews);

// Hapus ulasan (Admin)
router.delete('/:id', requireAuth, requireAdmin, deleteReview);

// Buat ulasan baru (Requires Auth)
router.post('/', requireAuth, createReview);

// Cek apakah rental tertentu sudah direview (Requires Auth)
router.get('/check/:rentalId', requireAuth, checkReview);

export default router;
