"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.registerStateAdminVerify = exports.registerStateAdminInit = exports.getMe = exports.changePassword = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const result = await auth_service_1.AuthService.login(identifier, password);
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
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // From authMiddleware
        const result = await auth_service_1.AuthService.changePassword(userId, currentPassword, newPassword);
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Password change failed' });
    }
};
exports.changePassword = changePassword;
const getMe = async (req, res, next) => {
    try {
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, req.user.id)).limit(1);
        if (result.length === 0)
            throw new Error('User not found');
        const { passwordHash, ...safeUser } = result[0];
        res.status(200).json({ success: true, user: safeUser });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// State Admin Registration Mock
const registerStateAdminInit = async (req, res, next) => {
    try {
        const { email } = req.body;
        // Check if user already exists
        const existing = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (existing.length > 0)
            return res.status(400).json({ success: false, message: 'Email already registered' });
        // Generate mock OTP
        const mockOtp = '123456';
        console.log(`[MOCK EMAIL] Sent OTP ${mockOtp} to ${email}`);
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    }
    catch (error) {
        next(error);
    }
};
exports.registerStateAdminInit = registerStateAdminInit;
const registerStateAdminVerify = async (req, res, next) => {
    try {
        const { email, otp, password, fullName, mobileNumber } = req.body;
        if (otp !== '123456') {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const newUser = {
            id: (0, uuid_1.v4)(),
            role: 'STATE_ADMIN',
            fullName,
            username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Auto-generate username
            email,
            mobileNumber,
            passwordHash,
            status: 'ACTIVE',
            isFirstLogin: false, // They just set their password
        };
        await db_1.db.insert(schema_1.users).values(newUser);
        res.status(201).json({ success: true, message: 'State Admin registered successfully. Please login.' });
    }
    catch (error) {
        next(error);
    }
};
exports.registerStateAdminVerify = registerStateAdminVerify;
// In-memory OTP store for demo
const resetOtps = new Map();
const forgotPassword = async (req, res, next) => {
    try {
        const { username } = req.body;
        // Check if user exists and is an admin
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username)).limit(1);
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = result[0];
        if (!['STATE_ADMIN', 'DISTRICT_ADMIN', 'TRAFFIC_ADMIN', 'TRAFFIC_OFFICER'].includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Forgot password is not allowed for this role' });
        }
        // Generate mock OTP
        const mockOtp = '123456';
        resetOtps.set(username, mockOtp);
        console.log(`[MOCK EMAIL/SMS] Sent OTP ${mockOtp} to admin ${username}`);
        res.status(200).json({ success: true, message: 'OTP sent to your registered email/mobile' });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { username, otp, newPassword } = req.body;
        const storedOtp = resetOtps.get(username);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username)).limit(1);
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await db_1.db.update(schema_1.users).set({ passwordHash }).where((0, drizzle_orm_1.eq)(schema_1.users.username, username));
        // Clear OTP
        resetOtps.delete(username);
        res.status(200).json({ success: true, message: 'Password reset successfully. Please login.' });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
