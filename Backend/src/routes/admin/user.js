import express from 'express';
import { requireAuth, requireAdmin, requireSuperAdmin } from '../../middleware/auth.js';
import { getAllUsers, updateRole, updateStatus, getUserDetails } from '../../controllers/admin/userController.js';

const router = express.Router();

// Semua rute di bawah ini butuh akses super admin
router.use(requireAuth, requireSuperAdmin);

// Mendapatkan semua pengguna
router.get('/', getAllUsers);

// Mendapatkan detail dan riwayat pengguna
router.get('/:id/details', getUserDetails);

// Mengubah status aktif/nonaktif
router.patch('/:id/status', updateStatus);

// Mengubah role khusus Super Admin
router.patch('/:id/role', requireSuperAdmin, updateRole);

export default router;
