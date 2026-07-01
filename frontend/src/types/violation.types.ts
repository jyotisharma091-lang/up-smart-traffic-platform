// ── Types: Violations ──────────────────────────────────────────

export type ViolationType =
  | 'no_helmet'
  | 'no_seatbelt'
  | 'triple_riding'
  | 'wrong_parking'
  | 'mobile_usage'
  | 'number_plate'
  | 'other';

export type ViolationStatus =
  | 'pending_ai_review'
  | 'ai_reviewed'
  | 'warning_issued'
  | 'verification_queue'
  | 'challan_recommended'
  | 'rejected'
  | 'closed';

export type AdminDecision = 'recommend_challan' | 'rejected' | 'closed';

export interface AIAnalysisResult {
  id: number;
  violationId: number;
  plateNumberDetected: string | null;
  detectedViolations: string[];
  confidenceScores: Record<string, number>;
  helmetDetected: boolean | null;
  seatbeltDetected: boolean | null;
  personCount: number | null;
  mobileUsageDetected: boolean | null;
  wrongParkingDetected: boolean | null;
  modelVersion: string | null;
  processingTimeMs: number | null;
  analyzedAt: string;
}

export interface Violation {
  id: number;
  officerId: number;
  officerName: string;
  vehicleId: number | null;
  vehicleRegistration: string | null;
  districtId: number;
  districtName: string;
  policeStationId: number;
  policeStationName: string;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  locationDescription: string | null;
  violationType: ViolationType | null;
  officerNotes: string | null;
  capturedAt: string;
  status: ViolationStatus;
  adminDecision: AdminDecision | null;
  adminNotes: string | null;
  reviewedByUserId: number | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  aiAnalysis: AIAnalysisResult | null;
  warningNumber: number | null;
  isDemo: boolean;
  createdAt: string;
}

export interface CreateViolationPayload {
  vehicleRegistration: string;
  violationType: ViolationType;
  locationDescription?: string;
  officerNotes?: string;
  latitude?: number;
  longitude?: number;
  imageFile?: File;
}

export interface Warning {
  id: number;
  vehicleId: number;
  violationId: number;
  issuedByUserId: number;
  issuedByName: string;
  warningNumber: 1 | 2 | 3;
  notes: string | null;
  issuedAt: string;
}
