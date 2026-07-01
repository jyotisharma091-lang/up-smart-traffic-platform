"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
class OpenAIProvider {
    apiKey;
    modelName;
    constructor(apiKey, modelName = 'gpt-4o') {
        this.apiKey = apiKey;
        this.modelName = modelName;
        if (!this.apiKey) {
            console.warn('OpenAIProvider initialized without an API key.');
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
            // NOTE: In a full implementation, you would use the openai npm package here.
            // e.g., const openai = new OpenAI({ apiKey: this.apiKey });
            // const response = await openai.chat.completions.create({
            //   model: this.modelName,
            //   response_format: { type: "json_object" },
            //   messages: [
            //     {
            //       role: "user",
            //       content: [
            //         { type: "text", text: prompt },
            //         { type: "image_url", image_url: { url: imageUrl } }
            //       ]
            //     }
            //   ]
            // });
            // ... then parse response.choices[0].message.content as JSON.
            // Returning a placeholder structure representing a parsed API response
            return {
                plateNumber: vehicleRegistration || null,
                detectedViolations: [],
                confidenceScores: {},
                rawModelResponse: {
                    note: 'OpenAI SDK integration required. Prompt prepared.',
                    preparedPrompt: prompt,
                    provider: 'OpenAI',
                    model: this.modelName
                }
            };
        }
        catch (error) {
            console.error('Error in OpenAIProvider.analyzeImage:', error);
            throw new Error(`Failed to analyze image with OpenAI: ${error.message}`);
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
