import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://aj.jyotiai.shop', 'http://localhost:5173', 'http://localhost:5000', 'https://up-smart-traffic-platform.onrender.com'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic health check route
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'ATIP Backend is running normally.' });
});

import authRoutes from './apps/auth/auth.routes';
import usersRoutes from './apps/users/users.routes';
import vehiclesRoutes from './apps/vehicles/vehicles.routes';
import violationsRoutes from './apps/violations/violations.routes';
import analyticsRoutes from './apps/analytics/analytics.routes';

// Mount routes here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/vehicles', vehiclesRoutes);
app.use('/api/v1/violations', violationsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all route to serve the frontend application
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
