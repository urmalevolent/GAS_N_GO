import express from 'express';
import { requireAuth, requireAdmin, requireSuperAdmin } from '../../middleware/auth.js';
import { getAllUsers, updateRole, updateStatus, createAdmin } from '../../controllers/admin/userController.js';

const router = express.Router();

// Semua rute di bawah ini setidaknya butuh akses admin
router.use(requireAuth, requireAdmin);

// Mendapatkan semua pengguna
router.get('/', getAllUsers);

// Mengubah status aktif/nonaktif
router.patch('/:id/status', updateStatus);

// Mengubah role khusus Super Admin
router.patch('/:id/role', requireSuperAdmin, updateRole);

// Membuat admin baru khusus Super Admin
router.post('/create', requireSuperAdmin, createAdmin);

export default router;
