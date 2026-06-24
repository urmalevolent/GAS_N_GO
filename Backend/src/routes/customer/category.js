import express from 'express';
import { getCategories } from '../../controllers/customer/carController.js';

const router = express.Router();

// Rute publik untuk melihat kategori mobil
router.get('/', getCategories);

export default router;
