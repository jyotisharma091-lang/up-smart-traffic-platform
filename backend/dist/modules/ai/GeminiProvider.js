"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
class GeminiProvider {
    apiKey;
    modelName;
    constructor(apiKey, modelName = 'gemini-1.5-pro') {
        this.apiKey = apiKey;
        this.modelName = modelName;
        if (!this.apiKey) {
            console.warn('GeminiProvider initialized without an API key.');
        }
    }
    async analyzeImage(imageUrl, vehicleRegistration) {
        try {
            const prompt = `
        Analyze this traffic camera image.
        1. Extract the vehicle registration number (number plate) if visible.
        2. Detect any of the following traffic violations: no_helmet, triple_riding, no_seatbelt, wrong_parking, mobile_usage.
        3. Provide confidence scores between 0 and 1 for each detected violation.
        ${vehicleRegistration ? `The officer provided the registration: ${vehicleRegistration}. Verify if it matches.` : ''}
        
        Return the result strictly as a JSON object with this exact structure:
        {
          "plateNumber": "string or null",
          "detectedViolations": ["violation_key"],
          "confidenceScores": { "violation_key": 0.95 }
        }
      `;
            // NOTE: In a full implementation, you would use the @google/generative-ai SDK here.
            // e.g., const genAI = new GoogleGenerativeAI(this.apiKey);
            // const model = genAI.getGenerativeModel({ model: this.modelName });
            // const result = await model.generateContent([prompt, imagePart]);
            // ... then parse result.response.text() as JSON.
            // Returning a placeholder structure representing a parsed API response
            return {
                plateNumber: vehicleRegistration || null,
                detectedViolations: [],
                confidenceScores: {},
                rawModelResponse: {
                    note: 'Gemini SDK integration required. Prompt prepared.',
                    preparedPrompt: prompt,
                    provider: 'Gemini',
                    model: this.modelName
                }
            };
        }
        catch (error) {
            console.error('Error in GeminiProvider.analyzeImage:', error);
            throw new Error(`Failed to analyze image with Gemini: ${error.message}`);
        }
    }
}
exports.GeminiProvider = GeminiProvider;
