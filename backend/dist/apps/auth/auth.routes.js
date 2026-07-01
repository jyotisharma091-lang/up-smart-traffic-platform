"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.login);
// State Admin OTP Registration
router.post('/register/state-admin/init', auth_controller_1.registerStateAdminInit);
router.post('/register/state-admin/verify', auth_controller_1.registerStateAdminVerify);
// Forgot and Reset Password
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.post('/reset-password', auth_controller_1.resetPassword);
// Protected routes
router.post('/change-password', authMiddleware_1.authenticate, auth_controller_1.changePassword);
router.get('/me', authMiddleware_1.authenticate, auth_controller_1.getMe);
exports.default = router;
