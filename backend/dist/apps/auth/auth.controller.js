"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.changePassword = exports.verifyOtp = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const result = await auth_service_1.AuthService.login(identifier, password);
        if (result.requiresOtp) {
            return res.status(200).json({ success: true, ...result });
        }
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message || 'Login failed' });
    }
};
exports.login = login;
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await auth_service_1.AuthService.verifyOtp(email, otp);
        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message || 'OTP Verification failed' });
    }
};
exports.verifyOtp = verifyOtp;
const changePassword = async (req, res, next) => {
    try {
        // Note: requires req.user from authMiddleware
        // Logic goes here (find user, compare old password, hash new, update DB)
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const getMe = async (req, res, next) => {
    try {
        // Returns decoded payload from req.user
        res.status(200).json({ success: true, user: req.user });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
