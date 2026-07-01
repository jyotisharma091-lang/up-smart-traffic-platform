"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ViolationService {
    static async createViolation(data, officerId, district) {
        const caseNumber = `UP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const result = await db_1.db.insert(schema_1.violations).values({
            ...data,
            caseNumber,
            officerId,
            district,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            status: 'SUBMITTED', // Or DRAFT if they want multi-step
        }).returning();
        // Log the creation
        await db_1.db.insert(schema_1.auditLogs).values({
            userId: officerId,
            action: 'CREATED_VIOLATION',
            entity: 'violations',
            entityId: result[0].id,
            details: { caseNumber }
        });
        return result[0];
    }
    static async getViolations(role, userId, district) {
        if (role === 'TRAFFIC_OFFICER') {
            // Officer only sees their own
            return await db_1.db.select().from(schema_1.violations).where((0, drizzle_orm_1.eq)(schema_1.violations.officerId, userId)).orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
        }
        else if (role === 'DISTRICT_ADMIN' && district) {
            // District Admin sees all in their district
            return await db_1.db.select().from(schema_1.violations).where((0, drizzle_orm_1.eq)(schema_1.violations.district, district)).orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
        }
        else if (role === 'STATE_ADMIN') {
            // State Admin sees all
            return await db_1.db.select().from(schema_1.violations).orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
        }
        throw new Error('Unauthorized access to violations');
    }
    static async getViolationById(id, role, userId, district) {
        const result = await db_1.db.select().from(schema_1.violations).where((0, drizzle_orm_1.eq)(schema_1.violations.id, id));
        if (result.length === 0)
            throw new Error('Violation not found');
        const violation = result[0];
        // Access control checks
        if (role === 'TRAFFIC_OFFICER' && violation.officerId !== userId) {
            throw new Error('Unauthorized access');
        }
        if (role === 'DISTRICT_ADMIN' && violation.district !== district) {
            throw new Error('Unauthorized access');
        }
        return violation;
    }
    static async updateStatus(id, newStatus, actorId, actorRole, actorDistrict) {
        const violation = await this.getViolationById(id, actorRole, actorId, actorDistrict);
        if (actorRole === 'TRAFFIC_OFFICER') {
            throw new Error('Officers cannot manually transition case statuses after submission');
        }
        const result = await db_1.db.update(schema_1.violations)
            .set({ status: newStatus, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.violations.id, id))
            .returning();
        await db_1.db.insert(schema_1.auditLogs).values({
            userId: actorId,
            action: `STATUS_CHANGED_TO_${newStatus}`,
            entity: 'violations',
            entityId: id,
            details: { oldStatus: violation.status }
        });
        // If recommending challan or warning, we would also update the vehicle warning count here
        if (newStatus === 'WARNING_ISSUED') {
            const vhc = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, violation.vehicleId));
            if (vhc.length > 0) {
                await db_1.db.update(schema_1.vehicles).set({ warningCount: vhc[0].warningCount + 1 }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vhc[0].id));
            }
        }
        return result[0];
    }
    static async analyzeImage(imageUrl, base64Image) {
        if (!process.env.OPENAI_API_KEY) {
            // Fallback for demo without API key
            console.warn("OPENAI_API_KEY is not set. Falling back to mock data.");
            return {
                suggestedType: "Helmet Detection",
                vehicleNumber: "UP32AB1234",
                confidenceScore: 94.5,
                aiSummary: "Rider is not wearing a helmet. Number plate detected clearly. [MOCK]"
            };
        }
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        let imageUrlPayload;
        if (base64Image) {
            imageUrlPayload = `data:image/jpeg;base64,${base64Image}`;
        }
        else if (imageUrl) {
            imageUrlPayload = imageUrl;
        }
        else {
            throw new Error('Must provide either an imageUrl or base64Image');
        }
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for cost effectiveness, can use gpt-4o for production
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant for the Uttar Pradesh Police Traffic System. Analyze the provided image and output a strict JSON object with the following keys:
- suggestedType: A string representing the violation type (e.g., 'Helmet Detection', 'Seatbelt Detection', 'Triple Riding Detection', 'Mobile Usage Detection', 'Wrong Parking Detection'). If none, return 'None'.
- vehicleNumber: The detected license plate number as a single alphanumeric string without spaces.
- confidenceScore: A number from 0 to 100 representing your confidence.
- aiSummary: A brief 1-2 sentence explanation.`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this image for traffic violations." },
                        {
                            type: "image_url",
                            image_url: { url: imageUrlPayload }
                        }
                    ]
                }
            ],
            max_tokens: 300,
        });
        const content = response.choices[0].message.content;
        if (!content)
            throw new Error('Failed to parse AI response');
        return JSON.parse(content);
    }
}
exports.ViolationService = ViolationService;
