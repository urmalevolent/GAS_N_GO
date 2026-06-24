import express from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  adminGetCars,
  adminCreateCar,
  adminUpdateCar,
  adminDeleteCar,
  adminRestoreCar
} from '../../controllers/admin/carController.js';

const router = express.Router();

// Terapkan middleware autentikasi dan otorisasi admin untuk semua rute di bawah ini
router.use(requireAuth, requireAdmin);

router.get('/', adminGetCars);
router.post('/', adminCreateCar);
router.put('/:id', adminUpdateCar);
router.delete('/:id', adminDeleteCar);
router.post('/:id/restore', adminRestoreCar);

export default router;
