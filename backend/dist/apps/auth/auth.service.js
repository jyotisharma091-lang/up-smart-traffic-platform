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
        return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, district: user.district, isFirstLogin: user.isFirstLogin }, process.env.JWT_SECRET, { expiresIn: '8h' });
    }
    static async login(identifier, passwordPlain) {
        // identifier can be Email (State Admin), CUG Number (District Admin), or PNO Number (Traffic Officer)
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, identifier), (0, drizzle_orm_1.eq)(schema_1.users.mobileNumber, identifier), (0, drizzle_orm_1.eq)(schema_1.users.pnoNumber, identifier), (0, drizzle_orm_1.eq)(schema_1.users.username, identifier) // Fallback for the seeded admin_state user
        )).limit(1);
        if (result.length === 0) {
            throw new Error('Invalid credentials');
        }
        const user = result[0];
        if (user.status !== 'ACTIVE') {
            throw new Error('Account is deactivated or suspended');
        }
        // Verify password
        const isMatch = await bcrypt_1.default.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        // Generate JWT
        const token = this.generateToken(user);
        // Return sanitized user
        const { passwordHash, ...safeUser } = user;
        return {
            token,
            user: safeUser
        };
    }
    static async changePassword(userId, currentPasswordPlain, newPasswordPlain) {
        const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        if (result.length === 0)
            throw new Error('User not found');
        const user = result[0];
        const isMatch = await bcrypt_1.default.compare(currentPasswordPlain, user.passwordHash);
        if (!isMatch)
            throw new Error('Incorrect current password');
        const passwordHash = await bcrypt_1.default.hash(newPasswordPlain, 10);
        await db_1.db.update(schema_1.users).set({
            passwordHash,
            isFirstLogin: false,
            updatedAt: new Date()
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        // Get updated user to return new token
        const updatedUserList = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        const updatedUser = updatedUserList[0];
        const token = this.generateToken(updatedUser);
        const { passwordHash: _, ...safeUser } = updatedUser;
        return {
            token,
            user: safeUser
        };
    }
}
exports.AuthService = AuthService;
