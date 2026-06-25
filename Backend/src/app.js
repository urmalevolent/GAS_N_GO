import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/customer/auth.js';
import bookingRoutes from './routes/customer/booking.js';
import carRoutes from './routes/customer/car.js';
import categoryRoutes from './routes/customer/category.js';
import carAdminRoutes from './routes/admin/car.js';
import userAdminRoutes from './routes/admin/user.js';
import dashboardAdminRoutes from './routes/admin/dashboard.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- GLOBAL MIDDLEWARES ---
app.use(cors({
  origin: '*', // Di production, gantilah dengan domain spesifik frontend Anda (misal http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- BASE API ENDPOINT ---
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to GAS N GO API Backend Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/cars', carAdminRoutes);
app.use('/api/admin/users', userAdminRoutes);
app.use('/api/admin/dashboard', dashboardAdminRoutes);

// --- 404 NOT FOUND HANDLER ---
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// --- GLOBAL ERROR HANDLER ---
app.use(errorHandler);

export default app;
