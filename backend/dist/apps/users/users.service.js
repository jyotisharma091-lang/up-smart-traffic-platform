"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static async createUser(data, creatorRole, creatorDistrict) {
        // 1. RBAC Checks
        if (creatorRole === 'DISTRICT_ADMIN' && data.role !== 'TRAFFIC_OFFICER') {
            throw new Error('District Admins can only create Traffic Officers');
        }
        if (creatorRole === 'DISTRICT_ADMIN' && data.district !== creatorDistrict) {
            throw new Error('District Admins can only create users in their own district');
        }
        // 2. Hash Password
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const { password, ...insertData } = data;
        // 3. Insert into DB
        const result = await db_1.db.insert(schema_1.users).values({
            ...insertData,
            passwordHash,
        }).returning();
        const { passwordHash: _, ...safeUser } = result[0];
        return safeUser;
    }
    static async getUsers(role, district) {
        if (role === 'STATE_ADMIN') {
            return await db_1.db.select().from(schema_1.users);
        }
        else if (role === 'DISTRICT_ADMIN' && district) {
            return await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.district, district));
        }
        throw new Error('Unauthorized to fetch users list');
    }
    static async updateUser(id, data, requesterRole, requesterDistrict) {
        // Fetch target user to check permissions
        const targetUserList = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (targetUserList.length === 0)
            throw new Error('User not found');
        const targetUser = targetUserList[0];
        if (requesterRole === 'DISTRICT_ADMIN') {
            if (targetUser.district !== requesterDistrict || targetUser.role !== 'TRAFFIC_OFFICER') {
                throw new Error('Unauthorized to update this user');
            }
        }
        const result = await db_1.db.update(schema_1.users).set({
            ...data,
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning();
        const { passwordHash: _, ...safeUser } = result[0];
        return safeUser;
    }
    static async resetPassword(id, newPasswordPlain, requesterRole, requesterDistrict) {
        const targetUserList = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (targetUserList.length === 0)
            throw new Error('User not found');
        const targetUser = targetUserList[0];
        if (requesterRole === 'DISTRICT_ADMIN') {
            if (targetUser.district !== requesterDistrict || targetUser.role !== 'TRAFFIC_OFFICER') {
                throw new Error('Unauthorized to reset this user\'s password');
            }
        }
        const passwordHash = await bcrypt_1.default.hash(newPasswordPlain, 10);
        await db_1.db.update(schema_1.users).set({ passwordHash, updatedAt: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return true;
    }
}
exports.UserService = UserService;
