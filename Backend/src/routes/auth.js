import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Route Autentikasi Publik
router.post('/register', register);
router.post('/login', login);

// Route Terproteksi (Memerlukan Token JWT/Supabase)
router.get('/profile', requireAuth, getProfile);

export default router;
