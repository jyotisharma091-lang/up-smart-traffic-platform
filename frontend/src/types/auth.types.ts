// ── Types: Authentication ──────────────────────────────────────

export type UserRole = 'traffic_officer' | 'district_admin' | 'state_admin';

export type UserStatus =
  | 'pending_verification'
  | 'active'
  | 'deactivated'
  | 'suspended'
  | 'transferred'
  | 'retired'
  | 'rejected';

export interface AuthUser {
  id: number;
  fullName: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  designation: string;
  rank: string;
  districtId: number | null;
  districtName: string | null;
  policeStationId: number | null;
  policeStationName: string | null;
  pnoNumber: string;
  mobileNumber: string;
  profilePhotoUrl: string | null;
  lastLoginAt: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  message: string;
}
