import type { UserRole, UserStatus } from './auth.types';

export interface District {
  id: number;
  name: string;
  code: string;
  division: string | null;
}

export interface PoliceStation {
  id: number;
  districtId: number;
  name: string;
  stationCode: string;
  address: string | null;
}

export interface User {
  id: number;
  pnoNumber: string;
  username: string;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  role: UserRole;
  designation: string | null;
  rank: string | null;
  status: UserStatus;
  districtId: number | null;
  districtName: string | null;
  policeStationId: number | null;
  policeStationName: string | null;
  profilePhotoUrl: string | null;
  lastLoginAt: string | null;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  pnoNumber: string;
  username: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  role: UserRole;
  designation?: string;
  rank?: string;
  districtId?: number;
  policeStationId?: number;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
  notes?: string;
}
