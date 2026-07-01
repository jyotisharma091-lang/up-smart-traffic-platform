"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../config/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const sms_service_1 = require("../../services/sms.service");
class ViolationService {
    static async createViolation(data, officerId, district) {
        const caseNumber = `UP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        let vehicleId = data.vehicleId;
        // Always resolve a valid vehicleId to satisfy the foreign key constraint
        const vNumber = data.vehicleNumber && data.vehicleNumber.trim() !== ''
            ? data.vehicleNumber
            : `UNKNOWN-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const existingVehicle = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleNumber, vNumber)).limit(1);
        let finalStatus = 'VERIFICATION_QUEUE';
        let newWarningCount = 0;
        if (existingVehicle.length > 0) {
            vehicleId = existingVehicle[0].id;
            newWarningCount = existingVehicle[0].warningCount;
        }
        else {
            const newVehicleId = (0, uuid_1.v4)();
            await db_1.db.insert(schema_1.vehicles).values({
                id: newVehicleId,
                vehicleNumber: vNumber,
                createdAt: new Date(),
                warningCount: 0
            });
            vehicleId = newVehicleId;
        }
        // Determine Status based on AI/Plate data and past warnings
        if (data.violationType === 'none') {
            finalStatus = 'OFFICER_REVIEW';
        }
        else if (!vNumber.startsWith('UNKNOWN')) {
            // Always increment warning count for record keeping
            await db_1.db.update(schema_1.vehicles)
                .set({ warningCount: newWarningCount + 1 })
                .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId));
            if (newWarningCount < 3) {
                finalStatus = 'WARNING_ISSUED';
                // Send SMS if mobile number is provided
                if (data.violatorMobile) {
                    await sms_service_1.SmsService.sendWarningSms(data.violatorMobile, vNumber, data.violationType || 'Unknown');
                }
            }
            else {
                // 4th violation or more -> Goes to district queue for challan
                finalStatus = 'VERIFICATION_QUEUE';
                // Send escalation SMS if mobile number is provided
                if (data.violatorMobile) {
                    const escalationMessage = `After 3 violations, your case for vehicle ${vNumber} is transferred to district admin for action.`;
                    await sms_service_1.SmsService.sendCustomSms(data.violatorMobile, escalationMessage);
                }
            }
        }
        else {
            // Unreadable plate -> Goes to district queue for manual review
            finalStatus = 'VERIFICATION_QUEUE';
        }
        const result = await db_1.db.insert(schema_1.violations).values({
            id: (0, uuid_1.v4)(),
            caseNumber,
            officerId,
            district,
            vehicleId: vehicleId,
            violationType: data.violationType || 'Unknown',
            status: finalStatus,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            evidenceUrl: data.imageBase64, // Storing base64 directly for demo
        }).returning();
        // Log the creation
        await db_1.db.insert(schema_1.auditLogs).values({
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            userId: officerId,
            action: 'CREATED_VIOLATION',
            entity: 'violations',
            entityId: result[0].id,
            details: { caseNumber }
        });
        return result[0];
    }
    static async getVerificationQueue(district) {
        return await db_1.db.select({
            id: schema_1.violations.id,
            caseNumber: schema_1.violations.caseNumber,
            district: schema_1.violations.district,
            violationType: schema_1.violations.violationType,
            status: schema_1.violations.status,
            timestamp: schema_1.violations.timestamp,
            evidenceUrl: schema_1.violations.evidenceUrl,
            createdAt: schema_1.violations.createdAt,
            vehicleId: schema_1.violations.vehicleId,
            vehicleNumber: schema_1.vehicles.vehicleNumber,
            warningCount: schema_1.vehicles.warningCount
        }).from(schema_1.violations)
            .leftJoin(schema_1.vehicles, (0, drizzle_orm_1.eq)(schema_1.violations.vehicleId, schema_1.vehicles.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.violations.district, district), (0, drizzle_orm_1.eq)(schema_1.violations.status, 'VERIFICATION_QUEUE')))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
    }
    static async getViolations(role, userId, district) {
        let query = db_1.db.select({
            id: schema_1.violations.id,
            caseNumber: schema_1.violations.caseNumber,
            district: schema_1.violations.district,
            violationType: schema_1.violations.violationType,
            status: schema_1.violations.status,
            timestamp: schema_1.violations.timestamp,
            evidenceUrl: schema_1.violations.evidenceUrl,
            createdAt: schema_1.violations.createdAt,
            vehicleId: schema_1.violations.vehicleId,
            vehicleNumber: schema_1.vehicles.vehicleNumber,
            warningCount: schema_1.vehicles.warningCount
        }).from(schema_1.violations).leftJoin(schema_1.vehicles, (0, drizzle_orm_1.eq)(schema_1.violations.vehicleId, schema_1.vehicles.id));
        if (role === 'TRAFFIC_OFFICER') {
            return await query.where((0, drizzle_orm_1.eq)(schema_1.violations.officerId, userId)).orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
        }
        else if (role === 'DISTRICT_ADMIN' && district) {
            return await query.where((0, drizzle_orm_1.eq)(schema_1.violations.district, district)).orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
        }
        else if (role === 'STATE_ADMIN') {
            return await query.orderBy((0, drizzle_orm_1.desc)(schema_1.violations.createdAt));
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
    static async updateStatus(id, newStatus, actorId, actorRole, actorDistrict, newViolationType) {
        const violation = await this.getViolationById(id, actorRole, actorId, actorDistrict);
        if (actorRole === 'TRAFFIC_OFFICER') {
            if (violation.status === 'OFFICER_REVIEW' && (newStatus === 'FORWARD_REVIEW' || newStatus === 'DISMISSED')) {
                // Officers can transition from OFFICER_REVIEW
            }
            else {
                throw new Error('Officers cannot manually transition case statuses after submission');
            }
        }
        let finalStatus = newStatus;
        // 3-Strike Enforcement Workflow
        if (newStatus === 'APPROVED') {
            const vhc = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, violation.vehicleId));
            if (vhc.length > 0) {
                const currentCount = vhc[0].warningCount;
                if (currentCount >= 3) {
                    // Changed by user request: District Admin directly issues the challan
                    finalStatus = 'CHALLAN_ISSUED';
                    // Send Challan SMS to the registered mobile of the vehicle
                    const challanMessage = `Your challan for vehicle ${vhc[0].vehicleNumber} has been generated by District Admin for traffic violations.`;
                    await sms_service_1.SmsService.sendCustomSms('REGISTERED_MOBILE', challanMessage);
                    // Reset the warning count after challan is issued
                    await db_1.db.update(schema_1.vehicles).set({ warningCount: 0 }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vhc[0].id));
                }
                else {
                    finalStatus = 'WARNING_ISSUED';
                    await db_1.db.update(schema_1.vehicles).set({ warningCount: currentCount + 1 }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vhc[0].id));
                }
            }
            else {
                finalStatus = 'WARNING_ISSUED';
            }
        }
        else if (newStatus === 'REJECTED') {
            finalStatus = 'REJECTED';
        }
        else if (newStatus === 'DISMISSED') {
            finalStatus = 'DISMISSED';
        }
        else if (newStatus === 'FORWARD_REVIEW') {
            // Process the forwarded review
            const vhc = await db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, violation.vehicleId));
            if (vhc.length > 0 && newViolationType && newViolationType !== 'none') {
                const currentCount = vhc[0].warningCount;
                await db_1.db.update(schema_1.vehicles).set({ warningCount: currentCount + 1 }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vhc[0].id));
                if (currentCount < 3) {
                    finalStatus = 'WARNING_ISSUED';
                }
                else {
                    finalStatus = 'VERIFICATION_QUEUE';
                }
                // We also need to update the violationType
                await db_1.db.update(schema_1.violations).set({ violationType: newViolationType }).where((0, drizzle_orm_1.eq)(schema_1.violations.id, id));
            }
            else {
                throw new Error('Invalid vehicle or violation type for forwarding');
            }
        }
        const result = await db_1.db.update(schema_1.violations)
            .set({ status: finalStatus, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.violations.id, id))
            .returning();
        await db_1.db.insert(schema_1.auditLogs).values({
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            userId: actorId,
            action: `STATUS_CHANGED_TO_${finalStatus}`,
            entity: 'violations',
            entityId: id,
            details: { oldStatus: violation.status }
        });
        return result[0];
    }
    static async analyzeImage(imageUrl, base64Image) {
        // Connect to local Ollama instance instead of OpenAI cloud
        const { OpenAI } = require('openai');
        const openai = new OpenAI({
            apiKey: 'ollama', // API key required by SDK but ignored by Ollama
            baseURL: 'http://localhost:11434/v1',
        });
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
        let response;
        try {
            response = await openai.chat.completions.create({
                model: "llava", // Using Ollama's vision model
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `You are an AI assistant for the Uttar Pradesh Police Traffic System. Analyze the provided image and output a strict JSON object with the following keys:
- suggestedType: Must be EXACTLY ONE of these strings: 'no_helmet', 'triple_riding', 'wrong_parking', 'overspeeding', 'red_light'. If the rider is NOT wearing a helmet on a motorcycle, you MUST return 'no_helmet'. If no violation is found, return 'none'.
- vehicleNumber: The detected license plate number as a single alphanumeric string without spaces. Look closely at the image to read the text on the number plate letter by letter. If no clear license plate is detected, return 'UNKNOWN'. Do not guess or use placeholder examples.
- confidenceScore: A number from 0 to 100 representing your confidence.
- locationDetails: A brief visual description of the location or a guessed location in Uttar Pradesh based on the surroundings (e.g., 'City intersection', 'Highway toll', 'Residential street').
- additionalNotes: Any other relevant details about the vehicle, driver, or surroundings (e.g., color of the vehicle, type of vehicle, weather conditions).
- aiSummary: A brief 1-2 sentence explanation.

EXAMPLE JSON OUTPUT:
{
  "suggestedType": "no_helmet",
  "vehicleNumber": "UNKNOWN",
  "confidenceScore": 92.5,
  "locationDetails": "Urban street in Lucknow",
  "additionalNotes": "Black motorcycle. Rider wearing a blue shirt.",
  "aiSummary": "The rider is not wearing a helmet while driving."
}

CRITICAL INSTRUCTION 1: Check carefully if the rider is wearing a helmet. If not, output 'no_helmet'.
CRITICAL INSTRUCTION 2: Please look extremely closely at the vehicle's license plate and extract the exact registration number text.` },
                            {
                                type: "image_url",
                                image_url: { url: imageUrlPayload }
                            }
                        ]
                    }
                ],
                max_tokens: 300,
                temperature: 0.1,
            });
            const content = response.choices[0].message.content;
            if (!content)
                throw new Error('Failed to parse AI response');
            return JSON.parse(content);
        }
        catch (err) {
            console.error('Ollama AI Error, falling back to mock data:', err.message);
            // Fallback for demo when Ollama model fails
            return {
                suggestedType: "no_helmet",
                vehicleNumber: "UP32AB1234",
                confidenceScore: 94.5,
                locationDetails: "Hazratganj Intersection, Lucknow",
                additionalNotes: "Red scooter. Rider looking away from the camera.",
                aiSummary: "Rider is not wearing a helmet. Number plate detected clearly. [MOCK FALLBACK]"
            };
        }
    }
}
exports.ViolationService = ViolationService;
