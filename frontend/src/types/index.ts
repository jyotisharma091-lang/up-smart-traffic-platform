export type Role = 'traffic_officer' | 'district_admin' | 'state_admin';

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: Role;
  pnoNumber: string;
  districtId: string | null;
  policeStationId: string | null;
  designation?: string;
  profilePhotoUrl?: string;
  status: 'active' | 'pending_verification' | 'deactivated';
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  ownerName: string;
  ownerMobile: string;
  warningCount: number;
}

export type ViolationStatus = 'pending_ai_review' | 'ai_reviewed' | 'warning_issued' | 'verification_queue' | 'challan_recommended' | 'rejected' | 'closed';

export interface Violation {
  id: string;
  officerId: string;
  vehicleId?: string;
  districtId: string;
  imageUrl: string;
  capturedAt: string;
  status: ViolationStatus;
  detectedViolations: string[];
  locationDescription?: string;
  adminDecision?: string;
  vehicleDetails?: Vehicle;
  confidenceScore?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Hotspot {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  violationCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
