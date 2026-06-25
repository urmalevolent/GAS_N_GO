import express from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { getDashboardStats } from '../../controllers/admin/dashboardController.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get('/', getDashboardStats);

export default router;
