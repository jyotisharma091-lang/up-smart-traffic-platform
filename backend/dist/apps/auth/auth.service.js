"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, district: user.district }, process.env.JWT_SECRET, { expiresIn: '8h' });
    }
    static async login(identifier, passwordPlain) {
        // 1. Find user by username or email
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.username, identifier), (0, drizzle_orm_1.eq)(schema_1.users.email, identifier))).limit(1);
        if (result.length === 0) {
            throw new Error('Invalid credentials');
        }
        const user = result[0];
        if (user.status !== 'ACTIVE') {
            throw new Error('Account is deactivated or retired');
        }
        // 2. Verify password
        const isMatch = await bcrypt_1.default.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        // 3. If State Admin, normally trigger OTP. 
        // In our mock, we bypass OTP requirement initially and just return token.
        // Real implementation would set a temporary state and send email.
        if (user.role === 'STATE_ADMIN') {
            const mockOtp = Math.floor(100000 + Math.random() * 900000);
            console.log(`[MOCK EMAIL SEND] Resend Email sent to ${user.email} with OTP: ${mockOtp}`);
            // Return a partial payload requiring OTP verification
            return {
                requiresOtp: true,
                message: 'OTP sent to registered email',
                email: user.email
            };
        }
        // 4. Generate JWT
        const token = this.generateToken(user);
        // Return sanitized user
        const { passwordHash, ...safeUser } = user;
        return {
            token,
            user: safeUser
        };
    }
    static async verifyOtp(email, otp) {
        // Mock OTP verification logic
        // In reality, you'd check redis or a DB table for the OTP mapping.
        // We will bypass it by just assuming OTP matches "123456" for demo
        if (otp !== '123456') {
            throw new Error('Invalid OTP');
        }
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (result.length === 0)
            throw new Error('User not found');
        const user = result[0];
        const token = this.generateToken(user);
        const { passwordHash, ...safeUser } = user;
        return {
            token,
            user: safeUser
        };
    }
}
exports.AuthService = AuthService;
