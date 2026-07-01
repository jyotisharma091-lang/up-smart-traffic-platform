// ── Types: Vehicles ──────────────────────────────────────────

export type VehicleType =
  | 'two_wheeler'
  | 'four_wheeler'
  | 'auto'
  | 'truck'
  | 'bus'
  | 'other';

export interface Vehicle {
  id: number;
  registrationNumber: string;
  vehicleType: VehicleType | null;
  ownerName: string | null;
  ownerMobile: string | null;
  make: string | null;
  model: string | null;
  color: string | null;
  warningCount: number;
  isDemo: boolean;
  createdAt: string;
  violations?: VehicleViolationHistory[];
  activeCase?: ActiveCase | null;
}

export interface VehicleViolationHistory {
  id: number;
  date: string;
  violationType: string;
  location: string;
  officerName: string;
  status: string;
  imageUrl: string;
  warningNumber: number;
}

export interface ActiveCase {
  caseNumber: string;
  status: string;
  districtName: string;
}

// ── Types: Analytics ──────────────────────────────────────────

export interface StateDashboardStats {
  totalViolationsToday: number;
  totalViolationsTodayTrend: number;
  pendingVerificationQueue: number;
  challansRecommended: number;
  challansRecommendedTrend: number;
  activeOfficers: number;
}

export interface DistrictDashboardStats {
  pendingQueue: number;
  closedCases: number;
  activeOfficers: number;
  challansThisWeek: number;
  violationsToday: number;
}

export interface OfficerDashboardStats {
  casesToday: number;
  pendingCases: number;
  challansRecommended: number;
  stationViolationsToday: number;
}

export interface ViolationTrendPoint {
  date: string;
  count: number;
}

export interface ViolationTypeBreakdown {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

export interface DistrictPerformance {
  rank: number;
  districtId: number;
  districtName: string;
  violationsCount: number;
  pendingQueue: number;
  challans: number;
}

export interface Hotspot {
  id: number;
  districtId: number;
  districtName: string;
  name: string | null;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  violationCount: number;
  dominantViolationType: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

export type NotificationType =
  | 'warning_issued'
  | 'case_updated'
  | 'admin_decision'
  | 'account_status_changed'
  | 'system_alert';

export interface Notification {
  id: number;
  userId: number;
  violationId: number | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}
