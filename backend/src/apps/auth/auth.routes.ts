import { Router } from 'express';
import { login, getMe, changePassword, registerStateAdminInit, registerStateAdminVerify, forgotPassword, resetPassword } from './auth.controller';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/login', login);

// State Admin OTP Registration
router.post('/register/state-admin/init', registerStateAdminInit);
router.post('/register/state-admin/verify', registerStateAdminVerify);

// Forgot and Reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/change-password', authenticate, changePassword);
router.get('/me', authenticate, getMe);

export default router;
