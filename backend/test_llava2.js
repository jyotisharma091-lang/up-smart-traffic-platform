const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: 'ollama', baseURL: 'http://localhost:11434/v1' });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: 'llava',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for the Uttar Pradesh Police Traffic System. Analyze the provided image and output a strict JSON object with the following keys:
- suggestedType: A string representing the violation type (e.g., 'Helmet Detection', 'Seatbelt Detection', 'Triple Riding Detection', 'Mobile Usage Detection', 'Wrong Parking Detection'). If none, return 'None'.
- vehicleNumber: The detected license plate number as a single alphanumeric string without spaces.
- confidenceScore: A number from 0 to 100 representing your confidence.
- aiSummary: A brief 1-2 sentence explanation.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image for traffic violations.' },
            {
              type: 'image_url',
              image_url: { url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=' }
            }
          ]
        }
      ],
      max_tokens: 300,
    });
    console.log(response.choices[0].message.content);
  } catch(e) {
    console.error(e.message);
  }
}
test();
