# AI Module Integration

## 1. AI Scope and Boundaries
- **Engine:** OpenAI Vision API.
- **Role:** Assistant only. AI analyzes images to reduce manual data entry for the Officer.
- **Strict Limitation:** AI never makes final decisions and cannot issue challans or warnings autonomously. Human verification is always mandatory.

## 2. AI Capabilities
The Vision AI is prompted to detect the following:
- Helmet Detection (Missing helmets on two-wheelers)
- Seatbelt Detection (Missing seatbelts in four-wheelers)
- Triple Riding Detection
- Mobile Phone Usage Detection while driving
- Wrong Parking Detection
- Number Plate Detection (OCR)

## 3. Process Workflow
1. **Input:** High-resolution image + GPS Coordinates + Timestamp.
2. **Backend Processing:** System forms a specialized prompt combined with the image, sent to OpenAI Vision.
3. **Output format:** JSON containing:
   - `Suggested Violation Type`
   - `Vehicle Number`
   - `Confidence Score` (Percentage)
   - `AI Summary` (Brief explanation of why the violation was detected)

## 4. Officer Interaction
Upon receiving the AI output, the UI presents the data to the Traffic Officer. The Officer must review the `Vehicle Number` and `Violation Type`. They have full authority to override the AI's suggestions before final submission.
