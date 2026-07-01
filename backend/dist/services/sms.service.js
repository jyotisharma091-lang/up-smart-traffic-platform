"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
class SmsService {
    /**
     * Sends a warning SMS to the violator.
     * If a real SMS API (like Textbelt, Twilio, or Fast2SMS) is integrated later,
     * replace the mock logic below with the actual API call.
     */
    static async sendWarningSms(mobileNumber, vehicleNumber, violationType) {
        const message = `Hello, this is a testing message only. Please drive safely.`;
        return this.sendCustomSms(mobileNumber, message);
    }
    static async sendCustomSms(mobileNumber, message) {
        if (!mobileNumber) {
            console.log(`[SMS] No mobile number provided. Skipping SMS.`);
            return false;
        }
        // By user request: We are disabling the Fast2SMS API call for testing
        // and relying on frontend alert windows instead.
        console.log(`\n================= MOCK SMS SENT =================`);
        console.log(`To: ${mobileNumber}`);
        console.log(`Message: ${message}`);
        console.log(`=================================================\n`);
        return true;
    }
}
exports.SmsService = SmsService;
