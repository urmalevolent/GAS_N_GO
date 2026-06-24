import express from 'express';
import { getCars, getCarById } from '../../controllers/customer/carController.js';

const router = express.Router();

// Rute publik untuk melihat mobil-mobil yang aktif disewakan
router.get('/', getCars);
router.get('/:id', getCarById);

export default router;
