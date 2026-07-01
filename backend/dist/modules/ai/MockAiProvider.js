"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAiProvider = void 0;
class MockAiProvider {
    /**
     * Simulates AI analysis for demo mode or testing.
     * Returns a predictable response after a simulated network delay.
     */
    async analyzeImage(imageUrl, vehicleRegistration) {
        // Simulate network delay (500ms to 1500ms)
        const delay = Math.floor(Math.random() * 1000) + 500;
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return synthetic data
                resolve({
                    plateNumber: vehicleRegistration || 'UP32DEMO123',
                    detectedViolations: ['no_helmet', 'triple_riding'],
                    confidenceScores: {
                        'no_helmet': 0.98,
                        'triple_riding': 0.85
                    },
                    rawModelResponse: {
                        mock: true,
                        delayMs: delay,
                        info: 'This is a mocked AI response for demo purposes.'
                    }
                });
            }, delay);
        });
    }
}
exports.MockAiProvider = MockAiProvider;
