# Core User Flows

## 1. Authentication Flow
1. User opens App.
2. Selects Role / Login Type.
3. Inputs Credentials.
   - *State Admin only:* Prompts for Resend OTP sent to Official Email.
4. Server validates -> Issues JWT + HttpOnly Cookie.
5. React Context updates -> Redirects to respective Role Dashboard.
*(Optional rule: Force password change on first login)*

## 2. Traffic Violation Capture Flow (Officer)
1. Officer clicks "Capture Violation".
2. Camera activates -> Officer takes photo.
3. System automatically captures GPS (Lat/Long) and Timestamp.
4. Image uploaded to Backend -> Sent to OpenAI Vision.
5. AI returns suggested Violation Type, Vehicle Number, and Confidence Score.
6. Officer reviews AI output -> Corrects if necessary.
7. Officer submits -> Saved as "Submitted".

## 3. Case Status Flow
1. **Draft:** Image taken but not yet submitted.
2. **Submitted:** Officer submits to system.
3. **Under Review:** System checks vehicle history.
4. **Warning Issued:** First or Second offense detected.
5. **Verification Queue:** Third+ offense detected. Case escalated to District Admin.
6. **Recommended:** District Admin recommends a formal challan.
7. **Closed:** Case resolved or rejected by Admin.

## 4. Verification Flow (District Admin)
1. District Admin opens "Verification Queue".
2. Views case details, AI summary, and photographic evidence.
3. Decides Action:
   - **Recommend Challan:** Approves for external e-Challan processing.
   - **Reject Case:** Invalid evidence.
   - **Close Case:** No action required.
*(AI strictly assists; Human verification is mandatory.)*
